import Matter from "matter-js";
import { type Dimensions, PHYSICS_CLASS_NAMES, type Position } from "./config";
import {
    bakeComputedStyles,
    deepCloneElement,
    forceElementSize,
    getCumulativeCSSRotation,
    getTextBounds,
    preventDefaultClicks,
    setElementClass,
} from "./dom";
import type { PhysicsSimulation } from "./main";
import { PhysicsSoundEffects } from "./sfx";
import { TransformStyle } from "./transform";

/**
 * Represents a physics-enabled DOM element
 */
export class PhysicsElement {
    private readonly soundEffects = new PhysicsSoundEffects();
    private placeholder: HTMLElement | null = null;
    public physicsBody: Matter.Body | null = null;

    private isHoveringOverElement = false;
    private isHoveringOverPickupBounds = false;
    private hasHoverStyle = false;

    private preHoverTransform: TransformStyle | null = null;
    private preExtractionTransform: TransformStyle | null = null;
    private preExtractionBounds: DOMRect | null = null;
    private preExtractionSize: Dimensions | null = null;
    private preExtractionRotation = 0;

    private originalOpacity = "1";
    private updateCount = 1;
    private localBodyOffset: Position = { x: 0, y: 0 };

    /**
     * Creates a new PhysicsElement
     * @param simulation - Parent physics simulation
     * @param element - DOM element to make physics-enabled
     */
    constructor(
        private readonly simulation: PhysicsSimulation,
        public element: HTMLElement | null,
    ) {
        if (!element) {
            throw new Error("Element cannot be null");
        }

        this.setupEventListeners();
        element.classList.add(PHYSICS_CLASS_NAMES.physicsElement);
    }

    /** Whether this element has been extracted from the DOM */
    get isExtracted(): boolean {
        return this.physicsBody !== null;
    }

    /** Whether this element can be extracted */
    get isExtractable(): boolean {
        return !this.isExtracted && this.simulation.gravityGun.isEquipped;
    }

    /**
     * Sets up event listeners for the element
     */
    private setupEventListeners(): void {
        if (!this.element) return;

        // Prevent native dragging
        this.element.addEventListener("dragstart", (event) => {
            if (this.isExtractable || this.isExtracted) {
                event.preventDefault();
                event.stopPropagation();
            }
        });

        this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.element.addEventListener(
            "mouseenter",
            this.onMouseEnter.bind(this),
        );
        this.element.addEventListener(
            "mouseleave",
            this.onMouseLeave.bind(this),
        );
    }

    /**
     * Handles mouse move events
     * @param event - Mouse event
     */
    private onMouseMove(event: MouseEvent): void {
        if (
            !this.isExtractable ||
            !this.isHoveringOverElement ||
            !this.shouldUseTextBounds()
        ) {
            return;
        }

        if (this.getParentPhysicsElements().length > 0) {
            return; // Prefer parent elements
        }

        this.isHoveringOverPickupBounds = this.isPointOverGrabbableRegion(
            event.clientX,
            event.clientY,
        );
        this.updateHoverStyle();
    }

    /**
     * Handles mouse enter events
     * @param event - Mouse event
     */
    private onMouseEnter(): void {
        if (!this.isExtractable || this.getParentPhysicsElements().length > 0) {
            return;
        }

        this.isHoveringOverElement = true;
        if (!this.shouldUseTextBounds()) {
            this.isHoveringOverPickupBounds = true;
        }

        this.updateHoverStyle();
    }

    /**
     * Handles mouse leave events
     * @param event - Mouse event
     */
    private onMouseLeave(): void {
        this.isHoveringOverElement = false;
        this.isHoveringOverPickupBounds = false;
        this.updateHoverStyle();
    }

    /**
     * Updates hover styling based on current state
     */
    private updateHoverStyle(): void {
        if (!this.element) return;

        const shouldHaveHoverStyle =
            this.isHoveringOverPickupBounds && this.isExtractable;

        if (this.hasHoverStyle === shouldHaveHoverStyle) return;

        this.hasHoverStyle = shouldHaveHoverStyle;

        setElementClass(
            this.element,
            PHYSICS_CLASS_NAMES.extractable,
            shouldHaveHoverStyle,
        );

        if (shouldHaveHoverStyle) {
            if (!this.preHoverTransform) {
                this.preHoverTransform = TransformStyle.fromElement(
                    this.element,
                );
            }

            const transform = this.preHoverTransform.clone();
            transform.scale *= this.simulation.config.hoverScale;
            transform.translate.y -= 4;
            transform.applyToElement(this.element);
        } else {
            this.preHoverTransform?.applyToElement(this.element);
        }
    }

    /**
     * Checks if a point is over the grabbable region of this element
     * @param clientX - X coordinate
     * @param clientY - Y coordinate
     * @returns Whether the point is over the grabbable region
     */
    isPointOverGrabbableRegion(clientX: number, clientY: number): boolean {
        if (!this.element) return false;

        if (this.shouldUseTextBounds()) {
            const textBounds = this.getTextBounds();
            return (
                textBounds !== null &&
                clientX >= textBounds.left &&
                clientX <= textBounds.right &&
                clientY >= textBounds.top &&
                clientY <= textBounds.bottom
            );
        }

        const elements = document.elementsFromPoint(clientX, clientY) ?? [];
        return elements.includes(this.element);
    }

    /**
     * Extracts this element from the DOM and creates a physics body
     * @param mouseEvent - Optional mouse event that triggered extraction
     */
    async extractElement(mouseEvent?: MouseEvent): Promise<void> {
        if (this.isExtracted || !this.element) return;

        if (
            mouseEvent &&
            !this.isPointOverGrabbableRegion(
                mouseEvent.clientX,
                mouseEvent.clientY,
            )
        ) {
            throw new Error("Cannot extract element from this position");
        }

        this.handlePreExtractionEffects();
        await this.prepareForExtraction();
        this.createPhysicsBody();
        await this.replaceWithPlaceholder();
        this.finalizeExtraction();
    }

    /**
     * Handles side effects before extraction
     */
    private handlePreExtractionEffects(): void {
        if (this.element?.matches("#crowbar3 .crowbar-isolated")) {
            document
                .querySelector("#crowbar3 .crowbar")
                ?.classList.add(PHYSICS_CLASS_NAMES.noShadow);
        }
    }

    /**
     * Prepares the element for extraction by storing current state
     */
    private async prepareForExtraction(): Promise<void> {
        if (!this.element) return;

        const computedStyle = getComputedStyle(this.element);

        this.preExtractionTransform = TransformStyle.fromElement(this.element);
        this.preExtractionBounds = this.element.getBoundingClientRect();
        this.preExtractionRotation = getCumulativeCSSRotation(this.element);

        if (computedStyle.display !== "inline") {
            this.preExtractionSize = {
                width: this.element.clientWidth,
                height: this.element.clientHeight,
            };
        } else {
            const bounds = this.element.getBoundingClientRect();
            this.preExtractionSize = {
                width: bounds.width,
                height: bounds.height,
            };
        }

        await bakeComputedStyles(this.element);
    }

    /**
     * Creates the Matter.js physics body for this element
     */
    private createPhysicsBody(): void {
        if (
            !this.preExtractionBounds ||
            !this.preExtractionSize ||
            !this.preExtractionTransform ||
            !this.simulation.renderer ||
            !this.simulation.engine
        ) {
            return;
        }

        const elementCenter = {
            x: this.preExtractionBounds.x + this.preExtractionBounds.width / 2,
            y: this.preExtractionBounds.y + this.preExtractionBounds.height / 2,
        };

        let bodyCenter: Position;
        let bodySize: Dimensions;

        if (this.shouldUseTextBounds()) {
            const textBounds = this.getTextBounds();
            if (!textBounds) return;

            const textCenter = {
                x: textBounds.x + textBounds.width / 2,
                y: textBounds.y + textBounds.height / 2,
            };

            this.localBodyOffset = {
                x:
                    (textCenter.x - elementCenter.x) /
                    this.preExtractionTransform.scale,
                y:
                    (textCenter.y - elementCenter.y) /
                    this.preExtractionTransform.scale,
            };

            bodyCenter = textCenter;
            bodySize = {
                width: textBounds.width,
                height: textBounds.height,
            };
        } else {
            bodyCenter = elementCenter;
            bodySize = {
                width:
                    this.preExtractionSize.width *
                    this.preExtractionTransform.scale,
                height:
                    this.preExtractionSize.height *
                    this.preExtractionTransform.scale,
            };
        }

        // Convert to physics world space
        bodyCenter = {
            x: bodyCenter.x + this.simulation.renderer.bounds.min.x,
            y: bodyCenter.y + this.simulation.renderer.bounds.min.y,
        };

        this.physicsBody = Matter.Bodies.rectangle(
            bodyCenter.x,
            bodyCenter.y,
            bodySize.width,
            bodySize.height,
            {
                render: {
                    fillStyle: "aqua",
                    opacity: 0.5,
                },
            },
        );

        const totalRotation =
            this.preExtractionTransform.rotate +
            (this.preExtractionRotation * Math.PI) / 180;

        Matter.Body.setAngle(this.physicsBody, totalRotation);
        Matter.Body.setStatic(this.physicsBody, true);
        Matter.Composite.add(this.simulation.engine.world, [this.physicsBody]);
    }

    /**
     * Replaces the element with a placeholder in the DOM
     */
    private async replaceWithPlaceholder(): Promise<void> {
        if (!this.element || !this.preExtractionSize) return;

        this.placeholder = deepCloneElement(this.element, true);
        this.placeholder.classList.add(PHYSICS_CLASS_NAMES.placeholder);
        this.placeholder.classList.remove(PHYSICS_CLASS_NAMES.physicsElement);

        forceElementSize(
            this.element,
            this.preExtractionSize.width + 2,
            this.preExtractionSize.height + 2,
        );

        this.originalOpacity = this.element.style.opacity;
        const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
        if (isFirefox) {
            this.element.style.opacity = "0";
        }

        this.element.replaceWith(this.placeholder);
        this.prepareExtractedElement();
    }

    /**
     * Prepares the extracted element for physics simulation
     */
    private prepareExtractedElement(): void {
        if (!(this.element && this.placeholder)) return;

        this.element.style.position = "absolute";
        this.element.style.top = "0px";
        this.element.style.left = "0px";
        this.element.style.bottom = "initial";
        this.element.style.right = "initial";
        this.element.style.margin = "initial";
        this.element.style.transformOrigin = "initial";
        this.element.classList.add(PHYSICS_CLASS_NAMES.extracted);

        if (this.element.style.display === "list-item") {
            this.element.style.display = "block";
        }

        preventDefaultClicks(this.placeholder);
        this.setupExtractedEventListeners();
    }

    /**
     * Sets up event listeners for the extracted element
     */
    private setupExtractedEventListeners(): void {
        if (!this.element || !this.placeholder) return;

        this.placeholder.addEventListener(
            "mouseup",
            (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.cancelBubble = true;
            },
            { capture: false },
        );

        this.element.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopPropagation();
            },
            { capture: true },
        );
    }

    /**
     * Finalizes the extraction process
     * @param mouseEvent - Optional mouse event
     */
    private finalizeExtraction(): void {
        if (!this.element || !this.physicsBody) return;

        this.simulation.addExtractedElement(this.element, this);
        this.simulation.config.elements.physContainer.appendChild(this.element);

        Matter.Body.setStatic(this.physicsBody, false);
        this.updateTransform(true);
        this.playExtractionSound();
    }

    /**
     * Plays the extraction sound effect
     */
    private playExtractionSound(): void {
        const soundAttr = this.element?.getAttribute("data-phys-pickup-sound");
        if (soundAttr) {
            this.soundEffects.playSound(soundAttr);
        }
    }

    /**
     * Updates the element's transform based on physics body position
     * @param force - Whether to force the update
     */
    updateTransform(force = false): void {
        if (
            !this.physicsBody ||
            (!force && this.physicsBody.isSleeping) ||
            !this.preExtractionSize ||
            !this.preExtractionTransform ||
            !this.element ||
            !this.simulation.renderer
        ) {
            return;
        }

        // Skip update if position hasn't changed (except for Firefox workaround)
        const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
        if (
            !force &&
            this.hasBodyNotMoved() &&
            (!isFirefox || this.updateCount > 3)
        ) {
            return;
        }

        const transform = new TransformStyle(
            {
                x:
                    this.physicsBody.position.x -
                    0.5 * this.preExtractionSize.width -
                    this.simulation.renderer.bounds.min.x,
                y:
                    this.physicsBody.position.y -
                    0.5 * this.preExtractionSize.height -
                    this.simulation.renderer.bounds.min.y,
            },
            this.physicsBody.angle,
            this.preExtractionTransform.scale,
        );

        let css = transform.toCSS();
        if (this.localBodyOffset.x !== 0 || this.localBodyOffset.y !== 0) {
            css += ` translate(${-this.localBodyOffset.x}px, ${-this.localBodyOffset.y}px)`;
        }

        this.element.style.transform = css;

        if (isFirefox && this.updateCount >= 3) {
            this.element.style.opacity = this.originalOpacity;
        }

        this.updateCount++;
    }

    /**
     * Checks if the physics body has not moved since last update
     * @returns Whether the body position is unchanged
     */
    private hasBodyNotMoved(): boolean {
        if (!this.physicsBody) return true;

        return (
            // @ts-expect-error - Matter.js types are incomplete
            this.physicsBody.angle === this.physicsBody.anglePrev &&
            // @ts-expect-error - Matter.js types are incomplete
            this.physicsBody.position.x === this.physicsBody.positionPrev.x &&
            // @ts-expect-error - Matter.js types are incomplete
            this.physicsBody.position.y === this.physicsBody.positionPrev.y
        );
    }

    /**
     * Gets parent physics elements in the DOM hierarchy
     * @returns Array of parent physics elements
     */
    private getParentPhysicsElements(): PhysicsElement[] {
        const parents: PhysicsElement[] = [];

        for (
            let elem = this.element?.parentElement;
            elem;
            elem = elem.parentElement
        ) {
            const physicsElement = this.simulation.getPhysicsElement(elem);
            if (physicsElement) {
                parents.push(physicsElement);
            }
        }

        return parents;
    }

    /**
     * Gets text bounds for this element
     * @returns Text bounding rectangle or fallback bounds
     */
    private getTextBounds(): DOMRect | null {
        if (!this.element) return null;
        return getTextBounds(this.element) ?? this.preExtractionBounds;
    }

    /**
     * Determines if text bounds should be used for this element
     * @returns Whether to use text bounds
     */
    private shouldUseTextBounds(): boolean {
        return (
            this.simulation.config.enableTextBounds &&
            this.simulation.config.textBoundedSelectors.some((s) =>
                this.element?.matches(s),
            )
        );
    }

    /**
     * Removes this element from the physics simulation
     */
    remove(): void {
        if (this.physicsBody && this.simulation.engine) {
            Matter.Composite.remove(this.simulation.engine.world, [
                this.physicsBody,
            ]);
            this.physicsBody = null;
        }

        this.simulation.removePhysicsElement(this.element);

        if (this.element) {
            this.element.parentElement?.removeChild(this.element);
            this.element = null;
        }
    }

    /**
     * Handles physics body removal
     */
    onBodyRemoved(): void {
        this.remove();
    }
}

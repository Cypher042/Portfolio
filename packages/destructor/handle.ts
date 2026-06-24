import Matter from "matter-js";
import { PHYSICS_CLASS_NAMES } from "./config";
import { setElementClass } from "./dom";
import type { PhysicsElement } from "./element";
import type { PhysicsSimulation } from "./main";
import { PhysicsSoundEffects } from "./sfx";
import { TransformStyle } from "./transform";

/**
 * Handles the gravity gun functionality
 */
export class PhysicsHandle {
    private readonly container: HTMLDivElement;
    private readonly gunElement: HTMLDivElement;
    private readonly transform = new TransformStyle();
    private readonly soundEffects = new PhysicsSoundEffects();

    private equipped = false;
    private heldItem: PhysicsElement | null = null;
    private hoveredItem: PhysicsElement | null = null;
    private closeTimeout: number | undefined;
    private touchingButton = false;
    private touchEndTimeout: number | undefined;

    /**
     * Creates a new PhysicsHandle (gravity gun)
     * @param simulation - Parent physics simulation
     */
    constructor(private readonly simulation: PhysicsSimulation) {
        this.container = this.createContainer();
        this.gunElement = this.createGunElement();
        this.setupEventListeners(simulation.config.elements.gravGunImage);
    }

    /** Whether the gravity gun is currently equipped */
    get isEquipped(): boolean {
        return this.equipped;
    }

    /**
     * Creates the gravity gun container element
     * @returns Container element
     */
    private createContainer(): HTMLDivElement {
        const container = document.createElement("div");
        container.className = PHYSICS_CLASS_NAMES.handleContainer;
        document.body.appendChild(container);
        return container;
    }

    /**
     * Creates the gravity gun element
     * @returns Gun element
     */
    private createGunElement(): HTMLDivElement {
        const gun = document.createElement("div");
        gun.className = PHYSICS_CLASS_NAMES.handle;
        this.container.appendChild(gun);
        return gun;
    }

    /**
     * Sets up event listeners for the gravity gun
     * @param button - Gravity gun button element
     */
    private setupEventListeners(button: HTMLElement): void {
        // Prevent default behaviors when equipped
        document.addEventListener(
            "click",
            (event) => {
                if (this.equipped) event.preventDefault();
            },
            { capture: true },
        );

        document.addEventListener(
            "contextmenu",
            (event) => {
                if (this.equipped) event.preventDefault();
            },
            { capture: true },
        );

        // Mouse events
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));

        // Button events
        button.addEventListener("mouseenter", () => {
            if (!this.touchingButton) {
                this.soundEffects.playSound("weaponswitch");
            }
        });

        button.addEventListener("mousedown", () => {
            if (!this.touchingButton) {
                this.setEquipped(!this.equipped);
            }
        });

        this.setupTouchEvents(button);
    }

    /**
     * Sets up touch events for mobile devices
     * @param button - Gravity gun button element
     */
    private setupTouchEvents(button: HTMLElement): void {
        button.addEventListener("touchstart", () => {
            this.touchingButton = true;
            this.showTouchMessage();
            this.soundEffects.playSound("dryfire");
            clearTimeout(this.touchEndTimeout);
        });

        button.addEventListener("touchend", (event) => {
            clearTimeout(this.touchEndTimeout);
            this.touchEndTimeout = setTimeout(() => {
                this.touchingButton = event.touches.length > 0;
            }, 100) as unknown as number;
        });
    }

    /**
     * Shows a message for touch device users
     */
    private showTouchMessage(): void {
        const isMobile = document.body.clientWidth <= 700;
        const mouseMessage =
            this.simulation.config.elements.mobileMessage.querySelector(
                ".use-mouse",
            ) as HTMLElement;
        const desktopMessage =
            this.simulation.config.elements.mobileMessage.querySelector(
                ".use-desktop",
            ) as HTMLElement;

        if (mouseMessage)
            mouseMessage.style.display = isMobile ? "none" : "inline";
        if (desktopMessage)
            desktopMessage.style.display = isMobile ? "inline" : "none";

        setElementClass(
            document.body,
            PHYSICS_CLASS_NAMES.showHandleMessage,
            true,
        );
        this.wiggleButton();
    }

    /**
     * Hides the touch message
     */
    private hideTouchMessage(): void {
        setElementClass(
            document.body,
            PHYSICS_CLASS_NAMES.showHandleMessage,
            false,
        );
    }

    /**
     * Triggers button wiggle animation
     */
    private wiggleButton(): void {
        setElementClass(
            this.simulation.config.elements.gravGunImage,
            PHYSICS_CLASS_NAMES.handleButtonWiggle,
            false,
        );
        setTimeout(() => {
            setElementClass(
                this.simulation.config.elements.gravGunImage,
                PHYSICS_CLASS_NAMES.handleButtonWiggle,
                true,
            );
        }, 0);
    }

    /**
     * Sets the equipped state of the gravity gun
     * @param shouldEquip - Whether to equip the gun
     */
    setEquipped(shouldEquip: boolean): void {
        if (this.equipped === shouldEquip) return;

        this.equipped = shouldEquip;
        this.updateClasses();

        if (shouldEquip) {
            this.soundEffects.playSound("select");
            this.hideTouchMessage();
            if (this.hoveredItem) {
                this.playOpenSound();
            }
        } else {
            this.soundEffects.playSound("weaponswitch");
        }
    }

    /**
     * Handles mouse down events
     * @param event - Mouse event
     */
    private onMouseDown(event: MouseEvent): void {
        this.updatePosition(event.clientX, event.clientY);

        if (!this.equipped) return;

        if (this.hoveredItem?.isExtractable || this.hoveredItem?.isExtracted) {
            this.pickupItem(this.hoveredItem, event);
        } else {
            this.dryFire();
        }
    }

    /**
     * Handles mouse move events
     * @param event - Mouse event
     */
    private onMouseMove(event: MouseEvent): void {
        this.updatePosition(event.clientX, event.clientY);

        if (this.equipped) {
            // @ts-expect-error - Matter.js types are incomplete
            this.simulation.renderer?.mouse.mousemove(event);
        }
    }

    /**
     * Handles mouse up events
     * @param event - Mouse event
     */
    private onMouseUp(event: MouseEvent): void {
        this.updatePosition(event.clientX, event.clientY);
        this.dropItem(event);
    }

    /**
     * Updates the gravity gun position
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    private updatePosition(x: number, y: number): void {
        this.transform.translate.x = x;
        this.transform.translate.y = y;
        this.transform.applyToElement(this.container);

        this.updateHoveredItem(x, y);
        this.updateClasses();
    }

    /**
     * Updates the currently hovered item
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    private updateHoveredItem(x: number, y: number): void {
        const hadHoveredItem = !!this.hoveredItem;

        if (this.heldItem) {
            this.hoveredItem = this.heldItem;
        } else {
            this.hoveredItem = null;

            for (const element of document.elementsFromPoint(x, y)) {
                const physicsElement = this.simulation.getPhysicsElement(
                    element as HTMLElement,
                );
                if (physicsElement?.isPointOverGrabbableRegion(x, y)) {
                    if (
                        !this.hoveredItem ||
                        physicsElement.element?.contains(
                            this.hoveredItem.element,
                        )
                    ) {
                        this.hoveredItem = physicsElement;
                    }
                }
            }
        }

        if (this.equipped) {
            if (this.hoveredItem && !hadHoveredItem) {
                this.playOpenSound();
            } else if (!this.hoveredItem && hadHoveredItem) {
                this.playCloseSound();
            }
        }
    }

    /**
     * Picks up a physics element
     * @param physicsElement - Element to pick up
     * @param mouseEvent - Mouse event
     */
    private async pickupItem(
        physicsElement: PhysicsElement,
        mouseEvent: MouseEvent,
    ): Promise<void> {
        if (this.heldItem) {
            this.dropItem(mouseEvent);
        }

        if (!physicsElement.isExtracted) {
            await physicsElement.extractElement();
        }

        this.heldItem = physicsElement;
        this.updateClasses();
        this.soundEffects.playSound("pickup");
        this.soundEffects.playSound("holdloop");

        // Start dragging immediately
        // @ts-expect-error - Matter.js types are incomplete
        this.simulation.renderer?.mouse.mousedown(mouseEvent);
        // @ts-expect-error - Matter.js types are incomplete
        Matter.MouseConstraint.update(this.simulation.mouseConstraint, [
            physicsElement.physicsBody,
        ]);
    }

    /**
     * Drops the currently held item
     */
    private dropItem(mouseEvent: MouseEvent): void {
        // @ts-expect-error - Matter.js types are incomplete
        this.simulation.renderer?.mouse.mouseup(mouseEvent);

        if (!this.heldItem) return;

        this.heldItem = null;
        this.updateClasses();
        this.soundEffects.stopSound("holdloop");
        this.soundEffects.playSound("drop");
        clearTimeout(this.closeTimeout);
        this.closeTimeout = undefined;
    }

    /**
     * Performs a dry fire action
     */
    private dryFire(): void {
        this.soundEffects.playSound("dryfire");
        this.recoil();
    }

    /**
     * Triggers recoil animation
     */
    private recoil(): void {
        setElementClass(
            this.gunElement,
            PHYSICS_CLASS_NAMES.handleRecoil,
            false,
        );
        setTimeout(() => {
            setElementClass(
                this.gunElement,
                PHYSICS_CLASS_NAMES.handleRecoil,
                true,
            );
        }, 0);
    }

    /**
     * Plays gun open sound
     */
    private playOpenSound(): void {
        if (!this.closeTimeout) {
            this.soundEffects.playSound("open");
        } else {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = undefined;
        }
    }

    /**
     * Plays gun close sound with debounce
     */
    private playCloseSound(): void {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = setTimeout(() => {
            this.soundEffects.playSound("close");
            this.closeTimeout = undefined;
        }, this
            .simulation.config.gravityHoverDebounceDelay) as unknown as number;
    }

    /**
     * Updates CSS classes based on current state
     */
    private updateClasses(): void {
        if (this.simulation.config.elements.gravGunImage) {
            setElementClass(
                this.simulation.config.elements.gravGunImage,
                PHYSICS_CLASS_NAMES.handleEquipped,
                this.equipped,
            );
        }

        setElementClass(
            this.gunElement,
            PHYSICS_CLASS_NAMES.handleEquipped,
            this.equipped,
        );
        setElementClass(
            this.gunElement,
            PHYSICS_CLASS_NAMES.handleHoveringOverItem,
            !!this.hoveredItem,
        );
        setElementClass(
            this.gunElement,
            PHYSICS_CLASS_NAMES.handleHoldingItem,
            !!this.heldItem,
        );

        this.simulation.updateBodyClasses();
    }
}

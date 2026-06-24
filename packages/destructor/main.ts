/**
 * Physics simulation system for interactive web elements
 * Adapted from https://www.half-life.com/en/halflife2/20th
 */

import Matter from "matter-js";
import MatterWrap from "matter-wrap";
import {
    DEFAULT_PHYSICS_CONFIG,
    PHYSICS_CLASS_NAMES,
    type PhysicsConfig,
} from "./config";
import { setElementClass } from "./dom";
import { PhysicsElement } from "./element";
import { PhysicsHandle } from "./handle";

/**
 * Main physics simulation class
 */
export class PhysicsSimulation {
    public readonly config: PhysicsConfig;
    public readonly gravityGun: PhysicsHandle;
    public readonly engine: Matter.Engine;
    public readonly renderer: Matter.Render;
    public readonly mouseConstraint: Matter.MouseConstraint;

    private readonly pageElements = new Map<HTMLElement, PhysicsElement>();
    private readonly extractedElements = new Map<HTMLElement, PhysicsElement>();
    private groundBody: Matter.Body | null = null;
    private canvas: HTMLCanvasElement | null = null;

    /**
     * Creates a new PhysicsSimulation
     * @param config - Optional configuration overrides
     */
    constructor(
        config: Partial<PhysicsConfig> & Pick<PhysicsConfig, "elements">,
    ) {
        this.config = { ...DEFAULT_PHYSICS_CONFIG, ...config };

        // Initialize Matter.js components
        this.engine = this.createEngine();
        this.renderer = this.createRenderer();
        this.mouseConstraint = this.createMouseConstraint();

        // Initialize gravity gun
        this.gravityGun = new PhysicsHandle(this);

        // Set up the physics world
        this.initializeWrapping();
        this.createBoundaries();
        this.setupEventListeners();
        this.initializeExtractableElements();
        this.startSimulation();

        if (this.config.autoEquipGravGun) {
            this.gravityGun.setEquipped(true);
        }

        this.updateBodyClasses();
    }

    /**
     * Creates the Matter.js engine
     * @returns Configured engine
     */
    private createEngine(): Matter.Engine {
        return Matter.Engine.create();
    }

    /**
     * Creates the Matter.js renderer
     * @returns Configured renderer
     */
    private createRenderer(): Matter.Render {
        const renderer = Matter.Render.create({
            element: this.config.elements.physContainer,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                background: "transparent",
                wireframes: false,
                showAngleIndicator: false,
                showDebug: this.config.debugPhysics,
            },
        });

        this.canvas = renderer.canvas;
        this.canvas.className = PHYSICS_CLASS_NAMES.physicsCanvas;

        return renderer;
    }

    /**
     * Creates the mouse constraint for dragging
     * @returns Configured mouse constraint
     */
    private createMouseConstraint(): Matter.MouseConstraint {
        const mouse = Matter.Mouse.create(this.canvas as HTMLCanvasElement);
        const constraint = Matter.MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,
                length: 0,
                // @ts-expect-error - Matter.js types are incomplete
                angularStiffness: 0,
                render: { visible: true },
            },
        });

        Matter.Composite.add(this.engine.world, constraint);
        this.renderer.mouse = mouse;

        return constraint;
    }

    /**
     * Initializes world wrapping functionality
     */
    private initializeWrapping(): void {
        Matter.use(MatterWrap);

        Matter.Events.on(this.engine.world, "afterAdd", (event) => {
            for (const obj of event.object) {
                this.setupBodyWrapping(obj);
            }
        });
    }

    /**
     * Sets up wrapping for a physics body
     * @param body - Physics body to configure
     */
    private setupBodyWrapping(body: Matter.Body): void {
        body.plugin.wrap = {
            min: {
                x: this.renderer.bounds.min.x,
                y: this.renderer.bounds.min.y - 100000,
            },
            max: {
                x: this.renderer.bounds.max.x,
                y: this.renderer.bounds.max.y,
            },
        };
    }

    /**
     * Creates world boundaries (ground and ceiling)
     */
    private createBoundaries(): void {
        this.groundBody = Matter.Bodies.rectangle(0, 0, 100000, 10000, {
            isStatic: true,
            render: {
                fillStyle: "orange",
                opacity: 0.5,
            },
        });

        const ceiling = Matter.Bodies.rectangle(0, -1500, 100000, 1000, {
            isStatic: true,
        });

        Matter.Composite.add(this.engine.world, [this.groundBody, ceiling]);
        this.updateGroundPosition();
    }

    /**
     * Sets up global event listeners
     */
    private setupEventListeners(): void {
        window.addEventListener("scroll", this.updateGroundPosition.bind(this));
        window.addEventListener("resize", this.resizeCanvas.bind(this));

        Matter.Events.on(this.engine.world, "afterRemove", (event) => {
            for (const obj of event.object) {
                this.onBodyRemoved(obj);
            }
        });
    }

    /**
     * Initializes extractable elements in the DOM
     */
    private initializeExtractableElements(): void {
        // Find and process existing elements
        const elements = document.querySelectorAll(
            this.config.draggableSelectors.join(", "),
        );
        for (const element of elements) {
            if (element instanceof HTMLElement) {
                this.makeElementExtractable(element);
            }
        }

        // Watch for new elements
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        if (
                            node instanceof HTMLElement &&
                            this.config.draggableSelectors.some((s) =>
                                node.matches(s),
                            )
                        ) {
                            this.makeElementExtractable(node);
                        }
                    }
                }
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    /**
     * Makes an element extractable by the physics system
     * @param element - Element to make extractable
     */
    private makeElementExtractable(element: HTMLElement): void {
        if (
            this.pageElements.has(element) ||
            this.extractedElements.has(element)
        ) {
            return;
        }

        if (element.classList.contains(PHYSICS_CLASS_NAMES.placeholder)) {
            return;
        }

        if (
            this.config.neverDraggableSelectors.some((s) => element.matches(s))
        ) {
            return;
        }

        const { width, height } = element.getBoundingClientRect();
        if (
            width > this.config.maxDimensions.width ||
            height > this.config.maxDimensions.height
        ) {
            return;
        }

        const physicsElement = new PhysicsElement(this, element);
        this.pageElements.set(element, physicsElement);
    }

    /**
     * Starts the physics simulation
     */
    private startSimulation(): void {
        Matter.Render.run(this.renderer);
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.engine);

        this.resizeCanvas();
        requestAnimationFrame(this.onAnimationFrame.bind(this));

        // Initial ground position update
        setTimeout(() => this.updateGroundPosition(), 1000);
    }

    /**
     * Animation frame callback
     */
    private onAnimationFrame(): void {
        setElementClass(
            document.body,
            PHYSICS_CLASS_NAMES.hasPhysBodies,
            this.extractedElements.size > 0,
        );

        for (const physicsElement of this.extractedElements.values()) {
            physicsElement.updateTransform();
        }

        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

    /**
     * Resizes the canvas to match window dimensions
     */
    private resizeCanvas(): void {
        this.renderer.bounds.max.x = window.innerWidth;
        this.renderer.bounds.max.y = window.innerHeight;
        this.renderer.options.width = window.innerWidth;
        this.renderer.options.height = window.innerHeight;
        this.renderer.canvas.width = window.innerWidth;
        this.renderer.canvas.height = window.innerHeight;

        this.updateGroundPosition();

        // Update wrapping for all bodies
        for (const body of this.engine.world.bodies) {
            this.setupBodyWrapping(body);
        }

        Matter.Render.lookAt(this.renderer, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight },
        });
    }

    /**
     * Updates the ground position based on footer location
     */
    private updateGroundPosition(): void {
        if (!this.groundBody) return;

        const groundEdgeY = Math.min(
            window.innerHeight,
            this.config.elements.footer.getBoundingClientRect().top,
        );
        const groundCenterY = groundEdgeY + 5000;

        // Move existing physics bodies if ground moves
        if (
            this.groundBody.position.y !== 0 &&
            this.groundBody.position.y !== groundCenterY
        ) {
            const deltaY = groundCenterY - this.groundBody.position.y;

            for (const physicsElement of this.extractedElements.values()) {
                if (physicsElement.physicsBody) {
                    Matter.Body.setPosition(
                        physicsElement.physicsBody,
                        Matter.Vector.create(
                            physicsElement.physicsBody.position.x,
                            physicsElement.physicsBody.position.y + deltaY,
                        ),
                    );
                    physicsElement.updateTransform(true);
                }
            }
        }

        Matter.Body.setPosition(
            this.groundBody,
            Matter.Vector.create(0, groundCenterY),
        );
    }

    /**
     * Handles physics body removal
     * @param body - Removed body
     */
    private onBodyRemoved(body: Matter.Body): void {
        for (const physicsElement of this.extractedElements.values()) {
            if (physicsElement.physicsBody === body) {
                physicsElement.onBodyRemoved();
                break;
            }
        }
    }

    /**
     * Updates body CSS classes based on current state
     */
    updateBodyClasses(): void {
        setElementClass(
            document.body,
            PHYSICS_CLASS_NAMES.debugPhysics,
            this.config.debugPhysics,
        );
        setElementClass(
            document.body,
            PHYSICS_CLASS_NAMES.showDebugUI,
            this.config.showDebugUI,
        );
        setElementClass(
            document.body,
            PHYSICS_CLASS_NAMES.handleEquipped,
            this.gravityGun.isEquipped,
        );
    }

    /**
     * Gets the PhysicsElement for a DOM element
     * @param element - DOM element
     * @returns Associated PhysicsElement or undefined
     */
    getPhysicsElement(element: HTMLElement): PhysicsElement | undefined {
        return (
            this.extractedElements.get(element) ??
            this.pageElements.get(element)
        );
    }

    /**
     * Adds an extracted element to the simulation
     * @param element - DOM element
     * @param physicsElement - Associated PhysicsElement
     */
    addExtractedElement(
        element: HTMLElement,
        physicsElement: PhysicsElement,
    ): void {
        this.pageElements.delete(element);
        this.extractedElements.set(element, physicsElement);
    }

    /**
     * Removes a physics element from the simulation
     * @param element - DOM element to remove
     */
    removePhysicsElement(element: HTMLElement | null): void {
        if (!element) return;
        this.pageElements.delete(element);
        this.extractedElements.delete(element);
    }

    /**
     * Shows debug UI
     */
    showDebug(): void {
        // Implementation for showing debug UI would go here
        console.log("Debug UI would be shown here");
    }
}

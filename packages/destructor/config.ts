/** Configuration for the physics simulation */
export interface PhysicsConfig {
    /** Show debug UI panels */
    readonly showDebugUI: boolean;
    /** Show physics debug visualizations */
    readonly debugPhysics: boolean;
    /** Auto-equip gravity gun on startup */
    readonly autoEquipGravGun: boolean;
    /** CSS selector for draggable elements */
    readonly draggableSelectors: string[];
    /** CSS selector for elements that should never be draggable */
    readonly neverDraggableSelectors: string[];
    /** Enable text-based collision bounds */
    readonly enableTextBounds: boolean;
    /** CSS selector for text-bounded elements */
    readonly textBoundedSelectors: string[];
    /** Hover scale multiplier */
    readonly hoverScale: number;
    /** Maximum element dimensions */
    readonly maxDimensions: { width: number; height: number };
    /** Gravity gun hover debounce delay in milliseconds */
    readonly gravityHoverDebounceDelay: number;
    /** Various important HTML elements */
    readonly elements: {
        /** Gravity gun image */
        readonly gravGunImage: HTMLElement;
        /** Message that shows up for mobile users */
        readonly mobileMessage: HTMLElement;
        /** Container for physics elements */
        readonly physContainer: HTMLElement;
        /** Footer element */
        readonly footer: HTMLElement;
    };
}

/** Default physics configuration */
export const DEFAULT_PHYSICS_CONFIG: Omit<PhysicsConfig, "elements"> = {
    showDebugUI: false,
    debugPhysics: false,
    autoEquipGravGun: false,
    draggableSelectors: [
        "[data-phys=true]",
        "[data-slot=card]",
        "img",
        "video",
        ".tab > div",
        "#testGravBox",
        "h2",
        "h1",
        "h3",
        "button",
        "p",
        "li",
    ],
    neverDraggableSelectors: [
        "[data-phys=none]",
        ".decoration .top img",
        ".lightbox *",
        "footer *",
    ],
    enableTextBounds: true,
    textBoundedSelectors: ["[data-phys-bounds=text]", "h3", "h2", "h1", "p"],
    hoverScale: 1,
    maxDimensions: { width: 1000, height: 1000 },
    gravityHoverDebounceDelay: 200,
};

/** CSS class names used by the physics system */
export const PHYSICS_CLASS_NAMES = {
    // Body classes
    debugPhysics: "debug-physics",
    hasPhysBodies: "has-physics-bodies",
    showDebugUI: "show-physics-debug-ui",
    showHandleMessage: "physics-handle-message",

    // Element classes
    physicsElement: "physics-element",
    extractable: "extractable",
    extracted: "extracted",
    placeholder: "physics-placeholder",
    mediaPlaceholder: "physics-media-placeholder",
    physicsCanvas: "physics-canvas",

    // Gravity gun classes
    handle: "handle-held",
    handleContainer: "handle-held-container",
    handleEquipped: "equipped",
    handleHoveringOverItem: "hovering-over-item",
    handleHoldingItem: "holding-item",
    handleRecoil: "recoil",
    handleButtonWiggle: "handle-wiggle",

    // Other
    noShadow: "noshadow",
} as const;

/** Interface for transform style components */
export interface TransformComponents {
    readonly translate: { x: number; y: number };
    readonly rotate: number;
    readonly scale: number;
}

/** Interface for size dimensions */
export interface Dimensions {
    readonly width: number;
    readonly height: number;
}

/** Interface for position coordinates */
export interface Position {
    readonly x: number;
    readonly y: number;
}

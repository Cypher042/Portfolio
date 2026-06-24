import fastdom from "fastdom";
import { PHYSICS_CLASS_NAMES } from "./config";

/**
 * Sets or removes a CSS class on an element
 * @param element - Target element
 * @param className - CSS class name
 * @param shouldAdd - Whether to add or remove the class
 */
export function setElementClass(
    element: HTMLElement,
    className: string,
    shouldAdd: boolean,
): void {
    if (shouldAdd) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * Creates a deep clone of an element with optional media placeholders
 * @param element - Element to clone
 * @param useMediaPlaceholders - Whether to replace media with placeholders
 * @returns Cloned element
 */
export function deepCloneElement(
    element: HTMLElement,
    useMediaPlaceholders: boolean,
): HTMLElement {
    const isMedia = element.matches("img, video, iframe");

    if (isMedia && useMediaPlaceholders) {
        const placeholder = document.createElement("div");
        copyComputedStyles(element, placeholder);
        placeholder.className = PHYSICS_CLASS_NAMES.mediaPlaceholder;

        const computedStyle = getComputedStyle(element);
        forceElementSize(
            placeholder,
            Number.parseFloat(computedStyle.width),
            Number.parseFloat(computedStyle.height),
        );

        return placeholder;
    }

    const clone = element.cloneNode(false) as HTMLElement;

    // Copy attributes
    for (const attr of element.attributes) {
        clone.setAttribute(attr.name, attr.value);
    }

    // Clone children
    for (const child of element.childNodes) {
        if (child instanceof HTMLElement) {
            clone.appendChild(deepCloneElement(child, useMediaPlaceholders));
        } else {
            clone.appendChild(child.cloneNode(true));
        }
    }

    return clone;
}

/**
 * Copies computed styles from one element to another
 * @param source - Source element
 * @param target - Target element
 */
export function copyComputedStyles(
    source: HTMLElement,
    target: HTMLElement,
): void {
    const styles = getComputedStyle(source);
    for (const styleKey of styles) {
        target.style.setProperty(styleKey, styles.getPropertyValue(styleKey));
    }
}

/**
 * Forces an element to have a fixed size
 * @param element - Element to resize
 * @param width - Width in pixels
 * @param height - Height in pixels
 */
export function forceElementSize(
    element: HTMLElement,
    width: number,
    height: number,
): void {
    const widthPx = `${width}px`;
    const heightPx = `${height}px`;

    element.style.width = widthPx;
    element.style.minWidth = widthPx;
    element.style.maxWidth = widthPx;
    element.style.height = heightPx;
    element.style.minHeight = heightPx;
    element.style.maxHeight = heightPx;

    if (element.style.display === "inline") {
        element.style.display = "inline-block";
    }
}

/**
 * Bakes computed styles into an element tree to preserve layout after reparenting
 * @param rootElement - Root element to process
 */
export async function bakeComputedStyles(
    rootElement: HTMLElement,
): Promise<void> {
    const elements: HTMLElement[] = [];
    const toTraverse = [rootElement];

    // Collect all elements
    while (toTraverse.length > 0) {
        const element = toTraverse.pop() as HTMLElement;
        elements.push(element);
        for (const child of element.children) {
            toTraverse.push(child as HTMLElement);
        }
    }

    // Read all computed styles
    const elementStyles = elements.map((element) => {
        const styles = getComputedStyle(element);
        const stylePairs: [string, string][] = [];
        for (let i = 0; i < styles.length; i++) {
            const propName = styles.item(i);
            stylePairs.push([propName, styles.getPropertyValue(propName)]);
        }
        return stylePairs;
    });

    // Apply styles in one mutation to prevent layout thrashing
    return new Promise<void>((resolve) => {
        fastdom.mutate(() => {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const styles = elementStyles[i];

                if (!(element && styles)) {
                    continue;
                }

                element.style.contain = "layout";
                for (const [propName, propValue] of styles) {
                    if (propName !== "contain") {
                        element.style.setProperty(propName, propValue);
                    }
                }
            }
            resolve();
        });
    });
}

/**
 * Gets text bounds for an element
 * @param element - Element to get text bounds for
 * @returns Text bounding rectangle or null
 */
export function getTextBounds(element: HTMLElement): DOMRect | null {
    const textNodes = getChildTextNodes(element);
    const textRects = textNodes
        .map((textNode) => {
            if (document.createRange) {
                const range = document.createRange();
                range.selectNodeContents(textNode);
                return range.getBoundingClientRect();
            }
            return null;
        })
        .filter(
            (rect): rect is DOMRect =>
                rect !== null && (rect.width > 0 || rect.height > 0),
        );

    if (textRects.length === 0) return null;

    const bounds = {
        left: (textRects[0] as DOMRect).left,
        right: (textRects[0] as DOMRect).right,
        top: (textRects[0] as DOMRect).top,
        bottom: (textRects[0] as DOMRect).bottom,
    };

    for (let i = 1; i < textRects.length; i++) {
        const rect = textRects[i];

        if (!rect) {
            continue;
        }

        bounds.left = Math.min(bounds.left, rect.left);
        bounds.top = Math.min(bounds.top, rect.top);
        bounds.right = Math.max(bounds.right, rect.right);
        bounds.bottom = Math.max(bounds.bottom, rect.bottom);
    }

    return new DOMRect(
        bounds.left,
        bounds.top,
        bounds.right - bounds.left,
        bounds.bottom - bounds.top,
    );
}

/**
 * Gets all text nodes within an element
 * @param element - Element to search
 * @returns Array of text nodes
 */
export function getChildTextNodes(element: HTMLElement): Node[] {
    const textNodes: Node[] = [];
    const nodesToTraverse: Node[] = [element];

    while (nodesToTraverse.length > 0) {
        const node = nodesToTraverse.pop() as Node;

        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        }

        for (const child of node.childNodes) {
            nodesToTraverse.push(child);
        }
    }

    return textNodes;
}

/**
 * Gets cumulative CSS rotate property in degrees
 * @param element - Element to check
 * @returns Total rotation in degrees
 */
export function getCumulativeCSSRotation(element: HTMLElement): number {
    let totalDegrees = 0;
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
        const degrees = Number.parseFloat(
            getComputedStyle(currentElement).rotate,
        );
        if (!Number.isNaN(degrees)) {
            totalDegrees += degrees;
        }
        currentElement = currentElement.parentElement;
    }

    return totalDegrees;
}

/**
 * Prevents default click behavior on an element and its parent links
 * @param element - Element to process
 */
export function preventDefaultClicks(element: HTMLElement): void {
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
        currentElement.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });

        currentElement.addEventListener("mousedown", (event) => {
            event.preventDefault();
        });

        currentElement.style.cursor = "default";

        const parent: HTMLElement | null = currentElement.parentElement;
        if (!parent || (!parent.matches("a") && !parent.matches("button"))) {
            break;
        }
        currentElement = parent;
    }
}

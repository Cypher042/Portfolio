import type { Position, TransformComponents } from "./config";

/**
 * Utility class for handling CSS transform styles
 */
export class TransformStyle implements TransformComponents {
    public translate: { x: number; y: number } = { x: 0, y: 0 };
    public rotate = 0;
    public scale = 1;

    /**
     * Creates a new TransformStyle instance
     * @param translateOrElement - Translation values or element to read from
     * @param rotate - Rotation in radians
     * @param scale - Scale multiplier
     */
    constructor(translate?: Position | null, rotate?: number, scale?: number) {
        this.translate = translate ?? { x: 0, y: 0 };

        if (rotate !== undefined) this.rotate = rotate;
        if (scale !== undefined) this.scale = scale;
    }

    static fromElement(element: Element): TransformStyle {
        const transform = new TransformStyle();
        transform.readFromElement(element);
        return transform;
    }

    /** Check if this transform is the identity transform */
    get isIdentity(): boolean {
        return (
            this.translate.x === 0 &&
            this.translate.y === 0 &&
            this.rotate === 0 &&
            this.scale === 1
        );
    }

    /**
     * Creates a deep copy of this transform
     * @returns New TransformStyle instance
     */
    clone(): TransformStyle {
        return new TransformStyle(
            { ...this.translate },
            this.rotate,
            this.scale,
        );
    }

    /**
     * Reads transform values from an element's computed style
     * @param element - Element to read from
     */
    private readFromElement(element: Element): void {
        const computedStyle = getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(computedStyle.transform);

        if (matrix.isIdentity) return;

        this.rotate = Math.atan2(matrix.m12, matrix.m11);

        if (matrix.m11 === 0 && matrix.m12 === 0) {
            this.scale = 0;
        } else if (Math.abs(matrix.m11) < Number.EPSILON * 10) {
            this.scale = matrix.m12 / Math.sin(this.rotate);
        } else {
            this.scale = matrix.m11 / Math.cos(this.rotate);
        }

        this.translate = {
            x: matrix.m41,
            y: matrix.m42,
        };
    }

    /**
     * Applies this transform to an element
     * @param element - Element to apply transform to
     */
    applyToElement(element: HTMLElement): void {
        if (this.isIdentity) {
            element.style.removeProperty("transform");
        } else {
            element.style.transform = this.toCSS();
        }
    }

    /**
     * Converts this transform to a CSS transform string
     * @returns CSS transform string
     */
    toCSS(): string {
        if (this.isIdentity) return "";

        return [
            `translate(${this.translate.x}px, ${this.translate.y}px)`,
            `rotate(${this.rotate}rad)`,
            `scale(${this.scale})`,
        ].join(" ");
    }
}

/**
 * kity 类型声明（部分，覆盖编辑器/导航器常用 API）。
 */

declare namespace Kity {
    interface Box {
        x: number;
        y: number;
        width: number;
        height: number;
        cx: number;
        cy: number;
        intersect(box: Box): Box;
        offset(dx: number, dy: number): Box;
    }

    class Box2 {
        x: number;
        y: number;
        width: number;
        height: number;
        cx: number;
        cy: number;
        intersect(box: any): any;
        offset(dx: number, dy: number): any;
    }

    class Paper {
        constructor(container: HTMLElement);
        put(shape: any): any;
        setViewBox(x: number, y: number, width: number, height: number): void;
        setStyle(key: string, value: string): void;
        on(event: string, handler: (e: { getPosition(mode?: string): { x: number; y: number } }) => void): void;
    }

    class Path {
        fill(color: string): this;
        stroke(color: string, width?: string): this;
        setPathData(data: string[] | null): this;
    }

    class Rect {
        constructor(width: number, height: number);
        stroke(color: string, width?: string): this;
        setBox(box: any): this;
    }

    interface Browser {
        gecko: boolean;
        webkit: boolean;
    }

    interface KityStatic {
        Paper: typeof Paper;
        Path: typeof Path;
        Rect: typeof Rect;
        Box: typeof Box2;
        Browser: Browser;
    }
}

declare global {
    interface Window {
        kity: Kity.KityStatic;
    }
}

export {};

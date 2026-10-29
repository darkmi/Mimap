/**
 * kityminder-core 类型声明（部分，覆盖编辑器常用 API）。
 * 上游无类型，此处为 Phase 3 自写声明。
 */

declare namespace KityMinder {
    interface MinderOptions {
        enableKeyReceiver?: boolean;
        enableAnimation?: boolean;
    }

    interface JsonData {
        data: NodeData;
        children?: JsonData[];
    }

    interface NodeData {
        text?: string;
        priority?: number;
        progress?: number;
        hyperlink?: string;
        hyperlinkTitle?: string;
        image?: string;
        imageTitle?: string;
        note?: string;
        resource?: string[];
        [key: string]: unknown;
    }

    interface MinderNode {
        type: string;
        parent: MinderNode | null;
        children: MinderNode[];

        getText(): string;
        setText(text: string): void;
        getData(key?: string): any;
        setData(key: string, value: any): void;
        getLevel(): number;
        isExpanded(): boolean;
        getRenderBox(mode?: string): { x: number; y: number; width: number; height: number; cx: number; cy: number; bottom: number; left: number; top: number; right: number };
        getLayoutBox(): { x: number; y: number; width: number; height: number };
        getRenderer(name: string): { getRenderShape(): { getRenderBox(mode?: string): any } };
        getConnection(): { getPathData(): string[] } | null;
        traverse(callback: (node: MinderNode) => void): void;
        renderTree(): void;
    }

    interface ViewDragger {
        getView(): { intersect(box: any): any; width: number; height: number };
        moveTo(position: { x: number; y: number }, duration?: number): void;
    }

    interface Minder {
        renderTo(container: HTMLElement | string): void;
        setTheme(theme: string | null): void;
        getTheme(): string;
        getThemeItems(): Record<string, any>;
        setDefaultOptions(options: Record<string, any>): void;
        getOption(key: string): any;

        getRoot(): MinderNode;
        getSelectedNode(): MinderNode | null;
        getSelectedNodes(): MinderNode[];
        select(node: MinderNode | MinderNode[], add?: boolean): void;
        getAllNode(): MinderNode[];
        createNode(data?: any, parent?: MinderNode, index?: number): MinderNode;

        execCommand(command: string, ...args: any[]): any;
        queryCommandState(command: string): number;
        queryCommandValue(command: string): any;

        exportJson(): JsonData;
        importJson(json: JsonData): void;
        exportData(protocol: string, option?: any): Promise<string>;
        importData(protocol: string, data: string, option?: any): Promise<JsonData>;

        on(event: string, handler: (e: any) => void): void;
        off(event: string, handler?: (e: any) => void): void;
        fire(event: string, data?: any): void;

        getPaper(): { getViewPortMatrix(): { transformBox(box: any): any } };
        getViewDragger(): ViewDragger;
        getRenderContainer(): { getBoundaryBox(): { x: number; y: number; width: number; height: number } };
        getStyle(key: string): string;
        getNodeStyle(node: MinderNode, key: string): any;
        getUsedResource(): string[];
        getResourceColor(resource: string): { toHEX(): string };
        layout(duration?: number): void;

        Text2Children(node: MinderNode, text: string): void;
        dispatchKeyEvent(e: KeyboardEvent): void;
    }

    interface MinderStatic {
        new (options?: MinderOptions): Minder;
        getTemplateList(): Record<string, any>;
        getThemeList(): Record<string, any>;
    }

    interface DataProtocol {
        Node2Text(node: MinderNode): string;
    }

    interface KityMinderStatic {
        version: string;
        Minder: MinderStatic;
        Editor: any;
        data: {
            getRegisterProtocol(name: string): DataProtocol;
        };
    }
}

declare global {
    interface Window {
        kityminder: KityMinder.KityMinderStatic;
    }
}

export {};

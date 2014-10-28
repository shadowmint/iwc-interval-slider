/// <reference path="../../bower_components/iwcjs/defs/iwc.d.ts" />
/// <reference path="../../defs/jquery/jquery.d.ts" />
export declare class Slider {
    public root: any;
    public data: any;
    public offset: number;
    public value: string;
    private _change;
    private _intervals;
    public content(): any;
    public init(): void;
    public move(offset?: number): void;
    public change(callback: () => void): void;
    private next();
    public prev(): void;
    private _trigger();
    private _offset(i);
}
export declare class SliderFactory {
    public stylesheet: string;
    public query(root: any): any;
    public factory(): any;
}
export declare class Draggable {
    private _root;
    private _active;
    private _rootOffset;
    private _bounds;
    private _width;
    public offset: number;
    public onrelease: (d: Draggable) => void;
    constructor(target: any);
    private resize();
    public move(pos: any, offset?: number): void;
    public track_cursor(): void;
}

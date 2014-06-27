/// <reference path="../../defs/jquery/jquery.d.ts" />
/// <reference path="../../defs/iwc/iwc.d.ts" />
export declare class Slider extends iwc.Base {
    public $: JQueryStatic;
    constructor();
    public targets(): HTMLElement[];
    public model(): any;
    public view(): any;
    public api(): any;
    public state(ref: iwc.Ref): any[];
    public update(ref: iwc.Ref): void;
    public instance(ref: iwc.Ref): void;
    private percent_offset(r, i);
    private move_to_selected(r);
    private move_to_closest(r);
    public next(r: iwc.Ref): void;
    public prev(r: iwc.Ref): void;
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

/// <reference path="../../defs/jquery/jquery.d.ts" />
/// <reference path="../../defs/iwc/iwc.d.ts" />
export declare class Slider extends iwc.Base {
    public $: JQueryStatic;
    constructor();
    public targets(): HTMLElement[];
    public model(): any;
    public view(): any;
    public state(ref: iwc.Ref): any[];
    public update(ref: iwc.Ref): void;
    public instance(ref: iwc.Ref): void;
    private move_to_selected(r);
    private move_to_closest(r);
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
    public move(pos: number, offset?: number): void;
    public track_cursor(): void;
}

/// <reference path="../../defs/jquery/jquery.d.ts" />
/// <reference path="../../defs/handlebars/handlebars.d.ts" />
/// <reference path="../../defs/iwc/iwc.d.ts" />
export interface Data {
    styles: string;
    markup: string;
    jquery: JQueryStatic;
    handlebars: HandlebarsStatic;
}
export declare class Base {
    public name: string;
    public _data: Data;
    public _template: HandlebarsTemplateDelegate;
    constructor(name: string, data: Data);
    public targets(): HTMLElement[];
    public template(data: any): string;
    public model(): any;
    public view(): any;
    public state(ref: iwc.Ref): any[];
    public update(ref: iwc.Ref): void;
    public instance(ref: iwc.Ref): void;
    public preload(ref: iwc.Ref): void;
    public def(): iwc.ComponentDef;
}
export declare class Slider extends Base {
    constructor();
    public model(): any;
    public view(): any;
    public state(ref: iwc.Ref): any[];
    public update(ref: iwc.Ref): void;
    public instance(ref: iwc.Ref): void;
    private _move_to_closest(d, r);
}
export declare class Draggable {
    private _root;
    private _active;
    private _bounds;
    private _width;
    public offset: number;
    public onrelease: (d: Draggable) => void;
    constructor(target: any);
    public move(pos: number): void;
    public track_cursor(): void;
}

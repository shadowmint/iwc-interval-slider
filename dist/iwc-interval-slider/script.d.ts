/// <reference path="../../bower_components/iwcjs/defs/iwc.d.ts" />
/// <reference path="../../defs/jquery/jquery.d.ts" />
/** Slider type */
export declare class Slider {
    /** Component root node */
    root: any;
    /** The component data model */
    data: any;
    /** The current index */
    offset: number;
    /** The current value */
    value: string;
    /** On change callback */
    private _change;
    /** The set of interval DOM nodes */
    private _intervals;
    /** Raw template for this component */
    content(): any;
    /** Run on start up */
    init(): void;
    /** Move the marker to a specific interval or closest if null */
    move(offset?: number): void;
    /** Bind a callback to invoke when the value changes on this object */
    change(callback: {
        (): void;
    }): void;
    /** Next item */
    private next();
    /** Previous item */
    prev(): void;
    /** Trigger on change callbacks */
    private _trigger();
    /** Calculate the % offset for an index */
    private _offset(i);
}
/** Slider factory */
export declare class SliderFactory {
    /** Inline styles */
    stylesheet: string;
    /** Find root nodes */
    query(root: any): any;
    /** New instance */
    factory(): any;
}
/** Draggable items */
export declare class Draggable {
    private _root;
    private _active;
    private _rootOffset;
    private _bounds;
    private _width;
    offset: number;
    onrelease: {
        (d: Draggable): void;
    };
    constructor(target: any);
    private resize();
    move(pos: any, offset?: number): void;
    track_cursor(): void;
}

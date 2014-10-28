/// <reference path="../../bower_components/iwcjs/defs/iwc.d.ts"/>
/// <reference path="../../defs/jquery/jquery.d.ts"/>
/// <amd-dependency='jquery'/>
import $ = require('jquery');
import iwc = require('iwc');
declare var data;

/** Slider type */
export class Slider {

    /** Component root node */
    public root:any;

    /** The component data model */
    public data:any;

    /** The current index */
    public offset:number;

    /** The current value */
    public value:string;

    /** On change callback */
    private _change:{():void}[] = [];

    /** The set of interval DOM nodes */
    private _intervals:any[] = [];

    /** Raw template for this component */
    public content():any {
        return data.markup;
    }

    /** Run on start up */
    public init():void {

        // Add intervals
        var $intervals = $(this.root).find('.intervals');
        for (var i = 0; i < this.data.interval.length; ++i) {
            var $mark = $('<div></div>').attr('data-value', i).addClass('interval');
            $mark.css('left', this._offset(i));
            $intervals.append($mark);
            this._intervals.push($mark);
        }

        // Make the marker draggable
        var $marker = $(this.root).find('.marker');
        var drag = new Draggable($marker);
        drag.onrelease = () => {
            console.log(this);
            this.move();
        };

        // Set initial state
        this.move(0);
    }

    /** Move the marker to a specific interval or closest if null */
    public move(offset:number = -1):void {
        var $marker = $(this.root).find('.marker');
        if (offset == -1) {
            var min = -1;
            var p = $marker.offset().left;
            for (var i = 0; i < this._intervals.length; ++i) {
                var delta = Math.abs(p - $(this._intervals[i]).offset().left);
                if ((min == -1) || (delta < min)) {
                    offset = i;
                    min = delta;
                }
            }
        }
        if (offset >= this._intervals.length) {
            offset = this._intervals[this._intervals.length - 1];
        }
        if (offset < 0) {
            offset = 0;
        }
        if (this.offset != offset) {
            this.offset = offset;
            this.value = $(this._intervals[offset]).attr('data-value');
            this._trigger();
        }
        $marker.css('left', this._offset(this.offset));
    }

    /** Bind a callback to invoke when the value changes on this object */
    public change(callback:{():void}):void {
        this._change.push(callback)
    }

    /** Next item */
    private next():void {
        this.move(this.offset + 1);
    }

    /** Previous item */
    public prev():void {
        this.move(this.offset - 1);
    }

    /** Trigger on change callbacks */
    private _trigger():void {
        var schedule = (i:number) => {
            setTimeout(() => {
                this._change[i].call(this);
            }, 1);
        };
        for (var i = 0; i < this._change.length; ++i) {
            schedule(i);
        }
    }

    /** Calculate the % offset for an index */
    private _offset(i:number):string {
        var count = this.data.interval.length > 0 ? this.data.interval.length : 1;
        var size = 100 / (count - 1);
        return i * size + '%';
    }
}

/** Slider factory */
export class SliderFactory {

    /** Inline styles */
    public stylesheet:string = data.styles;

    /** Find root nodes */
    public query(root:any):any {
        return $(root).find('.component--iwc-interval-slider');
    }

    /** New instance */
    public factory():any {
        return new Slider();
    }
}

/** Draggable items */
export class Draggable {

  private _root:any;
  private _active:boolean;
  private _rootOffset:number;
  private _bounds:number[];
  private _width:number;
  public offset:number;
  public onrelease:{(d:Draggable):void} = null;

  constructor(target:any) {
    this._root = target;
    this._active = false;
    this.resize();
    this.track_cursor();
  }

  private resize():void {
    this._width = this._root.width();
    this._rootOffset = $(this._root).parent().offset().left;
    var offset = this._root.parent().offset();
    var width = this._root.parent().width();
    this._bounds = [offset.left, offset.left + width];
  }

  public move(pos:any, offset:number = null):void {
    if (offset === null) {
      this._root.css('left', pos);
    }
    else {
      this._root.css('left', pos - offset);
    }
    this.offset = $(this._root).offset().left;
  }

  public track_cursor():void {
    var start = (e) => {
        this._active = true;
        e.preventDefault();
    };
    $(this._root).bind('touchstart', start);
    $(this._root).bind('mousedown', start);

    var stop = (e) => {
      if (this._active) {
        this._active = false;
        if (this.onrelease) {
          this.onrelease(this);
        }
      }
      e.preventDefault();
    };
    $(window).bind('mouseup', stop);
    $(window).bind('touchend', stop);

    var action = (e:any) => {
      if (this._active) {
          if (!e.clientX) {
             e = e.originalEvent.touches.item(0);
          }
        this.resize();
        if ((e.clientX > this._bounds[0]) && (e.clientX < this._bounds[1])) {
          this.move(e.clientX, this._rootOffset);
        }
      }
    };
    $(window).bind('mousemove', action);
    $(window).bind('touchmove', action);
  }
}

// Actually register
iwc.register(new SliderFactory());

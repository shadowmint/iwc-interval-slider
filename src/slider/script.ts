/// <reference path="../../defs/jquery/jquery.d.ts"/>
/// <reference path="../../defs/iwc/iwc.d.ts"/>
/// <amd-dependency='jquery'/>
import iwc = require('iwc');
import jquery = require('jquery');
declare var data:iwc.Data;

/** Slider type */
export class Slider extends iwc.Base {

  public $:JQueryStatic;

  constructor() {
    super('iwc-interval-slider', data);
      this.$ = jquery;
  }

  public targets():HTMLElement[] {
      var rtn = <HTMLElement[]> (<any> this.$('.component--iwc-interval-slider'));
      return rtn;
  }

  public model():any {
    return {
      selected: 0,
      value: null,
      intervals: []
    }
  }

  public view():any {
    return {
      intervals: [],
      markers: null,
      onchange: null
    };
  }

  public state(ref:iwc.Ref):any[] {
    return [ref.model.selected];
  }

  public update(ref:iwc.Ref):void {
    var intervals = ref.view.intervals;
    for (var i = 0; i < intervals.length; ++i) {
      if (ref.model.selected == i) {
        intervals[i].addClass('active');
        ref.model.value = ref.model.intervals[i];
      }
      else {
        intervals[i].removeClass('active');
      }
    }
    if (ref.view.onchange) {
      ref.view.onchange(ref.model);
    }
  }

  public instance(ref:iwc.Ref):void {
    var intervals = ref.view['data-interval'];
    ref.model.tmp = Math.random();
    ref.model.intervals = [];
    ref.view.intervals = [];
    ref.view.markers = $(ref.root).find('.intervals');
    ref.view.marker = new Draggable($(ref.root).find('.marker'));
    ref.view.marker.onrelease = (d) => { this.move_to_closest(ref); };
    var count = intervals.length > 0 ? intervals.length : 1;
    var size = 100 / (count - 1);
    for (var i = 0; i < intervals.length; ++i) {
      var $mark = $('<div></div>');
      $mark.attr('data-value', i);
      $mark.addClass('interval');
      $mark.css('left', i * size + "%");
      ref.view.markers.append($mark);
      ref.view.intervals.push($mark);
      ref.model.intervals.push(intervals[i]);
      $mark.click((e) => {
        ref.action((ref) => {
          var value = $(e.target).data('value');
          ref.model.selected = value;
          this.move_to_selected(ref);
        })
      });
    }
  }

  /** Move the draggable to nearest interval when it gets released */
  private move_to_selected(r:iwc.Ref):void {
      var d = r.view.marker;
      var pos = this.$(r.view.intervals[r.model.selected]).position().left;
      d.move(pos);
  }

  /** Move the draggable to nearest interval when it gets released */
  private move_to_closest(r:iwc.Ref):void {
    var d = r.view.marker;
    var min = -1;
    var offset = -1;
    var value = 0;
    for (var i = 0; i < r.view.intervals.length; ++i) {
      var item = r.view.intervals[i].offset().left;
      var delta = Math.abs(item - d.offset);
      if ((min == -1) || (delta < min)) {
        value = r.view.intervals[i].position().left;
        offset = i;
        min = delta;
      }
    }
    r.action((r) => {
      r.model.selected = offset;
      d.move(value);
    });
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
    this._width = this._root.width();
    this._rootOffset = $(target).parent().offset().left;
    var offset = this._root.parent().offset();
    var width = this._root.parent().width();
    this._bounds = [offset.left, offset.left + width];
    this.track_cursor();
    this._root.mousedown(() => { this._active = true; });
  }

  public move(pos:number, offset:number = 0):void {
    this._root.css('left', pos - offset);
    this.offset = pos;
  }

  public track_cursor():void {
    $(window).mouseup((e) => {
      if (this._active) {
        this._active = false;
        if (this.onrelease) {
          this.onrelease(this);
        }
      }
    });
    $(window).mousemove((e) => {
      if (this._active) {
        if ((e.clientX > this._bounds[0]) && (e.clientX < this._bounds[1])) {
          this.move(e.clientX, this._rootOffset);
        }
      }
    });
  }
}

// Actually register
iwc.component(new Slider().def());

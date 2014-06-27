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
      intervals: [],
      selected: 0,
      value: null
    };
  }

  public view():any {
    return {
      intervals: [],
      markers: null,
      onchange: null
    };
  }

  public api():any {
    return {
      next: (r) => { this.next(r); },
      prev: (r) => { this.prev(r); }
    }
  }

  public state(ref:iwc.Ref):any[] {
    return [ref.model.selected, ref.view.onchange];
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
    this.move_to_selected(ref);
  }

  public instance(ref:iwc.Ref):void {
    var intervals = ref.view['data-interval'];
    if ((typeof intervals) == 'string') {
      intervals = [intervals];
      this.$(ref.root).hide();
    }
    ref.model.intervals = [];
    ref.view.intervals = [];
    ref.view.markers = $(ref.root).find('.intervals');
    ref.view.marker = new Draggable($(ref.root).find('.marker'));
    ref.view.marker.onrelease = () => { this.move_to_closest(ref); };
    for (var i = 0; i < intervals.length; ++i) {
      var $mark = $('<div></div>');
      $mark.attr('data-value', i);
      $mark.addClass('interval');
      $mark.css('left', this.percent_offset(ref, i));
      ref.view.markers.append($mark);
      ref.view.intervals.push($mark);
      ref.model.intervals.push(intervals[i]);
      ((m) => {
        var action = (e) => {
          ref.action((ref) => {
            var value = $(m).data('value');
            ref.model.selected = value;
          });
        };
        m.click(action);
        m.bind('touchstart', action);
      })($mark);
      this.move_to_closest(ref);
    }
  }

  /** Calculate the % offset for an index */
  private percent_offset(r:iwc.Ref, i:number):string {
    var intervals = r.view['data-interval'];
    var count = intervals.length > 0 ? intervals.length : 1;
    var size = 100 / (count - 1);
    return i * size + '%';
  }

  /** Move the draggable to nearest interval when it gets released */
  private move_to_selected(r:iwc.Ref):void {
    var d = r.view.marker;
    d.move(this.percent_offset(r, r.model.selected));
  }

  /** Move the draggable to nearest interval when it gets released */
  private move_to_closest(r:iwc.Ref):void {
    var d = r.view.marker;
    var min = -1;
    var offset = -1;
    for (var i = 0; i < r.view.intervals.length; ++i) {
      var item = r.view.intervals[i].offset().left;
      var delta = Math.abs(item - d.offset);
      if ((min == -1) || (delta < min)) {
        offset = i;
        min = delta;
      }
    }
    r.action((r) => {
      r.model.selected = offset;
      this.move_to_selected(r);
    });
  }

  /** Next item */
  next(r:iwc.Ref):void {
    r.action((r) => {
      if (r.model.selected < (r.model.intervals.length)) {
        ++r.model.selected;
      }
    })
  }

  /** Prev item */
  prev(r:iwc.Ref):void {
    r.action((r) => {
      if (r.model.selected > 0) {
        --r.model.selected;
      }
    })
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
        if ((e.clientX > this._bounds[0]) && (e.clientX < this._bounds[1])) {
          this.resize();
          this.move(e.clientX, this._rootOffset);
        }
      }
    };
    $(window).bind('mousemove', action);
    $(window).bind('touchmove', action);
  }
}

// Actually register
iwc.component(new Slider().def());

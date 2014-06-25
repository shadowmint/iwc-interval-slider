/// <reference path="../../defs/jquery/jquery.d.ts"/>
/// <reference path="../../defs/handlebars/handlebars.d.ts"/>
/// <reference path="../../defs/iwc/iwc.d.ts"/>
/// <amd-dependency='jquery'/>
/// <amd-dependency='handlebars'/>
import iwc = require('iwc');
import jquery = require('jquery');
import handlebars = require('handlebars');
declare var data;
data['jquery'] = jquery;
data['handlebars'] = handlebars['default'];

/** Incoming data interface */
export interface Data {
  styles:string;
  markup:string;
  jquery:JQueryStatic;
  handlebars:HandlebarsStatic;
}

/** Common base for IWC instances using jquery, handlebars */
export class Base {

  /** Name */
  public name:string;

  /** Data elements */
  public _data:Data;

  /** Compiled template */
  public _template:HandlebarsTemplateDelegate;

  /** Create a component with a given name */
  constructor(name:string, data:Data) {
    this._data = data;
    this.name = name;
    this._template = data.handlebars.compile(this._data.markup);
  }

  public targets():HTMLElement[] {
    var matches = this._data.jquery('.component--' + this.name);
    var rtn = [];
    for (var i = 0; i < matches.length; ++i) {
      rtn.push(matches[i]);
    }
    return rtn;
  }

  public template(data:any):string {
    console.log(this._template(data));
    return this._template(data);
  }

  /** Return the model for this component */
  public model():any {
    return {};
  }

  /** Return the view for this component */
  public view():any {
    return {};
  }

  public state(ref:iwc.Ref):any[] {
    return [];
  }

  public update(ref:iwc.Ref):void {
  }

  public instance(ref:iwc.Ref):void {
  }

  public preload(ref:iwc.Ref):void {
  }

  /** Export a definition for this instance */
  public def():iwc.ComponentDef {
    return {
      name: this.name,
      model: this.model(),
      view: this.view(),
      styles: this._data.styles,
      targets: ():HTMLElement[] => {
        return this.targets();
      },
      template: (data:any) => {
        return this.template(data);
      },
      instance: (ref:iwc.Ref) => {
        this.instance(ref);
      },
      preload: (ref:iwc.Ref) => {
        this.preload(ref);
      },
      state: (ref:iwc.Ref) => {
        return this.state(ref);
      },
      update: (ref:iwc.Ref) => {
        this.update(ref);
      }
    };
  }
}

/** Slider type */
export class Slider extends Base {

  constructor() {
    super('iwc-interval-slider', data);
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
    console.log(ref);
    ref.view.marker = new Draggable($(ref.root).find('.marker'));
    ref.view.marker.onrelease = (d) => { this._move_to_closest(d, ref); };
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
          console.log(ref.model.tmp);
          var value = $(e.target).data('value');
          ref.model.selected = value;
        })
      });
    }
  }

  /** Move the draggable to nearest interval when it gets released */
  private _move_to_closest(d:Draggable, r:iwc.Ref):void {
    var min = -1;
    var offset = -1;
    var value = 0;
    console.log(r.view.intervals);
    for (var i = 0; i < r.view.intervals.length; ++i) {
      var item = r.view.intervals[i].offset().left;
      var delta = Math.abs(item - d.offset);
      if ((min == -1) || (delta < min)) {
        value = item;
        offset = i;
        min = delta;
      }
      console.log(value, offset, min);
    }
    console.log('FINAL', value, offset, min);
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
  private _bounds:number[];
  private _width:number;
  public offset:number;
  public onrelease:{(d:Draggable):void} = null;

  constructor(target:any) {
    this._root = target;
    this._active = false;
    this._width = this._root.width();
    var offset = this._root.parent().offset();
    var width = this._root.parent().width();
    this._bounds = [offset.left, offset.left + width];
    this.track_cursor();
    this._root.mousedown(() => { this._active = true; });
  }

  public move(pos:number):void {
    this._root.css('left', pos);
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
          this.move(e.clientX);
        }
      }
    });
  }
}

// Actually register
iwc.component(new Slider().def());

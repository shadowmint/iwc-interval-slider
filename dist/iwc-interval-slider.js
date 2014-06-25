(function(data) {
  var __extends = this.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
  };
  define(["require", "exports", 'iwc', 'jquery', 'handlebars'], function(require, exports, iwc, jquery, handlebars) {
    data['jquery'] = jquery;
    data['handlebars'] = handlebars['default'];



    var Base = (function() {
      function Base(name, data) {
        this._data = data;
        this.name = name;
        this._template = data.handlebars.compile(this._data.markup);
      }
      Base.prototype.targets = function() {
        var matches = this._data.jquery('.component--' + this.name);
        var rtn = [];
        for (var i = 0; i < matches.length; ++i) {
          rtn.push(matches[i]);
        }
        return rtn;
      };

      Base.prototype.template = function(data) {
        console.log(this._template(data));
        return this._template(data);
      };

      Base.prototype.model = function() {
        return {};
      };

      Base.prototype.view = function() {
        return {};
      };

      Base.prototype.state = function(ref) {
        return [];
      };

      Base.prototype.update = function(ref) {};

      Base.prototype.instance = function(ref) {};

      Base.prototype.preload = function(ref) {};

      Base.prototype.def = function() {
        var _this = this;
        return {
          name: this.name,
          model: this.model(),
          view: this.view(),
          styles: this._data.styles,
          targets: function() {
            return _this.targets();
          },
          template: function(data) {
            return _this.template(data);
          },
          instance: function(ref) {
            _this.instance(ref);
          },
          preload: function(ref) {
            _this.preload(ref);
          },
          state: function(ref) {
            return _this.state(ref);
          },
          update: function(ref) {
            _this.update(ref);
          }
        };
      };
      return Base;
    })();
    exports.Base = Base;

    var Slider = (function(_super) {
      __extends(Slider, _super);

      function Slider() {
        _super.call(this, 'iwc-interval-slider', data);
      }
      Slider.prototype.model = function() {
        return {
          selected: 0,
          value: null,
          intervals: []
        };
      };

      Slider.prototype.view = function() {
        return {
          intervals: [],
          markers: null,
          onchange: null
        };
      };

      Slider.prototype.state = function(ref) {
        return [ref.model.selected];
      };

      Slider.prototype.update = function(ref) {
        var intervals = ref.view.intervals;
        for (var i = 0; i < intervals.length; ++i) {
          if (ref.model.selected == i) {
            intervals[i].addClass('active');
            ref.model.value = ref.model.intervals[i];
          } else {
            intervals[i].removeClass('active');
          }
        }
        if (ref.view.onchange) {
          ref.view.onchange(ref.model);
        }
      };

      Slider.prototype.instance = function(ref) {
        var intervals = ref.view['data-interval'];
        ref.model.intervals = [];
        ref.view.intervals = [];
        ref.view.markers = $(ref.root).find('.intervals');
        ref.view.marker = new Draggable($(ref.root).find('.marker'));
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
          $mark.click(function(e) {
            ref.action(function(ref) {
              var value = $(e.target).data('value');
              ref.model.selected = value;
            });
          });
        }
      };
      return Slider;
    })(Base);
    exports.Slider = Slider;

    var Draggable = (function() {
      function Draggable(target) {
        this.track_cursor();
      }
      Draggable.prototype.track_cursor = function() {
        $(window).mousemove(function(e) {
          console.log(e.clientX);
        });
      };
      return Draggable;
    })();
    exports.Draggable = Draggable;

    iwc.component(new Slider().def());
  });
  //# sourceMappingURL=script.js.map

})({
  styles: ".component--iwc-interval-slider .intervals {\n  position: relative; }\n  .component--iwc-interval-slider .intervals .interval {\n    position: absolute;\n    width: 4px;\n    margin-left: -2px;\n    height: 15px;\n    background: #000; }\n    .component--iwc-interval-slider .intervals .interval.active {\n      background: #f00; }\n.component--iwc-interval-slider .marker {\n  height: 20px;\n  width: 20px;\n  background: #efefef;\n  border: 1px solid #000;\n  margin-left: -10px; }\n.component--iwc-interval-slider .base {\n  height: 2px;\n  width: 100%;\n  background: #000;\n  margin-top: 13px; }\n",
  markup: "<div><div class=\"marker\"></div><div class=\"intervals\"></div><div class=\"base\"></div></div>",
  resources: {}
});
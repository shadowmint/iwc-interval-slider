(function(data) {
  define(["require", "exports", 'jquery', 'iwc'], function(require, exports, $, iwc) {
    var Slider = (function() {
      function Slider() {
        this._change = [];
        this._intervals = [];
      }
      Slider.prototype.content = function() {
        return data.markup;
      };

      Slider.prototype.init = function() {
        var _this = this;
        var $intervals = $(this.root).find('.intervals');
        for (var i = 0; i < this.data.interval.length; ++i) {
          var $mark = $('<div></div>').attr('data-value', i).addClass('interval');
          $mark.css('left', this._offset(i));
          $intervals.append($mark);
          this._intervals.push($mark);
        }

        var $marker = $(this.root).find('.marker');
        var drag = new Draggable($marker);
        drag.onrelease = function() {
          console.log(_this);
          _this.move();
        };

        this.move(0);
      };

      Slider.prototype.move = function(offset) {
        if (typeof offset === "undefined") {
          offset = -1;
        }
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
      };

      Slider.prototype.change = function(callback) {
        this._change.push(callback);
      };

      Slider.prototype.next = function() {
        this.move(this.offset + 1);
      };

      Slider.prototype.prev = function() {
        this.move(this.offset - 1);
      };

      Slider.prototype._trigger = function() {
        var _this = this;
        var schedule = function(i) {
          setTimeout(function() {
            _this._change[i].call(_this);
          }, 1);
        };
        for (var i = 0; i < this._change.length; ++i) {
          schedule(i);
        }
      };

      Slider.prototype._offset = function(i) {
        var count = this.data.interval.length > 0 ? this.data.interval.length : 1;
        var size = 100 / (count - 1);
        return i * size + '%';
      };
      return Slider;
    })();
    exports.Slider = Slider;

    var SliderFactory = (function() {
      function SliderFactory() {
        this.stylesheet = data.styles;
      }
      SliderFactory.prototype.query = function(root) {
        return $(root).find('.component--iwc-interval-slider');
      };

      SliderFactory.prototype.factory = function() {
        return new Slider();
      };
      return SliderFactory;
    })();
    exports.SliderFactory = SliderFactory;

    var Draggable = (function() {
      function Draggable(target) {
        this.onrelease = null;
        this._root = target;
        this._active = false;
        this.resize();
        this.track_cursor();
      }
      Draggable.prototype.resize = function() {
        this._width = this._root.width();
        this._rootOffset = $(this._root).parent().offset().left;
        var offset = this._root.parent().offset();
        var width = this._root.parent().width();
        this._bounds = [offset.left, offset.left + width];
      };

      Draggable.prototype.move = function(pos, offset) {
        if (typeof offset === "undefined") {
          offset = null;
        }
        if (offset === null) {
          this._root.css('left', pos);
        } else {
          this._root.css('left', pos - offset);
        }
        this.offset = $(this._root).offset().left;
      };

      Draggable.prototype.track_cursor = function() {
        var _this = this;
        var start = function(e) {
          _this._active = true;
          e.preventDefault();
        };
        $(this._root).bind('touchstart', start);
        $(this._root).bind('mousedown', start);

        var stop = function(e) {
          if (_this._active) {
            _this._active = false;
            if (_this.onrelease) {
              _this.onrelease(_this);
            }
          }
          e.preventDefault();
        };
        $(window).bind('mouseup', stop);
        $(window).bind('touchend', stop);

        var action = function(e) {
          if (_this._active) {
            if (!e.clientX) {
              e = e.originalEvent.touches.item(0);
            }
            _this.resize();
            if ((e.clientX > _this._bounds[0]) && (e.clientX < _this._bounds[1])) {
              _this.move(e.clientX, _this._rootOffset);
            }
          }
        };
        $(window).bind('mousemove', action);
        $(window).bind('touchmove', action);
      };
      return Draggable;
    })();
    exports.Draggable = Draggable;

    iwc.register(new SliderFactory());
  });
  //# sourceMappingURL=script.js.map

})({
  styles: ".component--iwc-interval-slider {\n  position: relative; }\n  .component--iwc-interval-slider .intervals {\n    position: relative; }\n    .component--iwc-interval-slider .intervals .interval {\n      position: absolute;\n      width: 10px;\n      margin-left: -5px;\n      height: 10px;\n      background: #dfdfdf;\n      border-radius: 10px;\n      z-index: 1; }\n      .component--iwc-interval-slider .intervals .interval.active {\n        background: #af576b; }\n  .component--iwc-interval-slider .marker {\n    height: 20px;\n    width: 20px;\n    background: #efefef;\n    border: 1px solid #cfcfcf;\n    margin-left: -10px;\n    position: absolute;\n    top: -5px;\n    border-radius: 4px;\n    z-index: 2; }\n  .component--iwc-interval-slider .base {\n    position: relative;\n    top: 4px;\n    background: #dfdfdf;\n    height: 2px;\n    width: 100%; }\n\n/*# sourceMappingURL=styles.css.map */\n",
  markup: "<div><div class=\"marker\"></div><div class=\"intervals\"></div><div class=\"base\"></div></div>",
  resources: {}
});
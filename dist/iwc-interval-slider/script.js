var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'iwc', 'jquery'], function(require, exports, iwc, jquery) {
    var Slider = (function (_super) {
        __extends(Slider, _super);
        function Slider() {
            _super.call(this, 'iwc-interval-slider', data);
            this.$ = jquery;
        }
        Slider.prototype.targets = function () {
            var rtn = this.$('.component--iwc-interval-slider');
            return rtn;
        };

        Slider.prototype.model = function () {
            return {
                selected: 0,
                value: null,
                intervals: []
            };
        };

        Slider.prototype.view = function () {
            return {
                intervals: [],
                markers: null,
                onchange: null
            };
        };

        Slider.prototype.state = function (ref) {
            return [ref.model.selected];
        };

        Slider.prototype.update = function (ref) {
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

        Slider.prototype.instance = function (ref) {
            var _this = this;
            var intervals = ref.view['data-interval'];
            ref.model.tmp = Math.random();
            ref.model.intervals = [];
            ref.view.intervals = [];
            ref.view.markers = $(ref.root).find('.intervals');
            ref.view.marker = new Draggable($(ref.root).find('.marker'));
            ref.view.marker.onrelease = function (d) {
                _this.move_to_closest(ref);
            };
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
                $mark.click(function (e) {
                    ref.action(function (ref) {
                        var value = $(e.target).data('value');
                        ref.model.selected = value;
                        _this.move_to_selected(ref);
                    });
                });
            }
        };

        Slider.prototype.move_to_selected = function (r) {
            var d = r.view.marker;
            var pos = this.$(r.view.intervals[r.model.selected]).position().left;
            d.move(pos);
        };

        Slider.prototype.move_to_closest = function (r) {
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
            r.action(function (r) {
                r.model.selected = offset;
                d.move(value);
            });
        };
        return Slider;
    })(iwc.Base);
    exports.Slider = Slider;

    var Draggable = (function () {
        function Draggable(target) {
            var _this = this;
            this.onrelease = null;
            this._root = target;
            this._active = false;
            this._width = this._root.width();
            this._rootOffset = $(target).parent().offset().left;
            var offset = this._root.parent().offset();
            var width = this._root.parent().width();
            this._bounds = [offset.left, offset.left + width];
            this.track_cursor();
            this._root.mousedown(function () {
                _this._active = true;
            });
        }
        Draggable.prototype.move = function (pos, offset) {
            if (typeof offset === "undefined") { offset = 0; }
            this._root.css('left', pos - offset);
            this.offset = pos;
        };

        Draggable.prototype.track_cursor = function () {
            var _this = this;
            $(window).mouseup(function (e) {
                if (_this._active) {
                    _this._active = false;
                    if (_this.onrelease) {
                        _this.onrelease(_this);
                    }
                }
            });
            $(window).mousemove(function (e) {
                if (_this._active) {
                    if ((e.clientX > _this._bounds[0]) && (e.clientX < _this._bounds[1])) {
                        _this.move(e.clientX, _this._rootOffset);
                    }
                }
            });
        };
        return Draggable;
    })();
    exports.Draggable = Draggable;

    iwc.component(new Slider().def());
});
//# sourceMappingURL=script.js.map

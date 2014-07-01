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
                intervals: [],
                selected: null,
                value: null
            };
        };

        Slider.prototype.view = function () {
            return {
                intervals: [],
                markers: null,
                onchange: null
            };
        };

        Slider.prototype.api = function () {
            var _this = this;
            return {
                next: function (r) {
                    _this.next(r);
                },
                prev: function (r) {
                    _this.prev(r);
                }
            };
        };

        Slider.prototype.state = function (ref) {
            return [ref.model.selected, ref.view.onchange];
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
            this.move_to_selected(ref);
        };

        Slider.prototype.instance = function (ref) {
            var _this = this;
            var intervals = ref.view['data-interval'];
            if ((typeof intervals) == 'string') {
                intervals = [intervals];
                this.$(ref.root).hide();
            }
            ref.model.intervals = [];
            ref.view.intervals = [];
            ref.view.markers = $(ref.root).find('.intervals');
            ref.view.marker = new Draggable($(ref.root).find('.marker'));
            ref.view.marker.onrelease = function () {
                _this.move_to_closest(ref);
            };
            for (var i = 0; i < intervals.length; ++i) {
                var $mark = $('<div></div>');
                $mark.attr('data-value', i);
                $mark.addClass('interval');
                $mark.css('left', this.percent_offset(ref, i));
                ref.view.markers.append($mark);
                ref.view.intervals.push($mark);
                ref.model.intervals.push(intervals[i]);
                (function (m) {
                    var action = function (e) {
                        ref.action(function (ref) {
                            var value = $(m).data('value');
                            ref.model.selected = value;
                        });
                    };
                    m.click(action);
                    m.bind('touchstart', action);
                })($mark);
            }
        };

        Slider.prototype.percent_offset = function (r, i) {
            var intervals = r.view['data-interval'];
            var count = intervals.length > 0 ? intervals.length : 1;
            var size = 100 / (count - 1);
            return i * size + '%';
        };

        Slider.prototype.move_to_selected = function (r) {
            var d = r.view.marker;
            d.move(this.percent_offset(r, r.model.selected));
        };

        Slider.prototype.move_to_closest = function (r) {
            var _this = this;
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
            r.action(function (r) {
                r.model.selected = offset;
                _this.move_to_selected(r);
            });
        };

        Slider.prototype.next = function (r) {
            r.action(function (r) {
                if (r.model.selected < (r.model.intervals.length)) {
                    ++r.model.selected;
                }
            });
        };

        Slider.prototype.prev = function (r) {
            r.action(function (r) {
                if (r.model.selected > 0) {
                    --r.model.selected;
                }
            });
        };
        return Slider;
    })(iwc.Base);
    exports.Slider = Slider;

    var Draggable = (function () {
        function Draggable(target) {
            this.onrelease = null;
            this._root = target;
            this._active = false;
            this.resize();
            this.track_cursor();
        }
        Draggable.prototype.resize = function () {
            this._width = this._root.width();
            this._rootOffset = $(this._root).parent().offset().left;
            var offset = this._root.parent().offset();
            var width = this._root.parent().width();
            this._bounds = [offset.left, offset.left + width];
        };

        Draggable.prototype.move = function (pos, offset) {
            if (typeof offset === "undefined") { offset = null; }
            if (offset === null) {
                this._root.css('left', pos);
            } else {
                this._root.css('left', pos - offset);
            }
            this.offset = $(this._root).offset().left;
        };

        Draggable.prototype.track_cursor = function () {
            var _this = this;
            var start = function (e) {
                _this._active = true;
                e.preventDefault();
            };
            $(this._root).bind('touchstart', start);
            $(this._root).bind('mousedown', start);

            var stop = function (e) {
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

            var action = function (e) {
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

    iwc.component(new Slider().def());
});
//# sourceMappingURL=script.js.map

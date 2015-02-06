define(["require", "exports", 'jquery', 'iwc'], function (require, exports, $, iwc) {
    /** Slider type */
    var Slider = (function () {
        function Slider() {
            /** On change callback */
            this._change = [];
            /** The set of interval DOM nodes */
            this._intervals = [];
        }
        /** Raw template for this component */
        Slider.prototype.content = function () {
            return data.markup;
        };
        /** Run on start up */
        Slider.prototype.init = function () {
            var _this = this;
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
            drag.onrelease = function () {
                console.log(_this);
                _this.move();
            };
            // Set initial state
            this.move(0);
        };
        /** Move the marker to a specific interval or closest if null */
        Slider.prototype.move = function (offset) {
            if (offset === void 0) { offset = -1; }
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
        /** Bind a callback to invoke when the value changes on this object */
        Slider.prototype.change = function (callback) {
            this._change.push(callback);
        };
        /** Next item */
        Slider.prototype.next = function () {
            this.move(this.offset + 1);
        };
        /** Previous item */
        Slider.prototype.prev = function () {
            this.move(this.offset - 1);
        };
        /** Trigger on change callbacks */
        Slider.prototype._trigger = function () {
            var _this = this;
            var schedule = function (i) {
                setTimeout(function () {
                    _this._change[i].call(_this);
                }, 1);
            };
            for (var i = 0; i < this._change.length; ++i) {
                schedule(i);
            }
        };
        /** Calculate the % offset for an index */
        Slider.prototype._offset = function (i) {
            var count = this.data.interval.length > 0 ? this.data.interval.length : 1;
            var size = 100 / (count - 1);
            return i * size + '%';
        };
        return Slider;
    })();
    exports.Slider = Slider;
    /** Slider factory */
    var SliderFactory = (function () {
        function SliderFactory() {
            /** Inline styles */
            this.stylesheet = data.styles;
        }
        /** Find root nodes */
        SliderFactory.prototype.query = function (root) {
            return $(root).find('.component--iwc-interval-slider');
        };
        /** New instance */
        SliderFactory.prototype.factory = function () {
            return new Slider();
        };
        return SliderFactory;
    })();
    exports.SliderFactory = SliderFactory;
    /** Draggable items */
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
            if (offset === void 0) { offset = null; }
            if (offset === null) {
                this._root.css('left', pos);
            }
            else {
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
    // Actually register
    iwc.register(new SliderFactory());
});
//# sourceMappingURL=script.js.map
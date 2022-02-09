"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var toRadians = function (degree) {
    return (degree * Math.PI) / 180;
};
var rotatePoint = function (_a, _b, degree) {
    var pointX = _a[0], pointY = _a[1];
    var originX = _b[0], originY = _b[1];
    var angle = toRadians(degree); //clockwise
    var rotatedX = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;
    var rotatedY = Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY;
    return [rotatedX, rotatedY];
};
var getRoundedPoint = function (x1, y1, x2, y2, radius, first) {
    var total = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    var idx = first ? radius / total : (total - radius) / total;
    return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
};
var getRoundedPoints = function (pts, radius) {
    var len = pts.length;
    var res = new Array(len);
    for (var i2 = 0; i2 < len; i2++) {
        var i1 = i2 - 1;
        var i3 = i2 + 1;
        if (i1 < 0)
            i1 = len - 1;
        if (i3 == len)
            i3 = 0;
        var p1 = pts[i1];
        var p2 = pts[i2];
        var p3 = pts[i3];
        var prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
        var nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
        res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
    }
    return res;
};
var Helper = /** @class */ (function () {
    function Helper(ctx) {
        this.ctx = null;
        this.ctx = ctx;
    }
    Helper.prototype.mutateData = function (data, type, extra) {
        if (extra === void 0) { extra = null; }
        if (type === "mirror") {
            var rtn = [];
            for (var i = 0; i < data.length; i += 2) {
                rtn.push(data[i]);
            }
            rtn = __spreadArray(__spreadArray([], rtn, true), rtn.reverse(), true);
            return rtn;
        }
        if (type === "shrink") {
            //resize array by % of current array 
            if (extra < 1) {
                extra = data.length * extra;
            }
            var rtn = [];
            var splitAt = Math.floor(data.length / extra);
            for (var i = 1; i <= extra; i++) {
                var arraySection = data.slice(i * splitAt, (i * splitAt) + splitAt);
                var middle = arraySection[Math.floor(arraySection.length / 2)];
                rtn.push(middle);
            }
            return rtn;
        }
        if (type === "split") {
            var size = Math.floor(data.length / extra);
            var rtn = [];
            var temp = [];
            var track = 0;
            for (var i = 0; i <= size * extra; i++) {
                if (track === size) {
                    rtn.push(temp);
                    temp = [];
                    track = 0;
                }
                temp.push(data[i]);
                track++;
            }
            return rtn;
        }
        if (type === "scale") {
            var scalePercent_1 = extra / 255;
            if (extra <= 3 && extra >= 0)
                scalePercent_1 = extra;
            return data.map(function (value) { return value * scalePercent_1; });
        }
        if (type === "organize") {
            return {
                base: data.slice(60, 120),
                vocals: data.slice(120, 255),
                mids: data.slice(255, 2000)
            };
        }
        if (type === "reverb") {
            var rtn_1 = [];
            data.forEach(function (val, i) {
                rtn_1.push(val - (data[i + 1] || 0));
            });
            return rtn_1;
        }
        if (type === "amp") {
            var rtn_2 = [];
            data.forEach(function (val) {
                rtn_2.push(val * (extra + 1));
            });
            return rtn_2;
        }
        if (type === "min") {
            var rtn_3 = [];
            data.forEach(function (value) {
                if (value < extra)
                    value = extra;
                rtn_3.push(value);
            });
            return rtn_3;
        }
    };
    Helper.prototype.getPoints = function (shape, size, _a, pointCount, endPoints, options) {
        var originX = _a[0], originY = _a[1];
        var _b = __assign({ offset: 0, rotate: 0, customOrigin: [] }, options), offset = _b.offset, rotate = _b.rotate, customOrigin = _b.customOrigin;
        var rtn = {
            start: [],
            end: []
        };
        if (shape === "circle") {
            var degreePerPoint = 360 / pointCount;
            var radianPerPoint = toRadians(degreePerPoint);
            var radius = size / 2;
            for (var i = 1; i <= pointCount; i++) {
                var currentRadian = radianPerPoint * i;
                var currentEndPoint = endPoints[i - 1];
                var pointOffset = endPoints[i - 1] * (offset / 100);
                var x = originX + (radius - pointOffset) * Math.cos(currentRadian);
                var y = originY + (radius - pointOffset) * Math.sin(currentRadian);
                var point1 = rotatePoint([x, y], [originX, originY], rotate);
                rtn.start.push(point1);
                x = originX + ((radius - pointOffset) + currentEndPoint) * Math.cos(currentRadian);
                y = originY + ((radius - pointOffset) + currentEndPoint) * Math.sin(currentRadian);
                var point2 = rotatePoint([x, y], [originX, originY], rotate);
                rtn.end.push(point2);
            }
            return rtn;
        }
        if (shape === "line") {
            var increment = size / pointCount;
            originX = customOrigin[0] || originX;
            originY = customOrigin[1] || originY;
            for (var i = 0; i <= pointCount; i++) {
                var degree = rotate;
                var pointOffset = endPoints[i] * (offset / 100);
                var startingPoint = rotatePoint([originX + (i * increment), originY - pointOffset], [originX, originY], degree);
                rtn.start.push(startingPoint);
                var endingPoint = rotatePoint([originX + (i * increment), (originY + endPoints[i]) - pointOffset], [originX, originY], degree);
                rtn.end.push(endingPoint);
            }
            return rtn;
        }
    };
    Helper.prototype.drawCircle = function (_a, diameter, options) {
        var x = _a[0], y = _a[1];
        var _b = __assign({ lineColor: this.ctx.strokeStyle }, options), color = _b.color, lineColor = _b.lineColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke();
        this.ctx.fillStyle = color;
        if (color) {
            this.ctx.fill();
        }
    };
    // drawOval([x, y]: Array<number>, height: number, width: number, options: IVisualizerOptions): void {
    //   const {rotation, color, lineColor} = {
    //     rotation: toRadians(options.rotation || 0),
    //     lineColor: this.ctx.strokeStyle,
    //     ...options,
    //   };
    //
    //   this.ctx.beginPath();
    //   this.ctx.ellipse(x, y, width, height, rotation, 0, 2 * Math.PI);
    //   this.ctx.strokeStyle = lineColor
    //   this.ctx.stroke();
    //   this.ctx.fillStyle = color
    //   if (color) this.ctx.fill()
    // }
    Helper.prototype.drawSquare = function (_a, diameter, options) {
        var x = _a[0], y = _a[1];
        this.drawRectangle([x, y], diameter, diameter, options);
    };
    Helper.prototype.drawRectangle = function (_a, height, width, options) {
        var x = _a[0], y = _a[1];
        var _b = __assign({ lineColor: this.ctx.strokeStyle, radius: 0, rotate: 0 }, options), color = _b.color, lineColor = _b.lineColor, radius = _b.radius, rotate = _b.rotate;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        var p1 = rotatePoint([x + width, y], [x, y], rotate);
        var p2 = rotatePoint([x + width, y + height], [x, y], rotate);
        this.ctx.arcTo(p1[0], p1[1], p2[0], p2[1], radius);
        var p3 = rotatePoint([x + width, y + height], [x, y], rotate);
        var p4 = rotatePoint([x, y + height], [x, y], rotate);
        this.ctx.arcTo(p3[0], p3[1], p4[0], p4[1], radius);
        var p5 = rotatePoint([x, y + height], [x, y], rotate);
        var p6 = rotatePoint([x, y], [x, y], rotate);
        this.ctx.arcTo(p5[0], p5[1], p6[0], p6[1], radius);
        var p7 = rotatePoint([x, y], [x, y], rotate);
        var p8 = rotatePoint([x + width, y], [x, y], rotate);
        this.ctx.arcTo(p7[0], p7[1], p8[0], p8[1], radius);
        this.ctx.closePath();
        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke();
        this.ctx.fillStyle = color;
        if (color)
            this.ctx.fill();
    };
    Helper.prototype.drawLine = function (_a, _b, options) {
        var fromX = _a[0], fromY = _a[1];
        var toX = _b[0], toY = _b[1];
        var lineColor = __assign({ lineColor: this.ctx.strokeStyle }, options).lineColor;
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke();
    };
    Helper.prototype.drawPolygon = function (points, options) {
        var _a = __assign({ lineColor: this.ctx.strokeStyle, radius: 0, close: false }, options), color = _a.color, lineColor = _a.lineColor, radius = _a.radius, close = _a.close;
        if (radius > 0) {
            points = getRoundedPoints(points, radius);
        }
        var i, pt;
        var len = points.length;
        for (i = 0; i < len; i++) {
            pt = points[i];
            if (i == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(pt[0], pt[1]);
            }
            else {
                this.ctx.lineTo(pt[0], pt[1]);
            }
            if (radius > 0) {
                this.ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
            }
        }
        if (close)
            this.ctx.closePath();
        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke();
        this.ctx.fillStyle = color;
        if (color)
            this.ctx.fill();
    };
    return Helper;
}());
exports.default = Helper;

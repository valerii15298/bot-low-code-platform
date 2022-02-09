"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var colors = options.colors;
    var helper = new Helper_1.default(ctx);
    var data = functionContext.data;
    data = helper.mutateData(data, "shrink", 200).slice(0, 120);
    data = helper.mutateData(data, "mirror");
    data = helper.mutateData(data, "scale", (h / 4) + ((h / 4) * .35));
    var points = helper.getPoints("circle", h / 2, [w / 2, h / 2], data.length, data, { offset: 35, rotate: 270 });
    points.start.forEach(function (start, i) {
        helper.drawLine(start, points.end[i]);
    });
    helper.drawPolygon(points.start, { close: true });
    points.end.forEach(function (end) {
        helper.drawCircle(end, h * .01, { color: colors[0] });
    });
});

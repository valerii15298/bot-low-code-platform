"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var helper = new Helper_1.default(ctx);
    var minDimension = (h < w) ? h : w;
    data = helper.mutateData(data, "shrink", 200);
    data = helper.mutateData(data, "split", 2)[0];
    data = helper.mutateData(data, "scale", h / 2);
    var points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data, { offset: 50 });
    helper.drawPolygon(points.end, { close: true });
    helper.drawPolygon(points.start, { close: true });
    for (var i = 0; i < points.start.length; i += 1) {
        var start = points.start[i];
        i++;
        var end = points.end[i] || points.end[0];
        helper.drawLine(start, end);
        helper.drawLine(end, points.start[i + 1] || points.start[0]);
    }
});

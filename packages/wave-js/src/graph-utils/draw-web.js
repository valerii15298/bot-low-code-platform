"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w, colors = functionContext.options;
    var data = functionContext.data;
    var helper = new Helper_1.default(ctx);
    var minDimension = (h < w) ? h : w;
    data = helper.mutateData(data, "shrink", 100);
    data = helper.mutateData(data, "split", 2)[0];
    data = helper.mutateData(data, "scale", h / 4);
    var dataCopy = data;
    var points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
    helper.drawPolygon(points.end, { close: true });
    points.start.forEach(function (start, i) {
        helper.drawLine(start, points.end[i]);
    });
    data = helper.mutateData(data, "scale", .7);
    points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
    helper.drawPolygon(points.end, { close: true });
    data = helper.mutateData(data, "scale", .3);
    points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
    helper.drawPolygon(points.end, { close: true });
    helper.drawCircle([w / 2, h / 2], minDimension / 2, { color: colors[2] });
    dataCopy = helper.mutateData(dataCopy, "scale", 1.4);
    points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], dataCopy.length, dataCopy);
    points.end.forEach(function (end) {
        helper.drawCircle(end, minDimension * .01, { color: colors[1], lineColor: colors[1] || colors[0] });
    });
});

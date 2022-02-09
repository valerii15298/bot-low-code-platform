"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var colors = options.colors;
    var helper = new Helper_1.default(ctx);
    data = helper.mutateData(data, "shrink", 300);
    data = helper.mutateData(data, "scale", h / 2);
    data = helper.mutateData(data, "split", 4).slice(0, 3);
    var colorIndex = 0;
    data.forEach(function (points) {
        var wavePoints = helper.getPoints("line", w, [0, h / 2], points.length, points);
        helper.drawPolygon(wavePoints.end, { lineColor: colors[colorIndex], radius: (h * .015) });
        var invertedPoints = helper.getPoints("line", w, [0, h / 2], points.length, points, { offset: 100 });
        helper.drawPolygon(invertedPoints.start, { lineColor: colors[colorIndex], radius: (h * .015) });
        colorIndex++;
    });
});

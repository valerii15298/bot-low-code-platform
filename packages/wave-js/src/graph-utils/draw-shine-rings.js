"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var colors = options.colors;
    var helper = new Helper_1.default(ctx);
    var minDimension = (h < w) ? h : w;
    data = helper.mutateData(data, "organize");
    data.vocals = helper.mutateData(data.vocals, "scale", (minDimension / 2) / 2);
    data.base = helper.mutateData(data.base, "scale", (minDimension / 2) / 2);
    var outerBars = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals);
    var innerWave = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals, { offset: 100 });
    var thinLine = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.base.length, data.base, { offset: 100 });
    outerBars.start.forEach(function (start, i) {
        helper.drawLine(start, outerBars.end[i], { lineColor: colors[0] });
    });
    helper.drawPolygon(innerWave.start, { close: true, lineColor: colors[1], color: colors[3], radius: 5 });
    helper.drawPolygon(thinLine.start, { close: true, lineColor: colors[2], color: colors[4], radius: 5 });
});

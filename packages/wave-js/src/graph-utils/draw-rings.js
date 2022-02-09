"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var minDimension = (h < w) ? h : w;
    var helper = new Helper_1.default(ctx);
    var colors = options.colors;
    data = helper.mutateData(data, "organize");
    data = [data.mids, data.vocals];
    data[0] = helper.mutateData(data[0], "scale", minDimension / 4);
    data[1] = helper.mutateData(data[1], "scale", minDimension / 8);
    data[0] = helper.mutateData(data[0], "shrink", 1 / 5);
    data[0] = helper.mutateData(data[0], "split", 2)[0];
    data[0] = helper.mutateData(data[0], "reverb");
    data[1] = helper.mutateData(data[1], "reverb");
    var outerCircle = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data[0].length, data[0]);
    var innerCircle = helper.getPoints("circle", minDimension / 4, [w / 2, h / 2], data[1].length, data[1]);
    helper.drawPolygon(outerCircle.end, { close: true, radius: 4, lineColor: colors[0], color: colors[1] });
    helper.drawPolygon(innerCircle.end, { close: true, radius: 4, lineColor: colors[2], color: colors[3] });
    var middle = ((minDimension / 4) + (minDimension / 2)) / 2;
    var largerInner = data[1] = helper.mutateData(data[1], "scale", ((minDimension / 4) - (minDimension / 2)));
    var innerBars = helper.getPoints("circle", middle, [w / 2, h / 2], data[1].length, largerInner);
    innerBars.start.forEach(function (start, i) {
        helper.drawLine(start, innerBars.end[i], { lineColor: colors[4] || colors[2] });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var colors = options.colors;
    var helper = new Helper_1.default(ctx);
    data = helper.mutateData(data, "organize").vocals;
    data = helper.mutateData(data, "shrink", 10);
    data = helper.mutateData(data, "scale", h);
    data = helper.mutateData(data, "amp", 1);
    var points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });
    var colorIndex = 0;
    var colorStop = Math.ceil(data.length / colors.length);
    points.start.forEach(function (start, i) {
        if ((i + 1) % colorStop == 0)
            colorIndex++;
        helper.drawRectangle(start, data[i], w / data.length, { color: colors[colorIndex] });
    });
});

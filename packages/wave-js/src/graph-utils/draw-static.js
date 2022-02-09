"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var helper = new Helper_1.default(ctx);
    data = helper.mutateData(data, "shrink", 1 / 8);
    data = helper.mutateData(data, "split", 2)[0];
    data = helper.mutateData(data, "scale", h);
    var points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });
    var prevPoint = null;
    points.start.forEach(function (start, i) {
        if (prevPoint) {
            helper.drawLine(prevPoint, start);
        }
        helper.drawLine(start, points.end[i]);
        prevPoint = points.end[i];
    });
});

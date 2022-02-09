"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w, colors = functionContext.options;
    var data = functionContext.data;
    var helper = new Helper_1.default(ctx);
    data = helper.mutateData(data, "split", 4)[0];
    data = helper.mutateData(data, "scale", h);
    var points = helper.getPoints("line", w, [0, h], data.length, data, { offset: 100 });
    points.start = points.start.slice(0, points.end.length - 1);
    points.start.push([w, h]);
    points.start.push([0, h]);
    helper.drawPolygon(points.start, { lineColor: colors[0], color: colors[1], radius: (h * .008) });
});

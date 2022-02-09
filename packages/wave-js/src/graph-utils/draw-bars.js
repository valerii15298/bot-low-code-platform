"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var pointCount = 64;
    var percent = h / 255;
    var increase = w / 64;
    var breakpoint = Math.floor(pointCount / options.colors.length);
    for (var point = 1; point <= pointCount; point++) {
        var p = data[point] * percent;
        var x = increase * point;
        ctx.moveTo(x, h);
        ctx.lineTo(x, h - p);
        if (point % breakpoint === 0) {
            ctx.strokeStyle = options.colors[(point / breakpoint) - 1];
            ctx.stroke();
            ctx.beginPath();
        }
    }
});

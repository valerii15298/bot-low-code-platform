"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var percent = h / 255;
    var increase = w / 128;
    var point_count = 128;
    var min = 5;
    var breakpoint = Math.floor(point_count / options.colors.length);
    for (var point = 1; point <= point_count; point++) {
        var p = data[point]; //get value
        p += min;
        p *= percent;
        var x = increase * point;
        var mid = (h / 2) + (p / 2);
        ctx.moveTo(x, mid);
        ctx.lineTo(x, mid - p);
        if (point % breakpoint === 0) {
            var i = (point / breakpoint) - 1;
            ctx.strokeStyle = options.colors[i];
            ctx.stroke();
            ctx.beginPath();
        }
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var min = 5;
    var r = h / 4;
    var offset = r / 2;
    var cx = w / 2;
    var cy = h / 2;
    var point_count = 128;
    var percent = (r - offset) / 255;
    var increase = (360 / point_count) * Math.PI / 180;
    var breakpoint = Math.floor(point_count / options.colors.length);
    for (var point = 1; point <= point_count; point++) {
        var p = (data[point] + min) * percent;
        var a = point * increase;
        var sx = cx + (r - (p - offset)) * Math.cos(a);
        var sy = cy + (r - (p - offset)) * Math.sin(a);
        ctx.moveTo(sx, sy);
        var dx = cx + (r + p) * Math.cos(a);
        var dy = cy + (r + p) * Math.sin(a);
        ctx.lineTo(dx, dy);
        if (point % breakpoint === 0) {
            var i = (point / breakpoint) - 1;
            ctx.strokeStyle = options.colors[i];
            ctx.stroke();
            ctx.beginPath();
        }
    }
    ctx.stroke();
});

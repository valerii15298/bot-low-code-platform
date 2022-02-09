"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var r = h / 4;
    var cx = w / 2;
    var cy = h / 2;
    var point_count = 100;
    var percent = r / 255;
    var increase = (360 / point_count) * Math.PI / 180;
    var p = 0;
    var sx = cx + (r + p) * Math.cos(0);
    var sy = cy + (r + p) * Math.sin(0);
    ctx.moveTo(sx, sy);
    for (var point = 1; point <= point_count; point++) {
        var p_1 = (data[350 % point]) * percent;
        var a = point * increase;
        var dx = cx + (r + p_1) * Math.cos(a);
        var dy = cy + (r + p_1) * Math.sin(a);
        ctx.lineTo(dx, dy);
    }
    ctx.closePath();
    ctx.stroke();
    if (options.colors[1]) {
        ctx.fillStyle = options.colors[1];
        ctx.fill();
    }
});

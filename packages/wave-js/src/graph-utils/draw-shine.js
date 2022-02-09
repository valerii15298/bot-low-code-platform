"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var r = h / 4;
    var cx = w / 2;
    var cy = h / 2;
    var point_count = 56;
    var percent = r / 255;
    var increase = (360 / point_count) * Math.PI / 180;
    for (var point = 1; point <= point_count; point++) {
        var p = (data[point]) * percent;
        var a = point * increase;
        var ax = cx + (r - (p / 2)) * Math.cos(a);
        var ay = cy + (r - (p / 2)) * Math.sin(a);
        ctx.moveTo(ax, ay);
        var bx = cx + (r + p) * Math.cos(a);
        var by = cy + (r + p) * Math.sin(a);
        ctx.lineTo(bx, by);
        var dx = cx + (r + p) * Math.cos(a + increase);
        var dy = cy + (r + p) * Math.sin(a + increase);
        ctx.lineTo(dx, dy);
        var ex = cx + (r - (p / 2)) * Math.cos(a + increase);
        var ey = cy + (r - (p / 2)) * Math.sin(a + increase);
        ctx.lineTo(ex, ey);
        ctx.lineTo(ax, ay);
    }
    if (options.colors[1]) {
        ctx.fillStyle = options.colors[1];
        ctx.fill();
    }
    ctx.stroke();
});

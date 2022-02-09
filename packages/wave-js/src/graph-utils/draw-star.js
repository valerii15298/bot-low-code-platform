"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, colors = functionContext.options.colors, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var r = h / 4;
    var offset = r / 4;
    var cx = w / 2;
    var cy = h / 2;
    var point_count = 120;
    var percent = (r - offset - 35) / (255);
    var increase = (360 / point_count) * Math.PI / 180;
    var top = [];
    var bottom = [];
    for (var point = 1; point <= point_count; point++) {
        var p = ((data[200 % point])) * percent;
        var a = point * increase;
        var sx = cx + ((r) - p + offset) * Math.cos(a);
        var sy = cy + ((r) - p + offset) * Math.sin(a);
        ctx.moveTo(sx, sy);
        bottom.push({
            x: sx,
            y: sy
        });
        var dx = cx + (r + p + offset) * Math.cos(a);
        var dy = cy + (r + p + offset) * Math.sin(a);
        ctx.lineTo(dx, dy);
        top.push({
            x: dx,
            y: dy
        });
    }
    ctx.moveTo(top[0].x, top[0].y);
    for (var t in top) {
        t = top[t];
        ctx.lineTo(t.x, t.y);
    }
    ctx.closePath();
    ctx.moveTo(bottom[0].x, bottom[0].y);
    for (var b = bottom.length - 1; b >= 0; b--) {
        b = bottom[b];
        ctx.lineTo(b.x, b.y);
    }
    ctx.closePath();
    if (colors[1]) {
        ctx.fillStyle = colors[1];
        ctx.fill();
    }
    ctx.stroke();
    //inner color
    ctx.beginPath();
    ctx.moveTo(bottom[0].x, bottom[0].y);
    for (var b in bottom) {
        b = bottom[b];
        ctx.lineTo(b.x, b.y);
    }
    ctx.closePath();
    if (colors[2]) {
        ctx.fillStyle = colors[2];
        ctx.fill();
    }
    ctx.stroke();
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var cx = w / 2;
    var cy = h / 2;
    var r = (h - 10) / 2;
    var offset = r / 5;
    var percent = (r - offset) / 255;
    var point_count = 150;
    var increase = (360 / point_count) * Math.PI / 180;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI, true);
    var fa = 0;
    var fx = cx + (r - (data[0] * percent)) * Math.cos(fa);
    var fy = cy + (r - (data[0] * percent)) * Math.sin(fa);
    ctx.moveTo(fx, fy);
    var q = 0;
    for (var point = 0; point < point_count; point++) {
        q += 1;
        if (point >= point_count / 2) {
            q -= 2;
        }
        var p = data[q]; //get value
        p *= percent;
        var a = point * increase;
        var x = cx + (r - p) * Math.cos(a);
        var y = cy + (r - p) * Math.sin(a);
        ctx.lineTo(x, y);
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
    }
    ctx.lineTo(fx, fy);
    ctx.stroke();
    ctx.fillStyle = options.colors[1] || "#fff000";
    ctx.fill();
});

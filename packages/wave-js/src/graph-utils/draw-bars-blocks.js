"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var percent = h / 255;
    var width = w / 64;
    for (var point = 0; point < 64; point++) {
        var p = data[point]; //get value
        p *= percent;
        var x = width * point;
        ctx.rect(x, h, width, -(p));
    }
    ctx.fillStyle = options.colors[1] || options.colors[0];
    ctx.stroke();
    ctx.fill();
});

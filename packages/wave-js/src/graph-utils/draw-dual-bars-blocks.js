"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (functionContext) {
    var data = functionContext.data, options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var percent = h / 255;
    var width = w / 50;
    for (var point = 0; point <= 50; point++) {
        var p = data[point]; //get value
        p *= percent;
        var x = width * point;
        ctx.rect(x, (h / 2) + (p / 2), width, -(p));
    }
    if (options.colors[1]) {
        ctx.fillStyle = options.colors[1];
        ctx.fill();
    }
    ctx.stroke();
});

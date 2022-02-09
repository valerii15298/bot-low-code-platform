"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helper_1 = require("../core/Helper");
exports.default = (function (functionContext) {
    var options = functionContext.options, ctx = functionContext.ctx, h = functionContext.h, w = functionContext.w;
    var data = functionContext.data;
    var colors = options.colors;
    var helper = new Helper_1.default(ctx);
    data = helper.mutateData(data, "organize").base;
    data = helper.mutateData(data, "shrink", 20).slice(0, 19);
    data = helper.mutateData(data, "scale", h);
    var points = helper.getPoints("line", w, [0, h], data.length, data);
    var spacing = 5;
    var squareSize = (w / 20) - spacing;
    var colorIndex = 0;
    points.start.forEach(function (start, i) {
        var squareCount = Math.ceil(data[i] / squareSize);
        //find color stops from total possible squares in bar 
        var totalSquares = (h - (spacing * (h / squareSize))) / squareSize;
        var colorStop = Math.ceil(totalSquares / colors.length);
        for (var j = 1; j <= squareCount; j++) {
            var origin_1 = [start[0], (start[1] - (squareSize * j) - (spacing * j))];
            helper.drawSquare(origin_1, squareSize, { color: colors[colorIndex], lineColor: "black" });
            if (j % colorStop == 0) {
                colorIndex++;
                if (colorIndex >= colors.length)
                    colorIndex = colors.length - 1;
            }
        }
        colorIndex = 0;
    });
});

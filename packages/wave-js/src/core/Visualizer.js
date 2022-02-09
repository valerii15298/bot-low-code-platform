"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Generator_1 = require("./Generator");
var utils_1 = require("../utils");
var graphUtils = require("../graph-utils");
var default_options_1 = require("../utils/default-options");
var CanvasNotFoundError_1 = require("./errors/CanvasNotFoundError");
var typeMap = (_a = {},
    _a[Generator_1.default.BARS] = graphUtils.drawBars,
    _a[Generator_1.default.BARS_BLOCKS] = graphUtils.drawBarsBlocks,
    _a[Generator_1.default.BIG_BARS] = graphUtils.drawBigBars,
    _a[Generator_1.default.CUBES] = graphUtils.drawCubes,
    _a[Generator_1.default.DUAL_BARS] = graphUtils.drawDualBars,
    _a[Generator_1.default.DUAL_BARS_BLOCKS] = graphUtils.drawDualBarsBlocks,
    _a[Generator_1.default.FIREWOKS] = graphUtils.drawFireworks,
    _a[Generator_1.default.FLOWER] = graphUtils.drawFlower,
    _a[Generator_1.default.FLOWER_BLOCKS] = graphUtils.drawFlowerBlocks,
    _a[Generator_1.default.ORBS] = graphUtils.drawOrbs,
    _a[Generator_1.default.RING] = graphUtils.drawRing,
    _a[Generator_1.default.RINGS] = graphUtils.drawRings,
    _a[Generator_1.default.ROUND_WAVE] = graphUtils.drawRoundWave,
    _a[Generator_1.default.SHOCKWAVE] = graphUtils.drawShockWave,
    _a[Generator_1.default.SHINE] = graphUtils.drawShine,
    _a[Generator_1.default.SHINE_RINGS] = graphUtils.drawShineRings,
    _a[Generator_1.default.STAR] = graphUtils.drawStar,
    _a[Generator_1.default.STATIC] = graphUtils.drawStatic,
    _a[Generator_1.default.STITCHES] = graphUtils.drawStitches,
    _a[Generator_1.default.WAVE] = graphUtils.drawWave,
    _a[Generator_1.default.WEB] = graphUtils.drawWeb,
    _a);
var frameRateMap = {};
function visualize(data, canvasEltOrId, originalOptions, frame) {
    var options = __assign(__assign({}, default_options_1.default), (originalOptions || {}));
    var canvas = typeof canvasEltOrId === 'string' ?
        document.getElementById(canvasEltOrId.toString()) : canvasEltOrId;
    if (!canvas) {
        throw new CanvasNotFoundError_1.default(canvasEltOrId.toString());
    }
    var canvasId = canvas.id;
    var ctx = canvas.getContext('2d');
    var h = canvas.height;
    var w = canvas.width;
    ctx.strokeStyle = options.colors[0];
    ctx.lineWidth = Number(options.stroke.toString());
    var functionContext = {
        data: data,
        options: options,
        ctx: ctx,
        h: h,
        w: w,
        canvasId: canvasId,
    };
    var generators = (Array.isArray(options.type) ? options.type : [options.type]);
    (0, utils_1.setPropertyIfNotSet)(frameRateMap, generators[0].toString(), 1);
    if (frame % frameRateMap[generators[0].toString()] === 0) { //abide by the frame rate
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        generators.forEach(function (type) {
            typeMap[type.toString()](functionContext);
        });
    }
}
exports.default = visualize;

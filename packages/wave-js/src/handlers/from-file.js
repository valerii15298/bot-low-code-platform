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
Object.defineProperty(exports, "__esModule", { value: true });
var standardized_audio_context_1 = require("standardized-audio-context");
var default_options_1 = require("../utils/default-options");
var Visualizer_1 = require("../core/Visualizer");
var utils_1 = require("../utils");
var createVirtualCanvas = function (width, height) {
    var canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    return canvas;
};
function fromFile(file, options, fromFileOptions) {
    var parsedOptions = __assign(__assign({}, default_options_1.default), (options || {}));
    var _a = __assign({ width: window.innerWidth, height: window.innerHeight, format: 'png', drawRate: 20, callback: function () { return null; } }, fromFileOptions), callback = _a.callback, width = _a.width, height = _a.height, format = _a.format, drawRate = _a.drawRate;
    (0, utils_1.checkGenerator)(parsedOptions.type);
    var imageFormat = "image/".concat(format);
    var canvas = createVirtualCanvas(width, height);
    var audio = new Audio(file);
    var audioCtx = new standardized_audio_context_1.AudioContext();
    var analyser = audioCtx.createAnalyser();
    var source = audioCtx.createMediaElementSource(audio);
    analyser.fftSize = Math.pow(2, 10);
    var bufferLength = analyser.frequencyBinCount;
    var tempData = new Uint8Array(bufferLength);
    var getWave = null;
    source.connect(analyser);
    audio.addEventListener('loadedmetadata', function () { return audio.play().then(); });
    var playListener = function () {
        var frameCount = 1;
        getWave = setInterval(function () {
            analyser.getByteFrequencyData(tempData);
            (0, Visualizer_1.default)(tempData, canvas, parsedOptions, frameCount++);
            callback(canvas.toDataURL(imageFormat));
        }, drawRate);
    };
    var endedListener = function () {
        if (audio.currentTime === audio.duration && tempData !== undefined) {
            clearInterval(getWave);
        }
    };
    audio.addEventListener('play', playListener);
    audio.addEventListener('ended', endedListener);
    return {
        deactivate: function () {
            audio.removeEventListener('play', playListener);
            audio.removeEventListener('ended', endedListener);
            clearInterval(getWave);
            audioCtx.close().then();
            (0, utils_1.clearCanvas)(canvas);
            callback(canvas.toDataURL(imageFormat));
        }
    };
}
exports.default = fromFile;

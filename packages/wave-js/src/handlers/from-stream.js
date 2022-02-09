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
var renderFrame = function (currentStream, analyser, sources, stream, frameCount) {
    if (currentStream.activated) {
        analyser.getByteFrequencyData(currentStream.data);
        (0, Visualizer_1.default)(currentStream.data, currentStream.canvasId, currentStream.options, frameCount);
        sources[stream.id].animation = requestAnimationFrame(currentStream.loop);
    }
};
function fromStream(stream, canvasId, options, fromStreamOptions) {
    var _this = this;
    var parsedOptions = __assign(__assign({}, default_options_1.default), (options || {}));
    var parsedFromStreamOptions = __assign({ connectDestination: true }, (fromStreamOptions || {}));
    (0, utils_1.checkGenerator)(parsedOptions.type);
    var connectDestination = parsedFromStreamOptions.connectDestination;
    var currentStream = {
        canvasId: canvasId,
        options: parsedOptions,
        data: null,
        loop: null,
        animation: null,
        activated: true,
    };
    var sources = (0, utils_1.initGlobalObject)("stream-sources", parsedOptions.globalAccessKey);
    if (sources[stream.id]) {
        cancelAnimationFrame(sources[stream.id].animation);
    }
    var audioCtx = new standardized_audio_context_1.AudioContext();
    var analyser = audioCtx.createAnalyser();
    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    if (connectDestination) {
        source.connect(audioCtx.destination); //playback audio
    }
    sources[stream.id] = {
        audioCtx: audioCtx,
        analyser: analyser,
        source: source,
    };
    analyser.fftSize = 32768;
    var bufferLength = analyser.frequencyBinCount;
    currentStream.data = new Uint8Array(bufferLength);
    this.frameCount = 1;
    currentStream.loop = function () {
        return renderFrame(currentStream, analyser, sources, stream, ++_this.frameCount);
    };
    renderFrame(currentStream, analyser, sources, stream, 1);
    return {
        deactivate: function () {
            (0, utils_1.clearCanvas)(document.getElementById(currentStream.canvasId));
            audioCtx.close().then();
            currentStream.activated = false;
        },
    };
}
exports.default = fromStream;

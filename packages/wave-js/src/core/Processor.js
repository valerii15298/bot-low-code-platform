"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var standardized_audio_context_1 = require("standardized-audio-context");
var utils_1 = require("../utils");
var Visualizer_1 = require("./Visualizer");
var ElementNotFoundError_1 = require("./errors/ElementNotFoundError");
var CanvasNotFoundError_1 = require("./errors/CanvasNotFoundError");
var Processor = /** @class */ (function () {
    function Processor(element, canvasId, options, fromElementOptions) {
        var _this = this;
        this.element = element;
        this.canvasId = canvasId;
        this.options = options;
        this.fromElementOptions = fromElementOptions;
        this.activated = false;
        this.analyser = null;
        this.activeCanvas = {};
        this.activeElements = {};
        this.frameCount = 1;
        this.currentCount = 0;
        this.data = null;
        this.bufferLength = null;
        this.audioCtx = null;
        ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click'].forEach(function (event) {
            document.body.removeEventListener(event, _this.initialize);
        });
        this.element.removeEventListener('play', this.initialize);
    }
    Processor.prototype.isActivated = function () {
        return this.activated;
    };
    Processor.prototype.activate = function () {
        this.activated = true;
    };
    Processor.prototype.deactivate = function () {
        this.activated = false;
        (0, utils_1.clearCanvas)(document.getElementById(this.canvasId));
        if (!this.fromElementOptions.existingMediaStreamSource && this.audioCtx) {
            this.audioCtx.close().then();
        }
    };
    Processor.prototype.initializeAfterUserGesture = function () {
        var _this = this;
        ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click'].forEach(function (event) {
            document.body.addEventListener(event, _this.initialize.bind(_this), { once: true });
        });
        this.element.addEventListener('play', this.initialize.bind(this), { once: true });
    };
    Processor.prototype.initialize = function () {
        this.activate();
        this.activeCanvas[this.canvasId] = JSON.stringify(this.options);
        //track elements used so multiple elements use the same data
        var elementId = this.element.id;
        (0, utils_1.setPropertyIfNotSet)(this.activeElements, elementId, {});
        this.activeElements[elementId] = this.activeElements[elementId] || {};
        if (this.activeElements[elementId].count) {
            this.activeElements[elementId].count += 1;
        }
        else {
            this.activeElements[elementId].count = 1;
        }
        var _a = this.options, setGlobal = _a.setGlobal, getGlobal = _a.getGlobal;
        this.currentCount = this.activeElements[elementId].count;
        var source = getGlobal(elementId, 'source');
        if (!source || source.mediaElement !== this.element) {
            var audioCtx = setGlobal(elementId, 'audioCtx', new standardized_audio_context_1.AudioContext());
            this.audioCtx = audioCtx;
            source = this.fromElementOptions.existingMediaStreamSource || audioCtx.createMediaElementSource(this.element);
        }
        this.analyser = setGlobal(elementId, 'analyser', source.context.createAnalyser());
        setGlobal(elementId, 'source', source);
        //beep test for ios
        var oscillator = source.context.createOscillator();
        oscillator.frequency.value = 1;
        oscillator.connect(source.context.destination);
        oscillator.start(0);
        oscillator.stop(0);
        if (this.fromElementOptions.connectDestination) {
            this.connectSource(source, source.context.destination);
        }
        this.connectSource(source, this.analyser);
        this.analyser.fftsize = 32768;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.data = new Uint8Array(this.bufferLength);
        this.renderFrame();
    };
    Processor.prototype.renderFrame = function () {
        if (!this.isActivated()) {
            return;
        }
        var elementId = this.element.id;
        //only run one wave visual per canvas
        if (JSON.stringify(this.options) !== this.activeCanvas[this.canvasId]) {
            return;
        }
        //if the element or canvas go out of scope, stop animation
        if (!document.getElementById(elementId)) {
            throw new ElementNotFoundError_1.default(elementId);
        }
        if (!document.getElementById(this.canvasId)) {
            throw new CanvasNotFoundError_1.default(this.canvasId);
        }
        requestAnimationFrame(this.renderFrame.bind(this));
        this.frameCount++;
        //check if this element is the last to be called
        if (!(this.currentCount < this.activeElements[elementId].count)) {
            this.analyser.getByteFrequencyData(this.data);
            this.activeElements[elementId].data = this.data;
        }
        (0, Visualizer_1.default)(this.activeElements[elementId].data, this.canvasId, this.options, this.frameCount);
    };
    Processor.prototype.connectSource = function (source, destination) {
        source.connect(destination);
    };
    return Processor;
}());
exports.default = Processor;

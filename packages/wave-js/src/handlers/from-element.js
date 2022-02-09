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
var Processor_1 = require("../core/Processor");
var default_options_1 = require("../utils/default-options");
var utils_1 = require("../utils");
var ElementNotFoundError_1 = require("../core/errors/ElementNotFoundError");
var CanvasNotFoundError_1 = require("../core/errors/CanvasNotFoundError");
function fromElement(elementOrElementId, canvasOrCanvasId, options, fromElementOptions) {
    var element = typeof elementOrElementId === 'string' ?
        document.getElementById(elementOrElementId) : elementOrElementId;
    if (!element) {
        throw new ElementNotFoundError_1.default(typeof elementOrElementId === 'string' ? elementOrElementId : '');
    }
    var canvasElement = typeof canvasOrCanvasId === 'string' ?
        document.getElementById(canvasOrCanvasId) : canvasOrCanvasId;
    if (!element) {
        throw new CanvasNotFoundError_1.default(typeof canvasOrCanvasId === 'string' ? canvasOrCanvasId : '');
    }
    element.crossOrigin = 'anonymous';
    var parsedOptions = __assign(__assign({}, default_options_1.default), (options || {}));
    (0, utils_1.checkGenerator)(parsedOptions.type);
    var parsedFromElementOptions = __assign({ connectDestination: true, skipUserEventsWatcher: false, existingMediaStreamSource: null }, (fromElementOptions || {}));
    var runner = new Processor_1.default(element, canvasElement.id, parsedOptions, parsedFromElementOptions);
    if (runner.isActivated() || parsedFromElementOptions.skipUserEventsWatcher) {
        runner.initialize();
    }
    else {
        runner.initializeAfterUserGesture();
    }
    return {
        deactivate: function () {
            runner.deactivate();
        }
    };
}
exports.default = fromElement;

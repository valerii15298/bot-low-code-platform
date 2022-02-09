"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCanvas = exports.checkGenerator = exports.setPropertyIfNotSet = exports.initGlobalObject = void 0;
var has_1 = require("lodash/has");
var get_1 = require("lodash/get");
var set_1 = require("lodash/set");
var Generator_1 = require("../core/Generator");
var InvalidGeneratorError_1 = require("../core/errors/InvalidGeneratorError");
var initGlobalObject = function (elementId, accessKey) {
    var propertyPath = "".concat(accessKey, ".").concat(elementId);
    // console.log(setPropertyIfNotSet);
    (0, exports.setPropertyIfNotSet)(window, propertyPath, {});
    return (0, get_1.default)(window, propertyPath);
};
exports.initGlobalObject = initGlobalObject;
var setPropertyIfNotSet = function (object, property, value) {
    // console.log({has}, {set});
    // console.log("ll");
    if (!(0, has_1.default)(object, property)) {
        (0, set_1.default)(object, property, value);
    }
};
exports.setPropertyIfNotSet = setPropertyIfNotSet;
var checkGenerator = function (generatorType) {
    (Array.isArray(generatorType) ? generatorType : [generatorType]).forEach(function (currentGeneratorType) {
        if (!Object.keys(Generator_1.default).map(function (type) { return Generator_1.default[type]; }).includes(currentGeneratorType)) {
            throw new InvalidGeneratorError_1.default(currentGeneratorType);
        }
    });
};
exports.checkGenerator = checkGenerator;
var clearCanvas = function (canvas) {
    if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
};
exports.clearCanvas = clearCanvas;

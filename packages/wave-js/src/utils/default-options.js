"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Generator_1 = require("../core/Generator");
var defaultOptions = {
    stroke: 1,
    colors: ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
    type: Generator_1.default.BARS,
    globalAccessKey: '$wave',
    getGlobal: function (elementId, accessKey) {
        var globalAccessKey = defaultOptions.globalAccessKey;
        (0, index_1.initGlobalObject)(elementId, globalAccessKey);
        return window[globalAccessKey][elementId][accessKey];
    },
    setGlobal: function (elementId, accessKey, value) {
        var globalAccessKey = defaultOptions.globalAccessKey;
        var returnValue = defaultOptions.getGlobal(elementId, accessKey);
        if (!returnValue) {
            (0, index_1.setPropertyIfNotSet)(window[globalAccessKey][elementId], accessKey, value);
            returnValue = window[globalAccessKey][elementId][accessKey];
        }
        return returnValue;
    },
};
exports.default = defaultOptions;

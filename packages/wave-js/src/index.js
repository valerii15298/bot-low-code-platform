"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var from_element_1 = require("./handlers/from-element");
var from_file_1 = require("./handlers/from-file");
var from_stream_1 = require("./handlers/from-stream");
exports.default = {
    fromElement: from_element_1.default,
    fromFile: from_file_1.default,
    fromStream: from_stream_1.default,
};

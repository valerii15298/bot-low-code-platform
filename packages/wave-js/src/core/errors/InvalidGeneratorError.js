"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Generator_1 = require("../Generator");
var InvalidGeneratorError = /** @class */ (function (_super) {
    __extends(InvalidGeneratorError, _super);
    function InvalidGeneratorError(generatorName) {
        var _this = this;
        var validGenerators = Object.keys(Generator_1.default).map(function (g) { return "- \"".concat(Generator_1.default[g], "\""); }).join('\n');
        var errorMessage = "The required generator \"".concat(generatorName, "\" does not exist, please use one of the following:\n\n").concat(validGenerators);
        _this = _super.call(this, errorMessage) || this;
        _this.name = "InvalidGeneratorError";
        return _this;
    }
    return InvalidGeneratorError;
}(Error));
exports.default = InvalidGeneratorError;

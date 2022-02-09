"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_options_1 = require("./default-options");
describe('defaultOptions', function () {
    it('should match the expected set of options', function () {
        expect(default_options_1.default).toMatchSnapshot();
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Generator_1 = require("../core/Generator");
describe('Generator', function () {
    it('should define the appropriate generators', function () {
        expect(Object.values(Generator_1.default)).toMatchSnapshot();
    });
});

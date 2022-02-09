"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Visualizer_1 = require("./Visualizer");
var CanvasNotFoundError_1 = require("./errors/CanvasNotFoundError");
var Generator_1 = require("./Generator");
var index_1 = require("../graph-utils/index");
jest.mock('../graph-utils/index', function () { return ({
    drawBars: jest.fn(),
    drawRing: jest.fn(),
}); });
describe('Visualizer', function () {
    it('should throw a CanvasNotFoundError if the canvas with given id is not found', function () {
        jest.spyOn(document, 'getElementById').mockImplementationOnce(function () { return undefined; });
        expect(function () { return (0, Visualizer_1.default)(new Uint8Array(), 'canvas-id', {}, 1); })
            .toThrow(CanvasNotFoundError_1.default.default);
    });
    it('should throw a CanvasNotFoundError if the canvas element passed is not defined', function () {
        expect(function () { return (0, Visualizer_1.default)(new Uint8Array(), undefined, {}, 1); })
            .toThrow(CanvasNotFoundError_1.default.default);
    });
    it('should call each generator helper to draw on the canvas', function () {
        var mockContext = {
            clearRect: jest.fn(),
            beginPath: jest.fn(),
        };
        var canvas = {
            id: 'mock-canvas',
            width: 123,
            height: 456,
            getContext: function () { return mockContext; },
        };
        var expectedCallParameters = {
            data: new Uint8Array(),
            options: expect.objectContaining({
                type: [Generator_1.default.BARS, Generator_1.default.RING],
            }),
            ctx: mockContext,
            canvasId: 'mock-canvas',
            w: 123,
            h: 456,
        };
        (0, Visualizer_1.default)(new Uint8Array(), canvas, {
            type: [Generator_1.default.BARS, Generator_1.default.RING]
        }, 1);
        expect(index_1.drawBars).toHaveBeenCalledTimes(1);
        expect(index_1.drawBars).toHaveBeenCalledWith(expectedCallParameters);
        expect(index_1.drawRing).toHaveBeenCalledTimes(1);
        expect(index_1.drawRing).toHaveBeenCalledWith(expectedCallParameters);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Generator_1 = require("../core/Generator");
var utils = require("../utils");
var from_element_1 = require("../../src/handlers/from-element");
var Processor_1 = require("../core/Processor");
var ElementNotFoundError_1 = require("../core/errors/ElementNotFoundError");
var CanvasNotFoundError_1 = require("../core/errors/CanvasNotFoundError");
var audioElement = {};
var canvasElement = { id: 'canvas-id' };
jest.mock('../core/Visualizer');
jest.mock('../utils');
jest.mock('../core/Processor');
describe('from element', function () {
    beforeEach(function () {
        jest.spyOn(document, 'getElementById')
            .mockReturnValueOnce(audioElement)
            .mockReturnValueOnce(canvasElement);
    });
    it('should check the type of the generator', function () {
        jest.spyOn(utils, 'checkGenerator').mockReturnValue();
        (0, from_element_1.default)('element-id', 'canvas-id', { type: Generator_1.default.BARS });
        expect(utils.checkGenerator).toHaveBeenCalledTimes(1);
        expect(utils.checkGenerator).toHaveBeenCalledWith('bars');
    });
    it('should deactivate the handler', function () {
        jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(function () { return null; });
        jest.spyOn(Processor_1.default.prototype, 'deactivate');
        var deactivate = (0, from_element_1.default)('element-id', 'canvas-id').deactivate;
        deactivate();
        expect(Processor_1.default.prototype.deactivate).toHaveBeenCalledTimes(1);
    });
    it('should connect to the destination by default', function () {
        (0, from_element_1.default)('element-id', 'canvas-id');
        expect(Processor_1.default).toHaveBeenCalledTimes(1);
        expect(Processor_1.default).toHaveBeenCalledWith(audioElement, 'canvas-id', {
            colors: ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
            getGlobal: expect.any(Function),
            globalAccessKey: '$wave',
            setGlobal: expect.any(Function),
            stroke: 1,
            type: 'bars',
        }, {
            connectDestination: true,
            skipUserEventsWatcher: false,
            existingMediaStreamSource: null,
        });
    });
    it('should call initialize and not initializeAfterUserGesture if skipUserEventsWatcher is true', function () {
        (0, from_element_1.default)('element-id', 'canvas-id', {}, { skipUserEventsWatcher: true });
        expect(Processor_1.default.prototype.initialize).toHaveBeenCalledTimes(1);
        expect(Processor_1.default.prototype.initializeAfterUserGesture).toHaveBeenCalledTimes(0);
    });
    it('should call initialize and not initializeAfterUserGesture if activated is true', function () {
        jest.spyOn(Processor_1.default.prototype, 'isActivated').mockReturnValue(true);
        (0, from_element_1.default)('element-id', 'canvas-id', {}, {
            skipUserEventsWatcher: false,
        });
        expect(Processor_1.default.prototype.initialize).toHaveBeenCalledTimes(1);
        expect(Processor_1.default.prototype.initializeAfterUserGesture).toHaveBeenCalledTimes(0);
    });
    it('should call initializeAfterUserGesture and not initialize if skipUserEventsWatcher is false', function () {
        (0, from_element_1.default)('element-id', 'canvas-id', {}, { skipUserEventsWatcher: false });
        expect(Processor_1.default.prototype.initializeAfterUserGesture).toHaveBeenCalledTimes(1);
        expect(Processor_1.default.prototype.initialize).toHaveBeenCalledTimes(0);
    });
    it('should throw an ElementNotFoundError if the element is not found', function () {
        jest.spyOn(document, 'getElementById').mockReset().mockReturnValueOnce(undefined);
        expect(function () { return (0, from_element_1.default)('unexisting-element-id', 'canvas-id'); }).toThrow(ElementNotFoundError_1.default.default);
    });
    it('should throw an CanvasNotFoundError if the element is not found', function () {
        jest.spyOn(document, 'getElementById')
            .mockReset()
            .mockReturnValueOnce(audioElement)
            .mockReturnValueOnce(undefined);
        expect(function () { return (0, from_element_1.default)('element-id', 'unexisting-canvas-id'); }).toThrow(CanvasNotFoundError_1.default.default);
    });
});

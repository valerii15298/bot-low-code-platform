"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Processor_1 = require("./Processor");
var ElementNotFoundError_1 = require("./errors/ElementNotFoundError");
var utils = require("../utils/index");
jest.mock('./Visualizer');
var audioElement = {
    id: 'mock-audio',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};
var mockCanvas = {
    getContext: jest.fn().mockReturnValue({}),
    id: 'mock-canvas'
};
var mockElements = {
    'mock-audio': audioElement,
    'mock-canvas': mockCanvas,
};
var mockConnectOscillator = jest.fn();
var mockStartOscillator = jest.fn();
var mockStopOscillator = jest.fn();
var mockAudioCtxDestination = {};
var closeAudioContextMock = jest.fn().mockImplementation(function () { return null; });
jest.mock('standardized-audio-context', function () { return ({
    AudioContext: function () {
        var context = {
            close: jest.fn().mockReturnValue({
                then: closeAudioContextMock
            }),
            destination: mockAudioCtxDestination,
            connect: jest.fn(),
            createOscillator: function () { return ({
                connect: mockConnectOscillator,
                start: mockStartOscillator,
                stop: mockStopOscillator,
                frequency: {},
            }); },
            createAnalyser: jest.fn().mockReturnValue({
                getByteFrequencyData: jest.fn().mockReturnValue(new Uint8Array())
            }),
        };
        context['createMediaElementSource'] = jest.fn().mockReturnValue({
            connect: jest.fn(),
            context: context
        });
        return context;
    }
}); });
var createProcessor = function (options) {
    if (options === void 0) { options = { existingMediaStreamSource: null }; }
    return new Processor_1.default(audioElement, 'mock-canvas', {
        getGlobal: jest.fn(),
        setGlobal: jest.fn(function (elt, key, value) { return value; }),
    }, {
        existingMediaStreamSource: options.existingMediaStreamSource,
    });
};
describe('Processor', function () {
    var mockAudioElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    };
    it('should be deactivated by default', function () {
        var processor = new Processor_1.default(mockAudioElement, undefined, {}, {});
        expect(processor.isActivated()).toBe(false);
    });
    it('should set activated to true', function () {
        var processor = new Processor_1.default(mockAudioElement, undefined, {}, {});
        processor.activate();
        expect(processor.isActivated()).toBe(true);
    });
    it('should remove all event listeners during instantiation', function () {
        jest.spyOn(document.body, 'removeEventListener');
        var processor = new Processor_1.default(mockAudioElement, undefined, {}, {});
        expect(mockAudioElement.removeEventListener.mock.calls).toEqual([
            ['play', processor.initialize],
        ]);
        expect(document.body.removeEventListener.mock.calls).toEqual([
            ['touchstart', processor.initialize],
            ['touchmove', processor.initialize],
            ['touchend', processor.initialize],
            ['mouseup', processor.initialize],
            ['click', processor.initialize],
        ]);
    });
    it('should connect a source to the given destination', function () {
        var mockSource = { connect: jest.fn() };
        var mockDestination = {};
        var processor = new Processor_1.default(mockAudioElement, undefined, {}, {});
        processor.connectSource(mockSource, mockDestination);
        expect(mockSource.connect).toHaveBeenCalledTimes(1);
        expect(mockSource.connect).toHaveBeenCalledWith(mockDestination);
    });
    describe('initialize', function () {
        beforeEach(function () {
            jest.spyOn(document, 'getElementById').mockImplementation(function (id) { return mockElements[id]; });
        });
        it('should activate the instance', function () {
            var processor = createProcessor();
            processor.initialize();
            expect(processor.isActivated()).toBe(true);
        });
        it('should process a beep test for iOS devices', function () {
            var processor = createProcessor();
            processor.initialize();
            expect(mockConnectOscillator).toHaveBeenCalledTimes(1);
            expect(mockConnectOscillator).toHaveBeenCalledWith(mockAudioCtxDestination);
            expect(mockStartOscillator).toHaveBeenCalledTimes(1);
            expect(mockStopOscillator).toHaveBeenCalledTimes(1);
        });
        it('should trigger connectSource with the right parameters', function () {
            jest.spyOn(Processor_1.default.prototype, 'connectSource').mockReturnValue(null);
            var processor = createProcessor();
            processor.initialize();
            expect(Processor_1.default.prototype.connectSource).toHaveBeenCalledTimes(1);
        });
        it('should trigger renderFrame', function () {
            jest.spyOn(Processor_1.default.prototype, 'renderFrame').mockReturnValue(null);
            var processor = createProcessor();
            processor.initialize();
            expect(Processor_1.default.prototype.renderFrame).toHaveBeenCalledTimes(1);
        });
    });
    describe('initializeAfterUserGesture', function () {
        it('should register the expected events listeners', function () {
            jest.spyOn(document.body, 'addEventListener');
            jest.spyOn(audioElement, 'addEventListener');
            var processor = createProcessor();
            var mockBind = {};
            jest.spyOn(processor.initialize, 'bind').mockReturnValue(mockBind);
            processor.initializeAfterUserGesture();
            expect(processor.initialize.bind.mock.calls.filter(function (v) { return v.includes(processor); }).length).toEqual(6);
            expect(processor.initialize.bind).toHaveBeenCalledTimes(6);
            expect(document.body.addEventListener).toHaveBeenCalledTimes(5);
            expect(document.body.addEventListener.mock.calls).toEqual([
                ['touchstart', mockBind, { once: true }],
                ['touchmove', mockBind, { once: true }],
                ['touchend', mockBind, { once: true }],
                ['mouseup', mockBind, { once: true }],
                ['click', mockBind, { once: true }],
            ]);
            expect(document.body.addEventListener).toHaveBeenCalledTimes(5);
            expect(audioElement.addEventListener).toHaveBeenCalledTimes(1);
            expect(audioElement.addEventListener).toHaveBeenCalledWith('play', mockBind, { once: true });
        });
        describe('renderFrame', function () {
            it('should trigger an ElementNotFoundError if the canvas element is not found', function () {
                var _a;
                var processor = Object.assign(createProcessor(), { activeCanvas: (_a = {}, _a['mock-canvas'] = '{}', _a) });
                processor.activate();
                jest.spyOn(document, 'getElementById').mockImplementationOnce(function () { return undefined; });
                expect(function () { return processor.renderFrame(); }).toThrow(ElementNotFoundError_1.default.default);
            });
            it('should use existingMediaStreamSource if passed in the options', function () {
                jest.spyOn(document, 'getElementById')
                    .mockImplementationOnce(function () { return audioElement; })
                    .mockImplementationOnce(function () { return mockCanvas; });
                var analyzer = {};
                var mockAnalyzer = jest.fn().mockImplementation(function () { return analyzer; });
                var mockSourceConnect = jest.fn();
                var mockOscillatorConnect = jest.fn();
                var mockSource = {
                    connect: mockSourceConnect,
                    context: {
                        createAnalyser: mockAnalyzer,
                        createOscillator: jest.fn().mockReturnValue({
                            connect: mockOscillatorConnect,
                            start: function () { return null; },
                            stop: function () { return null; },
                            frequency: {},
                        }),
                        destination: {},
                    }
                };
                var processor = createProcessor({ existingMediaStreamSource: mockSource });
                jest.spyOn(processor, 'renderFrame').mockImplementation();
                jest.spyOn(processor, 'connectSource');
                processor.activate();
                processor.initialize();
                expect(mockOscillatorConnect).toHaveBeenCalledTimes(1);
                expect(mockSource.context.createAnalyser).toHaveBeenCalledTimes(1);
                expect(mockSource.context.createOscillator).toHaveBeenCalledTimes(1);
                expect(mockSourceConnect).toHaveBeenCalledTimes(1);
                expect(processor.connectSource).toHaveBeenCalledTimes(1);
                expect(processor.connectSource.mock.calls).toEqual([
                    [mockSource, analyzer]
                ]);
            });
        });
    });
    it('should close the audioContext when deactivating', function () {
        jest.spyOn(document, 'getElementById').mockImplementation(function (id) { return mockElements[id]; });
        jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(function () { return null; });
        var processor = createProcessor();
        processor.activate();
        processor.initialize();
        processor.deactivate();
        expect(closeAudioContextMock).toHaveBeenCalledTimes(1);
        expect(utils.clearCanvas).toHaveBeenCalledTimes(1);
    });
    it('should not close the audioContext when it comes from an existing external source', function () {
        jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(function () { return null; });
        var mockSource = {
            connect: function () { return null; },
            context: {
                close: closeAudioContextMock,
                createAnalyser: function () { return ({
                    getByteFrequencyData: function () { return []; },
                }); },
                createOscillator: function () { return ({
                    connect: function () { return null; },
                    start: function () { return null; },
                    stop: function () { return null; },
                    frequency: {},
                }); },
                destination: {},
            }
        };
        jest.spyOn(document, 'getElementById').mockImplementation(function (id) { return mockElements[id]; });
        var processor = createProcessor({ existingMediaStreamSource: mockSource });
        processor.activate();
        processor.initialize();
        processor.deactivate();
        expect(closeAudioContextMock).toHaveBeenCalledTimes(0);
    });
});

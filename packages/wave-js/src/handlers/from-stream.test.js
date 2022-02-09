"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream_mock_1 = require("stream-mock");
var Generator_1 = require("../core/Generator");
var utils = require("../utils");
var from_stream_1 = require("./from-stream");
var Visualizer_1 = require("../core/Visualizer");
var streamSourceConnectMock = jest.fn();
var audioCtxDestinationMock = jest.fn();
var analyzerMock = {
    getByteFrequencyData: jest.fn().mockReturnValue(new Uint8Array())
};
var closeMock = jest.fn().mockImplementation(function () { return null; });
jest.mock('../core/Visualizer');
jest.mock('standardized-audio-context', function () {
    var _a;
    return (_a = {},
        _a['AudioContext'] = function () { return ({
            close: jest.fn().mockReturnValue({
                then: closeMock
            }),
            connect: jest.fn(),
            createAnalyser: jest.fn().mockImplementation(function () { return analyzerMock; }),
            createMediaElementSource: jest.fn().mockReturnValue({ connect: jest.fn() }),
            createMediaStreamSource: jest.fn().mockReturnValue({ connect: streamSourceConnectMock }),
            destination: audioCtxDestinationMock,
        }); },
        _a);
});
describe('from stream', function () {
    beforeEach(function () {
        jest.spyOn(global, 'requestAnimationFrame').mockImplementationOnce(function (callback) {
            callback();
            return 123;
        }).mockImplementationOnce(function (callback) {
            callback();
            return 456;
        }).mockImplementationOnce(function (callback) {
            callback();
            return 789;
        });
        jest.spyOn(global, 'cancelAnimationFrame').mockReturnValueOnce(null);
    });
    it('should check the type of the generator', function () {
        jest.spyOn(utils, 'checkGenerator').mockReturnValueOnce();
        var stream = new stream_mock_1.ObjectReadableMock([], {});
        stream.toString = function () { return 'fake-stream1'; };
        (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS });
        expect(utils.checkGenerator).toHaveBeenCalledTimes(1);
        expect(utils.checkGenerator).toHaveBeenCalledWith('bars');
    });
    it('should cancel the current animation if fromStream has been already called for the given stream', function () {
        var stream = new stream_mock_1.ObjectReadableMock([], {});
        stream.toString = function () { return 'fake-stream2'; };
        (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS });
        (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS });
        expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
        expect(cancelAnimationFrame).toHaveBeenCalledWith(123);
    });
    it('should loop call visualize depending on requestAnimationFrame handler', function () {
        jest.useFakeTimers();
        jest.spyOn(global, 'requestAnimationFrame').mockImplementation(function () { return null; });
        var stream = new stream_mock_1.ObjectReadableMock([], {});
        stream.toString = function () { return 'fake-stream3'; };
        (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS });
        jest.runAllTimers();
        expect(requestAnimationFrame).toHaveBeenCalledTimes(4);
        expect(Visualizer_1.default).toHaveBeenCalledTimes(4);
        expect(Visualizer_1.default.mock.calls).toEqual([
            [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 1],
            [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 2],
            [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 3],
            [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 4],
        ]);
        jest.useRealTimers();
    });
    it('should connect to the destination by default', function () {
        var stream = new stream_mock_1.ObjectReadableMock([], {});
        stream.toString = function () { return 'fake-stream4'; };
        (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS });
        expect(streamSourceConnectMock).toHaveBeenCalledTimes(2);
        expect(streamSourceConnectMock.mock.calls).toEqual([
            [analyzerMock],
            [audioCtxDestinationMock],
        ]);
    });
    it('should not connect to the destination if the connectDestination option is set to false', function () {
        var stream = new stream_mock_1.ObjectReadableMock([], {});
        stream.toString = function () { return 'fake-stream5'; };
        (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS }, {
            connectDestination: false,
        });
        expect(streamSourceConnectMock).toHaveBeenCalledTimes(1);
        expect(streamSourceConnectMock.mock.calls).toEqual([
            [analyzerMock],
        ]);
    });
    it('should deactivate the handler', function () {
        jest.useFakeTimers();
        jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(function () { return null; });
        jest.spyOn(global, 'requestAnimationFrame').mockImplementationOnce(function (callback) {
            setTimeout(callback, 1);
            return 123;
        }).mockImplementationOnce(function (callback) {
            setTimeout(callback, 1);
            return 456;
        }).mockImplementationOnce(function (callback) {
            setTimeout(callback, 1);
            return 789;
        });
        var stream = new stream_mock_1.ObjectReadableMock([], {});
        stream.toString = function () { return 'fake-stream6'; };
        var deactivate = (0, from_stream_1.default)(stream, 'canvas-id', { type: Generator_1.default.BARS }).deactivate;
        jest.advanceTimersToNextTimer();
        requestAnimationFrame.mockClear();
        Visualizer_1.default.mockClear();
        deactivate();
        jest.advanceTimersToNextTimer();
        expect(requestAnimationFrame).toHaveBeenCalledTimes(0);
        expect(Visualizer_1.default).toHaveBeenCalledTimes(0);
        expect(closeMock).toHaveBeenCalledTimes(1);
        expect(utils.clearCanvas).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });
});

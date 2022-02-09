"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var from_file_1 = require("../../src/handlers/from-file");
var Generator_1 = require("../core/Generator");
var utils_1 = require("../utils");
var Visualizer_1 = require("../core/Visualizer");
var utils = require("../utils/index");
var closeMock = jest.fn().mockImplementation(function () { return null; });
jest.mock('../core/Visualizer');
jest.mock('../../src/core/Processor');
jest.mock('../utils');
jest.mock('standardized-audio-context', function () {
    var _a;
    return (_a = {},
        _a['AudioContext'] = function () { return ({
            close: jest.fn().mockReturnValue({
                then: closeMock
            }),
            connect: jest.fn(),
            createAnalyser: jest.fn().mockReturnValue({
                getByteFrequencyData: jest.fn().mockReturnValue(new Uint8Array())
            }),
            createMediaElementSource: jest.fn().mockReturnValue({ connect: jest.fn() }),
        }); },
        _a);
});
var originalGlobalAudio = global.Audio;
var audioEventListenerMock = jest.fn().mockImplementation(function () { return null; });
var audioPlayListenerMock = jest.fn();
describe('from file', function () {
    beforeEach(function () {
        global.Audio = jest.fn().mockImplementation(function () { return ({
            addEventListener: audioEventListenerMock,
            play: audioPlayListenerMock,
            currentTime: 200,
            duration: 200,
        }); });
        jest.useFakeTimers();
    });
    afterEach(function () {
        global.Audio = originalGlobalAudio;
        jest.useRealTimers();
    });
    it('should check the type of the generator', function () {
        (0, from_file_1.default)('mock-file.mp3', { type: Generator_1.default.BARS }, { callback: function () { return null; } });
        expect(utils_1.checkGenerator).toHaveBeenCalledTimes(1);
        expect(utils_1.checkGenerator).toHaveBeenCalledWith('bars');
    });
    it('should create an audio element and register the right listeners to it', function () {
        (0, from_file_1.default)('mock-file.mp3', { type: Generator_1.default.BARS }, { callback: function () { return null; } });
        expect(Audio).toHaveBeenCalledTimes(1);
        expect(Audio).toHaveBeenCalledWith('mock-file.mp3');
        expect(audioEventListenerMock).toHaveBeenCalledTimes(3);
        expect(audioEventListenerMock.mock.calls).toEqual([
            ['loadedmetadata', expect.any(Function)],
            ['play', expect.any(Function)],
            ['ended', expect.any(Function)],
        ]);
    });
    it('should deactivate the handler', function () {
        var audioElement = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
        jest.spyOn(global, 'Audio').mockImplementationOnce(function () { return audioElement; });
        jest.spyOn(global, 'clearInterval');
        jest.spyOn(document, 'createElement').mockImplementationOnce(function () { return ({
            toDataURL: jest.fn(),
        }); });
        jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(function () { return null; });
        var deactivate = (0, from_file_1.default)('mock-file.mp3', { type: Generator_1.default.BARS }, { callback: function () { return null; } }).deactivate;
        deactivate();
        expect(clearInterval).toHaveBeenCalledTimes(1);
        expect(audioElement.removeEventListener).toHaveBeenCalledTimes(2);
        expect(audioElement.removeEventListener.mock.calls).toEqual([
            ['play', expect.any(Function)],
            ['ended', expect.any(Function)],
        ]);
        expect(closeMock).toHaveBeenCalledTimes(1);
        expect(utils.clearCanvas).toHaveBeenCalledTimes(1);
    });
    it('should automatically trigger the play method of the audio object when the meta data has been loaded', function () {
        var onPlay = jest.fn().mockResolvedValue(null);
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: onPlay,
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        (0, from_file_1.default)('mock-file.mp3', { type: Generator_1.default.BARS }, { callback: function () { return null; } });
        triggers['loadedmetadata']();
        expect(onPlay).toHaveBeenCalledTimes(1);
    });
    it('should call visualize and the user callback regularly in accordance with the drawRate option', function () {
        var drawRate = 50;
        var images = [
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
            'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
        ];
        var imageIndex = 0;
        var fakeCanvas = {
            toDataURL: function () { return images[imageIndex++]; },
        };
        jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
        var callback = jest.fn();
        var onPlay = jest.fn().mockResolvedValue(null);
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: onPlay,
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        (0, from_file_1.default)('mock-file.mp3', {
            type: Generator_1.default.BARS,
            colors: ['red', 'green', 'blue'],
        }, {
            callback: callback,
            drawRate: drawRate,
            height: 100,
            width: 100,
        });
        triggers['play']();
        jest.advanceTimersByTime(drawRate * 2);
        triggers['ended']();
        expect(Visualizer_1.default).toHaveBeenCalledTimes(2);
        expect(Visualizer_1.default.mock.calls).toEqual([
            [expect.any(Uint8Array), fakeCanvas, {
                    type: 'bars',
                    stroke: 1,
                    colors: ['red', 'green', 'blue'],
                    getGlobal: expect.any(Function),
                    setGlobal: expect.any(Function),
                    globalAccessKey: '$wave',
                }, 1],
            [expect.any(Uint8Array), fakeCanvas, {
                    type: 'bars',
                    stroke: 1,
                    colors: ['red', 'green', 'blue'],
                    getGlobal: expect.any(Function),
                    setGlobal: expect.any(Function),
                    globalAccessKey: '$wave',
                }, 2],
        ]);
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.mock.calls).toEqual([
            ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='],
            ['data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='],
        ]);
    });
    it('should use window\'s dimensions by default', function () {
        var drawRate = 50;
        var widthSetter = jest.fn();
        var heightSetter = jest.fn();
        var fakeCanvas = {
            toDataURL: function () { return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='; },
            set width(val) {
                widthSetter(val);
            },
            set height(val) {
                heightSetter(val);
            }
        };
        jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 123 });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 456 });
        var callback = jest.fn();
        var onPlay = jest.fn().mockResolvedValue(null);
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: onPlay,
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        (0, from_file_1.default)('mock-file.mp3', {}, { callback: callback, drawRate: drawRate });
        triggers['play']();
        jest.advanceTimersByTime(drawRate);
        triggers['ended']();
        expect(widthSetter).toHaveBeenCalledTimes(1);
        expect(widthSetter).toHaveBeenCalledWith(123);
        expect(heightSetter).toHaveBeenCalledTimes(1);
        expect(heightSetter).toHaveBeenCalledWith(456);
    });
    it('should use specified size if any', function () {
        var drawRate = 50;
        var widthSetter = jest.fn();
        var heightSetter = jest.fn();
        var fakeCanvas = {
            toDataURL: function () { return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='; },
            set width(val) {
                widthSetter(val);
            },
            set height(val) {
                heightSetter(val);
            }
        };
        jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
        var callback = jest.fn();
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: jest.fn().mockResolvedValue(null),
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        (0, from_file_1.default)('mock-file.mp3', {}, { callback: callback, drawRate: drawRate, width: 400, height: 200 });
        triggers['play']();
        jest.advanceTimersByTime(drawRate);
        triggers['ended']();
        expect(widthSetter).toHaveBeenCalledTimes(1);
        expect(widthSetter).toHaveBeenCalledWith(400);
        expect(heightSetter).toHaveBeenCalledTimes(1);
        expect(heightSetter).toHaveBeenCalledWith(200);
    });
    it('should stop the drawing timer when the played file is ending', function () {
        var drawRate = 100;
        var fakeCanvas = {
            toDataURL: function () { return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='; },
        };
        jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
        var callback = jest.fn();
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: jest.fn().mockResolvedValue(null),
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        expect(Visualizer_1.default).toHaveBeenCalledTimes(0);
        (0, from_file_1.default)('mock-file.mp3', {}, { drawRate: drawRate, callback: callback });
        triggers['play']();
        jest.advanceTimersByTime(drawRate);
        triggers['ended']();
        jest.advanceTimersByTime(drawRate * 50);
        expect(Visualizer_1.default).toHaveBeenCalledTimes(1);
    });
    it('should use the image/png format by default', function () {
        var drawRate = 100;
        var toDataURL = jest.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
        var fakeCanvas = {
            toDataURL: toDataURL
        };
        jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
        var callback = jest.fn();
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: jest.fn().mockResolvedValue(null),
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        expect(Visualizer_1.default).toHaveBeenCalledTimes(0);
        (0, from_file_1.default)('mock-file.mp3', {}, { drawRate: drawRate, callback: callback });
        triggers['play']();
        jest.advanceTimersByTime(drawRate);
        triggers['ended']();
        expect(toDataURL).toHaveBeenCalledTimes(1);
        expect(toDataURL).toHaveBeenCalledWith('image/png');
    });
    it('should use the specified format if option is passed', function () {
        var drawRate = 100;
        var toDataURL = jest.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
        var fakeCanvas = {
            toDataURL: toDataURL
        };
        jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
        var callback = jest.fn();
        var triggers = {};
        global.Audio = jest.fn().mockImplementation(function () { return ({
            play: jest.fn().mockResolvedValue(null),
            addEventListener: function (event, callback) {
                triggers[event] = callback;
            }
        }); });
        expect(Visualizer_1.default).toHaveBeenCalledTimes(0);
        (0, from_file_1.default)('mock-file.mp3', {}, { drawRate: drawRate, callback: callback, format: 'jpeg' });
        triggers['play']();
        jest.advanceTimersByTime(drawRate);
        triggers['ended']();
        expect(toDataURL).toHaveBeenCalledTimes(1);
        expect(toDataURL).toHaveBeenCalledWith('image/jpeg');
    });
});

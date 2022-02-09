"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var InvalidGeneratorError_1 = require("../core/errors/InvalidGeneratorError");
describe('utils', function () {
    describe('setPropertyIfNotSet', function () {
        it('should set the property to a default value, if not already set', function () {
            var someObject = {};
            (0, index_1.setPropertyIfNotSet)(someObject, 'some-property', 'val');
            expect(someObject['some-property']).toEqual('val');
        });
        it('should not override the property if it\'s already set', function () {
            var someObject = {
                'some-property': 123,
            };
            (0, index_1.setPropertyIfNotSet)(someObject, 'some-property', 456);
            expect(someObject['some-property']).toEqual(123);
        });
    });
    describe('initGlobalObject', function () {
        it('should create the store if not already created', function () {
            (0, index_1.initGlobalObject)('anyId', 'accessKey');
            expect(window['accessKey']).toBeDefined();
        });
        it('should initialize an object within the window', function () {
            (0, index_1.initGlobalObject)('elementId', 'accessKey');
            expect(window['accessKey']['elementId']).toEqual({});
        });
        it('should not change the value when the object is already set', function () {
            window['anotherAccessKey'] = {
                anotherElementId: 123,
            };
            (0, index_1.initGlobalObject)('anotherElementId', 'anotherAccessKey');
            expect(window['anotherAccessKey']['anotherElementId']).toEqual(123);
        });
    });
    describe('checkGenerator', function () {
        it('should throw an error if the generator name is not expected', function () {
            expect(function () {
                (0, index_1.checkGenerator)('bad name');
            }).toThrow(InvalidGeneratorError_1.default.default);
        });
        it('should throw an error if any of the generators names passed in an array is not expected', function () {
            expect(function () {
                (0, index_1.checkGenerator)(['bars', 'bad name']);
            }).toThrow(InvalidGeneratorError_1.default.default);
        });
        it('should not throw an error if the generator name exists', function () {
            expect(function () { return (0, index_1.checkGenerator)('bars'); }).not.toThrow();
        });
        it('should not throw an error if all the generators names passed in an array exist', function () {
            expect(function () { return (0, index_1.checkGenerator)(['ring', 'flower']); }).not.toThrow();
        });
    });
    describe('clearCanvas', function () {
        it('should clear the canvas', function () {
            var mockContext = {
                clearRect: jest.fn(),
            };
            var canvas = {
                getContext: jest.fn().mockImplementation(function () { return mockContext; }),
                width: 123,
                height: 456
            };
            (0, index_1.clearCanvas)(canvas);
            expect(mockContext.clearRect).toHaveBeenCalledTimes(1);
            expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 123, 456);
        });
        it('should ignore without throwing an error if the canvas is not defined', function () {
            expect(function () { return (0, index_1.clearCanvas)(null); }).not.toThrow();
        });
    });
});

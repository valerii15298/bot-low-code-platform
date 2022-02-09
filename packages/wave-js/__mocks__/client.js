"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var dom = new jsdom_1.JSDOM('', { url: 'https://localhost' });
global['document'] = dom.window.document;
global['window'] = dom.window;
global['requestAnimationFrame'] = jest.fn().mockReturnValue(123);
global['cancelAnimationFrame'] = jest.fn();

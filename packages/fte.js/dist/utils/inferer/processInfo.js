"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processInfo = void 0;
const TSPrimitive_1 = require("./TSPrimitive");
const TSFunction_1 = require("./TSFunction");
const TSArray_1 = require("./TSArray");
const TSObject_1 = require("./TSObject");
function processInfo(info) {
    if (info.type === 'function') {
        return new TSFunction_1.TSFunction(info.name, [...info.properties.values()].map(processInfo));
    }
    if (info.type === 'array') {
        return new TSArray_1.TSArray(info.name, processInfo(info.children.values().next().value));
    }
    if (info.type === 'object') {
        return new TSObject_1.TSObject(info.name, [...info.properties.values()].map(processInfo));
    }
    if (info.type === 'primitive') {
        return new TSPrimitive_1.TSPrimitive(info.name);
    }
    throw new Error('unknown type');
}
exports.processInfo = processInfo;
//# sourceMappingURL=processInfo.js.map
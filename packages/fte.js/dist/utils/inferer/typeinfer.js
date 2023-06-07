"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const tslib_1 = require("tslib");
const parser = tslib_1.__importStar(require("@babel/parser"));
const visitAllFunctions_1 = require("./utils/visitAllFunctions");
const processInfo_1 = require("./utils/processInfo");
const processFunction_1 = require("./utils/processFunction");
function inferTypesFromFunction(funcCode) {
    const code = funcCode.trim();
    const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'module' });
    const result = (0, visitAllFunctions_1.visitAllFunctions)(sourceFile);
    const context = new Map();
    let anonymousCount = 0;
    const anonynmous = () => `anonymous${anonymousCount++}`;
    result.forEach(path => {
        (0, processFunction_1.processFunction)(context, path, anonynmous);
    });
    const res = [];
    context.forEach(value => {
        res.push((0, processInfo_1.processInfo)(value));
    });
    return context;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
//# sourceMappingURL=typeinfer.js.map
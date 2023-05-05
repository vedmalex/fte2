"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const tslib_1 = require("tslib");
const parser = tslib_1.__importStar(require("@babel/parser"));
const visitAllFunctions_1 = require("./utils/visitAllFunctions");
const processFunctions_1 = require("./utils/processFunctions");
function inferTypesFromFunction(funcCode) {
    const code = funcCode.trim();
    const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' });
    console.log(JSON.stringify(sourceFile, null, 2));
    const result = (0, visitAllFunctions_1.visitAllFunctions)(sourceFile);
    const context = new Map();
    (0, processFunctions_1.processFunctions)(result, context);
    return context;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
//# sourceMappingURL=typeinfer.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitAllFunctions = void 0;
const tslib_1 = require("tslib");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
function visitAllFunctions(ast) {
    const context = [];
    const extractFunction = {
        FunctionDeclaration(path) {
            context.push(path);
        },
        FunctionExpression(path) {
            context.push(path);
        },
        ArrowFunctionExpression(path) {
            context.push(path);
        },
        ObjectMethod(path) {
            context.push(path);
        },
        ClassMethod(path) {
            context.push(path);
        },
        ClassPrivateMethod(path) {
            context.push(path);
        },
    };
    (0, traverse_1.default)(ast, extractFunction);
    return context;
}
exports.visitAllFunctions = visitAllFunctions;
//# sourceMappingURL=visitAllFunctions.js.map
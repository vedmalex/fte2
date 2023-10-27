"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitAllFunctions = void 0;
const tslib_1 = require("tslib");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
function VisitAllFunctions(context, ast) {
    const extractFunction = {
        FunctionDeclaration(path) {
            context.set(path.node, path.scope);
        },
        FunctionExpression(path) {
            context.set(path.node, path.scope);
        },
        ArrowFunctionExpression(path) {
            context.set(path.node, path.scope);
        },
        ObjectMethod(path) {
            context.set(path.node, path.scope);
        },
        ClassMethod(path) {
            context.set(path.node, path.scope);
        },
        ClassPrivateMethod(path) {
            context.set(path.node, path.scope);
        },
    };
    (0, traverse_1.default)(ast, extractFunction);
    return context;
}
exports.VisitAllFunctions = VisitAllFunctions;
//# sourceMappingURL=VisitAllFunctions.js.map
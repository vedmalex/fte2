"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpression = void 0;
function isExpression(node) {
    return typeof node === 'object' && node !== null && node.type === 'expression';
}
exports.isExpression = isExpression;
//# sourceMappingURL=isExpression.js.map
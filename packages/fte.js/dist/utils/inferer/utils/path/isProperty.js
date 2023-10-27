"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProperty = void 0;
function isProperty(node) {
    return typeof node === 'object' && node !== null && node.type === 'property';
}
exports.isProperty = isProperty;
//# sourceMappingURL=isProperty.js.map
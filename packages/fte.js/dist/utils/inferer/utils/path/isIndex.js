"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIndex = void 0;
function isIndex(node) {
    return typeof node === 'object' && node !== null && node.type === 'index';
}
exports.isIndex = isIndex;
//# sourceMappingURL=isIndex.js.map
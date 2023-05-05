"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCall = void 0;
function isCall(node) {
    return typeof node === 'object' && node !== null && node.type === 'call';
}
exports.isCall = isCall;
//# sourceMappingURL=isCall.js.map
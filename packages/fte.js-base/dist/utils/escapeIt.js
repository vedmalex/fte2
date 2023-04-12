"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeIt = void 0;
var escapeExp = /[&<>"]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g;
function escapeIt(text) {
    if (text == null) {
        return '';
    }
    var result = text.toString();
    if (!escapeExp.test(result)) {
        return result;
    }
    return result
        .replace(escapeAmpExp, '&amp;')
        .replace(escapeLtExp, '&lt;')
        .replace(escapeGtExp, '&gt;')
        .replace(escapeQuotExp, '&quot;');
}
exports.escapeIt = escapeIt;
//# sourceMappingURL=escapeIt.js.map
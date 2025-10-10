"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintText = lintText;
const { lint } = require('fte.js-formatter');
function lintText(input) {
    return lint(String(input ?? ''));
}
//# sourceMappingURL=lint.js.map
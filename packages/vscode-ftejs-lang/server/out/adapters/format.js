"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatText = formatText;
const fte_js_formatter_1 = require("fte.js-formatter");
function formatText(input, opts) {
    const options = {
        indent: typeof opts?.indentSize === 'number'
            ? opts?.indentSize
            : opts?.indent === 'tab'
                ? 'tab'
                : 2,
        ensureFinalNewline: true,
        trimTrailingWhitespace: true,
    };
    return (0, fte_js_formatter_1.format)(String(input ?? ''), options);
}
//# sourceMappingURL=format.js.map
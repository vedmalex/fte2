"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fte = void 0;
const compileFull_1 = require("./compileFull");
const safeEval_1 = require("./safeEval");
const compile_1 = require("./compile");
function fte(strings, ...values) {
    var _a;
    let source = '';
    for (let i = 0; i < strings.length; i += 1) {
        source += strings[i];
        if (i < values.length) {
            source += String((_a = values[i]) !== null && _a !== void 0 ? _a : '');
        }
    }
    const compiled = (0, compileFull_1.compileFull)(source, false);
    const code = typeof compiled === 'string' ? compiled : compiled.code;
    const templateConfig = (0, safeEval_1.safeEval)(code);
    return function render(context, options) {
        const noop = () => '';
        return templateConfig.script(context !== null && context !== void 0 ? context : {}, noop, noop, noop, { ...compile_1.F.options, ...(options !== null && options !== void 0 ? options : {}) });
    };
}
exports.fte = fte;
exports.default = fte;
//# sourceMappingURL=tag.js.map
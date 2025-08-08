"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFull = void 0;
const fte_js_parser_1 = require("fte.js-parser");
const prepareCode_1 = require("./prepareCode");
const run_1 = require("./run");
const compile_1 = require("./compile");
function compileFull(content, optimize, fileName, sourceRoot, inlineMap = true, sourcemap = true) {
    compile_1.F.options = {
        ...compile_1.F.options,
        sourceMap: sourcemap,
        inline: inlineMap,
        sourceFile: fileName,
        sourceRoot,
    };
    const compiled = fte_js_parser_1.Parser.parse(content.toString(), {
        sourceMap: sourcemap,
        sourceFile: fileName,
        sourceContent: typeof content === 'string' ? content : content.toString(),
        sourceRoot,
    });
    const result = (0, run_1.run)(compiled, 'compiled.njs');
    if (typeof result === 'string') {
        return optimize ? (0, prepareCode_1.prepareCode)(result) : result;
    }
    return result;
}
exports.compileFull = compileFull;
//# sourceMappingURL=compileFull.js.map
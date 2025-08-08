"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTs = void 0;
const fte_js_parser_1 = require("fte.js-parser");
const run_1 = require("./run");
function compileTs(content, fileName, sourceRoot, inlineMap = true, sourcemap = true) {
    const compiled = fte_js_parser_1.Parser.parse(content.toString(), {
        sourceMap: sourcemap,
        sourceFile: fileName,
        sourceContent: typeof content === 'string' ? content : content.toString(),
        sourceRoot,
    });
    return (0, run_1.run)(compiled, 'es6module.ts.njs');
}
exports.compileTs = compileTs;
//# sourceMappingURL=compileTs.js.map
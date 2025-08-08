"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileLight = void 0;
const fte_js_parser_1 = require("fte.js-parser");
const run_1 = require("./run");
function compileLight(content, fileName, sourceRoot, inlineMap = true, sourcemap = true) {
    const compiled = fte_js_parser_1.Parser.parse(content.toString(), {
        sourceMap: sourcemap,
        sourceFile: fileName,
        sourceContent: typeof content === 'string' ? content : content.toString(),
        sourceRoot,
    });
    return (0, run_1.run)(compiled, 'raw.njs');
}
exports.compileLight = compileLight;
//# sourceMappingURL=compileLight.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileLight = void 0;
const fte_js_parser_1 = require("fte.js-parser");
const run_1 = require("./run");
function compileLight(content) {
    const compiled = fte_js_parser_1.Parser.parse(content.toString());
    return (0, run_1.run)(compiled, 'raw.njs');
}
exports.compileLight = compileLight;
//# sourceMappingURL=compileLight.js.map
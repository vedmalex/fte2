"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFull = void 0;
const fte_js_parser_1 = require("fte.js-parser");
const run_1 = require("./run");
function compileFull(content) {
    const compiled = fte_js_parser_1.Parser.parse(content.toString());
    return (0, run_1.run)(compiled, 'compiled.njs');
}
exports.compileFull = compileFull;
//# sourceMappingURL=compileFull.js.map
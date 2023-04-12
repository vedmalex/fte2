"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFull = void 0;
const fte_js_parser_1 = require("fte.js-parser");
const prepareCode_1 = require("./prepareCode");
const run_1 = require("./run");
function compileFull(content, optimize) {
    const compiled = fte_js_parser_1.Parser.parse(content.toString());
    const text = (0, run_1.run)(compiled, 'compiled.njs');
    return optimize ? (0, prepareCode_1.prepareCode)(text) : text;
}
exports.compileFull = compileFull;
//# sourceMappingURL=compileFull.js.map
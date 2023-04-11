"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFull = void 0;
const parse_1 = require("../parser/parse");
const run_1 = require("./run");
function compileFull(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return (0, run_1.run)(compiled, 'compiled.njs');
}
exports.compileFull = compileFull;
//# sourceMappingURL=compileFull.js.map
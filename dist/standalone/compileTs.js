"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTs = void 0;
const parse_1 = require("../parser/parse");
const run_1 = require("./run");
function compileTs(content) {
    const compiled = parse_1.Parser.parse(content.toString());
    return (0, run_1.run)(compiled, 'es6module.ts.njs');
}
exports.compileTs = compileTs;
//# sourceMappingURL=compileTs.js.map
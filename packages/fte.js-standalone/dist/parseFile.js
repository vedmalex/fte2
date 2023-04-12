"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const fte_js_parser_1 = require("fte.js-parser");
function parseFile(content) {
    return fte_js_parser_1.Parser.parse(content.toString());
}
exports.parseFile = parseFile;
//# sourceMappingURL=parseFile.js.map
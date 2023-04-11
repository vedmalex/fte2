"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const parse_1 = require("../parser/parse");
function parseFile(content) {
    return parse_1.Parser.parse(content.toString());
}
exports.parseFile = parseFile;
//# sourceMappingURL=parseFile.js.map
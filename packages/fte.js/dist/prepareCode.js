"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCode = void 0;
const tslib_1 = require("tslib");
const swc = tslib_1.__importStar(require("@swc/core"));
function prepareCode(text) {
    return swc.printSync(swc.parseSync(text, { syntax: 'typescript' })).code;
}
exports.prepareCode = prepareCode;
//# sourceMappingURL=prepareCode.js.map
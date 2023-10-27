"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPart = void 0;
const isCall_1 = require("./isCall");
const isExpression_1 = require("./isExpression");
const isIndex_1 = require("./isIndex");
const isProperty_1 = require("./isProperty");
function isPart(p) {
    return (0, isIndex_1.isIndex)(p) || (0, isCall_1.isCall)(p) || (0, isProperty_1.isProperty)(p) || (0, isExpression_1.isExpression)(p);
}
exports.isPart = isPart;
//# sourceMappingURL=Part.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitMemberExpression = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
const extractName_1 = require("./extractName");
function splitMemberExpression(node) {
    if (t.isMemberExpression(node)) {
        const propertyName = (0, extractName_1.extractName)(node.property);
        if (t.isIdentifier(node.object)) {
            return [(0, extractName_1.extractName)(node.object), propertyName];
        }
        else if (t.isMemberExpression(node.object)) {
            return splitMemberExpression(node.object).concat(propertyName);
        }
        else {
            return [];
        }
    }
    else
        return [];
}
exports.splitMemberExpression = splitMemberExpression;
//# sourceMappingURL=splitMemberExpression.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractName = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
function extractName(n, anonymous) {
    if (t.isIdentifier(n)) {
        return n.name;
    }
    else if (t.isPrivateName(n)) {
        return n.id.name;
    }
    else if (t.isObjectProperty(n)) {
        return extractName(n.key, anonymous);
    }
    else if (t.isStringLiteral(n)) {
        return n.value;
    }
    else if (t.isAssignmentExpression(n)) {
        return extractName(n.left, anonymous);
    }
    else if (t.isRestElement(n)) {
        return extractName(n.argument, anonymous);
    }
    else if (t.isAssignmentPattern(n)) {
        return extractName(n.left, anonymous);
    }
    else if (t.isTSParameterProperty(n)) {
        return extractName(n.parameter, anonymous);
    }
    else if (t.isTSAsExpression(n)) {
        return extractName(n.expression, anonymous);
    }
    else if (t.isTSTypeAssertion(n)) {
        return extractName(n.expression, anonymous);
    }
    else if (t.isTSNonNullExpression(n)) {
        return extractName(n.expression, anonymous);
    }
    else {
        return anonymous();
    }
}
exports.extractName = extractName;
//# sourceMappingURL=extractName.js.map
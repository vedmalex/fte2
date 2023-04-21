"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractName = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
function extractName(n) {
    if (t.isIdentifier(n)) {
        return [n.name];
    }
    else if (t.isPrivateName(n)) {
        return [n.id.name];
    }
    else if (t.isObjectProperty(n)) {
        return extractName(n.key);
    }
    else if (t.isStringLiteral(n)) {
        return [n.value];
    }
    else if (t.isAssignmentExpression(n)) {
        return extractName(n.left);
    }
    else if (t.isMemberExpression(n)) {
        const property = extractName(n.property);
        if (t.isIdentifier(n.object)) {
            return [...extractName(n.object), ...property];
        }
        else
            return property;
    }
    else if (t.isRestElement(n)) {
        return extractName(n.argument);
    }
    else if (t.isAssignmentPattern(n)) {
        return extractName(n.left);
    }
    else if (t.isArrayPattern(n)) {
        return n.elements.flatMap(element => extractName(element));
    }
    else if (t.isObjectPattern(n)) {
        return n.properties.flatMap(property => extractName(property));
    }
    else if (t.isTSParameterProperty(n)) {
        return extractName(n.parameter);
    }
    else if (t.isTSAsExpression(n)) {
        return extractName(n.expression);
    }
    else if (t.isTSTypeAssertion(n)) {
        return extractName(n.expression);
    }
    else if (t.isTSNonNullExpression(n)) {
        return extractName(n.expression);
    }
    else {
        n;
        return ['anonymous'];
    }
}
exports.extractName = extractName;
//# sourceMappingURL=extractName.js.map
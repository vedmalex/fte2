"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNameList = exports.extractName = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
function extractName(n, anonymous) {
    var _a;
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
        return (_a = anonymous === null || anonymous === void 0 ? void 0 : anonymous()) !== null && _a !== void 0 ? _a : 'anonymous';
    }
}
exports.extractName = extractName;
function extractNameList(n, anonymous) {
    if (t.isMemberExpression(n)) {
        const property = extractName(n.property, anonymous);
        if (t.isIdentifier(n.object)) {
            return [...extractName(n.object, anonymous), ...property];
        }
        else
            return [property];
    }
    else if (t.isArrayPattern(n)) {
        return n.elements.flatMap(element => extractName(element, anonymous));
    }
    else if (t.isObjectPattern(n)) {
        return n.properties.flatMap(property => extractName(property, anonymous));
    }
    else
        return [extractName(n, anonymous)];
}
exports.extractNameList = extractNameList;
//# sourceMappingURL=extractName.js.map
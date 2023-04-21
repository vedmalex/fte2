"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
const parser = tslib_1.__importStar(require("@babel/parser"));
const extractName_1 = require("./utils/extractName");
const createFunction_1 = require("./utils/createFunction");
const visitAllFunctions_1 = require("./utils/visitAllFunctions");
function inferTypesFromFunction(funcCode) {
    const code = funcCode.trim();
    const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' });
    console.log(JSON.stringify(sourceFile, null, 2));
    const result = new Map();
    (0, visitAllFunctions_1.visitAllFunctions)(result, sourceFile);
    const context = new Map();
    let anonymousCount = 0;
    const anonynmous = () => `anonymous${anonymousCount++}`;
    result.forEach((scope, node) => {
        let name = '';
        if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) {
            if (t.isVariableDeclarator(scope.parentBlock)) {
                name = (0, extractName_1.extractName)(scope.parentBlock.id, anonynmous);
            }
            else
                name = anonynmous();
        }
        else if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
            name = (0, extractName_1.extractName)(node.id, anonynmous);
        }
        else if (t.isObjectMethod(node) || t.isClassMethod(node) || t.isClassPrivateMethod(node)) {
            name = (0, extractName_1.extractName)(node.key, anonynmous);
        }
        (0, createFunction_1.createFunction)(context, name, node, scope, anonynmous);
    });
    return context;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
//# sourceMappingURL=typeinfer.js.map
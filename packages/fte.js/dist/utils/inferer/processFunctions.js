"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFunctions = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
const extractName_1 = require("./utils/extractName");
const processFunction_1 = require("./utils/processFunction");
function processFunctions(result, context) {
    let anonymousCount = 0;
    const anonynmous = () => `anonymous${anonymousCount++}`;
    result.forEach(path => {
        let name = '';
        const { node, scope } = path;
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
        (0, processFunction_1.processFucntion)(context, name, node, scope, anonynmous);
    });
}
exports.processFunctions = processFunctions;
//# sourceMappingURL=processFunctions.js.map
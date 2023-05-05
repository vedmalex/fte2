"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processExpression = void 0;
const tslib_1 = require("tslib");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const t = tslib_1.__importStar(require("@babel/types"));
function processExpression(path, pathArray) {
    if (t.isOptionalCallExpression(path.node) || t.isCallExpression(path.node)) {
        console.log(path.node.type);
        const callee = [];
        (0, traverse_1.default)(path.node.callee, {
            enter(path) {
                console.log(`CALLEE ${path.node.type}`);
                processExpression(path, callee);
            },
        }, path.scope);
        pathArray.push(...callee);
        console.log(`CALL ${JSON.stringify(callee)}`);
        if (callee.length > 0 || callee[callee.length - 1] === 'forEach') {
        }
        path.skip();
    }
    else if (t.isIdentifier(path.node)) {
        if (t.isMemberExpression(path.parent) || t.isOptionalMemberExpression(path.parent)) {
            pathArray.push({
                name: path.node.name,
                type: 'property',
                optional: t.isOptionalMemberExpression(path.parent),
            });
        }
        else {
            pathArray.push({
                name: path.node.name,
                type: 'property',
                optional: false,
            });
        }
    }
    else if (t.isNumericLiteral(path.node) &&
        (t.isMemberExpression(path.parent) || t.isOptionalMemberExpression(path.parent))) {
        pathArray.push({
            name: path.node.value,
            type: 'index',
            optional: t.isOptionalMemberExpression(path.parent),
        });
    }
    else if (t.isStringLiteral(path.node) &&
        (t.isMemberExpression(path.parent) || t.isOptionalMemberExpression(path.parent))) {
        pathArray.push({
            name: path.node.value,
            type: 'index',
            optional: t.isOptionalMemberExpression(path.parent),
        });
    }
}
exports.processExpression = processExpression;
//# sourceMappingURL=processExpression.js.map
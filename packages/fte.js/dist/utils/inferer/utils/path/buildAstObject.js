"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAstObject = void 0;
function buildAstObject(ast) {
    let node = {
        type: (ast === null || ast === void 0 ? void 0 : ast.type) || 'NullLiteral',
    };
    switch (ast.type) {
        case 'Identifier':
            node.value = ast.name;
            break;
        case 'NumericLiteral':
        case 'BooleanLiteral':
        case 'BigIntLiteral':
        case 'StringLiteral':
            node.value = ast.value;
            break;
        case 'NullLiteral':
            node.value = 'null';
            break;
        case 'RegexLiteral':
        case 'RegExpLiteral':
            node.value = `/${ast.pattern}/${ast.flags}`;
            break;
        case 'TemplateLiteral':
            node.value = '`' + ast.quasis.map(q => q.value.raw).join('${}') + '`';
            break;
        case 'ThisExpression':
            node.value = 'this';
            break;
        default:
    }
    let keys = [];
    switch (node.type) {
        case 'Identifier':
        case 'NumericLiteral':
        case 'StringLiteral':
        case 'BooleanLiteral':
        case 'BigIntLiteral':
        case 'NullLiteral':
        case 'RegExpLiteral':
        case 'RegexLiteral':
            break;
        case 'TemplateLiteral':
            keys = ['quasis', 'expressions'];
            break;
        case 'TemplateElement':
            keys = ['value', 'tail'];
            break;
        case 'File':
            keys = ['program'];
            break;
        case 'Program':
            keys = ['body'];
            break;
        case 'ExpressionStatement':
            keys = ['expression'];
            break;
        case 'OptionalCallExpression':
            keys = ['callee', 'optional', 'arguments'];
            break;
        case 'OptionalMemberExpression':
            keys = ['object', 'optional', 'property'];
            break;
        case 'MemberExpression':
            keys = ['object', 'property'];
            break;
        case 'ConditionalExpression':
            keys = ['test', 'consequent', 'alternate'];
            break;
        case 'CallExpression':
            keys = ['callee', 'arguments'];
            break;
        case 'BinaryExpression':
            keys = ['left', 'operator', 'right'];
            break;
        case 'LogicalExpression':
            keys = ['left', 'operator', 'right'];
            break;
        case 'AssignmentExpression':
            keys = ['left', 'operator', 'right'];
            break;
        case 'TaggedTemplateExpression':
            keys = ['tag', 'quasi'];
            break;
        case 'ObjectExpression':
            keys = ['properties'];
            break;
        case 'ObjectProperty':
            keys = ['key', 'value'];
            break;
        case 'NewExpression':
            keys = ['callee', 'arguments'];
            break;
        case 'ArrayExpression':
            keys = ['elements'];
            break;
        case 'UnaryExpression':
            keys = ['operator', 'argument'];
            break;
        case 'UpdateExpression':
            keys = ['prefix', 'operator', 'argument'];
            break;
        case 'ArrowFunctionExpression':
            keys = ['params', 'body'];
            break;
        case 'FunctionExpression':
            keys = ['id', 'params', 'body'];
            break;
        case 'SequenceExpression':
            keys = ['expressions'];
            break;
        case 'BlockStatement':
            keys = ['body'];
            break;
        case 'ReturnStatement':
            keys = ['argument'];
            break;
        case 'IfStatement':
            keys = ['test', 'consequent', 'alternate'];
            break;
        case 'SwitchStatement':
            keys = ['discriminant', 'cases'];
            break;
        case 'SwitchCase':
            keys = ['test', 'consequent'];
            break;
        case 'BreakStatement':
            keys = ['label'];
            break;
        case 'ContinueStatement':
            keys = ['label'];
            break;
        case 'LabeledStatement':
            keys = ['label', 'body'];
            break;
        case 'ThrowStatement':
            keys = ['argument'];
            break;
        case 'ForStatement':
            keys = ['init', 'test', 'update', 'body'];
            break;
        case 'ForInStatement':
            keys = ['left', 'right', 'body'];
            break;
        case 'ForOfStatement':
            keys = ['left', 'right', 'body'];
            break;
        case 'WhileStatement':
            keys = ['test', 'body'];
            break;
        case 'DoWhileStatement':
            keys = ['body', 'test'];
            break;
        case 'WithStatement':
            keys = ['object', 'body'];
            break;
        case 'TryStatement':
            keys = ['block', 'handler', 'finalizer'];
            break;
        case 'CatchClause':
            keys = ['param', 'body'];
            break;
        case 'ArrayPattern':
            keys = ['elements'];
            break;
        case 'ObjectPattern':
            keys = ['properties'];
            break;
        case 'AssignmentPattern':
            keys = ['left', 'right'];
            break;
        case 'RestElement':
            keys = ['argument'];
            break;
        case 'SpreadElement':
            keys = ['argument'];
            break;
        case 'VariableDeclaration':
            keys = ['declarations'];
            break;
        case 'VariableDeclarator':
            keys = ['id', 'init'];
            break;
    }
    for (let key of keys) {
        if (ast[key]) {
            let value = ast[key];
            if (Array.isArray(value)) {
                if (!node[key]) {
                    node[key] = [];
                }
                for (let i = 0; i < value.length; i++) {
                    if (typeof value[i] === 'object') {
                        node[key].push(buildAstObject(value[i]));
                    }
                    else {
                        node[key] = value[i];
                    }
                }
            }
            else if (value !== null) {
                if (typeof value === 'object') {
                    node[key] = buildAstObject(value);
                }
                else {
                    node[key] = value;
                }
            }
        }
    }
    return node;
}
exports.buildAstObject = buildAstObject;
//# sourceMappingURL=buildAstObject.js.map
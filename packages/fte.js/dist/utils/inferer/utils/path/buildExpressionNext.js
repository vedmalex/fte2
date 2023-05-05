"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExpression = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
function buildExpression(ast) {
    let dot = ['digraph AST {\n'];
    let id = 0;
    function traverse(node, parentId) {
        let nodeId = id++;
        let color;
        if (node === null)
            node = t.nullLiteral();
        switch (node.type) {
            case 'Identifier':
                color = 'red';
                dot.push(`  ${nodeId} [label="ID:${node.name}", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'NumericLiteral':
                color = 'green';
                dot.push(`  ${nodeId} [label="NUM:${node.value}", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'BooleanLiteral':
                color = 'green';
                dot.push(`  ${nodeId} [label="BOOL:${node.value}", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'BigIntLiteral':
                color = 'green';
                dot.push(`  ${nodeId} [label="BIG:${node.value}", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'StringLiteral':
                color = 'green';
                dot.push(`  ${nodeId} [label="STR:${node.value}", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'NullLiteral':
                color = 'gray';
                dot.push(`  ${nodeId} [label="NULL", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'RegexLiteral':
            case 'RegExpLiteral':
                color = 'green';
                dot.push(`  ${nodeId} [label="REGEXP:/${node.pattern}/${node.flags}", style="filled", fillcolor="${color}"];\n`);
                break;
            case 'TemplateLiteral':
                color = 'green';
                dot.push(`  ${nodeId} [label="${node.type}"];\n`);
                break;
            case 'ThisExpression':
                color = 'green';
                dot.push(`  ${nodeId} [label="THIS", style="filled", fillcolor="${color}"];\n`);
                break;
            default:
                dot.push(`  ${nodeId} [label="${node.type}"];\n`);
        }
        if (parentId !== null) {
            dot.push(`  ${parentId} -> ${nodeId};\n`);
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
        let currentNode = nodeId;
        for (let key of keys) {
            let value = node[key];
            if (Array.isArray(value)) {
                let newNodeId = id++;
                dot.push(`  ${currentNode} -> ${newNodeId};\n`);
                dot.push(`  ${newNodeId} [label="${key}"];\n\n`);
                for (let i = 0; i < value.length; i++) {
                    if (typeof value[i] === 'object') {
                        traverse(value[i], newNodeId);
                    }
                    else {
                        let newNodeId = id++;
                        dot.push(`  ${currentNode} -> ${newNodeId};\n`);
                        dot.push(`  ${newNodeId} [label="${key}${value[i]}"];\n\n`);
                    }
                }
            }
            else if (value !== null) {
                if (typeof value === 'object') {
                    let newNodeId = id++;
                    dot.push(`  ${currentNode} -> ${newNodeId};\n`);
                    dot.push(`  ${newNodeId} [label="${key}"];\n\n`);
                    traverse(value, newNodeId);
                }
                else {
                    let newNodeId = id++;
                    dot.push(`  ${currentNode} -> ${newNodeId};\n`);
                    dot.push(`  ${newNodeId} [label="${key}: ${value}"];\n\n`);
                }
            }
        }
    }
    traverse(ast, null);
    dot.push('}');
    return dot;
}
exports.buildExpression = buildExpression;
//# sourceMappingURL=buildExpressionNext.js.map
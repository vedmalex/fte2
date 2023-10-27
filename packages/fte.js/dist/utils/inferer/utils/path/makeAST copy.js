"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAST = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
function cExpression(ast, nodeId) {
    const node = {
        nodeId,
        type: fixType(ast.type),
        children: [],
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
            node.value = '`' + ast.quasis.map(q => q.value.raw).join('') + '`';
            break;
        case 'ThisExpression':
            node.value = 'this';
    }
    return node;
}
function fixType(type) {
    let result = type;
    switch (result) {
        case 'CallExpression':
            result = 'call';
            break;
        case 'OptionalCallExpression':
            result = 'call';
            break;
        case 'NewExpression':
            result = 'new';
            break;
        case 'OptionalNewExpression':
            result = 'new';
            break;
        case 'MemberExpression':
            result = 'member';
            break;
        case 'OptionalMemberExpression':
            result = 'member';
            break;
        case 'SpreadElement':
        case 'RestElement':
            result = 'rest';
            break;
    }
    return result;
}
function getParamsFromNode(ast) {
    let term = false;
    let hoist = false;
    let type = (ast === null || ast === void 0 ? void 0 : ast.type) || 'NullLiteral';
    let keys = [];
    switch (ast === null || ast === void 0 ? void 0 : ast.type) {
        case 'Identifier':
        case 'NumericLiteral':
        case 'BooleanLiteral':
        case 'BigIntLiteral':
        case 'StringLiteral':
        case 'NullLiteral':
        case 'RegexLiteral':
        case 'ThisExpression':
            term = true;
            break;
        case 'RegExpLiteral':
            term = true;
            break;
        case 'TemplateLiteral':
            keys = ['quasis', 'expressions'];
            term = true;
            break;
        case 'TemplateElement':
            keys = ['value', 'tail'];
            term = true;
            break;
        case 'File':
            keys = [{ property: 'program', term: false }];
            break;
        case 'Program':
            keys = [{ property: 'body', term: false, separate: true }];
            break;
        case 'ExpressionStatement':
            keys = ['expression'];
            hoist = true;
            break;
        case 'CallExpression':
            keys = [
                { property: 'callee', term: false, type: fixType(ast.type) },
                { property: 'arguments', term: true, type: 'arguments', separate: true },
            ];
            term = true;
            break;
        case 'OptionalCallExpression':
            keys = [
                { property: 'callee', term: false, type: fixType(ast.type) },
                { property: 'optional', term: false },
                { property: 'arguments', term: true, type: 'arguments', separate: true },
            ];
            term = true;
            break;
        case 'NewExpression':
            keys = [
                { property: 'callee', term: false, type: fixType(ast.type) },
                { property: 'arguments', term: true, type: 'arguments', separate: true },
            ];
            term = true;
            break;
        case 'MemberExpression':
            keys = [
                { property: 'object', term: false, type: fixType(ast.type) },
                { property: 'property', term: false, type: fixType(ast.type), hoist: true, separate: ast.computed },
            ];
            term = true;
            break;
        case 'OptionalMemberExpression':
            keys = [
                { property: 'object', term: false, type: fixType(ast.type) },
                { property: 'optional', term: false },
                { property: 'property', term: false, type: fixType(ast.type), hoist: true, separate: ast.computed },
            ];
            term = true;
            break;
        case 'ConditionalExpression':
            keys = ['test', 'consequent', 'alternate'];
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
        case 'ArrayExpression':
            keys = ['elements'];
            break;
        case 'UnaryExpression':
            keys = ['operator', 'arguments'];
            break;
        case 'UpdateExpression':
            keys = ['prefix', 'operator', 'arguments'];
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
            keys = [{ property: 'argument', term: true, type: 'member' }];
            term = false;
            break;
        case 'SpreadElement':
            keys = [{ property: 'argument', term: true, type: 'member' }];
            term = false;
            break;
        case 'VariableDeclaration':
            keys = ['declarations'];
            break;
        case 'VariableDeclarator':
            keys = ['id', 'init'];
            break;
    }
    return { term, keys, type: fixType(type), hoist };
}
function convertMember(ast) {
    const result = [];
    for (const v of ast.children) {
        if (v.type !== 'arguments') {
            if (v.type === 'member' || v.type === 'call') {
                result.push(...convertMember(v));
            }
            else {
                result.push(convertExpressionToTypeInfo(v));
            }
        }
    }
    return result;
}
function convertExpressionToTypeInfo(v) {
    return {
        type: v.type,
        value: v.value,
        optional: v.optional,
        id: v.nodeId,
    };
}
function convertCall(ast) {
    const result = [];
    for (const v of ast.children) {
        if (v.type !== 'arguments')
            if (v.type === 'call') {
                result.push(...convertCall(v));
            }
            else {
                result.push(convertExpressionToTypeInfo(v));
            }
    }
    return result;
}
function traverseRest(root) {
    let result = null;
    switch (root.type) {
        case 'rest': {
            result = convertExpressionToTypeInfo(root);
            break;
        }
    }
    return result;
}
function makeAST(ast) {
    let nodeId = 0;
    const nodes = {};
    function traverse(ast, parent) {
        var _a;
        const { keys, term, type, hoist } = getParamsFromNode(ast);
        if (term && !hoist) {
            const node = cExpression({ ...ast, type }, nodeId++);
            nodes[node.nodeId] = node;
            if (!parent.children)
                parent.children = [];
            parent.children.push(node);
            parent = node;
        }
        for (let key of keys) {
            const prop = typeof key === 'object' ? key.property : key;
            const propType = typeof key === 'object' ? key.type : ast.type;
            let createExpression = typeof key === 'object' ? key.term : false;
            let separate = typeof key === 'object' ? (_a = key.separate) !== null && _a !== void 0 ? _a : false : false;
            console.log(`${prop} ${createExpression} ${separate}`);
            let value = ast[prop];
            let node;
            let children;
            if (createExpression) {
                node = cExpression({
                    ...value,
                    type: `${propType}${keys.length > 1 && key !== 'optional' && !(typeof key === 'object' && key.type) ? `:${prop}` : ''}`,
                }, nodeId++);
                nodes[node.nodeId] = node;
                children = node.children;
                parent.children.push(node);
            }
            else {
                children = parent.children;
                node = parent;
            }
            if (value !== undefined) {
                if (prop === 'optional') {
                    if (value) {
                        const tmp = children.pop();
                        if (tmp) {
                            tmp.optional = value;
                            children.push(tmp);
                        }
                    }
                    continue;
                }
                if (Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++) {
                        if (typeof value[i] === 'object') {
                            let currentNode;
                            const { term } = getParamsFromNode(value[i]);
                            if (separate && !term) {
                                currentNode = cExpression(value[i], nodeId++);
                                nodes[currentNode.nodeId] = currentNode;
                                children.push(currentNode);
                                children = currentNode.children;
                            }
                            else {
                                currentNode = node;
                            }
                            traverse(value[i], currentNode);
                        }
                        else {
                            children.push(cExpression(t.stringLiteral(value[i]), nodeId++));
                        }
                    }
                }
                else if (value !== null) {
                    if (typeof value === 'object') {
                        let currentNode;
                        const { term } = getParamsFromNode(value);
                        if (separate && !term) {
                            currentNode = cExpression(value, nodeId++);
                            nodes[currentNode.nodeId] = currentNode;
                            children.push(currentNode);
                            children = currentNode.children;
                        }
                        else {
                            currentNode = node;
                        }
                        traverse(value, currentNode);
                    }
                    else {
                        children.push(cExpression(t.stringLiteral(value), nodeId++));
                    }
                }
            }
        }
    }
    const root = cExpression({ ...ast }, nodeId++);
    nodes[root.nodeId] = root;
    traverse(ast, root);
    const calls = [];
    const members = [];
    const identifiers = {};
    function traverseExpression(root) {
        switch (root.type) {
            case 'member': {
                members.push(convertMember(root));
                break;
            }
            case 'new': {
                const children = [...root.children];
                const args = children.pop();
                const callee = children;
                calls.push({
                    id: root.nodeId,
                    value: root.value,
                    type: root.type,
                    callee: callee
                        .map(v => {
                        if (v.type === 'call') {
                            return traverseCall(v).callee;
                        }
                        else {
                            return v.type === 'Identifier' ? convertExpressionToTypeInfo(v) : convertCall(v);
                        }
                    })
                        .reduce((ret, cur) => {
                        if (Array.isArray(cur)) {
                            ret.push(...cur);
                        }
                        else {
                            ret.push(cur);
                        }
                        return ret;
                    }, []),
                    args: args.children.length,
                });
                break;
            }
            case 'Identifier': {
                identifiers[root.nodeId] = {
                    type: root.type,
                    value: root.value,
                    optional: root.optional,
                    id: root.nodeId,
                };
                break;
            }
            default:
                for (const child of root.children) {
                    traverseExpression(child);
                }
        }
    }
    traverseExpression(root);
    for (const member of members) {
        let prev = member.shift();
        for (const m of member) {
            if (prev && nodes[prev.id]) {
                let curr = convertExpressionToTypeInfo(nodes[prev.id]);
                curr.type = 'object';
                if (!curr.properties) {
                    curr.properties = {};
                }
                curr.properties[m.id] = true;
            }
            if (prev && identifiers[prev.id]) {
                const curr = identifiers[prev.id];
                curr.type = 'object';
                if (!curr.properties) {
                    curr.properties = {};
                }
                curr.properties[m.id] = true;
            }
            prev = m;
        }
    }
    for (const call of calls) {
        let func = call.callee.pop();
        const item = identifiers[func.id];
        item.type = 'function';
        item.args = call.args;
    }
    return { root, calls, members, ids: identifiers };
}
exports.makeAST = makeAST;
//# sourceMappingURL=makeAST%20copy.js.map
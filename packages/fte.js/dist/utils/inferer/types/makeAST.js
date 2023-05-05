"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAST = void 0;
const tslib_1 = require("tslib");
const t = tslib_1.__importStar(require("@babel/types"));
const Info_1 = require("./Info");
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
function convertMember(ast, visited) {
    const result = [];
    visited === null || visited === void 0 ? void 0 : visited(ast);
    for (const v of [...ast.children]) {
        if (v.type !== 'arguments') {
            if (v.type === 'member' || v.type === 'call') {
                result.push(...convertMember(v, visited));
            }
            else {
                result.push(convertExpressionToTypeInfo(v));
            }
        }
    }
    return result;
}
function convertExpressionToTypeInfo(v) {
    var _a;
    return {
        type: v.type,
        value: (_a = v.value) !== null && _a !== void 0 ? _a : v.type,
        optional: v.optional,
        id: v.nodeId,
        name: typeof v.value === 'string' ? v.value : String(v.value),
    };
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
                        let tmp;
                        switch (typeof value) {
                            case 'string':
                                tmp = t.stringLiteral(value);
                                break;
                            case 'number':
                                tmp = t.numericLiteral(value);
                                break;
                            case 'boolean':
                                tmp = t.booleanLiteral(value);
                                break;
                            default:
                                throw new Error(`Unknown type ${typeof value}`);
                        }
                        children.push(cExpression(tmp, nodeId++));
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
    const identifiers = new Map();
    const processed = { member: new Set(), call: new Set(), identifier: new Set() };
    function traverseExpression(root) {
        switch (root.type) {
            case 'member': {
                if (processed.member.has(root.nodeId))
                    break;
                members.push(convertMember(root, item => {
                    processed.member.add(item.nodeId);
                }));
                break;
            }
            case 'call':
            case 'new': {
                if (processed.call.has(root.nodeId))
                    break;
                processed.call.add(root.nodeId);
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
                            return convertMember(v);
                        }
                        else {
                            return v.type === 'Identifier' ? convertExpressionToTypeInfo(v) : convertMember(v);
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
                if (processed.identifier.has(root.nodeId))
                    break;
                processed.identifier.add(root.nodeId);
                identifiers.set(root.nodeId, {
                    type: root.type,
                    value: root.value,
                    optional: root.optional,
                    id: root.nodeId,
                    name: root.value,
                });
                break;
            }
        }
        for (const child of root.children) {
            traverseExpression(child);
        }
    }
    traverseExpression(root);
    for (const member of members) {
        const memberCpy = [...member];
        let prev = null;
        for (const m of memberCpy) {
            if (!identifiers.has(m.id)) {
                const tmp = convertExpressionToTypeInfo(nodes[m.id]);
                identifiers.set(tmp.id, tmp);
            }
            const curr = identifiers.get(m.id);
            if (prev) {
                prev.type = typeof curr.value === 'string' ? 'object' : 'array';
                if (!prev.properties) {
                    prev.properties = new Set();
                }
                prev.properties.add(curr.id);
                curr.root = prev.id;
            }
            prev = curr;
        }
    }
    for (const call of calls) {
        let func = [...call.callee].pop();
        const item = identifiers.get(func.id);
        item.type = call.type;
        item.args = call.args;
    }
    const types = new Map();
    const idsProcessed = new Set();
    function getPath(v) {
        var _a;
        if (v.root) {
            return `${getPath((_a = identifiers.get(v.root)) !== null && _a !== void 0 ? _a : convertExpressionToTypeInfo(nodes[v.id]))}|${v.value}`;
        }
        return v.value;
    }
    function processIds(v) {
        if (idsProcessed.has(v.id))
            return;
        idsProcessed.add(v.id);
        const path = getPath(v);
        v.typeName = path;
        if (!types.has(path)) {
            types.set(path, v);
        }
        else {
            if (v.properties && v.properties.size > 0) {
                const same = types.get(path);
                if (!same.properties)
                    same.properties = new Set();
                for (const id of v.properties) {
                    same.properties.add(id);
                    identifiers.get(id).root = same.id;
                }
            }
            identifiers.delete(v.id);
        }
    }
    identifiers.forEach((v, k) => {
        processIds(v);
    });
    const infos = new Map();
    types.forEach(id => {
        var _a, _b;
        const tmp = (0, Info_1.createMinInfo)({
            name: id.name,
            type: id.type == 'array' || id.type == 'object'
                ? id.type
                : id.type == 'call' || id.type == 'new'
                    ? 'function'
                    : 'primitive',
            typeName: id.typeName,
        });
        const props = [...((_b = (_a = id.properties) === null || _a === void 0 ? void 0 : _a.values()) !== null && _b !== void 0 ? _b : [])];
        props
            .map(item => identifiers.get(item))
            .map(v => (0, Info_1.createMinInfo)({ name: v.name, typeName: v.typeName }))
            .forEach(v => tmp.properties.set(v.name, v));
        const parts = tmp.typeName.split('|');
        if (parts.length === 1) {
            infos.set(tmp.typeName, tmp);
        }
        else if (parts.length > 1) {
            const parent = infos.get(parts[0]);
            parent.children.set(tmp.typeName, tmp);
        }
        return tmp;
    });
    return {
        root,
        calls,
        members,
        ids: [...identifiers.values()].map(v => { var _a, _b; return ({ ...v, properties: [...((_b = (_a = v.properties) === null || _a === void 0 ? void 0 : _a.values()) !== null && _b !== void 0 ? _b : [])] }); }),
        identifiers,
        infos,
    };
}
exports.makeAST = makeAST;
//# sourceMappingURL=makeAST.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processExpression = exports.processOptionalMember = exports.processCall = exports.buildExpression = void 0;
const tslib_1 = require("tslib");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const t = tslib_1.__importStar(require("@babel/types"));
function hasChildren(node) {
    var _a, _b;
    if (!t.isNode(node)) {
        return false;
    }
    const keys = (_b = (_a = t.VISITOR_KEYS) === null || _a === void 0 ? void 0 : _a[node.type]) === null || _b === void 0 ? void 0 : _b.filter(key => (Array.isArray(node[key]) ? node[key].length > 0 : node[key]));
    return (keys === null || keys === void 0 ? void 0 : keys.length) > 0;
}
function buildExpression(path, name) {
    var _a;
    const expression = {
        name: name !== null && name !== void 0 ? name : '',
        type: 'expression',
        optional: false,
        children: [],
    };
    if (t.isOptionalCallExpression(path.node) || t.isCallExpression(path.node)) {
        const result = buildExpression(path.get('callee'), name);
        if ((_a = result.children) === null || _a === void 0 ? void 0 : _a.length) {
            expression.children.push(...result.children);
            const last = result.children[result.children.length - 1];
            last.type = 'call';
            last.arguments = [];
            if (!name)
                expression.name = result.children[0].name;
        }
        else {
            result.type = 'call';
            result.arguments = [];
            expression.children.push(result);
            if (!name)
                expression.name = result.name;
        }
        const args = path.get('arguments');
        for (let i = 0; i < args.length; i++) {
            const argResult = buildExpression(args[i], `arg${i}`);
            const call = expression.children[expression.children.length - 1];
            call.type = 'call';
            call.arguments = [];
            call.arguments.push(argResult);
        }
    }
    else {
        if (hasChildren(path.node)) {
            console.log(path.node.type);
            (0, traverse_1.default)(path.node, {
                enter(path) {
                    console.log(`!${path.node.type}`);
                    processExpression(path, expression.children);
                },
            }, path.scope);
        }
        else {
            switch (path.node.type) {
                case 'Identifier':
                    expression.name = path.node.name;
                    break;
                case 'NumericLiteral':
                    expression.name = path.node.value;
                    break;
                case 'StringLiteral':
                    expression.name = path.node.value;
                    break;
            }
        }
    }
    return expression;
}
exports.buildExpression = buildExpression;
function processCall(path, pathArray) {
    var _a;
    const result = buildExpression(path.get('callee'));
    result.optional = t.isOptionalCallExpression(path.node);
    if ((_a = result.children) === null || _a === void 0 ? void 0 : _a.length) {
        pathArray.push(...result.children);
    }
    else {
        pathArray.push(result);
    }
    const call = pathArray[pathArray.length - 1];
    call.type = 'call';
    call.arguments = [];
    const args = path.get('arguments');
    if (args === null || args === void 0 ? void 0 : args.length) {
        for (let i = 0; i < args.length; i++) {
            const argResult = buildExpression(args[i], `arg${i}`);
            call.arguments.push(argResult);
        }
    }
    path.skip();
}
exports.processCall = processCall;
function processOptionalMember(path, pathArray) {
    var _a;
    const result = buildExpression(path);
    if (t.isOptionalCallExpression(path.node)) {
    }
    else if (t.isOptionalMemberExpression(path.node)) {
    }
    let optional;
    if ((_a = result.children) === null || _a === void 0 ? void 0 : _a.length) {
        pathArray.push(...result.children);
        if (t.isOptionalCallExpression(path.node)) {
            optional = result.children[result.children.length - 1];
        }
        else {
            optional = result.children[result.children.length - 2];
        }
    }
    else {
        pathArray.push(result);
        optional = result;
    }
    optional.optional = path.node.optional;
    path.skip();
}
exports.processOptionalMember = processOptionalMember;
function processExpression(path, pathArray) {
    switch (path.node.type) {
        case 'OptionalCallExpression':
            processOptionalMember(path, pathArray);
            break;
        case 'OptionalMemberExpression':
            processOptionalMember(path, pathArray);
            break;
        case 'CallExpression':
            processCall(path, pathArray);
            break;
        case 'Identifier':
            pathArray.push({
                name: path.node.name,
                type: 'property',
                optional: t.isOptionalMemberExpression(path.parent),
            });
            break;
        case 'NumericLiteral':
        case 'StringLiteral':
            pathArray.push({
                name: path.node.value,
                type: 'index',
                optional: t.isOptionalMemberExpression(path.parent),
            });
            break;
    }
}
exports.processExpression = processExpression;
//# sourceMappingURL=buildExpression.js.map
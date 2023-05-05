"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpression = exports.isCall = exports.isIndex = exports.isProperty = void 0;
const tslib_1 = require("tslib");
const parser_1 = require("@babel/parser");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const t = tslib_1.__importStar(require("@babel/types"));
const code = "param?.some?.[1].name?.(m(),e.name())['super name']?.nice(a + b + c);";
const ast = (0, parser_1.parse)(code);
let pathArray = [];
(0, traverse_1.default)(ast, {
    enter(path) {
        processExpression(path, pathArray);
    },
});
console.log(pathArray);
function isProperty(node) {
    return typeof node === 'object' && node !== null && node.type === 'property';
}
exports.isProperty = isProperty;
function isIndex(node) {
    return typeof node === 'object' && node !== null && node.type === 'index';
}
exports.isIndex = isIndex;
function isCall(node) {
    return typeof node === 'object' && node !== null && node.type === 'call';
}
exports.isCall = isCall;
function isExpression(node) {
    return typeof node === 'object' && node !== null && node.type === 'expression';
}
exports.isExpression = isExpression;
const rest1 = {
    name: 'rest',
    type: 'expression',
    optional: false,
    children: [
        {
            name: 'rest',
            type: 'property',
            optional: false,
        },
        {
            name: 'length',
            type: 'property',
            optional: false,
        },
    ],
};
const rest = {
    name: 'rest',
    type: 'expression',
    optional: false,
    children: [
        {
            name: 'rest',
            type: 'property',
            optional: false,
        },
        {
            name: 0,
            type: 'index',
            optional: false,
        },
        {
            name: 'some',
            type: 'property',
            optional: true,
        },
        {
            name: 'push',
            type: 'call',
            optional: true,
            arguments: [
                {
                    name: 'arg0',
                    type: 'expression',
                    optional: false,
                    children: [
                        { name: 'a', type: 'property', optional: false },
                        { name: 'b', type: 'property', optional: false },
                        { name: 'c', type: 'property', optional: false },
                    ],
                },
            ],
        },
    ],
};
const param = {
    name: 'param',
    type: 'expression',
    optional: false,
    children: [
        {
            name: 'param',
            type: 'property',
            optional: true,
        },
        {
            name: 'some',
            type: 'property',
            optional: true,
        },
        {
            name: 1,
            type: 'index',
            optional: false,
        },
        {
            name: 'name',
            type: 'call',
            optional: true,
            arguments: [
                {
                    name: 'arg0',
                    type: 'expression',
                    optional: false,
                    children: [
                        {
                            name: 'm',
                            type: 'call',
                            optional: false,
                            arguments: [],
                        },
                    ],
                },
                {
                    name: 'arg1',
                    type: 'expression',
                    optional: false,
                    children: [
                        {
                            name: 'e',
                            type: 'parameter',
                            optional: false,
                        },
                        {
                            name: 'name',
                            type: 'call',
                            optional: false,
                            arguments: [],
                        },
                    ],
                },
            ],
        },
        {
            name: 'super name',
            type: 'index',
            optional: true,
        },
        {
            name: 'nice',
            type: 'call',
            optional: false,
            arguments: [
                {
                    name: 'arg0',
                    type: 'expression',
                    optional: false,
                    children: [
                        { name: 'a', type: 'property', optional: false },
                        { name: 'b', type: 'property', optional: false },
                        { name: 'c', type: 'property', optional: false },
                    ],
                },
            ],
        },
    ],
};
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
            let optional = '';
            if (t.isOptionalMemberExpression(path.parent)) {
                optional = '?';
            }
            pathArray.push(`${optional}${path.node.name}`);
        }
        else {
            pathArray.push(`${path.node.name}`);
        }
    }
    else if (t.isNumericLiteral(path.node) &&
        (t.isMemberExpression(path.parent) || t.isOptionalMemberExpression(path.parent))) {
        let optional = '';
        if (t.isOptionalMemberExpression(path.parent)) {
            optional = '?';
        }
        pathArray.push(`${optional}[${path.node.value}]`);
    }
    else if (t.isStringLiteral(path.node) &&
        (t.isMemberExpression(path.parent) || t.isOptionalMemberExpression(path.parent))) {
        let optional = '';
        if (t.isOptionalMemberExpression(path.parent)) {
            optional = '?';
        }
        pathArray.push(`${optional}["${path.node.value}"]`);
    }
}
//# sourceMappingURL=in.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const tslib_1 = require("tslib");
const createInfo_1 = require("./createInfo");
const t = tslib_1.__importStar(require("@babel/types"));
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const parser = tslib_1.__importStar(require("@babel/parser"));
function inferTypesFromFunction(funcCode) {
    const code = funcCode.trim();
    const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' });
    console.log(JSON.stringify(sourceFile, null, 2));
    const result = new Map();
    VisitAllFunctions(result, sourceFile, code);
    return result;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
function VisitAllFunctions(result, ast, code) {
    const extractFunction = {
        FunctionDeclaration(path) {
            const name = extractName(path.node.id);
            if (name) {
                createFunction(result, name, path.node);
            }
        },
        VariableDeclarator(path) {
            const name = extractName(path.node.id);
            if (name) {
                const init = path.node.init;
                if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
                    createFunction(result, name, init);
                }
                else if (t.isCallExpression(init)) {
                    const extractor = {
                        FunctionExpression(path) {
                            createFunction(result, name, path.node);
                        },
                        ArrowFunctionExpression(path) {
                            createFunction(result, name, path.node);
                        },
                    };
                    (0, traverse_1.default)(init, extractor, path.scope, path.state, path.parentPath);
                }
            }
        },
        ClassMethod(path) {
            const name = extractName(path.node.key);
            if (name) {
                createFunction(result, name, path.node);
            }
        },
        ClassPrivateMethod(path) {
            const name = extractName(path.node.key);
            if (name) {
                createFunction(result, name, path.node);
            }
        },
    };
    (0, traverse_1.default)(ast, extractFunction);
    return result;
}
function extractName(n) {
    if (t.isIdentifier(n)) {
        return n.name;
    }
    else if (t.isObjectPattern(n)) {
        return extractName(n);
    }
    else
        return 'anonymous';
}
function createFunction(result, name, func) {
    const info = (0, createInfo_1.createInfo)(result, name, name, '', 'function');
    result.set(info.name, info);
    if (t.isFunctionExpression(func)) {
        func.params.forEach(p => {
            processPattern(p, result, info);
        });
    }
    else if (t.isArrowFunctionExpression(func)) {
        func.params.forEach(p => {
            processPattern(p, result, info);
        });
    }
    else if (t.isClassMethod(func)) {
        func.params.forEach(p => {
            processPattern(p, result, info);
        });
    }
    else if (t.isClassPrivateMethod(func)) {
        func.params.forEach(p => {
            processPattern(p, result, info);
        });
    }
    else if (t.isFunctionDeclaration(func)) {
        func.params.forEach(p => {
            processPattern(p, result, info);
        });
    }
}
function processPattern(node, result, func) {
    if (t.isIdentifier(node)) {
        const param = (0, createInfo_1.createInfo)(result, node.name, node.name, '', 'primitive');
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
}
//# sourceMappingURL=typeinfer_babel.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const tslib_1 = require("tslib");
const createInfo_1 = require("./utils/createInfo");
const t = tslib_1.__importStar(require("@babel/types"));
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const parser = tslib_1.__importStar(require("@babel/parser"));
function inferTypesFromFunction(funcCode) {
    const code = funcCode.trim();
    const sourceFile = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' });
    console.log(JSON.stringify(sourceFile, null, 2));
    const result = new Map();
    VisitAllFunctions(result, sourceFile);
    return result;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
function VisitAllFunctions(result, ast) {
    const extractFunction = {
        FunctionDeclaration(path, context) {
            const name = extractName(path.node.id)[0];
            createFunction(context, name, path.node, path.scope);
        },
        VariableDeclarator(path, context) {
            const name = extractName(path.node.id)[0];
            if (name) {
                const init = path.node.init;
                if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
                    createFunction(context, name, init, path.scope);
                }
                else if (t.isCallExpression(init)) {
                    const extractor = {
                        FunctionExpression(path) {
                            createFunction(context, name, path.node, path.scope);
                        },
                        ArrowFunctionExpression(path) {
                            createFunction(context, name, path.node, path.scope);
                        },
                    };
                    (0, traverse_1.default)(init, extractor, path.scope, path.state, path.parentPath);
                }
            }
        },
        ObjectMethod(path, context) {
            const name = extractName(path.node.key)[0];
            if (name) {
                createFunction(context, name, path.node, path.scope);
            }
        },
        ClassMethod(path, context) {
            const name = extractName(path.node.key)[0];
            if (name) {
                createFunction(context, name, path.node, path.scope);
            }
        },
        ClassPrivateMethod(path, context) {
            const name = extractName(path.node.key)[0];
            if (name) {
                createFunction(context, name, path.node, path.scope);
            }
        },
    };
    (0, traverse_1.default)(ast, extractFunction, undefined, result);
    return result;
}
function extractName(n) {
    if (t.isIdentifier(n)) {
        return [n.name];
    }
    else if (t.isPrivateName(n)) {
        return [n.id.name];
    }
    else if (t.isObjectProperty(n)) {
        return extractName(n.key);
    }
    else if (t.isStringLiteral(n)) {
        return [n.value];
    }
    else if (t.isAssignmentExpression(n)) {
        return extractName(n.left);
    }
    else if (t.isMemberExpression(n)) {
        const property = extractName(n.property);
        if (t.isIdentifier(n.object)) {
            return [...extractName(n.object), ...property];
        }
        else
            return property;
    }
    else if (t.isRestElement(n)) {
        return extractName(n.argument);
    }
    else if (t.isAssignmentPattern(n)) {
        return extractName(n.left);
    }
    else if (t.isArrayPattern(n)) {
        return n.elements.flatMap(element => extractName(element));
    }
    else if (t.isObjectPattern(n)) {
        return n.properties.flatMap(property => extractName(property));
    }
    else if (t.isTSParameterProperty(n)) {
        return extractName(n.parameter);
    }
    else if (t.isTSAsExpression(n)) {
        return extractName(n.expression);
    }
    else if (t.isTSTypeAssertion(n)) {
        return extractName(n.expression);
    }
    else if (t.isTSNonNullExpression(n)) {
        return extractName(n.expression);
    }
    else
        return ['anonymous'];
}
function createFunction(context, name, func, scope) {
    const info = (0, createInfo_1.createInfo)(context, name, name, '', 'function', scope);
    context.set(info.name, info);
    func.params.forEach((p, index) => {
        processPattern(index, p, context, info, scope);
    });
}
function processPattern(index, node, result, func, scope) {
    if (t.isIdentifier(node)) {
        const name = extractName(node)[0];
        const param = (0, createInfo_1.createInfo)(result, name, name, '', 'primitive', scope);
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
    else if (t.isTSParameterProperty(node)) {
        const parameters = extractName(node.parameter);
        parameters.forEach(name => {
            const param = (0, createInfo_1.createInfo)(result, name, name, '', 'primitive', scope);
            func.properties.set(param.name, param);
            result.set(param.name, param);
        });
    }
    else if (t.isRestElement(node)) {
        const parameters = extractName(node.argument);
        parameters.forEach(name => {
            const param = (0, createInfo_1.createInfo)(result, name, name, '', 'array', scope);
            func.properties.set(param.name, param);
            result.set(param.name, param);
        });
    }
    else if (t.isPattern(node)) {
        if (t.isObjectPattern(node)) {
            const paramName = `param${index}`;
            const paramObj = (0, createInfo_1.createInfo)(result, paramName, paramName, '', 'object', scope);
            func.properties.set(paramObj.name, paramObj);
            node.properties.forEach(p => {
                const parameter = extractName(p)[0];
                const param = (0, createInfo_1.createInfo)(result, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                result.set(param.name, param);
            });
        }
        else if (t.isArrayPattern(node)) {
            const paramName = `param${index}`;
            const paramObj = (0, createInfo_1.createInfo)(result, paramName, paramName, '', 'object', scope);
            func.properties.set(paramObj.name, paramObj);
            node.elements.forEach(p => {
                const parameter = extractName(p)[0];
                const param = (0, createInfo_1.createInfo)(result, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                result.set(param.name, param);
            });
        }
        else if (t.isAssignmentPattern(node)) {
            const parameter = extractName(node.left)[0];
            const param = (0, createInfo_1.createInfo)(result, parameter, parameter, parameter, 'primitive', scope);
            func.properties.set(param.name, param);
            result.set(param.name, param);
        }
    }
}
//# sourceMappingURL=typeinfer_prev.js.map
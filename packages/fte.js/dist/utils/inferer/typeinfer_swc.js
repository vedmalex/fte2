"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const createInfo_1 = require("./createInfo");
const core_1 = require("@swc/core");
const Visitor_1 = require("./Visitor");
function inferTypesFromFunction(funcCode) {
    const code = funcCode.trim();
    const sourceFile = (0, core_1.parseSync)(code, { syntax: 'typescript' });
    console.log(JSON.stringify(sourceFile, null, 2));
    const result = new Map();
    VisitAllFunctions(result, sourceFile, code);
    return result;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
function VisitAllFunctions(result, sourceFile, code) {
    const extractFunction = new Visitor_1.BaseVistor({
        visitFunction: n => {
            if ((0, Visitor_1.isFunctionDeclaration)(n)) {
                const name = extractName(n.identifier);
                createFunction(result, name, n);
            }
            return n;
        },
        visitVariableDeclarator(n) {
            if (n.init) {
                if ((0, Visitor_1.isArrowFunctionExpression)(n.init)) {
                    const name = extractName(n);
                    createFunction(result, name, n.init);
                }
                else if ((0, Visitor_1.isFunctionExpression)(n.init)) {
                    const name = extractName(n);
                    createFunction(result, name, n.init);
                }
                else if ((0, Visitor_1.isCallExpression)(n.init)) {
                    const name = extractName(n);
                    const extractor = new Visitor_1.BaseVistor({
                        visitFunctionExpression: n => {
                            createFunction(result, name, n);
                            return n;
                        },
                        visitArrowFunctionExpression: n => {
                            createFunction(result, name, n);
                            return n;
                        },
                    });
                    extractor.visitCallExpression(n.init);
                }
            }
            return n;
        },
        visitClassMethod(n) {
            if ((0, Visitor_1.isPropertyName)(n.key) && (0, Visitor_1.isIdentifier)(n.key)) {
                const name = extractName(n.key);
                createFunction(result, name, n);
            }
            return n;
        },
        visitPrivateMethod(n) {
            if ((0, Visitor_1.isPropertyName)(n.key) && (0, Visitor_1.isIdentifier)(n.key)) {
                const name = extractName(n.key);
                createFunction(result, name, n);
            }
            return n;
        },
    });
    extractFunction.visitProgram(sourceFile);
    return result;
}
function extractName(n) {
    if ((0, Visitor_1.isIdentifier)(n)) {
        return n.value;
    }
    else if ((0, Visitor_1.isVariableDeclarator)(n) && (0, Visitor_1.isBindingIdentifier)(n.id)) {
        return n.id.value;
    }
    else
        return 'anonymous';
}
function createFunction(result, name, func) {
    const info = (0, createInfo_1.createInfo)(result, name, name, '', 'function');
    result.set(info.name, info);
    if ((0, Visitor_1.isFunctionExpression)(func)) {
        func.params.forEach(p => {
            processPattern(p.pat, result, info);
        });
    }
    else if ((0, Visitor_1.isArrowFunctionExpression)(func)) {
        func.params.forEach(p => {
            processPattern(p, result, info);
        });
    }
    else if ((0, Visitor_1.isClassMethod)(func)) {
        func.function.params.forEach(p => {
            processPattern(p.pat, result, info);
        });
    }
    else if ((0, Visitor_1.isPrivateMethod)(func)) {
        func.function.params.forEach(p => {
            processPattern(p.pat, result, info);
        });
    }
    else if ((0, Visitor_1.isFunctionDeclaration)(func)) {
        func.params.forEach(p => {
            processPattern(p.pat, result, info);
        });
    }
    else if ((0, Visitor_1.isMethodProperty)(func)) {
        func.params.forEach(p => {
            processPattern(p.pat, result, info);
        });
    }
}
function processPattern(node, result, func) {
    if ((0, Visitor_1.isBindingIdentifier)(node)) {
        const param = (0, createInfo_1.createInfo)(result, node.value, node.value, '', 'primitive');
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
    else if ((0, Visitor_1.isArrayPattern)(node)) {
    }
    else if ((0, Visitor_1.isRestElement)(node)) {
    }
    else if ((0, Visitor_1.isObjectPattern)(node)) {
    }
    else if ((0, Visitor_1.isAssignmentPattern)(node)) {
    }
    else if ((0, Visitor_1.isInvalid)(node)) {
    }
    else if ((0, Visitor_1.isExpression)(node)) {
    }
}
//# sourceMappingURL=typeinfer_swc.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processArgument = void 0;
const tslib_1 = require("tslib");
const createInfo_1 = require("./createInfo");
const t = tslib_1.__importStar(require("@babel/types"));
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const extractName_1 = require("./extractName");
function processArgument(index, node, result, func, scope, anonynmous) {
    if (t.isIdentifier(node)) {
        const name = (0, extractName_1.extractName)(node, anonynmous);
        const param = (0, createInfo_1.createInfo)(result, name, name, '', 'primitive', scope);
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
    else if (t.isTSParameterProperty(node)) {
        const parameter = (0, extractName_1.extractName)(node.parameter, anonynmous);
        const param = (0, createInfo_1.createInfo)(result, parameter, parameter, '', 'primitive', scope);
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
    else if (t.isRestElement(node)) {
        const parameter = (0, extractName_1.extractName)(node.argument, anonynmous);
        debugger;
        discoverType(scope.getBinding(parameter), parameter, func.scope.block);
        const param = (0, createInfo_1.createInfo)(result, parameter, parameter, '', 'array', scope);
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
    else if (t.isPattern(node)) {
        if (t.isObjectPattern(node)) {
            const paramName = `param${index}`;
            const paramObj = (0, createInfo_1.createInfo)(result, paramName, paramName, '', 'object', scope);
            func.properties.set(paramObj.name, paramObj);
            node.properties.forEach(p => {
                const parameter = (0, extractName_1.extractName)(p, anonynmous);
                const param = (0, createInfo_1.createInfo)(result, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                result.set(param.name, param);
            });
        }
        else if (t.isArrayPattern(node)) {
            const paramName = `param${index}`;
            const paramObj = (0, createInfo_1.createInfo)(result, paramName, paramName, '', 'array', scope);
            func.properties.set(paramObj.name, paramObj);
            node.elements.forEach(p => {
                const parameter = (0, extractName_1.extractName)(p, anonynmous);
                const param = (0, createInfo_1.createInfo)(result, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                result.set(param.name, param);
            });
        }
        else if (t.isAssignmentPattern(node)) {
            const parameter = (0, extractName_1.extractName)(node.left, anonynmous);
            debugger;
            discoverType(scope.getBinding(parameter), parameter, func.scope.block);
            const param = (0, createInfo_1.createInfo)(result, parameter, parameter, parameter, 'primitive', scope);
            func.properties.set(param.name, param);
            result.set(param.name, param);
        }
    }
}
exports.processArgument = processArgument;
function discoverType(binding, param, ast) {
    let type = '';
    if (binding === null || binding === void 0 ? void 0 : binding.referenced) {
        binding.referencePaths.forEach(path => {
            (0, traverse_1.default)(path.node, {
                enter(path) {
                    if (path.isVariableDeclarator()) {
                        if (t.isArrayExpression(path.node.init)) {
                            type = 'array';
                        }
                        else if (t.isObjectExpression(path.node.init)) {
                            type = 'object';
                        }
                        else if (t.isCallExpression(path.node.init)) {
                            const callee = path.node.init.callee;
                            debugger;
                        }
                    }
                    else if (path.isMemberExpression()) {
                    }
                },
            }, path.scope, path);
        });
    }
    return type;
}
//# sourceMappingURL=processArgument.js.map
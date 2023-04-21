"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processArgument = void 0;
const tslib_1 = require("tslib");
const createInfo_1 = require("./utils/createInfo");
const t = tslib_1.__importStar(require("@babel/types"));
const extractName_1 = require("./utils/extractName");
function processArgument(index, node, result, func, scope) {
    if (t.isIdentifier(node)) {
        const name = (0, extractName_1.extractName)(node)[0];
        const param = (0, createInfo_1.createInfo)(result, name, name, '', 'primitive', scope);
        func.properties.set(param.name, param);
        result.set(param.name, param);
    }
    else if (t.isTSParameterProperty(node)) {
        const parameters = (0, extractName_1.extractName)(node.parameter);
        parameters.forEach(name => {
            const param = (0, createInfo_1.createInfo)(result, name, name, '', 'primitive', scope);
            func.properties.set(param.name, param);
            result.set(param.name, param);
        });
    }
    else if (t.isRestElement(node)) {
        const parameters = (0, extractName_1.extractName)(node.argument);
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
                const parameter = (0, extractName_1.extractName)(p)[0];
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
                const parameter = (0, extractName_1.extractName)(p)[0];
                const param = (0, createInfo_1.createInfo)(result, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                result.set(param.name, param);
            });
        }
        else if (t.isAssignmentPattern(node)) {
            const parameter = (0, extractName_1.extractName)(node.left)[0];
            const param = (0, createInfo_1.createInfo)(result, parameter, parameter, parameter, 'primitive', scope);
            func.properties.set(param.name, param);
            result.set(param.name, param);
        }
    }
}
exports.processArgument = processArgument;
//# sourceMappingURL=processPattern.js.map
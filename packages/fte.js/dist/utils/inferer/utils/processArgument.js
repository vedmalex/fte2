"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processArgument = void 0;
const tslib_1 = require("tslib");
const createInfo_1 = require("./createInfo");
const t = tslib_1.__importStar(require("@babel/types"));
const extractName_1 = require("./extractName");
function processArgument(index, node, actualAgruments, func, scope, anonynmous) {
    if (t.isIdentifier(node)) {
        const name = (0, extractName_1.extractName)(node, anonynmous);
        const param = (0, createInfo_1.createInfo)(actualAgruments, name, name, '', 'primitive', scope);
        func.properties.set(param.name, param);
        actualAgruments.set(param.name, param);
    }
    else if (t.isTSParameterProperty(node)) {
        const parameter = (0, extractName_1.extractName)(node.parameter, anonynmous);
        const param = (0, createInfo_1.createInfo)(actualAgruments, parameter, parameter, '', 'primitive', scope);
        func.properties.set(param.name, param);
        actualAgruments.set(param.name, param);
    }
    else if (t.isRestElement(node)) {
        const parameter = (0, extractName_1.extractName)(node.argument, anonynmous);
        const param = (0, createInfo_1.createInfo)(actualAgruments, parameter, parameter, '', 'array', scope);
        func.properties.set(param.name, param);
        actualAgruments.set(param.name, param);
    }
    else if (t.isPattern(node)) {
        if (t.isObjectPattern(node)) {
            const paramName = `param${index}`;
            const paramObj = (0, createInfo_1.createInfo)(actualAgruments, paramName, paramName, '', 'object', scope);
            func.properties.set(paramObj.name, paramObj);
            node.properties.forEach(p => {
                const parameter = (0, extractName_1.extractName)(p, anonynmous);
                const param = (0, createInfo_1.createInfo)(actualAgruments, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                actualAgruments.set(param.name, param);
            });
        }
        else if (t.isArrayPattern(node)) {
            const paramName = `param${index}`;
            const paramObj = (0, createInfo_1.createInfo)(actualAgruments, paramName, paramName, '', 'array', scope);
            func.properties.set(paramObj.name, paramObj);
            node.elements.forEach(p => {
                const parameter = (0, extractName_1.extractName)(p, anonynmous);
                const param = (0, createInfo_1.createInfo)(actualAgruments, parameter, parameter, paramName, 'primitive', scope);
                paramObj.properties.set(param.name, param);
                actualAgruments.set(param.name, param);
            });
        }
        else if (t.isAssignmentPattern(node)) {
            const parameter = (0, extractName_1.extractName)(node.left, anonynmous);
            const param = (0, createInfo_1.createInfo)(actualAgruments, parameter, parameter, parameter, 'primitive', scope);
            func.properties.set(param.name, param);
            actualAgruments.set(param.name, param);
        }
    }
}
exports.processArgument = processArgument;
//# sourceMappingURL=processArgument.js.map
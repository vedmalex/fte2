"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFucntion = void 0;
const tslib_1 = require("tslib");
const createInfo_1 = require("./createInfo");
const t = tslib_1.__importStar(require("@babel/types"));
const processArgument_1 = require("./processArgument");
const extractName_1 = require("./extractName");
const makeAST_1 = require("../types/makeAST");
function processFucntion(context, path, anonynmous) {
    let name = '';
    const { node: func, scope } = path;
    if (t.isArrowFunctionExpression(func) || t.isFunctionExpression(func)) {
        if (t.isVariableDeclarator(scope.parentBlock)) {
            name = (0, extractName_1.extractName)(scope.parentBlock.id, anonynmous);
        }
        else
            name = anonynmous();
    }
    else if (t.isFunctionDeclaration(func) || t.isFunctionExpression(func)) {
        name = (0, extractName_1.extractName)(func.id, anonynmous);
    }
    else if (t.isObjectMethod(func) || t.isClassMethod(func) || t.isClassPrivateMethod(func)) {
        name = (0, extractName_1.extractName)(func.key, anonynmous);
    }
    const info = (0, createInfo_1.createInfo)(context, name, name, '', 'function', scope);
    context.set(info.name, info);
    let result = new Map();
    func.params.forEach((p, index) => {
        (0, processArgument_1.processArgument)(index, p, result, info, scope, anonynmous);
    });
    result.forEach((info, paramName) => {
        const binding = path.scope.getBinding(paramName);
        if (!binding) {
            if (!info.children)
                info.type = 'primitive';
            return;
        }
        for (let j = 0; j < binding.referencePaths.length; j++) {
            const refPath = binding.referencePaths[j];
            const expression = refPath.getStatementParent();
            if (expression) {
                const astExpression = (0, makeAST_1.makeAST)(expression.node);
                console.log(astExpression.ids[refPath.toString()]);
                const itemUsage = astExpression.infos.get(refPath.toString());
                if (itemUsage)
                    mergeInfo(info, itemUsage);
            }
        }
    });
}
exports.processFucntion = processFucntion;
function mergeInfo(info, itemUsage) {
    info.type = itemUsage.type;
    itemUsage.properties.forEach((value, key) => {
        if (info.properties.has(key)) {
            const prop = info.properties.get(key);
            mergeInfo(prop, value);
        }
        else {
            info.properties.set(key, value);
        }
    });
    itemUsage.children.forEach((value, key) => {
        if (info.children.has(key)) {
            const prop = info.children.get(key);
            mergeInfo(prop, value);
        }
        else {
            info.children.set(key, value);
        }
    });
    if (itemUsage.args && ((info.args && itemUsage.args > info.args) || !info.args)) {
        info.args = itemUsage.args;
    }
    if (!info.optional && itemUsage.optional) {
        info.optional = itemUsage.optional;
    }
}
//# sourceMappingURL=processFunction.js.map
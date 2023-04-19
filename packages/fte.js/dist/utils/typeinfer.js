"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = exports.processInfo = exports.TSObject = exports.TSArray = exports.TSFunction = exports.TSPrimitive = exports.TSBaseType = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const ts = tslib_1.__importStar(require("typescript"));
function print(node, sourceFile) {
    console.log(node.getText(sourceFile), ts.SyntaxKind[node.kind]);
}
class TSBaseType {
    constructor(type) {
        this.type = type;
    }
    toString() {
        return this.type;
    }
}
exports.TSBaseType = TSBaseType;
class TSPrimitive extends TSBaseType {
    constructor(name) {
        super('primitive');
        this.name = name;
    }
    toString() {
        return `${this.name}: any`;
    }
}
exports.TSPrimitive = TSPrimitive;
class TSFunction extends TSBaseType {
    constructor(name, params) {
        super('function');
        this.name = name;
        this.params = params;
    }
    toString() {
        return `${this.name}: ((${this.params.map(p => p.toString())})=> any)`;
    }
}
exports.TSFunction = TSFunction;
class TSArray extends TSBaseType {
    constructor(name, children) {
        super('array');
        this.name = name;
        this.children = children;
    }
    toString() {
        return `${this.name}: Array<${this.children.toString()}>`;
    }
}
exports.TSArray = TSArray;
class TSObject extends TSBaseType {
    constructor(name, properties) {
        super('object');
        this.name = name;
        this.properties = properties;
    }
    toString() {
        return ` type ${this.name} = {${this.properties.map(p => `${p.toString()},`)}}`;
    }
}
exports.TSObject = TSObject;
function processInfo(info) {
    if (info.type === 'function') {
        return new TSFunction(info.name, [...info.properties.values()].map(processInfo));
    }
    if (info.type === 'array') {
        return new TSArray(info.name, processInfo(info.children.values().next().value));
    }
    if (info.type === 'object') {
        return new TSObject(info.name, [...info.properties.values()].map(processInfo));
    }
    if (info.type === 'primitive') {
        return new TSPrimitive(info.name);
    }
    throw new Error('unknown type');
}
exports.processInfo = processInfo;
function createInfo(props, name, typeName, parent, type) {
    console.log('createInfo', name, typeName, parent, type);
    const parentInfo = props.get(parent);
    const info = {
        name,
        type,
        properties: new Map(),
        typeName: lodash_1.default.upperFirst(typeName),
        parent: parentInfo,
        children: new Map(),
    };
    if (parentInfo) {
        parentInfo.children.set(lodash_1.default.upperFirst(typeName), info);
    }
    props.set(name, info);
    return info;
}
function isFunctionNode(node) {
    return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node);
}
function inferTypesFromFunction(funcCode) {
    const sourceFile = ts.createSourceFile('temp.ts', funcCode, ts.ScriptTarget.ES2015, true);
    const result = new Map();
    visitAllFunctions(result, sourceFile, sourceFile);
    return result;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
function processFunctionParams(funcDef, paramName, props) {
    props.forEach((prop, name) => {
        if (prop.name === paramName) {
            funcDef.properties.set(name, prop);
        }
        else {
            funcDef.children.set(name, prop);
        }
    });
}
function visitAllFunctions(result, sourceFile, node) {
    var _a, _b, _c;
    if (isFunctionNode(node)) {
        let name;
        if (ts.isFunctionExpression(node) && ts.isPropertyAssignment(node.parent)) {
            name = node.parent.name.getText();
        }
        else if (ts.isFunctionDeclaration(node)) {
            name = (_b = (_a = node.name) === null || _a === void 0 ? void 0 : _a.getText()) !== null && _b !== void 0 ? _b : '';
        }
        else {
            name = `${(_c = node.parent) === null || _c === void 0 ? void 0 : _c.getText()}.anonymous`;
        }
        const funcDef = createInfo(result, name, name, '', 'function');
        const scopeResult = new Map();
        node.parameters.forEach((param, index) => {
            if (ts.isIdentifier(param.name)) {
                const paramName = param.name.getText(sourceFile);
                findParemeterUsage(scopeResult, sourceFile, paramName, node);
                processFunctionParams(funcDef, paramName, scopeResult);
            }
            else if (ts.isObjectBindingPattern(param.name)) {
                const arg = createInfo(scopeResult, `param${index}`, `param${index}`, '', 'object');
                ts.forEachChild(param.name, field => {
                    if (ts.isBindingElement(field)) {
                        const name = field.name.getText(sourceFile);
                        arg.properties.set(name, createInfo(scopeResult, name, name, arg.name, 'primitive'));
                        findParemeterUsage(scopeResult, sourceFile, field.name.getText(sourceFile), node);
                    }
                });
                processFunctionParams(funcDef, arg.name, scopeResult);
            }
            else {
                throw new Error('unknown parameter type');
            }
        });
    }
    ts.forEachChild(node, visiting => visitAllFunctions(result, sourceFile, visiting));
}
function findParemeterUsage(props, sourceFile, paramName, node) {
    createInfo(props, paramName, paramName, '', 'primitive');
    if (node.body) {
        ts.forEachChild(node.body, visitingNode => findUsages(sourceFile, props, visitingNode));
    }
}
function findUsages(sourceFile, props, node) {
    if (ts.isPropertyAccessExpression(node)) {
        processPropertyAccessExpression(sourceFile, props, node);
    }
    else if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        processForEach(sourceFile, props, node);
    }
    else if (ts.isVariableDeclaration(node) && node.initializer && props.has(node.initializer.getText(sourceFile))) {
        processVariableDeclaration(sourceFile, props, node);
    }
    ts.forEachChild(node, visitingNode => findUsages(sourceFile, props, visitingNode));
}
function processPropertyAccessExpression(sourceFile, props, node) {
    const expression = node.expression.getText(sourceFile);
    if (props.has(expression)) {
        const item = props.get(expression);
        const propertyName = node.name.getText(sourceFile);
        const current = createInfo(props, propertyName, `${item.typeName}.${propertyName}`, item.typeName, 'primitive');
        item.properties.set(propertyName, current);
    }
    else {
        if (ts.isElementAccessExpression(node.expression)) {
            const obj = node.expression.expression.getText();
            if (props.has(obj)) {
                const item = props.get(obj);
                item.type = 'array';
                const subProp = node.name.getText();
                const containmentType = props.has(`${item.typeName}Containment`)
                    ? props.get(`${item.typeName}Containment`)
                    : createInfo(props, item.typeName, `${item.typeName}Containment`, item.typeName, 'object');
                const current = createInfo(props, subProp, `${item.typeName}.${subProp}`, item.typeName, 'primitive');
                containmentType.properties.set(subProp, current);
            }
        }
        else if (ts.isPropertyAccessExpression(node.expression)) {
            const obj = node.expression.expression.getText();
            if (props.has(obj)) {
                const item = props.get(obj);
                item.type = 'object';
                const subProp = node.name.getText();
                const current = createInfo(props, item.typeName, `${item.typeName}.${subProp}`, item.typeName, 'primitive');
                item.properties.set(subProp, current);
            }
        }
    }
}
function extractPathParts(path) {
    const parts = path.getText().split('.');
    return parts;
}
function processForEach(sourceFile, props, node) {
    const expression = node.expression;
    const forEachCalledOn = expression.expression;
    const forEachMethodName = expression.name.getText(sourceFile);
    if (forEachMethodName === 'forEach' && node.arguments.length > 0) {
        const pathParts = extractPathParts(forEachCalledOn);
        let property;
        let prev;
        do {
            const part = pathParts.shift();
            if (props.has(part)) {
                property = props.get(part);
                property.type = 'object';
            }
            else {
                if (property) {
                    prev = property;
                    property = createInfo(props, part, `${property.typeName}.${part}`, property.typeName, 'primitive');
                    prev.properties.set(part, property);
                }
                else {
                    break;
                }
            }
        } while (pathParts.length > 0);
        if (property) {
            property.type = 'array';
        }
        const callback = node.arguments[0];
        if (ts.isArrayTypeNode(forEachCalledOn) ||
            (ts.isIdentifier(forEachCalledOn) && property) ||
            (ts.isPropertyAccessExpression(forEachCalledOn) && property)) {
            if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
                const param = callback.parameters[0];
                if (ts.isIdentifier(param.name)) {
                    const paramName = param.name.getText(sourceFile);
                    createInfo(props, paramName, `${property.typeName}Containment`, property.typeName, 'object');
                }
                else if (ts.isObjectBindingPattern(param.name)) {
                    const subtype = createInfo(props, `${property.typeName}Containment`, `${property.typeName}Containment`, property.typeName, 'object');
                    ts.forEachChild(param.name, element => {
                        if (ts.isBindingElement(element)) {
                            const subProp = element.name.getText();
                            const current = createInfo(props, subProp, `${subtype.typeName}.${subProp}`, subtype.typeName, 'primitive');
                            subtype.properties.set(subProp, current);
                        }
                    });
                }
                ts.forEachChild(callback.body, (visitingNode) => findUsages(sourceFile, props, visitingNode));
            }
        }
    }
}
function processVariableDeclaration(sourceFile, props, node) {
    const property = node.initializer.getText(sourceFile);
    ts.forEachChild(node.name, element => {
        if (ts.isBindingElement(element)) {
            const subProp = element.name.getText();
            const prop = props.get(property);
            const current = createInfo(props, prop.typeName, `${prop.typeName}.${subProp}`, prop.typeName, 'primitive');
            prop.properties.set(subProp, current);
        }
    });
}
//# sourceMappingURL=typeinfer.js.map
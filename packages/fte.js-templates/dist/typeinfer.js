"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferTypesFromFunction = void 0;
const tslib_1 = require("tslib");
const ts = tslib_1.__importStar(require("typescript"));
function nodeToString(node, sourceFile) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const result = printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    console.log(result, ts.SyntaxKind[node.kind]);
    return result;
}
function inferTypesFromFunction(funcCode) {
    const sourceFile = ts.createSourceFile('temp.ts', funcCode, ts.ScriptTarget.ES2015, true);
    const result = [];
    function visit(node) {
        var _a, _b;
        nodeToString(node, sourceFile);
        if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
            let funcDef = { params: [], types: [] };
            result.push(funcDef);
            if (ts.isFunctionExpression(node) && ts.isPropertyAssignment(node.parent)) {
                funcDef.name = node.parent.name.getText();
            }
            if (ts.isFunctionDeclaration(node)) {
                funcDef.name = (_b = (_a = node.name) === null || _a === void 0 ? void 0 : _a.getText()) !== null && _b !== void 0 ? _b : '';
            }
            const list = node.parameters.map((param) => {
                const paramName = param.name.getText(sourceFile);
                if (param.type) {
                    nodeToString(param, sourceFile);
                    return [{ name: paramName, type: param.type.getText(sourceFile) }, []];
                }
                else {
                    return findUsage(param, sourceFile, paramName, node);
                }
            });
            list.forEach(([param, types]) => {
                funcDef.params.push(param);
                funcDef.types.push(...types);
            });
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return result;
}
exports.inferTypesFromFunction = inferTypesFromFunction;
const funcCode = `
import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "standalone.ts.njs"
    ],
    script: function(files, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'");
        for(let i = 0; i < files.length; i += 1){
            out.push("\n");
            out.push("  import " + (files[i].name.replaceAll(/[\s\.]/g, "_")) + " from '" + (files[i].path) + "'");
        }
        out.push("\n");
        out.push("\n");
        out.push("const templates = {");
        for(let i = 0; i < files.length; i += 1){
            out.push("\n");
            out.push("  '" + (files[i].name) + "': " + (files[i].name.replaceAll(/[\s\.]/g, "_")) + ",");
        }
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("function run<T>(context:T, name:string) => {\n");
        out.push("  return F.run(context, name)\n");
        out.push("}\n");
        out.push("export default run");
        return out.join("");
    },
    compile: function(this: TemplateBase) {},
    dependency: {}
};

`;
console.log(JSON.stringify(inferTypesFromFunction(funcCode), (_, value) => {
    if (value instanceof Set) {
        return [...value];
    }
    return value;
}, 2));
function findUsage(param, sourceFile, paramName, node) {
    nodeToString(param, sourceFile);
    const props = new Map();
    props.set(paramName, { name: paramName, parent: '', type: 'primitive', properties: new Set() });
    function findUsages(node) {
        if (ts.isPropertyAccessExpression(node)) {
            const expression = node.expression.getText(sourceFile);
            if (props.has(expression)) {
                const item = props.get(expression);
                item.properties.add(node.name.getText(sourceFile));
            }
            else {
                if (ts.isElementAccessExpression(node.expression)) {
                    const obj = node.expression.expression.getText();
                    debugger;
                    if (props.has(obj)) {
                        const item = props.get(obj);
                        item.type = 'array';
                        const subProp = node.name.getText();
                        const containmentType = props.has(`${item.name}Containment`)
                            ? props.get(`${item.name}Containment`)
                            : (props.set(`${item.name}Containment`, {
                                name: `${item.name}Containment`,
                                parent: item.name,
                                type: 'object',
                                properties: new Set(),
                            }),
                                props.get(`${item.name}Containment`));
                        containmentType.properties.add(subProp);
                        props.set(subProp, {
                            parent: item.name,
                            name: `${item.name}.${subProp}`,
                            type: 'primitive',
                            properties: new Set(),
                        });
                    }
                }
                else if (ts.isPropertyAccessExpression(node.expression)) {
                    debugger;
                }
                nodeToString(node, sourceFile);
            }
        }
        else if (ts.isVariableDeclaration(node) && node.initializer && props.has(node.initializer.getText(sourceFile))) {
            const property = node.initializer.getText(sourceFile);
            nodeToString(node, sourceFile);
            ts.forEachChild(node.name, element => {
                if (ts.isBindingElement(element)) {
                    const subProp = element.name.getText();
                    nodeToString(element, sourceFile);
                    const prop = props.get(property);
                    prop.properties.add(subProp);
                    props.set(subProp, {
                        parent: prop.name,
                        name: `${prop.name}.${subProp}`,
                        type: 'primitive',
                        properties: new Set(),
                    });
                }
            });
        }
        ts.forEachChild(node, findUsages);
    }
    node.body && ts.forEachChild(node.body, findUsages);
    return [props.get(paramName), Array.from(props.values()).filter(t => t.parent !== '')];
}
//# sourceMappingURL=typeinfer.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parser = tslib_1.__importStar(require("@babel/parser"));
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
function analyzeParamsTypes(code) {
    const ast = parser.parse(code, { plugins: ['typescript'], sourceType: 'script' });
    const paramsTypes = {};
    (0, traverse_1.default)(ast, {
        FunctionDeclaration(path) {
            var _a;
            const params = path.node.params;
            for (let i = 0; i < params.length; i++) {
                const param = params[i];
                let paramName = ensureName(param);
                if (param.type === 'Identifier') {
                    paramName = param.name;
                }
                else if (param.type === 'ObjectPattern') {
                    for (let j = 0; j < param.properties.length; j++) {
                        const property = param.properties[j];
                        if (property.type === 'ObjectProperty') {
                            paramName = property.value.name;
                        }
                        else if (property.type === 'RestElement') {
                            paramName = property.argument.name;
                        }
                    }
                }
                if (!paramName) {
                    continue;
                }
                const binding = path.scope.getBinding(paramName);
                if (!binding) {
                    paramsTypes[paramName] = 'primitive';
                    continue;
                }
                let usagePath = null;
                for (let j = 0; j < binding.referencePaths.length; j++) {
                    const refPath = binding.referencePaths[j];
                    if ((_a = refPath === null || refPath === void 0 ? void 0 : refPath.parentPath) === null || _a === void 0 ? void 0 : _a.isIdentifier({ name: paramName })) {
                        usagePath = refPath.parentPath;
                        break;
                    }
                }
                if (!usagePath) {
                    paramsTypes[paramName] = 'primitive';
                }
                else if (usagePath.isArrayExpression()) {
                    paramsTypes[paramName] = 'array';
                }
                else if (usagePath.isObjectExpression()) {
                    paramsTypes[paramName] = 'object';
                }
                else {
                    paramsTypes[paramName] = 'primitive';
                }
            }
        },
    });
    return paramsTypes;
}
const code = `
function foo(a, b, {c, d}, ...rest) {
   c = [a, b];
   d = { e: a, f: b };
  console.log(a + b);
}
`;
console.log(analyzeParamsTypes(code));
//# sourceMappingURL=in.js.map
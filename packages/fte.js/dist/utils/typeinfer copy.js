"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts = tslib_1.__importStar(require("typescript"));
const codeString = `
  function add(x, y) {
    return x + y;
  }

  const result = add(1, 2);
`;
const sourceFile = ts.createSourceFile('temp.js', codeString, ts.ScriptTarget.Latest, true);
const options = { allowJs: true, checkJs: true };
const program = ts.createProgram([sourceFile.fileName], options);
function visitNode(node) {
    var _a;
    if (ts.isVariableDeclaration(node)) {
        const checker = program.getTypeChecker();
        const type = checker.getTypeAtLocation(node);
        const typeName = checker.typeToString(type);
        console.log(`Variable '${node.name.getText()}' has inferred type '${typeName}'`);
    }
    if (ts.isFunctionDeclaration(node)) {
        const checker = program.getTypeChecker();
        const signature = checker.getSignatureFromDeclaration(node);
        if (signature) {
            const signatureString = checker.signatureToString(signature);
            console.log(`Function '${(_a = node.name) === null || _a === void 0 ? void 0 : _a.getText()}' has inferred signature '${signatureString}'`);
        }
    }
    ts.forEachChild(node, visitNode);
}
visitNode(sourceFile);
//# sourceMappingURL=typeinfer%20copy.js.map
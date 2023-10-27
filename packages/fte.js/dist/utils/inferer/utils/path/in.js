"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parser_1 = require("@babel/parser");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const buildExpressionNext_1 = require("./buildExpressionNext");
const fs_1 = tslib_1.__importDefault(require("fs"));
const makeAST_1 = require("../../types/makeAST");
const code = `r = -a ?? param?.some[(1n +1 + m(new Date())) > 10? 10: true].name?.(m(/some!/ig),e.name(a+1, new Regex('some','ig')))['super name']?.nice((++a + -1 + b++) * c + {name: 1, ...{name: some, code: 10}}, [some, [,some,],...other, some.go(true), ()=>{return 1}, ()=>true]);`;
const ast = (0, parser_1.parse)(code);
function getExpressionStatement() {
    let expression = null;
    (0, traverse_1.default)(ast, {
        Program(path) {
            expression = path;
            path.stop();
        },
    });
    return expression;
}
const expression = getExpressionStatement();
if (!expression)
    throw new Error('no expression');
fs_1.default.writeFileSync('ast0.json', JSON.stringify(expression.node, null, 2));
const dot = (0, buildExpressionNext_1.buildExpression)(ast);
fs_1.default.writeFileSync('ast.dot', dot.join(''));
const astExpression = (0, makeAST_1.makeAST)(ast);
console.log(JSON.stringify(astExpression, null, 2));
fs_1.default.writeFileSync('astExpr.json', JSON.stringify(astExpression, null, 2));
//# sourceMappingURL=in.js.map
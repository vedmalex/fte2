import * as t from '@babel/types';
export type Expression = {
    type: string;
    optional?: boolean;
    value?: string | number | boolean;
    children: Array<Expression>;
};
export declare function buildExpressionAST(ast: t.Node): Expression;
//# sourceMappingURL=buildExpressionAST%20copy.d.ts.map
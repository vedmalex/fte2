import * as t from '@babel/types';
export type Expression = {
    type: string;
    optional?: boolean;
    children: Array<Part | Expression>;
};
export type Part = {
    value?: string | number | boolean;
    type: string;
    optional?: boolean;
};
export declare function buildAstObject(ast: t.Node): Expression;
//# sourceMappingURL=buildAstObject%20copy.d.ts.map
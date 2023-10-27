import * as t from '@babel/types';
export type Expression = {
    nodeId: number;
    type: string;
    optional?: boolean;
    value?: string | number | boolean;
    children: Array<Expression>;
};
export type TypeInfo = {
    id: number;
    type: string;
    optional?: boolean;
    value: string | number | boolean | Array<TypeInfo>;
    args?: number;
    properties?: Record<number, boolean>;
    callee?: Array<TypeInfo>;
};
export type FunctionInfo = {
    id: number;
    type: string;
    optional?: boolean;
    value: string;
    args: number;
    callee: Array<TypeInfo>;
};
export declare function makeAST(ast: t.Node): {
    root: Expression;
    calls: FunctionInfo[];
    members: TypeInfo[][];
    ids: Record<number, TypeInfo>;
};
//# sourceMappingURL=makeAST%20copy.d.ts.map
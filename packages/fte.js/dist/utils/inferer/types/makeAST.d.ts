import * as t from '@babel/types';
import { Info } from './Info';
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
    properties?: Set<number>;
    callee?: Array<TypeInfo>;
};
export type IdentifierInfo = {
    id: number;
    type: 'call' | 'new' | 'object' | 'array' | 'Identifier' | 'NumericLiteral' | 'BooleanLiteral' | 'BigIntLiteral' | 'StringLiteral' | 'NullLiteral' | 'RegexLiteral' | 'RegExpLiteral' | 'TemplateLiteral' | 'ThisExpression';
    optional?: boolean;
    value: string | number | boolean;
    args?: number;
    properties?: Set<number>;
    callee?: Array<TypeInfo>;
    root?: number;
    typeName?: string;
    name: string;
};
export type FunctionInfo = {
    id: number;
    type: 'call' | 'new';
    optional?: boolean;
    value: string;
    args: number;
    callee: Array<TypeInfo>;
};
export declare function makeAST(ast: t.Node): Map<string, Info>;
//# sourceMappingURL=makeAST.d.ts.map
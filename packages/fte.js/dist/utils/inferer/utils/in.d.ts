export type Part = {
    name: string | number;
    type: 'index' | 'property' | 'call' | 'expression';
    optional: boolean;
    children?: Part[];
    arguments?: Part[];
};
export type Property = {
    name: string;
    type: 'property';
    optional: boolean;
};
export declare function isProperty(node: unknown): node is Property;
export type Index = {
    name: number | string;
    type: 'index';
    optional: boolean;
};
export declare function isIndex(node: unknown): node is Index;
export type Call = {
    name: string;
    type: 'call';
    optional: boolean;
    arguments: Part[];
};
export declare function isCall(node: unknown): node is Call;
export type Expression = {
    name: string;
    type: 'expression';
    optional: boolean;
    children: Part[];
};
export declare function isExpression(node: unknown): node is Expression;
//# sourceMappingURL=in.d.ts.map
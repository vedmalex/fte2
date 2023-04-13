type FunctionDefinition = {
    name: string;
    params: Array<Info>;
    types: Array<Info>;
};
export declare function inferTypesFromFunction(funcCode: string): Array<FunctionDefinition>;
type Info = {
    parent: string;
    name: string;
    type: 'object' | 'array' | 'primitive' | 'function';
    properties: Set<string>;
};
export {};
//# sourceMappingURL=typeinfer.d.ts.map
export type Info = {
    parent: Info;
    children: Map<string, Info>;
    typeName: string;
    name: string;
    type: 'object' | 'array' | 'primitive' | 'function';
    properties: Map<string, Info>;
};
//# sourceMappingURL=Info.d.ts.map
import { Scope } from '@babel/traverse';
export type Info = {
    parent: Info;
    scope: Scope;
    children: Map<string, Info>;
    typeName: string;
    name: string;
    type: 'object' | 'array' | 'primitive' | 'function';
    properties: Map<string, Info>;
};
//# sourceMappingURL=Info.d.ts.map
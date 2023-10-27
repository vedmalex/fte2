import { Scope } from '@babel/traverse';
export type Info = {
    type: 'object' | 'array' | 'primitive' | 'function' | 'min';
    name: string;
    typeName: string;
    properties: Map<string, Info>;
    children: Map<string, Info>;
    parent?: Info;
    optional?: boolean;
    args?: number;
    scope?: Scope;
};
export declare function createMinInfo({ name, typeName, type }: {
    name: string;
    typeName?: string;
    type: Info['type'];
}): Info;
//# sourceMappingURL=Info.d.ts.map
import { Info } from './Info';
export declare class TSBaseType {
    type: 'object' | 'array' | 'primitive' | 'function';
    constructor(type: 'object' | 'array' | 'primitive' | 'function');
    toString(): string;
}
export declare class TSPrimitive extends TSBaseType {
    name: string;
    constructor(name: string);
    toString(): string;
}
export declare class TSFunction extends TSBaseType {
    name: string;
    params: Array<TSBaseType>;
    constructor(name: string, params: Array<TSBaseType>);
    toString(): string;
}
export declare class TSArray extends TSBaseType {
    name: string;
    children: TSBaseType;
    constructor(name: string, children: TSBaseType);
    toString(): string;
}
export declare class TSObject extends TSBaseType {
    name: string;
    properties: Array<TSBaseType>;
    constructor(name: string, properties: Array<TSBaseType>);
    toString(): string;
}
export declare function processInfo(info: Info): TSBaseType;
export declare function inferTypesFromFunction(funcCode: string): Map<string, Info>;
//# sourceMappingURL=typeinfer.d.ts.map
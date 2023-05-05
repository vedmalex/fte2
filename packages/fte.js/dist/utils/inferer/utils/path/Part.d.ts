export type Part = {
    name: string | number | boolean;
    type: 'index' | 'property' | 'call' | 'expression';
    optional: boolean;
    children?: Part[];
    arguments?: Part[];
};
export declare function isPart(p: any): p is Part;
//# sourceMappingURL=Part.d.ts.map
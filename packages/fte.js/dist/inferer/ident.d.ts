export type IdentOptions = {
    knownGlobals?: Array<string>;
};
export declare function findUnusedAndGlobalVariables(code: any, options?: IdentOptions): {
    unusedVariables: Set<string>;
    globalVariables: Map<string, number>;
    referencedVariables: Map<string, number>;
    declaredVariables: Map<string, number>;
};
export declare function processUnusedAndGlobalVariables(code: any, options?: IdentOptions): {
    unusedVariables: Set<string>;
    globalVariables: Map<string, number>;
    referencedVariables: Map<string, number>;
    declaredVariables: Map<string, number>;
};
//# sourceMappingURL=ident.d.ts.map
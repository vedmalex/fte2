export type TypeInferConfig = {
    cwd?: string;
    allowed: Array<string>;
    notallowed?: Array<string>;
    ignore?: Array<string>;
    include?: Array<string>;
    knownGlobals?: Array<string>;
    applyJsdoc?: boolean;
    globalsFile?: string;
    exportFunctions?: Array<string>;
    reportFile?: string;
};
export type InferredType = string;
export type FunctionInfo = {
    name?: string;
    params: Record<string, Set<InferredType>>;
    returns: Set<InferredType>;
    spanStart: number;
};
export declare function inferTypesInFiles(config: TypeInferConfig): {
    globalsFile: string;
    report: any;
};
export declare function inferTypesInSource(source: string, knownGlobals?: string[]): {
    variables: Record<string, InferredType>;
};
//# sourceMappingURL=type-infer.d.ts.map
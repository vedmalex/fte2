type HostLanguage = 'html' | 'markdown' | 'javascript' | 'typescript';
type DualExtractionOptions = {
    hostLanguage?: HostLanguage;
    instructionLanguage?: 'javascript' | 'typescript';
};
export declare function extractTemplateCodeView(originalText: string, ast: any, options?: DualExtractionOptions): {
    code: string;
};
export declare function extractInstructionCodeView(originalText: string, ast: any, options?: DualExtractionOptions): {
    code: string;
};
export {};
//# sourceMappingURL=formatterCore.d.ts.map
export type SimpleDiagnostic = {
    severity: 'error' | 'warning' | 'hint';
    message: string;
};
export declare function computeDiagnosticsFromText(text: string, workspaceRoots?: string[]): SimpleDiagnostic[];
//# sourceMappingURL=diagnosticsCore.d.ts.map
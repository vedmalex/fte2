import { type Diagnostic, type TextDocument } from 'vscode-languageserver/node';
export type FileIndexLite = {
    requireAs: Map<string, string>;
    path?: string;
};
export declare function computeDiagnostics(doc: TextDocument, deps: {
    parseContent: (text: string) => any;
    getExtendTargetFrom: (text: string, docUri?: string) => string | null;
    fileIndex: Map<string, FileIndexLite>;
    workspaceRoots: string[];
    logError?: (e: unknown, context: string) => void;
}): Diagnostic[];
//# sourceMappingURL=diagnostics.d.ts.map
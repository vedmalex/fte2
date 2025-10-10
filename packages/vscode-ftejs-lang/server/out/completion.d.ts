import { type CompletionItem, type Position } from 'vscode-languageserver/node';
export declare function getCompletions(docText: string, docUri: string, position: Position, deps: {
    usageDocs: {
        functions: Record<string, string>;
        directives: Record<string, string>;
    };
    parseContent: (text: string) => any;
    getExtendTargetFrom: (text: string, docUri?: string) => string | null;
    fileIndex: Map<string, {
        blocks: Map<string, any>;
    }>;
}): CompletionItem[];
//# sourceMappingURL=completion.d.ts.map
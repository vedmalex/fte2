import { Location, Position } from 'vscode-languageserver/node';
export declare function getDefinition(docText: string, docUri: string, position: Position, deps: {
    parseContent: (text: string) => any;
    getExtendTargetFrom: (text: string, docUri?: string) => string | null;
    fileIndex: Map<string, {
        requireAs: Map<string, string>;
        path?: string;
    }>;
    workspaceRoots: string[];
}): Location | null;
export declare function getReferences(docText: string, docUri: string, position: Position, deps: {
    fileIndex: Map<string, {
        path?: string;
    }>;
}): Location[];
export declare function getHover(docText: string, position: Position, deps: {
    usageDocs: {
        functions: Record<string, string>;
        directives: Record<string, string>;
    };
    parseContent: (text: string) => any;
}): {
    contents: {
        kind: 'markdown' | 'plaintext';
        value: string;
    };
} | null;
//# sourceMappingURL=navigation.d.ts.map
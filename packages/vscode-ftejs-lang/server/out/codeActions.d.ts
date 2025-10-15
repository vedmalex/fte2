import { type Diagnostic, Range } from 'vscode-languageserver/node.js';
import type { TextDocument } from 'vscode-languageserver-textdocument';
export declare function buildCodeActions(params: {
    text: string;
    uri: string;
    range: Range;
    diagnostics: Diagnostic[];
    doc: TextDocument;
    indentSize: number;
    parseContent: (text: string) => any;
}): any[];
//# sourceMappingURL=codeActions.d.ts.map
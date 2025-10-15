import { Position } from 'vscode-languageserver/node.js';
export type AstNode = {
    type: string;
    pos: number;
    start?: string;
    end?: string;
    name?: string;
    blockName?: string;
    slotName?: string;
    content?: string;
};
export type OpenBlock = {
    trimmedOpen: boolean;
    trimmedClose: boolean;
    name: string;
    index: number;
};
export declare function computeOpenBlocksFromAst(nodes: AstNode[], upTo?: number): OpenBlock[];
export declare function buildEndTagFor(item: OpenBlock): string;
export declare function computePairsFromAst(nodes: AstNode[]): {
    open: AstNode;
    close?: AstNode;
}[];
export declare function walkAstNodes(ast: any, callback: (node: any) => void | boolean): void;
export declare function getTemplatePathVariants(basePath: string): string[];
export declare function posFromOffset(text: string, offset: number): Position;
export declare function getExtendTargetFrom(text: string, docUri: string | undefined, parseContent: (t: string) => any): string | null;
export declare function resolveTemplatePath(rel: string, docUri?: string): string | null;
export declare function resolveTemplateRel(rel: string, docUri: string | undefined, workspaceRoots: string[]): string | null;
export declare function isTemplateTagLine(line: string): boolean;
export declare function stripStringsAndComments(line: string): string;
export declare function computeJsCodeDelta(line: string): {
    dedentFirst: number;
    delta: number;
};
export declare function collectAllASTSegments(ast: any): any[];
export type BlockInfo = {
    name: string;
    startPos: number;
    endPos: number;
};
export type SlotInfo = {
    name: string;
    startPos: number;
    endPos: number;
};
export declare function extractBlockAndSlotSymbols(ast: any): {
    blocks: BlockInfo[];
    slots: SlotInfo[];
};
export declare function computeOpenBlocksFromText(text: string, upTo: number | undefined, parseContent: (t: string) => any): OpenBlock[];
export declare function validateStructureAndCollectErrors(text: string, parseContent: (t: string) => any): {
    unmatchedEnds: Array<{
        pos: number;
        len: number;
    }>;
    unclosed: Array<{
        name: string;
        pos: number;
    }>;
    parserErrors: Array<{
        pos: number;
        message: string;
    }>;
};
export declare function collectUnknownContentRefs(text: string, docUri: string | undefined, parseContent: (t: string) => any, getExtendTargetFrom: (t: string, uri?: string) => string | null): Array<{
    index: number;
    length: number;
    name: string;
}>;
export declare function collectUnresolvedPartials(text: string, docUri: string | undefined, parseContent: (t: string) => any, fileIndex: Map<string, {
    requireAs: Map<string, string>;
}>, workspaceRoots: string[]): Array<{
    index: number;
    length: number;
    key: string;
}>;
export declare function collectDuplicateDeclarations(text: string, parseContent: (t: string) => any): Array<{
    name: string;
    pos: number;
    length: number;
}>;
export declare function collectTrimWhitespaceHints(text: string): Array<{
    start: number;
    end: number;
    kind: 'left' | 'right';
}>;
export declare function validateDirectivesInText(text: string): Array<{
    start: number;
    end: number;
    message: string;
    severity: 'warning' | 'error';
}>;
export declare function collectExtendParentIssues(text: string, docUri: string | undefined, parseContent: (t: string) => any, workspaceRoots: string[]): Array<{
    start: number;
    end: number;
    message: string;
    severity: 'error';
}>;
export declare function collectUnknownContentAgainstParent(text: string, docUri: string | undefined, parseContent: (t: string) => any, getExtendTargetFrom: (t: string, uri?: string) => string | null): Array<{
    index: number;
    length: number;
    name: string;
}>;
export declare function collectChildBlocksMissingInParent(text: string, docUri: string | undefined, parseContent: (t: string) => any, getExtendTargetFrom: (t: string, uri?: string) => string | null): Array<{
    start: number;
    end: number;
    name: string;
}>;
//# sourceMappingURL=astUtils.d.ts.map
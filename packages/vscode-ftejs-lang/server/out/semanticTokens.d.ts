export declare const semanticTokenTypes: readonly ["namespace", "type", "class", "enum", "interface", "struct", "typeParameter", "parameter", "variable", "property", "enumMember", "event", "function", "method", "macro", "keyword", "modifier", "comment", "string", "number", "regexp", "operator"];
export type TokenType = (typeof semanticTokenTypes)[number];
export declare const semanticTokenModifiers: readonly ["declaration", "definition", "readonly", "static", "deprecated", "abstract", "async", "modification", "documentation", "defaultLibrary"];
export type TokenModifier = (typeof semanticTokenModifiers)[number];
export type BuiltToken = {
    line: number;
    char: number;
    length: number;
    type: TokenType;
    modifiers?: TokenModifier[];
};
export declare function buildSemanticTokensFromText(text: string): BuiltToken[];
export declare function buildSemanticTokensFromAst(text: string, ast: any): BuiltToken[];
//# sourceMappingURL=semanticTokens.d.ts.map
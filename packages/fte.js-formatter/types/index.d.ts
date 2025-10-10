export interface FormatOptions {
    indent?: number | 'tab';
    ensureFinalNewline?: boolean;
    trimTrailingWhitespace?: boolean;
}
export type LintSeverity = 'error' | 'warning' | 'info';
export interface LintIssue {
    ruleId: string;
    message: string;
    line: number;
    column: number;
    severity: LintSeverity;
    fix?: {
        description: string;
    };
}
export declare function format(input: string, options?: FormatOptions): string;
export declare function lint(input: string): LintIssue[];
//# sourceMappingURL=index.d.ts.map
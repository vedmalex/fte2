type LintIssue = {
    ruleId: string;
    message: string;
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
    fix?: {
        description: string;
    };
};
export declare function lintText(input: string): LintIssue[];
export {};
//# sourceMappingURL=lint.d.ts.map
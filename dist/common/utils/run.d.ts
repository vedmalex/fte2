import templates from '../../templates';
export declare function run<T>(context: T, template: keyof typeof templates): string | {
    name: string;
    content: string;
}[];
//# sourceMappingURL=run.d.ts.map
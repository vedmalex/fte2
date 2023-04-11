import { DefaultFactoryOption, SlotsHash, TemplateConfig, TemplateFactoryBase, TemplateBase } from "fte.js-base";
import templates from "fte.js-templates";
declare class StandaloneTemplate<T extends DefaultFactoryOption> extends TemplateBase<T> {
    compile(): void;
}
declare class TemplateFactoryStandalone<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    private templates;
    constructor(templates: Record<string, TemplateConfig<OPTIONS>>);
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string): StandaloneTemplate<OPTIONS>;
    preload(): void;
    run<T>(context: T, name: string): string | Array<{
        name: string;
        content: string;
    }>;
    runPartial<T, OPTIONS extends DefaultFactoryOption>({ context, name, slots, options }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): string;
}
declare const F: TemplateFactoryStandalone<import("fte.js-base").DefaultFactoryOption>;
declare function compileFull(content: Buffer | string): string | {
    name: string;
    content: string;
}[];
declare function compileLight(content: Buffer | string): string | {
    name: string;
    content: string;
}[];
declare function compileTs(content: Buffer | string): string | {
    name: string;
    content: string;
}[];
declare function parseFile(content: Buffer | string): import("fte.js-parser").CodeBlock;
declare function run(context: any, template: keyof typeof templates): string | {
    name: string;
    content: string;
}[];
export { F, compileFull, compileLight, compileTs, parseFile, run, StandaloneTemplate, TemplateFactoryStandalone };
//# sourceMappingURL=index.d.ts.map
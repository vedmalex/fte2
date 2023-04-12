import { RunPartialContext, DefaultFactoryOption, TemplateConfig, TemplateFactoryBase, ChunkContent, TemplateBase } from "fte.js-base";
declare class TemplateBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateBase<OPTIONS> {
    compile(): void;
}
declare class TemplateFactoryBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string, absPath?: boolean): TemplateBrowser<OPTIONS>;
    run<T>(context: T, name: string): string | Array<ChunkContent>;
    runPartial<T>({ context, name, options, slots }: RunPartialContext<T, OPTIONS>): string;
}
export { TemplateFactoryBrowser as Factory, TemplateBrowser as Template };
export { TemplateBase } from 'fte.js-base';
//# sourceMappingURL=index.module.d.ts.map
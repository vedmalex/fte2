import { RunPartialContext, DefaultFactoryOption, TemplateConfig, TemplateFactoryBase, ChunkContent } from 'fte.js-base';
import { TemplateBrowser } from './TemplateBrowser';
export declare let global: {
    fte<OPTIONS extends DefaultFactoryOption>(filename: any): TemplateConfig<OPTIONS>;
};
export declare class TemplateFactoryBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string, absPath?: boolean): TemplateBrowser<OPTIONS>;
    run<T>(context: T, name: string): string | Array<ChunkContent>;
    runPartial<T>({ context, name, options, slots }: RunPartialContext<T, OPTIONS>): string;
}
//# sourceMappingURL=TemplateFactoryBrowser.d.ts.map
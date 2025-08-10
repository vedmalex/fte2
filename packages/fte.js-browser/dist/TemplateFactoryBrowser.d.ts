import { RunPartialContext, DefaultFactoryOption, TemplateConfig, TemplateFactoryBase, ChunkContent } from 'fte.js-base';
import { TemplateBrowser } from './TemplateBrowser';
export declare class TemplateFactoryBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string, absPath?: boolean): TemplateBrowser<OPTIONS>;
    run<T>(context: T, name: string): string | Array<ChunkContent>;
    runAsync<T>(context: T, name: string): Promise<string | Array<ChunkContent>>;
    runPartial<T>({ context, name, options, slots }: RunPartialContext<T, OPTIONS>): string;
    runPartialAsync<T>({ context, name, options, slots }: RunPartialContext<T, OPTIONS>): Promise<string>;
}
//# sourceMappingURL=TemplateFactoryBrowser.d.ts.map
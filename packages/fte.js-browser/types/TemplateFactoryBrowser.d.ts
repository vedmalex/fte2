import { type ChunkContent, type DefaultFactoryOption, type PartialResult, type RunPartialContext, type TemplateConfig, TemplateFactoryBase } from 'fte.js-base';
import { TemplateBrowser } from './TemplateBrowser';
export declare class TemplateFactoryBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string, absPath?: boolean): TemplateBrowser<OPTIONS>;
    run<T>(context: T, name: string): string | Array<ChunkContent>;
    runAsync<T>(context: T, name: string): Promise<string | Array<ChunkContent>>;
    runStream<T>(context: T, name: string): AsyncIterable<string> | string | Array<ChunkContent | {
        name: string;
        content: AsyncIterable<string>;
    }>;
    runPartial<T>({ context, name, options, slots, }: RunPartialContext<T, OPTIONS>): PartialResult;
    runPartialAsync<T>({ context, name, options, slots, }: RunPartialContext<T, OPTIONS>): Promise<PartialResult>;
}
//# sourceMappingURL=TemplateFactoryBrowser.d.ts.map
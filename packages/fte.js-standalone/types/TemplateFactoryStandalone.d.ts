import { type DefaultFactoryOption, type PartialResult, type SlotsHash, type TemplateConfig, TemplateFactoryBase } from 'fte.js-base';
import { StandaloneTemplate } from './StandaloneTemplate';
export declare class TemplateFactoryStandalone<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    private templates;
    constructor(templates: Record<string, TemplateConfig<OPTIONS>>);
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string): StandaloneTemplate<OPTIONS>;
    preload(): void;
    run<T>(context: T, name: string): string | Array<{
        name: string;
        content: string;
    }>;
    runAsync<T>(context: T, name: string): Promise<string | Array<{
        name: string;
        content: string;
    }>>;
    runStream<T>(context: T, name: string): AsyncIterable<string> | string | Array<{
        name: string;
        content: string;
    } | {
        name: string;
        content: AsyncIterable<string>;
    }>;
    runPartial<T, OPTIONS extends DefaultFactoryOption>({ context, name, slots, options, }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): PartialResult;
    runPartialAsync<T, OPTIONS extends DefaultFactoryOption>({ context, name, slots, options, }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): Promise<PartialResult>;
}
//# sourceMappingURL=TemplateFactoryStandalone.d.ts.map
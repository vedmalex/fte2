import { DefaultFactoryOption, SlotsHash, TemplateConfig, TemplateFactoryBase } from 'fte.js-base';
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
    runPartial<T, OPTIONS extends DefaultFactoryOption>({ context, name, slots, options, }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): string;
    runPartialAsync<T, OPTIONS extends DefaultFactoryOption>({ context, name, slots, options, }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): Promise<string>;
}
//# sourceMappingURL=TemplateFactoryStandalone.d.ts.map
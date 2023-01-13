import { TemplateBrowser } from './template';
import { TemplateFactoryBase } from '../common/factory';
import { HashType, SlotsHash } from '../common/interfaces';
import { TemplateConfig } from '../common/interfaces';
import { DefaultFactoryOption } from '../common/interfaces';
export declare class TemplateFactoryStandalone<T extends DefaultFactoryOption> extends TemplateFactoryBase<T> {
    private templates;
    constructor(templates: Record<string, TemplateConfig<T>>);
    resolveTemplateConfig(fileName: string): TemplateConfig<T>;
    load(fileName: string): TemplateBrowser<T>;
    preload(): void;
    run<T extends Record<string, any>>(context: HashType, name: string): string | Array<{
        name: string;
        content: string;
    }>;
    runPartial<T extends Record<string, any>>({ context, name, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options?: T;
        slots?: SlotsHash;
    }): string;
}
//# sourceMappingURL=factory.d.ts.map
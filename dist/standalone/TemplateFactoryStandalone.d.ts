import { DefaultFactoryOption } from '../common/types/DefaultFactoryOption';
import { SlotsHash } from '../common/types/SlotsHash';
import { TemplateConfig } from '../common/types/TemplateConfig';
import { TemplateFactoryBase } from '../common/types/TemplateFactoryBase';
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
    runPartial<T, OPTIONS extends DefaultFactoryOption>({ context, name, slots, options, }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): string;
}
//# sourceMappingURL=TemplateFactoryStandalone.d.ts.map
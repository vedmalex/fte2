import { TemplateBrowser } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { HashType, SlotsHash } from './../common/interfaces';
import { TemplateConfig } from './../common/interfaces';
import { DefaultFactoryOption } from '../common/interfaces';
export declare class TemplateFactoryBrowser<T extends DefaultFactoryOption> extends TemplateFactoryBase<T> {
    resolveTemplateConfig(fileName: string): TemplateConfig<T>;
    load(fileName: string, absPath?: boolean): TemplateBrowser<T>;
    run<T extends Record<string, any>>({ context, name, absPath, options, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options: T;
        slots?: SlotsHash;
    }): string | Array<object>;
    runPartial<T extends Record<string, any>>({ context, name, absPath, options, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options: T;
        slots?: SlotsHash;
    }): string;
}
//# sourceMappingURL=factory.d.ts.map
import { TemplateBrowser } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { HashType } from './../common/interfaces';
import { TemplateConfig } from './../common/interfaces';
export declare class TemplateFactoryBrowser extends TemplateFactoryBase {
    resolveTemplateConfig(fileName: string): TemplateConfig;
    load(fileName: string, absPath?: boolean): TemplateBrowser;
    run(context: HashType, name: string, absPath?: boolean): string | Array<object>;
    runPartial(context: HashType, name: string, absPath?: boolean): string;
}
//# sourceMappingURL=factory.d.ts.map
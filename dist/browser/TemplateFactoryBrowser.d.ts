import { RunPartialContext } from '../common/types/RunPartialContext';
import { DefaultFactoryOption } from '../common/types/DefaultFactoryOption';
import { TemplateConfig } from '../common/types/TemplateConfig';
import { TemplateFactoryBase } from '../common/types/TemplateFactoryBase';
import { TemplateBrowser } from './TemplateBrowser';
import { ChunkContent } from '../common/types/ChunkContent';
export declare class TemplateFactoryBrowser<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    resolveTemplateConfig(fileName: string): TemplateConfig<OPTIONS>;
    load(fileName: string, absPath?: boolean): TemplateBrowser<OPTIONS>;
    run<T>(context: T, name: string): string | Array<ChunkContent>;
    runPartial<T>({ context, name, options, slots }: RunPartialContext<T, OPTIONS>): string;
}
//# sourceMappingURL=TemplateFactoryBrowser.d.ts.map
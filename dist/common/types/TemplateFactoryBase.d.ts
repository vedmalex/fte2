import { TemplateBase } from './TemplateBase';
import { FactoryConfig } from './FactoryConfig';
import { BlockContent } from './BlockContent';
import { DefaultFactoryOption } from './DefaultFactoryOption';
import { HashTypeGeneric } from './HashTypeGeneric';
import { SlotsHash } from './SlotsHash';
import { RunPartialContext } from './RunPartialContext';
export declare abstract class TemplateFactoryBase<OPTIONS extends DefaultFactoryOption> {
    ext: Array<string>;
    cache: HashTypeGeneric<TemplateBase<OPTIONS>>;
    root?: Array<string>;
    options: OPTIONS;
    watch: boolean;
    constructor(config?: Partial<FactoryConfig<OPTIONS>>);
    register(tpl: TemplateBase<OPTIONS>, fileName?: string): TemplateBase<OPTIONS>;
    ensure(fileName: string, absPath?: boolean): TemplateBase<OPTIONS>;
    blockContent(tpl: TemplateBase<OPTIONS>, slots?: SlotsHash): BlockContent<OPTIONS>;
    preload(fileName?: string): void;
    load(fileName: string, absPath?: boolean): TemplateBase<OPTIONS>;
    run<T>(context: T, name: string): string | Array<{
        name: string;
        content: string;
    }>;
    runPartial<CONTEXT>(_: RunPartialContext<CONTEXT, OPTIONS>): string;
}
//# sourceMappingURL=TemplateFactoryBase.d.ts.map
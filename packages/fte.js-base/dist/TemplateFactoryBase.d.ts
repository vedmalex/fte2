import { TemplateBase } from './TemplateBase';
import { FactoryConfig } from './types/FactoryConfig';
import { BlockContent } from './types/BlockContent';
import { DefaultFactoryOption } from './types/DefaultFactoryOption';
import { HashTypeGeneric } from './types/HashTypeGeneric';
import { SlotsHash } from './types/SlotsHash';
import { RunPartialContext } from './types/RunPartialContext';
export declare abstract class TemplateFactoryBase<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
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
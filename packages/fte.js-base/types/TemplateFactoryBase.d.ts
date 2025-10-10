import type { TemplateBase } from './TemplateBase';
import type { BlockContent } from './types/BlockContent';
import type { DefaultFactoryOption } from './types/DefaultFactoryOption';
import type { FactoryConfig } from './types/FactoryConfig';
import type { HashTypeGeneric } from './types/HashTypeGeneric';
import type { RunPartialContext } from './types/RunPartialContext';
import type { SlotsHash } from './types/SlotsHash';
import type { SourceMapOptions } from './types/source-map';
export declare abstract class TemplateFactoryBase<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
    ext: Array<string>;
    cache: HashTypeGeneric<TemplateBase<OPTIONS>>;
    root?: Array<string>;
    options: OPTIONS & SourceMapOptions;
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
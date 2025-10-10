import type { TemplateFactoryBase } from './TemplateFactoryBase';
import type { BlockRunFunction } from './types/BlockRunFunction';
import type { BlocksHash } from './types/BlocksHash';
import type { DefaultFactoryOption } from './types/DefaultFactoryOption';
import type { HashTypeGeneric } from './types/HashTypeGeneric';
import type { TemplateConfig } from './types/TemplateConfig';
export declare class TemplateBase<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
    parent?: string;
    blocks?: BlocksHash;
    slots?: BlocksHash;
    aliases: HashTypeGeneric<string>;
    alias: Array<string>;
    dependency?: HashTypeGeneric<boolean>;
    absPath?: string;
    name?: string;
    chunks: string;
    srcCode: string;
    script: BlockRunFunction;
    factory: TemplateFactoryBase<OPTIONS>;
    constructor(config: TemplateConfig<OPTIONS>);
    mergeParent(src: TemplateBase<OPTIONS>): void;
    compile(): void;
}
//# sourceMappingURL=TemplateBase.d.ts.map
import { TemplateFactoryBase } from './TemplateFactoryBase';
import { BlocksHash } from './types/BlocksHash';
import { TemplateConfig } from './types/TemplateConfig';
import { BlockRunFunction } from './types/BlockRunFunction';
import { HashTypeGeneric } from './types/HashTypeGeneric';
import { DefaultFactoryOption } from './types/DefaultFactoryOption';
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
import { TemplateFactoryBase } from './factory';
import { BlocksHash, HashTypeGeneric, BlockRunFunction, TemplateConfig, DefaultFactoryOption } from './interfaces';
export declare class TemplateBase<T extends DefaultFactoryOption> {
    parent: string;
    blocks: BlocksHash;
    slots: BlocksHash;
    aliases: HashTypeGeneric<string>;
    alias: Array<string>;
    dependency: HashTypeGeneric<boolean>;
    absPath: string;
    name: string;
    srcCode: string;
    script: BlockRunFunction;
    factory: TemplateFactoryBase<T>;
    constructor(config: TemplateConfig<T>);
    mergeParent(src: TemplateBase<T>): void;
    compile(): void;
}
//# sourceMappingURL=template.d.ts.map
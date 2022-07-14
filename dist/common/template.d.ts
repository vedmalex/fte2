import { TemplateFactoryBase } from './factory';
import { BlocksHash, HashTypeGeneric, BlockRunFunction, TemplateConfig, DefaultFactoryOption } from './interfaces';
export declare class TemplateBase<T extends DefaultFactoryOption> {
    parent: string;
    blocks: BlocksHash<T>;
    slots: BlocksHash<T>;
    aliases: HashTypeGeneric<string>;
    alias: Array<string>;
    dependency: HashTypeGeneric<boolean>;
    absPath: string;
    name: string;
    srcCode: string;
    script: BlockRunFunction<T>;
    factory: TemplateFactoryBase<T>;
    constructor(config: TemplateConfig<T>);
    mergeParent(src: TemplateBase<T>): void;
    compile(): void;
}
//# sourceMappingURL=template.d.ts.map
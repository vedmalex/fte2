import { TemplateFactoryBase } from './factory';
import { BlocksHash, HashTypeGeneric, BlockRunFunction, TemplateConfig } from './interfaces';
export declare class TemplateBase {
    parent: string;
    blocks: BlocksHash;
    aliases: HashTypeGeneric<string>;
    alias: string;
    dependency: HashTypeGeneric<boolean>;
    absPath: string;
    name: string;
    srcCode: string;
    script: BlockRunFunction;
    factory: TemplateFactoryBase;
    constructor(config: TemplateConfig);
    mergeParent(src: TemplateBase): void;
    compile(): void;
}

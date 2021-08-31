import { TemplateFactoryBase } from './factory';
export declare type HashType = {
    [key: string]: any;
};
export declare type HashTypeGeneric<T> = {
    [key: string]: T;
};
export declare type PartialFunction = (obj: HashType, name: string) => string;
export declare type SlotFunction = (name: string, content: string | Array<string>) => void | string;
export declare type SlotsHash = {
    [key: string]: Array<string>;
};
export declare type ContentFunction = (name: string, context: HashType, content: ContentFunction, partial: PartialFunction, slot: SlotFunction) => string;
export declare type BlockRunFunction = (context: HashType, content: ContentFunction, partial: PartialFunction, slot: SlotFunction) => string;
export declare type BlockContent = {
    partial: PartialFunction;
    content: ContentFunction;
    run: BlockRunFunction;
    slots: SlotsHash;
    slot: SlotFunction;
};
export declare type BlocksHash = HashTypeGeneric<BlockRunFunction>;
export declare type TemplateConfig = {
    source?: string;
    name?: string;
    absPath?: string;
    parent?: string;
    blocks?: BlocksHash;
    slots?: BlocksHash;
    aliases?: HashTypeGeneric<string>;
    alias?: Array<string>;
    dependency?: HashTypeGeneric<boolean>;
    srcCode?: string;
    script?: BlockRunFunction;
    factory?: TemplateFactoryBase;
    compile?: () => void;
};
//# sourceMappingURL=interfaces.d.ts.map
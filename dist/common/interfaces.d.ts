import { TemplateFactoryBase } from './factory';
export declare type HashType = {
    [key: string]: any;
};
export declare type HashTypeGeneric<T> = {
    [key: string]: T;
};
export declare type PartialFunction = (obj: HashType, name: string) => string;
export declare type ContentFunction = (name: string, context: HashType, content: ContentFunction, partial: PartialFunction) => string;
export declare type BlockRunFunction = (context: HashType, content: ContentFunction, partial: PartialFunction) => string;
export declare type BlockContent = {
    partial: PartialFunction;
    content: ContentFunction;
    run: BlockRunFunction;
};
export declare type BlocksHash = HashTypeGeneric<BlockRunFunction>;
export declare type TemplateConfig = {
    source?: string;
    name: string;
    absPath: string;
    parent?: string;
    blocks?: BlocksHash;
    aliases?: HashTypeGeneric<string>;
    alias?: string;
    dependency?: HashTypeGeneric<boolean>;
    srcCode?: string;
    script?: BlockRunFunction;
    factory?: TemplateFactoryBase;
    compile?: () => void;
};

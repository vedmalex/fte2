import { TemplateFactoryBase } from './factory';
export declare type HashType = {
    [key: string]: any;
};
export interface DefaultFactoryOption extends Record<string, any> {
    applyIndent(_str: string, _indent: number | string): string;
    escapeIt(text: string): string;
}
export declare type HashTypeGeneric<T> = {
    [key: string]: T;
};
export declare type PartialFunction = (obj: HashType, name: string) => string;
export declare type SlotFunction = (name: string, content: string | Array<string>) => void | string;
export declare type SlotsHash = {
    [key: string]: Array<string>;
};
export declare type ContentFunction = (name: string, context: HashType, content: ContentFunction, partial: PartialFunction, slot: SlotFunction) => string | Array<{
    name: string;
    content: string;
}>;
export declare type OriginalSource = {
    line: number;
    col: number;
    pos: number;
};
export declare type BlockRunFunction<T extends DefaultFactoryOption> = (context: HashType, content: ContentFunction, partial: PartialFunction, slot: SlotFunction, options: T) => string | Array<{
    name: string;
    content: string;
}>;
export declare type BlockContent<T extends DefaultFactoryOption> = {
    partial: PartialFunction;
    content: ContentFunction;
    run: BlockRunFunction<T>;
    slots: SlotsHash;
    slot: SlotFunction;
};
export declare type BlocksHash<T extends DefaultFactoryOption> = HashTypeGeneric<BlockRunFunction<T>>;
export declare type TemplateConfig<T extends DefaultFactoryOption> = {
    source?: string;
    name?: string;
    absPath?: string;
    parent?: string;
    options?: Record<string, any>;
    blocks?: BlocksHash<T>;
    slots?: BlocksHash<T>;
    aliases?: HashTypeGeneric<string>;
    alias?: Array<string>;
    dependency?: HashTypeGeneric<boolean>;
    srcCode?: string;
    script?: BlockRunFunction<T>;
    factory?: TemplateFactoryBase<T>;
    compile?: () => void;
};
//# sourceMappingURL=interfaces.d.ts.map
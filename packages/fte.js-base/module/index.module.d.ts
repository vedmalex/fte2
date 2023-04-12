declare function applyDeindent(str: string, numChars: number | string): string;
declare function applyDeindent(str: Array<string>, numChars: number | string): Array<string>;
declare function applyIndent(str: string, _indent: number | string): string;
declare function applyIndent(str: Array<string>, _indent: number | string): Array<string>;
type ChunkContent = {
    name: string;
    content: string;
};
type PartialFunction = <T>(obj: T, name: string) => string;
type SlotFunction = (name: string, content: string | Array<string>) => void | string;
type ContentFunction = <T>(name: string, context: T, content: ContentFunction, partial: PartialFunction, slot: SlotFunction) => string | Array<ChunkContent>;
interface DefaultFactoryOption {
    applyIndent(_str: string, _indent: number | string): string;
    applyIndent(_str: Array<string>, _indent: number | string): Array<string>;
    applyDeindent(str: string, numChars: number | string): string;
    applyDeindent(str: Array<string>, numChars: number | string): Array<string>;
    escapeIt(text: string): string;
}
type BlockRunFunction = <T = any, OPTIONS extends DefaultFactoryOption = DefaultFactoryOption>(context: T, content: ContentFunction, partial: PartialFunction, slot: SlotFunction, options: OPTIONS) => string | Array<ChunkContent>;
type SlotsHash = {
    [key: string]: Array<string>;
};
type BlockContent<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> = {
    partial: PartialFunction;
    content: ContentFunction;
    run: BlockRunFunction;
    slots: SlotsHash;
    slot: SlotFunction;
    options: OPTIONS;
};
type HashTypeGeneric<T> = {
    [key: string]: T;
};
type BlocksHash = HashTypeGeneric<BlockRunFunction>;
declare function escapeIt(text: string): string;
declare const DefaultFactoryOptions: {
    applyIndent: typeof applyIndent;
    escapeIt: typeof escapeIt;
    applyDeindent: typeof applyDeindent;
};
interface FactoryConfig<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
    root: string | Array<string>;
    ext: Array<string>;
    preload: boolean;
    options: OPTIONS;
    watch: boolean;
}
declare function merge(a: object, b: object, property: string): void;
type RunPartialContext<T = any, OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> = {
    context: T;
    name: string;
    absPath?: boolean;
    options?: OPTIONS;
    slots?: SlotsHash;
};
declare abstract class TemplateFactoryBase<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
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
type TemplateConfig<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> = {
    source?: string;
    name?: string;
    absPath?: string;
    parent?: string;
    options?: Record<string, any>;
    blocks?: BlocksHash;
    slots?: BlocksHash;
    aliases?: HashTypeGeneric<string>;
    alias?: Array<string>;
    dependency?: HashTypeGeneric<boolean>;
    srcCode?: string;
    script?: BlockRunFunction;
    factory?: TemplateFactoryBase<OPTIONS>;
    compile?: () => void;
};
declare class TemplateBase<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
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
export { applyDeindent, applyIndent, BlockContent, BlockRunFunction, BlocksHash, ChunkContent, ContentFunction, DefaultFactoryOption, DefaultFactoryOptions, escapeIt, FactoryConfig, HashTypeGeneric, merge, PartialFunction, RunPartialContext, SlotFunction, SlotsHash, TemplateBase, TemplateConfig, TemplateFactoryBase };
//# sourceMappingURL=index.module.d.ts.map
type StateDefinition = {
    start?: Array<string>;
    end?: Array<string>;
    skip?: {
        start?: Array<string>;
        end?: Array<string>;
    };
    states?: Array<ResultTypes>;
    curly?: 0 | 1 | 2;
    type?: {
        [key: string]: ResultTypes;
    };
};
type ResultTypes = 'unknown' | 'expression' | 'uexpression' | 'expression2' | 'uexpression2' | 'code' | 'directive' | 'comments' | 'slotStart' | 'blockStart' | 'blockEnd' | 'text' | 'skip' | 'empty';
type SystemBlocksType = 'directive' | 'comments' | 'slotStart' | 'blockStart' | 'blockEnd' | 'code' | null;
declare const globalStates: {
    [key: string]: StateDefinition;
};
interface ParserResult {
    data: string;
    pos: number;
    line: number;
    column: number;
    type: ResultTypes;
    start: string;
    end: string;
    eol: boolean;
}
interface Items {
    content: string;
    indent?: string;
    pos: number;
    line: number;
    column: number;
    start: string;
    end: string;
    eol: boolean;
    type: ResultTypes;
}
type RequireItem = {
    name: string;
    alias: string;
};
declare class CodeBlockDirectives {
    extend: string;
    deindent: number | boolean;
    context: string;
    alias: Array<string>;
    chunks: string;
    includeMainChunk: boolean;
    useHash: boolean;
    content: boolean;
    slots: boolean;
    blocks: boolean;
    partial: boolean;
    options: boolean;
    promise: boolean;
    callback: boolean;
    requireAs: Array<RequireItem>;
    push(init: ParserResult): void;
}
declare class CodeBlock {
    name: string;
    main: Array<Items>;
    directives: CodeBlockDirectives;
    documentation: Array<Items>;
    slots: {
        [slot: string]: CodeBlock;
    };
    blocks: {
        [block: string]: CodeBlock;
    };
    constructor(init?: ParserResult);
    addBlock(block: CodeBlock): void;
    addSlot(slot: CodeBlock): void;
}
declare class Parser {
    private buffer;
    private size;
    INDENT: number;
    private static INITIAL_STATE;
    private static DEFAULT_TAB_SIZE;
    private globalState;
    private actualState?;
    private globalToken;
    private pos;
    private line;
    private column;
    private curlyAware;
    private curlyBalance;
    private result;
    static parse(text: string | Buffer, options?: {
        indent?: string | number;
    }): CodeBlock;
    private constructor();
    collect(): void;
    private run;
    private parse;
    private process;
    private SYMBOL;
    private DETECT_INDENT;
    private SKIP;
    private block;
    private SUB;
    private term;
}
export { globalStates as default, StateDefinition, ResultTypes, SystemBlocksType, ParserResult, Items, RequireItem, CodeBlockDirectives, CodeBlock, Parser };
//# sourceMappingURL=index.d.ts.map
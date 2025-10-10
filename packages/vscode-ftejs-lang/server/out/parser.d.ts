export type ResultTypes = 'unknown' | 'expression' | 'uexpression' | 'expression2' | 'uexpression2' | 'code' | 'directive' | 'comments' | 'slotStart' | 'blockStart' | 'blockEnd' | 'text' | 'skip' | 'empty';
export interface ParserResult {
    data: string;
    pos: number;
    line: number;
    column: number;
    type: ResultTypes;
    start: string;
    end: string;
    eol: boolean;
}
export interface Items {
    content: string;
    indent?: string;
    pos: number;
    line: number;
    column: number;
    start: string;
    end: string;
    eol: boolean;
    type: ResultTypes;
    name?: string;
}
export interface ParserError {
    message: string;
    pos: number;
    line: number;
    column: number;
}
export declare class CodeBlock {
    name: string;
    main: Array<Items>;
    slots: {
        [slot: string]: CodeBlock;
    };
    blocks: {
        [block: string]: CodeBlock;
    };
    declPos?: number;
    declStart?: string;
    declContent?: string;
    declEnd?: string;
    constructor(init?: ParserResult);
    addBlock(block: CodeBlock): void;
    addSlot(slot: CodeBlock): void;
    private unquote;
}
export declare function SUB(buffer: string, str: string, pos?: number, size?: number): string;
export declare class Parser {
    private buffer;
    private size;
    private static INITIAL_STATE;
    private globalState;
    private actualState?;
    private globalToken;
    private pos;
    private line;
    private column;
    private curlyAware;
    private curlyBalance;
    private result;
    private errors;
    static parse(text: string, options?: {
        indent?: number;
    }): CodeBlock;
    private constructor();
    private collect;
    private run;
    private parse;
    private process;
    private symbol;
    private SKIP;
    private block;
    private SUB;
    private term;
}
//# sourceMappingURL=parser.d.ts.map
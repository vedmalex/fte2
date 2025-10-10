export interface DefaultFactoryOption {
    applyIndent(_str: string, _indent: number | string): string;
    applyIndent(_str: Array<string>, _indent: number | string): Array<string>;
    applyDeindent(str: string, numChars: number | string): string;
    applyDeindent(str: Array<string>, numChars: number | string): Array<string>;
    applyDeindentStream?(source: AsyncIterable<string>, numChars?: number | string): AsyncIterable<string>;
    escapeIt(text: string): string;
    sourceMap?: boolean;
    inline?: boolean;
    sourceRoot?: string;
    sourceFile?: string;
    stream?: boolean;
    abort?: any;
    onChunk?(chunk: string): void;
    onError?(error: unknown): void;
    highWaterMark?: number;
    maxCoalesceChunkSize?: number;
}
//# sourceMappingURL=DefaultFactoryOption.d.ts.map
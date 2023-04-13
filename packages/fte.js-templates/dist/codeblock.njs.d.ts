import { TemplateBase } from 'fte.js-base';
type Block = {
    type: 'empty' | 'text' | 'code' | 'uexpression' | 'expression';
    content: string;
    eol: boolean;
    indent: string;
    start: boolean;
    end: boolean;
};
declare const _default: {
    alias: string[];
    script: (blockList: Array<Block>, _content: any, partial: any, slot: any, options: any) => string;
    compile: (this: TemplateBase) => void;
    dependency: {};
};
export default _default;
//# sourceMappingURL=codeblock.njs.d.ts.map
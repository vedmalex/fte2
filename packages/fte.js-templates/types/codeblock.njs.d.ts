import { type TemplateBase } from 'fte.js-base';
export interface CodeBlockOptions {
    escapeIt: (str: string) => string;
    applyIndent: (str: string, indent: string) => string;
    sourceMap?: boolean;
    sourceFile?: string;
    sourceRoot?: string;
    inline?: boolean;
}
declare const _default: {
    alias: string[];
    script: (blockList: any, _content: any, partial: any, slot: any, options: CodeBlockOptions) => any;
    compile: (this: TemplateBase) => void;
    dependency: {};
};
export default _default;
//# sourceMappingURL=codeblock.njs.d.ts.map
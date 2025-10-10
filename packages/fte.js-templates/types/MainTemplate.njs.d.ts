import { type TemplateBase } from 'fte.js-base';
export interface MainTemplateOptions {
    escapeIt: (str: string) => string;
    applyIndent: (str: string, indent: string) => string;
    applyDeindent: (str: string) => string;
    sourceMap?: boolean;
    sourceFile?: string;
    sourceRoot?: string;
    inline?: boolean;
    promise?: boolean;
    stream?: boolean;
    abort?: any;
}
export interface MainTemplateResult {
    code: string;
    map?: any;
}
declare const _default: {
    alias: string[];
    aliases: {
        codeblock: string;
    };
    script: (context: any, _content: any, partial: any, slot: any, options: MainTemplateOptions) => MainTemplateResult;
    blocks: {
        maincontent: (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        'chunks-start': (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        'chunks-finish': (directives: any, _content: any, partial: any, slot: any, options: any) => string;
    };
    compile: (this: TemplateBase) => void;
    dependency: {
        'codeblock.njs': boolean;
        codeblock: boolean;
    };
};
export default _default;
//# sourceMappingURL=MainTemplate.njs.d.ts.map
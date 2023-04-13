import { TemplateBase } from 'fte.js-base';
declare const _default: {
    alias: string[];
    aliases: {
        codeblock: string;
    };
    script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
    blocks: {
        maincontent: (directives: {
            content: any;
            context: any;
        }, _content: any, partial: any, slot: any, options: any) => string;
        'chunks-start': (directives: {
            chunks: any;
        }, _content: any, partial: any, slot: any, options: any) => string;
        'chunks-finish': (directives: {
            chunks: any;
            useHash: any;
            includeMainChunk: any;
        }, _content: any, partial: any, slot: any, options: any) => string;
    };
    compile: (this: TemplateBase) => void;
    dependency: {
        'codeblock.njs': boolean;
        codeblock: boolean;
    };
};
export default _default;
//# sourceMappingURL=MainTemplate.ts.njs.d.ts.map
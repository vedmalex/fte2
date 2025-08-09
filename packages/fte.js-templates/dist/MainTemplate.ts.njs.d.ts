import { TemplateBase } from "fte.js-base";
declare const _default: {
    alias: string[];
    aliases: {
        codeblock: string;
    };
    script: (context: any, _content: any, partial: any, slot: any, options: any) => any;
    blocks: {
        maincontent: (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        "chunks-start": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        "chunks-finish": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
    };
    compile: (this: TemplateBase) => void;
    dependency: {
        "codeblock.njs": boolean;
        codeblock: boolean;
    };
};
export default _default;
//# sourceMappingURL=MainTemplate.ts.njs.d.ts.map
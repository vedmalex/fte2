export interface TemplateOptions {
    escapeIt: (str: string) => string;
    applyIndent: (str: string, indent: string) => string;
    applyDeindent: (str: string) => string;
    sourceMap?: boolean;
    sourceFile?: string;
    sourceRoot?: string;
    inline?: boolean;
}
export interface TemplateResult {
    code: string;
    map?: any;
}
export type { CodeBlockOptions } from "./codeblock.njs";
export type { MainTemplateOptions, MainTemplateResult } from "./MainTemplate.njs";
declare const templates: {
    "typedefinitions.njs": {
        alias: string[];
        script: (typedefs: any, _content: any, partial: any, slot: any, options: any) => string;
        blocks: {
            info: (info: any, _content: any, partial: any, slot: any, options: any) => string;
        };
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "standalone.ts.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "standalone.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "standalone.index.ts.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "standalone.index.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "standalone.index.es6.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "standalone.es6.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "singlefile.ts.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.ts.njs": boolean;
            core: boolean;
        };
    };
    "singlefile.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "singlefile.es6.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "raw.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "es6module.ts.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.ts.njs": boolean;
            core: boolean;
        };
    };
    "es6module.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string | {
            code: string;
            map: any;
        };
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "compiled.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string | {
            code: string;
            map: any;
        };
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "compilationError.njs": {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "codeblock.njs": {
        alias: string[];
        script: (blockList: any, _content: any, partial: any, slot: any, options: import("./codeblock.njs").CodeBlockOptions) => {
            code: string;
            map: import("fte.js-base").TemplateSourceMap | undefined;
        };
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {};
    };
    "MainTemplate.ts.njs": {
        alias: string[];
        aliases: {
            codeblock: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        blocks: {
            maincontent: (directives: any, _content: any, partial: any, slot: any, options: any) => string;
            "chunks-start": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
            "chunks-finish": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        };
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "codeblock.njs": boolean;
            codeblock: boolean;
        };
    };
    "MainTemplate.njs": {
        alias: string[];
        aliases: {
            codeblock: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: import("./MainTemplate.njs").MainTemplateOptions) => import("./MainTemplate.njs").MainTemplateResult;
        blocks: {
            maincontent: (directives: any, _content: any, partial: any, slot: any, options: any) => string;
            "chunks-start": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
            "chunks-finish": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        };
        compile: (this: import("fte.js-base").TemplateBase<import("fte.js-base").DefaultFactoryOption>) => void;
        dependency: {
            "codeblock.njs": boolean;
            codeblock: boolean;
        };
    };
};
export default templates;
//# sourceMappingURL=index.d.ts.map
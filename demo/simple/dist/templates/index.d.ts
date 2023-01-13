declare const templates: {
    'codeblock.njs': {
        alias: string[];
        script: (blockList: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {};
    };
    'compilationError.njs': {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {};
    };
    'compiled.njs': {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    'es6module.njs': {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    'MainTemplate.njs': {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        blocks: {
            maincontent: (directives: any, _content: any, partial: any, slot: any, options: any) => string;
            "chunks-start": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
            "chunks-finish": (directives: any, _content: any, partial: any, slot: any, options: any) => string;
        };
        compile: () => void;
        dependency: {
            "codeblock.njs": boolean;
            codeblock: boolean;
        };
    };
    'raw.njs': {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    'singlefile.es6.njs': {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    'singlefile.njs': {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    'standalone.es6.njs': {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {};
    };
    'standalone.index.es6.njs': {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {};
    };
    'standalone.index.njs': {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {};
    };
    'standalone.njs': {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: () => void;
        dependency: {};
    };
};
export default templates;
//# sourceMappingURL=index.d.ts.map
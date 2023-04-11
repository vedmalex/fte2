declare const templates: {
    "codeblock.njs": {
        alias: string[];
        script: (blockList: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "compilationError.njs": {
        alias: string[];
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "compiled.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "es6module.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
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
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "MainTemplate.ts.njs": boolean;
            core: boolean;
        };
    };
    "MainTemplate.njs": {
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
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "codeblock.njs": boolean;
            codeblock: boolean;
        };
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
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "codeblock.njs": boolean;
            codeblock: boolean;
        };
    };
    "raw.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (context: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
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
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "singlefile.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "MainTemplate.njs": boolean;
            core: boolean;
        };
    };
    "singlefile.ts.njs": {
        alias: string[];
        aliases: {
            core: string;
        };
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {
            "MainTemplate.ts.njs": boolean;
            core: boolean;
        };
    };
    "standalone.es6.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "standalone.index.es6.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "standalone.index.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "standalone.index.ts.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "standalone.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
    "standalone.ts.njs": {
        alias: string[];
        script: (files: any, _content: any, partial: any, slot: any, options: any) => string;
        compile: (this: {
            factory: {
                ensure: (template: string) => any;
            };
            parent: string;
            mergeParent: (template: any) => void;
        }) => void;
        dependency: {};
    };
};
export default templates;
//# sourceMappingURL=index.d.ts.map
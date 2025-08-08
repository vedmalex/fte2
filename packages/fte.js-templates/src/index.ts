import typedefinitions_njs from "./typedefinitions.njs";
import standalone_ts_njs from "./standalone.ts.njs";
import standalone_njs from "./standalone.njs";
import standalone_index_ts_njs from "./standalone.index.ts.njs";
import standalone_index_njs from "./standalone.index.njs";
import standalone_index_es6_njs from "./standalone.index.es6.njs";
import standalone_es6_njs from "./standalone.es6.njs";
import singlefile_ts_njs from "./singlefile.ts.njs";
import singlefile_njs from "./singlefile.njs";
import singlefile_es6_njs from "./singlefile.es6.njs";
import raw_njs from "./raw.njs";
import es6module_ts_njs from "./es6module.ts.njs";
import es6module_njs from "./es6module.njs";
import compiled_njs from "./compiled.njs";
import compilationError_njs from "./compilationError.njs";
import codeblock_njs from "./codeblock.njs";
import MainTemplate_ts_njs from "./MainTemplate.ts.njs";
import MainTemplate_njs from "./MainTemplate.njs";

// Экспортируем интерфейсы для source maps
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

// Реэкспортируем типы из других модулей
export type { CodeBlockOptions } from "./codeblock.njs";
export type { MainTemplateOptions, MainTemplateResult } from "./MainTemplate.njs";

const templates = {
    "typedefinitions.njs": typedefinitions_njs,
    "standalone.ts.njs": standalone_ts_njs,
    "standalone.njs": standalone_njs,
    "standalone.index.ts.njs": standalone_index_ts_njs,
    "standalone.index.njs": standalone_index_njs,
    "standalone.index.es6.njs": standalone_index_es6_njs,
    "standalone.es6.njs": standalone_es6_njs,
    "singlefile.ts.njs": singlefile_ts_njs,
    "singlefile.njs": singlefile_njs,
    "singlefile.es6.njs": singlefile_es6_njs,
    "raw.njs": raw_njs,
    "es6module.ts.njs": es6module_ts_njs,
    "es6module.njs": es6module_njs,
    "compiled.njs": compiled_njs,
    "compilationError.njs": compilationError_njs,
    "codeblock.njs": codeblock_njs,
    "MainTemplate.ts.njs": MainTemplate_ts_njs,
    "MainTemplate.njs": MainTemplate_njs
};

export default templates;

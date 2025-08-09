"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "index.ts"
    ],
    script: function (context, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push('import typedefinitions_njs from "./typedefinitions.njs";\n');
        out.push('import standalone_ts_njs from "./standalone.ts.njs";\n');
        out.push('import standalone_njs from "./standalone.njs";\n');
        out.push('import standalone_index_ts_njs from "./standalone.index.ts.njs";\n');
        out.push('import standalone_index_njs from "./standalone.index.njs";\n');
        out.push('import standalone_index_es6_njs from "./standalone.index.es6.njs";\n');
        out.push('import standalone_es6_njs from "./standalone.es6.njs";\n');
        out.push('import singlefile_ts_njs from "./singlefile.ts.njs";\n');
        out.push('import singlefile_njs from "./singlefile.njs";\n');
        out.push('import singlefile_es6_njs from "./singlefile.es6.njs";\n');
        out.push('import raw_njs from "./raw.njs";\n');
        out.push('import es6module_ts_njs from "./es6module.ts.njs";\n');
        out.push('import es6module_njs from "./es6module.njs";\n');
        out.push('import compiled_njs from "./compiled.njs";\n');
        out.push('import compilationError_njs from "./compilationError.njs";\n');
        out.push('import codeblock_njs from "./codeblock.njs";\n');
        out.push('import MainTemplate_ts_njs from "./MainTemplate.ts.njs";\n');
        out.push('import MainTemplate_njs from "./MainTemplate.njs";\n');
        out.push("\n");
        out.push("const templates = {\n");
        out.push('    "typedefinitions.njs": typedefinitions_njs,\n');
        out.push('    "standalone.ts.njs": standalone_ts_njs,\n');
        out.push('    "standalone.njs": standalone_njs,\n');
        out.push('    "standalone.index.ts.njs": standalone_index_ts_njs,\n');
        out.push('    "standalone.index.njs": standalone_index_njs,\n');
        out.push('    "standalone.index.es6.njs": standalone_index_es6_njs,\n');
        out.push('    "standalone.es6.njs": standalone_es6_njs,\n');
        out.push('    "singlefile.ts.njs": singlefile_ts_njs,\n');
        out.push('    "singlefile.njs": singlefile_njs,\n');
        out.push('    "singlefile.es6.njs": singlefile_es6_njs,\n');
        out.push('    "raw.njs": raw_njs,\n');
        out.push('    "es6module.ts.njs": es6module_ts_njs,\n');
        out.push('    "es6module.njs": es6module_njs,\n');
        out.push('    "compiled.njs": compiled_njs,\n');
        out.push('    "compilationError.njs": compilationError_njs,\n');
        out.push('    "codeblock.njs": codeblock_njs,\n');
        out.push('    "MainTemplate.ts.njs": MainTemplate_ts_njs,\n');
        out.push('    "MainTemplate.njs": MainTemplate_njs\n');
        out.push("};\n");
        out.push("\n");
        out.push("export default templates;");
        return out.join("");
    },
    compile: function () { },
    dependency: {}
};
//# sourceMappingURL=index.ts.njs.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["standalone.index.es6.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        for (let i = 0; i < files.length; i += 1) {
            out.push("\n");
            out.push("  import " + (files[i].name.replaceAll(/[\s\.]/g, '_')) + " from '" + (files[i].path) + "'");
        }
        out.push("\n");
        out.push("\n");
        out.push("const templates = {");
        for (let i = 0; i < files.length; i += 1) {
            out.push("\n");
            out.push("  '" + (files[i].name) + "': " + (files[i].name.replaceAll(/[\s\.]/g, '_')) + ",");
        }
        out.push("\n");
        out.push("}\n");
        out.push("export default templates");
        return out.join('');
    },
    compile: 
};
{
}
dependency: {
}
;
//# sourceMappingURL=standalone.index.es6.njs.err.js.map
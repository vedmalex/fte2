"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "standalone.index.njs"
    ],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("const templates = {");
        for (let i = 0; i < files.length; i += 1) {
            out.push("\n");
            out.push("  '" + (files[i].name) + "': require('" + (files[i].path) + "'),");
        }
        out.push("\n");
        out.push("}\n");
        out.push("module.exports = templates");
        return out.join("");
    },
    compile: function () { },
    dependency: {}
};
//# sourceMappingURL=standalone.index.njs.js.map
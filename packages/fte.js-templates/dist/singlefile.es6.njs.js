"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "singlefile.es6.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n");
        out.push("\n");
        out.push("export const templates = {");
        files.forEach((file) => {
            out.push("\n");
            out.push("  ['" + ((file.template.alias || file.name)) + "']: " + (partial(file.template, "core")) + ",");
        });
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("export function run(context, name) {\n");
        out.push("  return F.run(context, name)\n");
        out.push("}\n");
        out.push("");
        return out.join("");
    },
    compile: function () {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};
//# sourceMappingURL=singlefile.es6.njs.js.map
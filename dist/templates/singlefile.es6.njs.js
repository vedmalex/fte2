"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["singlefile.es6.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n");
        out.push("\n");
        out.push("export const templates = {\n");
        files.forEach((file) => {
            out.push("['" + (file.template.alias || file.name) + "']: " + partial(file.template, "core") + ",\n");
        });
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("export function run (context, name) {\n");
        out.push("  return F.run(context, name)\n");
        out.push("}\n");
        out.push("\n");
        return out.join("");
    },
    compile: function () {
        this.alias = ["singlefile.es6.njs"];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.njs";
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};
//# sourceMappingURL=singlefile.es6.njs.js.map
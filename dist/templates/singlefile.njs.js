"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["singlefile.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n"
            + "\n"
            + "const templates = {\n"
            + "");
        files.forEach(file => {
            ;
            out.push("['" + ((file.template.alias || file.name)) + "']: " + (partial(file.template, 'core')) + ",\n"
                + "");
        });
        out.push("\n"
            + "}\n"
            + "\n"
            + "exports.templates = templates\n"
            + "const F = new Factory(templates)\n"
            + "\n"
            + "function run(context, name){\n"
            + "  return F.run( context, name )\n"
            + "}\n"
            + "\n"
            + "exports.run = run\n"
            + "" + "");
        return out.join('');
    },
    compile: function () {
        this.alias = ["singlefile.njs"];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.njs";
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true,
    }
};
//# sourceMappingURL=singlefile.njs.js.map
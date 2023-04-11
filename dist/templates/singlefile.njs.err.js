"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["singlefile.njs"],
    aliases: {
        "core": "MainTemplate.njs",
    },
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n");
        out.push("\n");
        out.push("const templates = {");
        files.forEach(file => {
            out.push("\n");
            out.push("  ['" + ((file.template.alias || file.name)) + "']: " + (partial(file.template, 'core')) + ",");
        });
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("exports.templates = templates\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("function run(context, name){\n");
        out.push("  return F.run( context, name )\n");
        out.push("}\n");
        out.push("\n");
        out.push("exports.run = run");
        return out.join('');
    },
    compile: 
};
{
    this.factory.ensure("MainTemplate.njs");
}
dependency: {
    "MainTemplate.njs";
    true,
        "core";
    true,
    ;
}
;
//# sourceMappingURL=singlefile.njs.err.js.map
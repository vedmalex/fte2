import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "es6module.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function(context, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push("const core: any = " + (partial(context, "core")) + " as any;\n");
        out.push("if (typeof core === 'string') {\n");
        out.push('  return "export default " + core + ";";\n');
        out.push("} else {\n");
        out.push("  return {\n");
        out.push('    code: "export default " + core.code + ";",\n');
        out.push("    map: core.map\n");
        out.push("  };\n");
        out.push("}");
        return out.join("");
    },
    compile: function(this: TemplateBase) {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};

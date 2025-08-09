import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "singlefile.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function(files, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push('const Factory = require("fte.js-standalone").TemplateFactoryStandalone;\n');
        out.push("\n");
        out.push("const templates = {\n");
        files.forEach((file)=>{
            out.push("\n");
            out.push("  ['" + ((file.template.alias || file.name)) + "']: " + ((()=>{
                const __core = partial(file.template, "core");
                return typeof __core === "string" ? __core : __core.code;
            })()) + ",\n");
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

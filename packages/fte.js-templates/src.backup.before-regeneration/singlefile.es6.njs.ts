import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "singlefile.es6.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function(files, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push('import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";\n');
        out.push("\n");
        out.push("export const templates = {");
        files.forEach((file)=>{
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
    compile: function(this: TemplateBase) {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};

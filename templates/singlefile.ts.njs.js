module.exports = {
    alias: [
        "singlefile.ts.njs"
    ],
    script: function(files, _content, partial, slot, options) {
        var out = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n");
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
    compile: function() {
        this.alias = [
            "singlefile.ts.njs"
        ];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.ts.njs";
        this.factory.ensure("MainTemplate.ts.njs");
    },
    dependency: {
        "MainTemplate.ts.njs": true,
        "core": true
    }
};

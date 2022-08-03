export default {
    alias: ["singlefile.es6.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n"
            + "\n"
            + "export const templates = {\n"
            + "");
        files.forEach(file => {
            ;
            out.push("\n"
                + "  ['" + ((file.template.alias || file.name)) + "']: " + (partial(file.template, 'core')) + ",\n"
                + "");
        });
        out.push("\n"
            + "}\n"
            + "\n"
            + "const F = new Factory(templates)\n"
            + "\n"
            + "export function run (context, name) {\n"
            + "  return F.run({ context, name })\n"
            + "}\n"
            + "\n"
            + "" + "");
        return out.join('');
    },
    compile: function () {
        this.alias = ["singlefile.es6.njs"];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.njs";
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true,
    }
};

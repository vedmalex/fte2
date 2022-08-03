export default {
    alias: ["standalone.es6.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n"
            + "\n"
            + "");
        for (let i = 0; i < files.length; i += 1) {
            ;
            out.push("\n"
                + "  import " + (files[i].name.replaceAll(/[\s\.]/g, '_')) + " from '" + (files[i].path) + "'\n"
                + "");
        }
        ;
        out.push("\n"
            + "\n"
            + "const templates = {\n"
            + "");
        for (let i = 0; i < files.length; i += 1) {
            ;
            out.push("\n"
                + "  '" + (files[i].name) + "': " + (files[i].name.replaceAll(/[\s\.]/g, '_')) + ",\n"
                + "");
        }
        ;
        out.push("\n"
            + "}\n"
            + "\n"
            + "const F = new Factory(templates)\n"
            + "\n"
            + "module.exports = (context, name) => {\n"
            + "  F.run( context, name )\n"
            + "}\n"
            + "" + "");
        return out.join('');
    },
    compile: function () {
        this.alias = ["standalone.es6.njs"];
    },
    dependency: {}
};

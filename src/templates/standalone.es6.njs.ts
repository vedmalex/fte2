export default {
    alias: [
        "standalone.es6.njs"
    ],
    script: function(files, _content, partial, slot, options) {
        var out = [];
        out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n\n");
        for(var i = 0; i < files.length; i += 1)out.push("import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
        out.push("\n\nconst templates = {\n");
        for(var i1 = 0; i1 < files.length; i1 += 1)out.push("'" + files[i1].name + "': " + files[i1].name.replaceAll(/[\s\.]/g, "_") + ",\n");
        out.push("\n}\n\nconst F = new Factory(templates)\n\nmodule.exports = (context, name) => {\n  return F.run( context, name )\n}\n");
        return out.join("");
    },
    compile: function() {
        this.alias = [
            "standalone.es6.njs"
        ];
    },
    dependency: {}
};

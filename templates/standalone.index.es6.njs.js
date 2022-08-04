module.exports = {
    alias: [
        "standalone.index.es6.njs"
    ],
    script: function(files, _content, partial, slot, options) {
        var out = [];
        for(var i = 0; i < files.length; i += 1)out.push("import " + files[i].name.replaceAll(/[\s\.]/g, "_") + " from '" + files[i].path + "'\n");
        out.push("\n\nconst templates = {\n");
        for(var i1 = 0; i1 < files.length; i1 += 1)out.push("'" + files[i1].name + "': " + files[i1].name.replaceAll(/[\s\.]/g, "_") + ",\n");
        out.push("\n}\nexport default templates");
        return out.join("");
    },
    compile: function() {
        this.alias = [
            "standalone.index.es6.njs"
        ];
    },
    dependency: {}
};

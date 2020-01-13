module.exports = { alias: ["compilationError.njs"], script: function (context, _content, partial, slot) {
        var out = '';
        /*2:1*/
        out += context.error.message;
        /*2:25*/
        out += ";\n";
        /*3:1*/
        out += context.compiledFile;
        /*3:24*/
        out += ";";
        return out;
    },
    compile: function () {
        this.alias = ["compilationError.njs"];
    },
    dependency: {}
};

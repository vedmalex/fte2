"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["standalone.index.es6.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
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
            + "export default templates" + "");
        return out.join('');
    },
    compile: function () {
        this.alias = ["standalone.index.es6.njs"];
    },
    dependency: {}
};
//# sourceMappingURL=standalone.index.es6.njs.js.map
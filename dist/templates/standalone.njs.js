"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["standalone.njs"],
    script: function (files, _content, partial, slot, options) {
        var out = [];
        out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n"
            + "\n"
            + "const templates = {\n"
            + "");
        for (let i = 0; i < files.length; i += 1) {
            ;
            out.push("\n"
                + "  '" + (files[i].name) + "': require('" + (files[i].path) + "'),\n"
                + "");
        }
        ;
        out.push("\n"
            + "}\n"
            + "\n"
            + "const F = new Factory(templates)\n"
            + "\n"
            + "module.exports = (context, name) => {\n"
            + "  F.run({ context, name })\n"
            + "}\n"
            + "" + "");
        return out.join('');
    },
    compile: function () {
        this.alias = ["standalone.njs"];
    },
    dependency: {}
};
//# sourceMappingURL=standalone.njs.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["compiled.njs"],
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push("module.exports = " + partial(context, "core") + ";\n");
        return out.join("");
    },
    compile: function () {
        this.alias = ["compiled.njs"];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.njs";
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};
//# sourceMappingURL=compiled.njs.js.map
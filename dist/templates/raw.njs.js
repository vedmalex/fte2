"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "raw.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push("(function(){\n");
        out.push("  return " + (partial(context, "core")) + ";\n");
        out.push("})();");
        return out.join("");
    },
    compile: function () {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};
//# sourceMappingURL=raw.njs.js.map
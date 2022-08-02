"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["compilationError.njs"],
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push((context.error.message) + ";\n"
            + "" + (context.compiledFile) + ";" + "");
        return out.join('');
    },
    compile: function () {
        this.alias = ["compilationError.njs"];
    },
    dependency: {}
};
//# sourceMappingURL=compilationError.njs.js.map
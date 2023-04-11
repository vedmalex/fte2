"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["compilationError.njs"],
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push((context.error.message) + ";\n");
        out.push((context.compiledFile) + ";");
        return out.join('');
    },
    compile: 
};
{
}
dependency: {
}
;
//# sourceMappingURL=compilationError.njs.err.js.map
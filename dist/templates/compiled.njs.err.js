"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["compiled.njs"],
    aliases: {
        "core": "MainTemplate.njs",
    },
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push("module.exports = " + (partial(context, 'core')) + ";");
        return out.join('');
    },
    compile: 
};
{
    this.factory.ensure("MainTemplate.njs");
}
dependency: {
    "MainTemplate.njs";
    true,
        "core";
    true,
    ;
}
;
//# sourceMappingURL=compiled.njs.err.js.map
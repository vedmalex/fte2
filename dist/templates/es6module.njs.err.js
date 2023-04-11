"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["es6module.njs"],
    aliases: {
        "core": "MainTemplate.njs",
    },
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push("export default " + (partial(context, 'core')) + ";");
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
//# sourceMappingURL=es6module.njs.err.js.map
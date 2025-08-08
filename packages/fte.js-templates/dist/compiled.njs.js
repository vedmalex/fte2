"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "compiled.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function (context, _content, partial, slot, options) {
        const core = partial(context, "core");
        if (typeof core === 'string') {
            return "module.exports = " + core + ";";
        }
        else {
            return {
                code: "module.exports = " + core.code + ";",
                map: core.map
            };
        }
    },
    compile: function () {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};
//# sourceMappingURL=compiled.njs.js.map
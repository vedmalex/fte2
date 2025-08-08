"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "es6module.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function (context, _content, partial, slot, options) {
        const core = partial(context, "core");
        if (typeof core === 'string') {
            return "export default " + core + ";";
        }
        else {
            return {
                code: "export default " + core.code + ";",
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
//# sourceMappingURL=es6module.njs.js.map
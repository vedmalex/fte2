"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "es6module.njs"
    ],
    aliases: {
        "core": "MainTemplate.ts.njs"
    },
    script: function (context, _content, partial, slot, options) {
        var out = [];
        out.push("import { TemplateBase } from 'fte.js-base'\n");
        out.push("\n");
        out.push("export default " + (partial(context, "core")) + ";");
        return out.join("");
    },
    compile: function () {
        this.factory.ensure("MainTemplate.ts.njs");
    },
    dependency: {
        "MainTemplate.ts.njs": true,
        "core": true
    }
};
//# sourceMappingURL=es6module.ts.njs.js.map
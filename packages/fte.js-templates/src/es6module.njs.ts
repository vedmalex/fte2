import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "es6module.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function(context, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("export default " + (partial(context, "core")) + ";");
        return out.join("");
    },
    compile: function(this: TemplateBase) {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};

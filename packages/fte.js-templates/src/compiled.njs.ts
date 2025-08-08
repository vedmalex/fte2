import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "compiled.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function(context, _content, partial, slot, options) {
        const core: any = partial(context, "core") as any;
        if (typeof core === 'string') {
            return "module.exports = " + core + ";";
        } else {
            return {
                code: "module.exports = " + core.code + ";",
                map: core.map
            };
        }
    },
    compile: function(this: TemplateBase) {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};

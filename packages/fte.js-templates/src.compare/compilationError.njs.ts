import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "compilationError.njs"
    ],
    script: function(context, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("\n");
        out.push("\n");
        out.push((context.error.message) + ";\n");
        out.push((context.compiledFile) + ";");
        return out.join("");
    },
    compile: function(this: TemplateBase) {},
    dependency: {}
};

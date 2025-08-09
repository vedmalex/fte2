import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "standalone.es6.njs"
    ],
    script: function(files, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push('import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";\n');
        out.push("\n");
        for(let i = 0; i < files.length; i += 1){
            out.push("\n");
            out.push("  import " + (files[i].name.replaceAll(/[\s\.]/g, "_")) + " from '" + (files[i].path) + "'\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("const templates = {\n");
        for(let i = 0; i < files.length; i += 1){
            out.push("\n");
            out.push("  '" + (files[i].name) + "': " + (files[i].name.replaceAll(/[\s\.]/g, "_")) + ",\n");
        }
        out.push("\n");
        out.push("}\n");
        out.push("\n");
        out.push("const F = new Factory(templates)\n");
        out.push("\n");
        out.push("function run(context, name:string) => {\n");
        out.push("  return F.run(context, name)\n");
        out.push("}\n");
        out.push("export default run");
        return out.join("");
    },
    compile: function(this: TemplateBase) {},
    dependency: {}
};

import { TemplateBase } from "fte.js-base";
export default {
    alias: [
        "typedefs.ts.njs"
    ],
    script: function(typedefs, _content, partial, slot, options) {
        function content<T>(blockName: string, ctx: T) {
            if (ctx === undefined || ctx === null) ctx = typedefs;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out: Array<string> = [];
        typedefs.forEach(({ params , types , name  })=>{
            out.push("\n");
            out.push(" // function " + (name) + "\n");
            out.push(" ");
            params.forEach((param)=>{
                out.push("\n");
                out.push((options.applyIndent(content("info", param), "  ")) + "\n");
                out.push(" ");
            });
            out.push("\n");
            out.push("\n");
            out.push(" ");
            types.forEach((param)=>{
                out.push("\n");
                out.push((options.applyIndent(content("info", param), "  ")) + "\n");
                out.push(" ");
            });
            out.push("\n");
        });
        out.push("\n");
        out.push("");
        return out.join("");
    },
    blocks: {
        "info": function(info, _content, partial, slot, options) {
            var out: Array<string> = [];
            out.push((info.name) + "\n");
            out.push((info.type) + "\n");
            info.properties.forEach((prop)=>{
                out.push("\n");
                out.push((options.applyIndent(prop.name, "  ")) + ": any\n");
            });
            out.push("");
            return out.join("");
        }
    },
    compile: function(this: TemplateBase) {},
    dependency: {}
};

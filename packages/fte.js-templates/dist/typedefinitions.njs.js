"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "typedefs.ts.njs"
    ],
    script: function (typedefs, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = typedefs;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        typedefs.forEach(({ params, types, name }) => {
            out.push("\n");
            out.push(" // function " + (name) + "\n");
            out.push(" ");
            params.forEach((param) => {
                out.push("\n");
                out.push((options.applyIndent(content("info", param), "  ")) + "\n");
                out.push(" ");
            });
            out.push("\n");
            out.push("\n");
            out.push(" ");
            types.filter((f) => f.type !== "primitive" && f.type !== "function").forEach((param) => {
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
        "info": function (info, _content, partial, slot, options) {
            var out = [];
            out.push((info.name) + "\n");
            out.push((info.type) + "\n");
            info.properties.forEach((prop) => {
                out.push("\n");
                out.push((options.applyIndent(prop.name, "  ")) + ": any\n");
            });
            out.push("");
            return out.join("");
        }
    },
    compile: function () { },
    dependency: {}
};
//# sourceMappingURL=typedefinitions.njs.js.map
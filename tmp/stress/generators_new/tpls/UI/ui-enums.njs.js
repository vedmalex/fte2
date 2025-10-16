module.exports = {
    chunks: "$$$main$$$",
    alias: [
        "ui-enums"
    ],
    script: function(_enum, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = _enum;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const _partial = partial;
        partial = function(obj, template) {
            const result = _partial(obj, template);
            if (Array.isArray(result)) {
                result.forEach((r)=>{
                    chunkEnsure(r.name, r.content);
                });
                return '';
            } else {
                return result;
            }
        };
        const main = '$$$main$$$';
        var current = main;
        let outStack = [
            current
        ];
        let result;
        function chunkEnsure(name, content) {
            if (!result) {
                result = {};
            }
            if (!result.hasOwnProperty(name)) {
                result[name] = content ? content : [];
            }
        }
        function chunkStart(name) {
            chunkEnsure(name);
            chunkEnd();
            current = name;
            out = [];
        }
        function chunkEnd() {
            result[current].push(...out);
            out = [];
            current = outStack.pop() || main;
        }
        chunkStart(main);
        chunkStart(`${_enum.name}/index.js`);
        out.push("import React, { useContext } from 'react';" + "import { UIXContext } from '../contexts';\n");
        out.push("\n");
        out.push("export const translation = {\n");
        out.push("  enums: {\n");
        out.push("    " + (_enum.name) + ": {\n");
        _enum.items.forEach((item)=>{
            out.push((item.name) + ": '" + (item.metadata?.UI?.title || item.name) + "',\n");
        });
        out.push("\n");
        out.push("    },\n");
        out.push("  },\n");
        out.push("};\n");
        out.push("\n");
        out.push("const choices = [\n");
        _enum.items.forEach((item)=>{
            out.push("{ id: '" + (item.name) + "', name: 'enums." + (_enum.name) + "." + (item.name) + "' },\n");
        });
        out.push("\n");
        out.push("];\n");
        out.push("const Input = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.SelectInput\n");
        out.push("      {...props}\n");
        out.push("      choices={choices}\n");
        out.push("    />\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push("const Field = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (<uix.SelectField {...props} choices={choices}/>)\n");
        out.push("  }\n");
        out.push("\n");
        out.push("export default {\n");
        out.push("  Input,\n");
        out.push("  Field,\n");
        out.push("  choices,\n");
        out.push("};");
        chunkEnd();
        out = Object.keys(result).filter((i)=>i !== '$$$main$$$').map((curr)=>({
                name: curr,
                content: result[curr]
            }));
        if (out.some((t)=>typeof t == 'object')) {
            return out.map(chunk = ({
                ...chunk,
                content: Array.isArray(chunk.content) ? chunk.content.join('') : chunk.content
            }));
        } else {
            return out.join('');
        }
    },
    compile: function() {
        this.chunks = "$$$main$$$";
        this.alias = [
            "ui-enums"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/ui-enums.njs.js.map
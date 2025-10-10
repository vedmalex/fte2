module.exports = {
    chunks: "$$$main$$$",
    alias: [
        "ui-root"
    ],
    script: function(model, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = model;
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
        out.push("\n");
        out.push("\n");
        out.push("\n");
        chunkStart(`index.js`);
        out.push("\n");
        out.push("\n");
        out.push("import React from 'react';\n");
        out.push("import Admin from './ui/admin';\n");
        out.push("import dataProvider from './data-provider-fb-auth';\n");
        out.push("import authProvider from './auth-provider-fb';\n");
        out.push("\n");
        out.push("export default ({ title }) => (\n");
        out.push("  <Admin\n");
        out.push("    locale=\"russian\"\n");
        out.push("    authProvider={authProvider}\n");
        out.push("    dataProvider={dataProvider}\n");
        out.push("    title={title}\n");
        out.push("  />\n");
        out.push(");");
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
            "ui-root"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/next-js/ui-root.njs.js.map
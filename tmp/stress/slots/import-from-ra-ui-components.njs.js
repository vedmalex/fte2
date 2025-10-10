module.exports = {
    alias: [],
    script: function(items, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = items;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const separatedItems = Object.keys(items.reduce((res, it)=>{
            it.split(',').map((i)=>i.trim()).filter((f)=>f).reduce((r, cur)=>{
                r[cur] = 1;
                return r;
            }, res);
            return res;
        }, {}));
        out.push("\n");
        if (separatedItems.length > 0) {
            out.push("\n");
            out.push("import { components } from 'oda-ra-ui';\n");
            out.push("const {\n");
            separatedItems.forEach((item)=>{
                out.push("\n");
                out.push("  " + (item.trim()) + ",\n");
            });
            out.push("\n");
            out.push("} = components;\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [];
    },
    dependency: {}
};

//# sourceMappingURL=slots/import-from-ra-ui-components.njs.js.map
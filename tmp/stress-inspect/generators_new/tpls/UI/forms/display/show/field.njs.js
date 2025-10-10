module.exports = {
    alias: [
        "display-show-field"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, grid, embedded } = ctx;
        out.push("\n");
        out.push("<uix.primitive." + (f.type) + ".Field \n");
        out.push("  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" \n");
        out.push("  source={`" + (source) + (f.name));
        if (f.isFile) {
            out.push(".src");
        }
        out.push("`}\n");
        out.push("  ");
        if (grid && embedded) {
            out.push("sortable={false}");
        }
        out.push("\n");
        if (f.isFile) {
            out.push("title={`" + (source) + (f.name) + ".name`}");
        }
        out.push("\n");
        out.push("/>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-field"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/field.njs.js.map
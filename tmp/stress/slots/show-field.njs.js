module.exports = {
    alias: [
        "show-field"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const { entity, f } = ctx;
        out.push("\n");
        const type = (f.type == "Number" ? "Text" : f.type) + 'Field';
        if (f.type === 'JSON') {
            slot('import-from-ra-ui-components-show', `${type}`);
        } else {
            slot('import-from-react-admin-show', `${type}`);
        }
        out.push("\n");
        out.push("<" + (type) + " \n");
        out.push("  label=\"resources." + (entity.name) + ".fields." + (f.name) + "\" \n");
        out.push("  source=\"" + (f.name) + "\"\n");
        out.push("/>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "show-field"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=slots/show-field.njs.js.map
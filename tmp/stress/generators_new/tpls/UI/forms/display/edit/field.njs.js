module.exports = {
    alias: [
        "display-edit-field"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, readonly } = ctx;
        const type = `${(f.calculated || f.readonly || readonly) ? 'Readonly' + f.type : f.type}`;
        out.push("<uix.primitive." + (type) + ".Input");
        if (f.defaultValue) {
            out.push("\n");
            out.push("  defaultValue={" + (f.defaultValue) + "}");
        }
        out.push("\n");
        out.push("  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        if (f.hint) {
            out.push("helperText=\"resources." + (f.inheritedFrom || entity.name) + ".helpers." + (f.name) + "\"\n");
        } else {
            out.push("helperText={false}");
        }
        out.push("\n");
        out.push("  source={`" + (source) + (f.name) + "`}\n");
        out.push("  ");
        if (!f.required) {
            out.push("allowEmpty");
        } else {
            out.push("validate={uix.required()}");
        }
        out.push("\n");
        out.push("/>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-edit-field"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/edit/field.njs.js.map
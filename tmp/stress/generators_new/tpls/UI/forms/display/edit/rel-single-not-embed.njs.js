module.exports = {
    alias: [
        "display-edit-rel-single-not-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, sectionLabel, readonly } = ctx;
        out.push("<uix.ReferenceInput" + "  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        out.push("  source={`" + (source) + (f.ref.backField) + "`}\n");
        if (f.hint) {
            out.push("helperText=\"resources." + (f.inheritedFrom || entity.name) + ".helpers." + (f.name) + "\"\n");
        } else {
            out.push("helperText={false}");
        }
        out.push("\n");
        const empty = '{}';
        out.push("\n");
        out.push("  filter={" + (f.ref.editFilter ? f.ref.editFilter : empty) + "}\n");
        out.push("  reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"");
        if (!f.required) {
            out.push("\n");
            out.push("  allowEmpty");
        } else {
            out.push("validate={uix.required()}");
        }
        out.push("\n");
        out.push(">\n");
        out.push("  ");
        if (f.ref.autocomplete) {
            out.push("<uix.AutocompleteInput optionText={uix." + (f.ref.entity) + ".inputText} />\n");
            out.push("  ");
        } else {
            out.push("<uix.SelectInput optionText={<uix." + (f.ref.entity) + ".SelectTitle />} />\n");
            out.push("  ");
        }
        out.push("</uix.ReferenceInput>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-edit-rel-single-not-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/edit/rel-single-not-embed.njs.js.map
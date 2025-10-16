module.exports = {
    alias: [
        "display-edit-rel-multiple-not-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, sectionLabel, readonly } = ctx;
        out.push("<uix.FormDataConsumer>" + "  {({ formData, ...rest }) => (\n");
        out.push("    <div style={{display:'flex'}}>\n");
        out.push("      ");
        if (sectionLabel) {
            out.push("\n");
            out.push("      <uix.HeaderLabel text=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" />\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      <uix.ReferenceArrayInput\n");
        out.push("        {...rest}\n");
        out.push("        label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        out.push("        source={`" + (source) + (f.ref.backField) + "`}\n");
        out.push("        ");
        const empty = '{}';
        out.push("\n");
        out.push("        filter={" + (f.ref.editFilter ? f.ref.editFilter : empty) + "}\n");
        out.push("        reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
        out.push("        ");
        if (!f.required) {
            out.push("allowEmpty");
        } else {
            out.push("validate={uix.required()}");
        }
        out.push("\n");
        out.push("      >\n");
        out.push("    ");
        if (f.ref.autocomplete) {
            out.push("<uix.AutocompleteArrayInput optionText={uix." + (f.ref.entity) + ".inputText } />\n");
            out.push("    ");
        } else {
            out.push("<uix.SelectArrayInput optionText={<uix." + (f.ref.entity) + ".SelectTitle />} />\n");
            out.push("    ");
        }
        out.push("</uix.ReferenceArrayInput>" + "      <uix." + (f.ref.entity) + ".Add {...rest} target={'" + (f.ref.opposite) + "'} label=\"resources." + (f.inheritedFrom || entity.name) + ".actions." + (f.name) + "\" />\n");
        out.push("    </div>\n");
        out.push("  )}\n");
        out.push("</uix.FormDataConsumer>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-edit-rel-multiple-not-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/edit/rel-multiple-not-embed.njs.js.map
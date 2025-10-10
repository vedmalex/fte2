module.exports = {
    alias: [
        "display-edit-rel-single-not-embed-w-preview"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, sectionLabel, readonly } = ctx;
        out.push("\n");
        out.push("<uix.InputWithPreview\n");
        out.push("  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        out.push("  source={`" + (source) + (f.ref.backField) + "`}\n");
        out.push("  reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
        out.push("  entity=\"" + (f.ref.entity) + "\"\n");
        out.push("  perPage={10000}\n");
        if (f.hint) {
            out.push("\n");
            out.push("  helperText=\"resources." + (f.inheritedFrom || entity.name) + ".helpers." + (f.name) + "\"\n");
        } else {
            out.push("\n");
            out.push("  helperText={false}\n");
        }
        out.push("\n");
        const empty = '{}';
        out.push("\n");
        out.push("  filter={" + (f.ref.editFilter ? f.ref.editFilter : empty) + "}\n");
        out.push("  Select={\n");
        out.push("  ");
        if (f.ref.autocomplete) {
            out.push("\n");
            out.push("    uix.AutocompleteInput\n");
            out.push("  ");
        } else {
            out.push("\n");
            out.push("    uix.SelectInput\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  }\n");
        out.push("  ");
        if (!f.required) {
            out.push("\n");
            out.push("  allowEmpty");
        } else {
            out.push("\n");
            out.push("  validate={uix.required()}");
        }
        out.push("\n");
        out.push("  optionText={\n");
        out.push("  ");
        if (f.ref.autocomplete) {
            out.push("\n");
            out.push("    uix." + (f.ref.entity) + ".inputText\n");
            out.push("  ");
        } else {
            out.push("\n");
            out.push("    <uix." + (f.ref.entity) + ".SelectTitle />\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  }\n");
        out.push("  >\n");
        out.push("    <uix.SimpleForm resource=\"" + (entity.model.entityPathMapper[entity.name]) + "\">\n");
        out.push("  ");
        const e = entity.model.entities.find((e)=>e.name === f.ref.entity);
        const context = {
            entity: {
                ...e,
                props: e.lists.quickCreate
            },
            source: '',
            sectionLabel,
            readonly
        };
        out.push("\n");
        out.push("    " + (partial(context, 'display-edit-entity')) + "\n");
        out.push("    </uix.SimpleForm>\n");
        out.push("  </uix.InputWithPreview>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-edit-rel-single-not-embed-w-preview"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/edit/rel-single-not-embed-w-preview.njs.js.map
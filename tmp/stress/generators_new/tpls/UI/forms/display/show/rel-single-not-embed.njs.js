module.exports = {
    alias: [
        "display-show-rel-single-not-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const { entity, f, source, sectionLabel, customizable } = ctx;
        out.push("\n");
        if (sectionLabel && customizable) {
            out.push("\n");
            out.push("<>\n");
        }
        out.push("\n");
        if (sectionLabel) {
            out.push("\n");
            out.push("<uix.HeaderLabel text=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" />\n");
        }
        out.push("\n");
        out.push("<uix.ReferenceField\n");
        if (sectionLabel) {
            out.push("\n");
            out.push("  addLabel={false}\n");
        } else {
            out.push("\n");
            out.push("  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        }
        out.push("\n");
        out.push("  source={`" + (source) + (f.ref.backField) + "`}\n");
        const empty = '{}';
        out.push("\n");
        out.push("  filter={" + (f.ref.showFilter ? f.ref.showFilter : empty) + "}\n");
        out.push("  reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
        out.push("  link=\"show\"\n");
        out.push(">\n");
        out.push("  <uix." + (f.ref.entity) + ".SelectTitle />\n");
        out.push("</uix.ReferenceField>\n");
        if (sectionLabel && customizable) {
            out.push("\n");
            out.push("</>\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-rel-single-not-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/rel-single-not-embed.njs.js.map
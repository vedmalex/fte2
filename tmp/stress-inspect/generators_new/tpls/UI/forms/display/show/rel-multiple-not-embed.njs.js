module.exports = {
    alias: [
        "display-show-rel-multiple-not-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
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
        if (f.ref.using) {
            out.push("\n");
            out.push("<uix.ReferenceArrayField\n");
            out.push("  ");
            if (sectionLabel) {
                out.push("\n");
                out.push("    addLabel={false}\n");
                out.push("  ");
            } else {
                out.push("\n");
                out.push("    label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
            out.push("  source=\"" + (f.name) + "\"\n");
            out.push(">\n");
            out.push("  <uix." + (f.ref.entity) + ".Grid/>\n");
            out.push("</uix.ReferenceArrayField>\n");
        } else {
            out.push("\n");
            out.push("<uix.ReferenceManyField\n");
            out.push("  ");
            if (sectionLabel) {
                out.push("\n");
                out.push("    addLabel={false}\n");
                out.push("  ");
            } else {
                out.push("\n");
                out.push("    label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"\n");
            const empty = '{}';
            out.push("\n");
            out.push("  filter={" + (f.ref.showFilter ? f.ref.showFilter : empty) + "}\n");
            out.push("  target=\"" + (f.ref.opposite) + "\"\n");
            out.push(">\n");
            out.push("  <uix." + (f.ref.using ? f.ref.using.entity : f.ref.entity) + ".Grid fields={'!" + (f.ref.opposite) + "'}/>\n");
            out.push("</uix.ReferenceManyField>\n");
        }
        out.push("\n");
        if (sectionLabel && customizable) {
            out.push("\n");
            out.push("</>\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-rel-multiple-not-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/rel-multiple-not-embed.njs.js.map
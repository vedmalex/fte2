module.exports = {
    alias: [
        "display-show-rel-multiple-not-embed-stored"
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
        out.push("<uix.ReferenceArrayField\n");
        if (sectionLabel) {
            out.push("\n");
            out.push("  addLabel={false}\n");
        } else {
            out.push("\n");
            out.push("  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        }
        out.push("\n");
        out.push("  reference=\"" + (entity.model.entityPathMapper[!(f.verb === 'BelongsToMany' && f.ref.using) ? f.ref.entity : f.ref.using.entity]) + "\"\n");
        const empty = '{}';
        out.push("\n");
        out.push("  filter={" + (f.ref.showFilter ? f.ref.showFilter : empty) + "}\n");
        out.push("  source={`" + (source) + (f.ref.backField) + "`}\n");
        out.push(">\n");
        out.push("  <uix." + (!(f.verb === 'BelongsToMany' && f.ref.using) ? f.ref.entity : f.ref.using.entity) + ".Grid fields={'!" + (f.name) + "'}/>\n");
        out.push("</uix.ReferenceArrayField>\n");
        if (sectionLabel && customizable) {
            out.push("\n");
            out.push("</>\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-rel-multiple-not-embed-stored"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/rel-multiple-not-embed-stored.njs.js.map
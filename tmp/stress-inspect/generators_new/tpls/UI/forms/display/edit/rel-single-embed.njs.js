module.exports = {
    alias: [
        "display-edit-rel-single-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, sectionLabel, readonly, grid, customizable } = ctx;
        out.push("\n");
        const e = entity.model.entities.find((e)=>e.name === f.ref.entity);
        const context = {
            entity: {
                ...e,
                props: e.lists.all
            },
            source: source ? `${source}${f.ref.backField}.` : `${f.ref.backField}.`,
            sectionLabel: !grid && sectionLabel,
            readonly,
            customizable
        };
        out.push("\n");
        if (customizable) {
            out.push("\n");
            out.push("<>\n");
        }
        out.push("\n");
        if (sectionLabel) {
            out.push("\n");
            out.push("<uix.HeaderLabel text=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" />\n");
        }
        out.push("\n");
        out.push((partial(context, 'display-edit-entity')) + "\n");
        if (customizable) {
            out.push("\n");
            out.push("</>\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-edit-rel-single-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/edit/rel-single-embed.njs.js.map
module.exports = {
    alias: [
        "display-show-rel-single-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const { entity, f, source, grid, embedded, sectionLabel, customizable } = ctx;
        out.push("\n");
        const e = entity.model.entities.find((e)=>e.name === f.ref.entity);
        const context = {
            entity: {
                ...e,
                props: e.lists.all.filter((fl)=>fl.name !== f.name)
            },
            source: source ? `${source}${f.name}.` : `${f.name}.`,
            grid,
            embedded,
            sectionLabel: !grid && sectionLabel,
            customizable
        };
        out.push("\n");
        if (sectionLabel) {
            out.push("\n");
            out.push("<uix.HeaderLabel text=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" />\n");
        }
        out.push("\n");
        out.push((partial(context, 'display-show-entity')) + "\n");
        out.push("");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-rel-single-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/rel-single-embed.njs.js.map
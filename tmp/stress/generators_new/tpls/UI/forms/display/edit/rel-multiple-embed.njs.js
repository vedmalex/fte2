module.exports = {
    alias: [
        "display-edit-rel-multiple-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const { entity, f, source, sectionLabel, readonly } = ctx;
        out.push("<uix.ArrayInput" + "  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        out.push("  source={`" + (source) + (f.ref.backField) + "`}\n");
        out.push("  allowEmpty\n");
        out.push(">\n");
        out.push("  <uix.SimpleFormIterator>\n");
        out.push("  ");
        const e = entity.model.entities.find((e)=>e.name === f.ref.entity);
        const context = {
            entity: {
                ...e,
                props: !readonly ? e.lists.all : e.lists.all.map((f)=>({
                        ...f,
                        readonly
                    }))
            },
            sectionLabel: true,
            source: ''
        };
        out.push("\n");
        out.push("    " + (partial(context, 'display-edit-entity')) + "\n");
        out.push("  </uix.SimpleFormIterator>\n");
        out.push("</uix.ArrayInput>");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-edit-rel-multiple-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/edit/rel-multiple-embed.njs.js.map
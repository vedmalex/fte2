module.exports = {
    alias: [
        "display-show-rel-multiple-embed"
    ],
    script: function(ctx, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = ctx;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const { entity, f, source, embedded, sectionLabel, grid, customizable } = ctx;
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
        out.push("<uix.ArrayField\n");
        if (sectionLabel) {
            out.push("\n");
            out.push("  addLabel={false}\n");
        } else {
            out.push("\n");
            out.push("  label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\"\n");
        }
        out.push("\n");
        out.push("  source={`" + (source) + (f.ref.backField) + "`}\n");
        out.push("  >\n");
        const e = entity.model.entities.find((e)=>e.name === f.ref.entity);
        const context = {
            entity: {
                ...e,
                props: e.lists.all.filter((fl)=>fl.name !== f.name)
            },
            source: "",
            grid: true,
            embedded: f.embedded,
            sectionLabel: !grid && sectionLabel
        };
        out.push("\n");
        out.push("  <uix.Datagrid {...props} ");
        if (!e.embedded) {
            out.push("rowClick=\"edit\"");
        }
        out.push(" >\n");
        out.push("    " + (partial(context, 'display-show-entity')) + "\n");
        out.push("    ");
        e.actions.forEach((action)=>{
            out.push("\n");
            out.push("        <uix." + (e.name) + "." + (action.fullName) + " />\n");
            out.push("    ");
        });
        out.push("\n");
        if (!(e.embedded || e.abstract)) {
            out.push("\n");
            out.push("    <uix.ShowButton label=\"\" />\n");
            out.push("    <uix.CloneButton label=\"\" />\n");
        }
        out.push("\n");
        out.push("  </uix.Datagrid>\n");
        out.push("</uix.ArrayField>\n");
        if (sectionLabel && customizable) {
            out.push("\n");
            out.push("</>\n");
        }
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "display-show-rel-multiple-embed"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/display/show/rel-multiple-embed.njs.js.map
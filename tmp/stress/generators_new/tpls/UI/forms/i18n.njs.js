module.exports = {
    alias: [
        "forms-i18n"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const rels = entity.props.filter((f)=>f.ref).filter((r)=>!r.single && !r.ref.embedded);
        out.push("\n");
        out.push("\n");
        out.push("export default {\n");
        out.push("  resources: {\n");
        out.push("    " + (entity.name) + ": {\n");
        out.push("      summary: '" + (entity.UI.generalTab || 'Общая информация') + "',\n");
        out.push("      name: '" + (entity.title) + " |||| " + (entity.titlePlural || entity.plural) + "',\n");
        out.push("      fields: {\n");
        out.push("\n");
        entity.props.forEach((f)=>{
            if (!f.ref && !f.inheritedFrom) {
                out.push("\n");
                out.push("        " + (f.name) + ": '" + (f.label) + "',\n");
            } else if (f.ref && !f.inheritedFrom) {
                out.push("\n");
                out.push("        " + (f.name) + ": '" + (f.label) + "',\n");
            }
        });
        out.push("\n");
        out.push("      },\n");
        const hintList = entity.props.filter((f)=>f.hint);
        if (hintList.length > 0) {
            out.push("\n");
            out.push("      helpers:{\n");
            entity.props.filter((f)=>f.hint).forEach((f)=>{
                if (!f.ref && !f.inheritedFrom) {
                    out.push("\n");
                    out.push("        " + (f.name) + ": '" + (f.hint) + "',\n");
                } else if (f.ref && !f.inheritedFrom) {
                    out.push("\n");
                    out.push("        " + (f.name) + ": '" + (f.hint) + "',\n");
                }
            });
            out.push("\n");
            out.push("      },\n");
        }
        out.push("\n");
        if (entity.actions.length > 0 || rels.length > 0) {
            out.push("\n");
            out.push("      actions:{\n");
            entity.actions.forEach((action)=>{
                out.push("\n");
                out.push("        " + (action.name) + ": '" + (action.title) + "',\n");
            });
            out.push("\n");
            rels.forEach((rel)=>{
                out.push("\n");
                out.push("  " + (rel.name) + ": '" + (rel?.metadata?.UI?.actions?.add || rel.label) + "',\n");
            });
            out.push("\n");
            out.push("      },\n");
        }
        out.push("\n");
        out.push("    }\n");
        out.push("  },\n");
        out.push("}");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-i18n"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/i18n.njs.js.map
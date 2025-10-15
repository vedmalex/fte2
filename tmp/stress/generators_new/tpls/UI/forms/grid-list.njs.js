module.exports = {
    alias: [
        "forms-grid-list"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React, { useContext } from 'react';\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("\n");
        out.push("const SmallList = (props) => {\n");
        out.push("   const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("  <uix.SimpleList {...props} primaryText={record => \n");
        out.push("    ");
        entity.UI.listName.forEach((ln)=>{
            out.push("\n");
            out.push("      record." + (ln) + " ||\n");
            out.push("    ");
        });
        out.push("\n");
        out.push("    record.id } />\n");
        out.push(");}\n");
        out.push("\n");
        out.push("export default SmallList;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-grid-list"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/grid-list.njs.js.map
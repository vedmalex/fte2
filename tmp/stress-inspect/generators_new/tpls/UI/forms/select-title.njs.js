module.exports = {
    alias: [
        "forms-select-title"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React from \"react\";\n");
        out.push("\n");
        out.push("export const inputText = record => record ? (\n");
        out.push("    ");
        entity.UI.listName.forEach((ln)=>{
            out.push("\n");
            out.push("      record." + (ln) + " ||\n");
            out.push("    ");
        });
        out.push("\n");
        out.push("    record.id ):'';\n");
        out.push("\n");
        out.push("const Title = ({ record }) => (\n");
        out.push("  <span>{record ? (\n");
        out.push("    ");
        entity.UI.listName.forEach((ln)=>{
            out.push("\n");
            out.push("      record." + (ln) + " ||\n");
            out.push("    ");
        });
        out.push("\n");
        out.push("    record.id ):''}</span>\n");
        out.push(");\n");
        out.push("\n");
        out.push("export default Title;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-select-title"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/select-title.njs.js.map
module.exports = {
    alias: [
        "forms-grid-view"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React, { useContext } from \"react\";\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import { prepareExcludeList } from '../';\n");
        out.push("// import { useTranslate } from 'react-admin';\n");
        out.push("\n");
        out.push("const Grid = ({ fields, ...props }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const excludedField = prepareExcludeList(fields)\n");
        out.push("  // const translate = useTranslate();\n");
        out.push("  return (\n");
        out.push("  <uix.Datagrid {...props} ");
        if (!entity.embedded) {
            out.push("rowClick=\"edit\"");
        }
        out.push(" >\n");
        out.push("   ");
        const list = !(entity.embedded || entity.abstract) ? 'list' : 'all';
        const ctx = {
            entity: {
                ...entity,
                props: entity.lists[list],
                sectionLabel: false,
                grid: true
            },
            source: '',
            customizable: true
        };
        out.push("\n");
        out.push("\n");
        out.push("      " + (partial(ctx, 'display-show-entity')) + "\n");
        out.push("\n");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("    <uix." + (entity.name) + "." + (action.fullName) + " />\n");
        });
        out.push("\n");
        out.push("\n");
        if (!(entity.embedded || entity.abstract)) {
            out.push("\n");
            out.push("    <uix.ShowButton label=\"\" />\n");
            out.push("    <uix.CloneButton label=\"\" />\n");
        }
        out.push("\n");
        out.push("  </uix.Datagrid>\n");
        out.push(");}\n");
        out.push("\n");
        out.push("export default Grid;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-grid-view"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/grid-view.njs.js.map
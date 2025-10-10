module.exports = {
    alias: [
        "forms-filter"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push("import React, { useContext } from \"react\";\n");
        out.push("import { withStyles } from '@material-ui/core/styles';\n");
        out.push("import styles from './styles';\n");
        out.push("\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import { useTranslate } from 'react-admin';\n");
        out.push("\n");
        out.push("const FilterPanel = ({ classes, ...props }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const translate = useTranslate();\n");
        out.push("  return (\n");
        out.push("  <uix.Filter {...props} >\n");
        out.push("\n");
        if (entity.UI.quickSearch) {
            out.push("\n");
            out.push("    <uix.TextInput label=\"uix.filter.search\" source=\"q\" allowEmpty alwaysOn />\n");
        }
        out.push("\n");
        out.push("\n");
        out.push(" ");
        entity.lists.all.forEach((f, index)=>{
            const ctx = {
                entity,
                f,
                source: '',
                label: ''
            };
            out.push("\n");
            out.push("  " + (partial(ctx, 'display-filter-entity')) + "\n");
        });
        out.push("\n");
        out.push("  </uix.Filter>\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("export default withStyles(styles)(FilterPanel);");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-filter"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/filter.njs.js.map
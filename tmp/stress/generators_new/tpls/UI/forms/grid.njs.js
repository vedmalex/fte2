module.exports = {
    alias: [
        "forms-grid"
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
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import useMediaQuery from '@material-ui/core/useMediaQuery';\n");
        out.push("\n");
        out.push("const Grid = ({fields, ...props}) =>  {\n");
        out.push("  const { filterValues } = props;\n");
        out.push("  const filteredFields = filterValues\n");
        out.push("    ? Object.keys(filterValues).reduce((list, fld) => {\n");
        out.push("        if (fld.match(/-eq/)) {\n");
        out.push("          list.push(`!${fld.split('-')[0]}`);\n");
        out.push("        }\n");
        out.push("        return list;\n");
        out.push("      }, [])\n");
        out.push("    : undefined;\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));\n");
        out.push("  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n");
        out.push("  // const Result = isXSmall\n");
        out.push("  //   ? uix." + (entity.name) + ".ListView \n");
        out.push("  //   : isSmall \n");
        out.push("  //   ? uix." + (entity.name) + ".CardView \n");
        out.push("  //   : uix." + (entity.name) + ".GridView\n");
        out.push("\n");
        out.push("  const Result = uix." + (entity.name) + ".GridView\n");
        out.push("\n");
        out.push("  return (\n");
        out.push("    <Result\n");
        out.push("      {...props}\n");
        out.push("      fields={fields ? fields.concat(filteredFields) : filteredFields}\n");
        out.push("    />\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("export default Grid;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-grid"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/grid.njs.js.map
module.exports = {
    alias: [
        "forms-preview"
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
        out.push("import React, { useContext } from 'react';\n");
        out.push("import { connect } from 'react-redux';\n");
        out.push("import { withStyles } from '@material-ui/core/styles';\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("\n");
        out.push("const styles = theme => ({\n");
        out.push("  field: {\n");
        out.push("    // These styles will ensure our drawer don't fully cover our\n");
        out.push("    // application when teaser or title are very long\n");
        out.push("    '& span': {\n");
        out.push("      display: 'inline-block',\n");
        out.push("      maxWidth: '30rem',\n");
        out.push("    },\n");
        out.push("  },\n");
        out.push("});\n");
        out.push("\n");
        out.push("const " + (entity.name) + "PreviewView = ({ classes, ...props }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.SimpleShowLayout {...props}>\n");
        out.push("    ");
        const ctx = {
            entity: {
                ...entity,
                props: entity.lists.preview
            },
            source: ''
        };
        out.push("\n");
        out.push("      " + (partial(ctx, 'display-show-entity')) + "\n");
        out.push("    </uix.SimpleShowLayout>\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("const mapStateToProps = (state, props) => ({\n");
        out.push("  // Get the record by its id from the react-admin state.\n");
        out.push("  record: state.admin.resources." + (entity.name) + "\n");
        out.push("    ? state.admin.resources." + (entity.name) + ".data[props.id]\n");
        out.push("    : null,\n");
        out.push("  version: state.admin.ui.viewVersion,\n");
        out.push("});\n");
        out.push("\n");
        out.push("const " + (entity.name) + "Preview = connect(\n");
        out.push("  mapStateToProps,\n");
        out.push("  {},\n");
        out.push(")(withStyles(styles)(" + (entity.name) + "PreviewView));\n");
        out.push("\n");
        out.push("export default " + (entity.name) + "Preview;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-preview"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/preview.njs.js.map
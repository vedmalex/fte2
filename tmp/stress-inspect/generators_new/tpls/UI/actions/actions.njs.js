module.exports = {
    alias: [
        "actions"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React, {Component} from \"react\";\n");
        out.push("import PropTypes from 'prop-types';\n");
        out.push("import { connect } from 'react-redux';\n");
        out.push("import { Button } from 'react-admin';\n");
        out.push("\n");
        out.push("\n");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("// " + (action.name) + "\n");
            out.push("// " + (action.actionType) + "\n");
            out.push("// " + (action.actionName) + "\n");
            out.push("\n");
            out.push("export const " + (action.actionName) + " = '" + (action.actionName) + "';\n");
            out.push("export const " + (action.actionCreatorName) + " = (data) => ({\n");
            out.push("  type: " + (action.actionName) + ",\n");
            out.push("  payload: { data, resource: '" + (entity.name) + "' },\n");
            out.push("  // dataProvider hack\n");
            out.push("  meta: { fetch: 'EXECUTE', resource: '" + (action.actionCreatorName) + "' },\n");
            out.push("});\n");
            out.push("\n");
            out.push("/**\n");
            out.push("*  // define this method in dataProvider to use this\n");
            out.push("*  async function " + (action.actionCreatorName) + "(data, resource){\n");
            out.push("*    \n");
            out.push("*  }\n");
            out.push("*/\n");
            out.push("\n");
            out.push("class " + (action.fullName) + "Action  extends Component {\n");
            out.push("  handleClick = () => {\n");
            out.push("    const { " + (action.actionCreatorName) + ", record } = this.props;\n");
            out.push("    " + (action.actionCreatorName) + "(record);\n");
            out.push("  }\n");
            out.push("  render(){\n");
            out.push("    return(<Button onClick={this.handleClick} label=\"resources." + (entity.name) + ".actions." + (action.name) + "\"/>);\n");
            out.push("  }\n");
            out.push("}\n");
            out.push("\n");
            out.push((action.fullName) + "Action.propTypes = {\n");
            out.push("  " + (action.actionCreatorName) + ": PropTypes.func.isRequired,\n");
            out.push("  record: PropTypes.object,\n");
            out.push("};\n");
            out.push("\n");
            out.push("export const " + (action.fullName) + "Button = connect(null, {\n");
            out.push("  " + (action.actionCreatorName) + ",\n");
            out.push("})(" + (action.fullName) + "Action);\n");
            out.push("\n");
        });
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "actions"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/actions/actions.njs.js.map
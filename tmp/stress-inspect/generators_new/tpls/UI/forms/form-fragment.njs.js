module.exports = {
    alias: [
        "forms-form-fragments"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const rels = entity.props.filter((f)=>f.ref).filter((r)=>!r.single && !r.ref.embedded);
        out.push("\n");
        out.push("\n");
        out.push("import React, { useContext } from 'react';\n");
        out.push("import PropTypes from 'prop-types';\n");
        out.push("import { useLocation } from 'react-router';\n");
        out.push("import { Link } from 'react-router-dom';\n");
        out.push("import AddIcon from '@material-ui/icons/Add';\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import useListParams from 'ra-core/lib/controller/useListParams';\n");
        out.push("\n");
        if (entity.actions.length > 0) {
            out.push("\n");
            out.push("import { connect } from 'react-redux';\n");
            out.push("import ExecuteActionIcon from '@material-ui/icons/Settings';\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("// action definitions\n");
        out.push((content('actions')) + "\n");
        out.push("\n");
        out.push("// rel buttons\n");
        out.push((content('add-buttons')));
        return out.join('');
    },
    blocks: {
        "actions": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            entity.actions.forEach((action)=>{
                out.push("\n");
                out.push("export const " + (action.actionName) + " = '" + (action.actionName) + "';\n");
                out.push("export const " + (action.actionCreatorName) + " = (data) => ({\n");
                out.push("  type: " + (action.actionName) + ",\n");
                out.push("  payload: { data, resource: '" + (entity.model.entityPathMapper[entity.name]) + "' },\n");
                out.push("  // dataProvider hack\n");
                out.push("  meta: { fetch: 'EXECUTE', resource: '" + (action.actionCreatorName) + "' },\n");
                out.push("});\n");
                out.push("\n");
                out.push("/**\n");
                out.push("  // define this method in dataProvider to use this\n");
                out.push("  async function " + (action.actionCreatorName) + "(data, resource){\n");
                out.push("\n");
                out.push("  }\n");
                out.push("*/\n");
                out.push("\n");
                out.push("const " + (action.fullName) + "Action  = ({ " + (action.actionCreatorName) + ", record, selectedIds, children }) => {\n");
                out.push("  const uix = useContext(UIXContext);\n");
                out.push("  return (\n");
                out.push("  <uix.Button onClick={() =>\n");
                out.push("    " + (action.actionCreatorName) + "({record, selectedIds})\n");
                out.push("  }\n");
                out.push("  label=\"resources." + (entity.name) + ".actions." + (action.name) + "\"\n");
                out.push("  >\n");
                out.push("    {children ? children : (<ExecuteActionIcon/>)}\n");
                out.push("  </uix.Button>);}\n");
                out.push("\n");
                out.push("\n");
                out.push((action.fullName) + "Action.propTypes = {\n");
                out.push("  " + (action.actionCreatorName) + ": PropTypes.func.isRequired,\n");
                out.push("  record: PropTypes.object,\n");
                out.push("};\n");
                out.push("\n");
                out.push("\n");
                out.push("export const " + (action.fullName) + "Button = connect(null, {\n");
                out.push("  " + (action.actionCreatorName) + ",\n");
                out.push("})(" + (action.fullName) + "Action);\n");
            });
            out.push("\n");
            out.push("\n");
            out.push("export const actions = {\n");
            entity.actions.forEach((action)=>{
                out.push("\n");
                out.push("  " + (action.name) + ":{\n");
                out.push("    type:'" + (action.actionType) + "',\n");
                out.push("    creator: " + (action.actionCreatorName) + ",\n");
                out.push("    action: " + (action.actionName) + ",\n");
                out.push("    button: " + (action.fullName) + "Button,\n");
                out.push("  },\n");
            });
            out.push("\n");
            out.push("}");
            return out.join('');
        },
        "add-buttons": function(entity, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = entity;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            out.push("const Add" + (entity.name) + " = ({ record, target, label, children }) => {\n");
            out.push("  const location = useLocation()\n");
            out.push("  const uix = useContext(UIXContext);\n");
            out.push("  const to = {\n");
            out.push("    pathname: `/" + (entity.model.entityPathMapper[entity.name]) + "/create`,\n");
            out.push("  };\n");
            out.push("\n");
            out.push("  to.state = { pathname: location.pathname };\n");
            out.push("  const newRecord = target && record && record.id ? { [target]: record.id } : undefined;\n");
            out.push("  if (newRecord) {\n");
            out.push("    to.state.record = newRecord;\n");
            out.push("  }\n");
            out.push("  return (\n");
            out.push("    <uix.Button\n");
            out.push("      component={Link}\n");
            out.push("      to={to}\n");
            out.push("      label={label}>\n");
            out.push("      {children || <AddIcon/>}\n");
            out.push("    </uix.Button>\n");
            out.push("  );\n");
            out.push("};\n");
            out.push("\n");
            out.push("Add" + (entity.name) + ".propTypes = {\n");
            out.push("  record: PropTypes.object,\n");
            out.push("  target: PropTypes.string.isRequired,\n");
            out.push("  label: PropTypes.string.isRequired,\n");
            out.push("}\n");
            out.push("\n");
            out.push("const Create" + (entity.name) + "Button = ({ resource, label, children }) => {\n");
            out.push("  const location = useLocation()\n");
            out.push("  const uix = useContext(UIXContext);\n");
            out.push("  const [{ filterValues }] = useListParams({ resource, location });\n");
            out.push("  const record = filterValues\n");
            out.push("    ? Object.keys(filterValues).reduce((rec, fld) => {\n");
            out.push("        if (fld.match(/-eq/)) {\n");
            out.push("          rec[fld.split('-')[0]] = filterValues[fld];\n");
            out.push("        }\n");
            out.push("        return rec;\n");
            out.push("      }, {})\n");
            out.push("    : undefined;\n");
            out.push("  const to = {\n");
            out.push("    pathname: `/" + (entity.model.entityPathMapper[entity.name]) + "/create`,\n");
            out.push("  };\n");
            out.push("  to.state = { pathname: location.pathname };\n");
            out.push("  if (record) {\n");
            out.push("    to.state.record = record;\n");
            out.push("  }\n");
            out.push("  return (\n");
            out.push("    <uix.Button component={Link} to={to} label={label}>\n");
            out.push("      {children || <AddIcon />}\n");
            out.push("    </uix.Button>\n");
            out.push("  );\n");
            out.push("};\n");
            out.push("\n");
            out.push("Create" + (entity.name) + "Button.propTypes = {\n");
            out.push("  label: PropTypes.string.isRequired,\n");
            out.push("};\n");
            out.push("\n");
            out.push("export const buttons = {\n");
            out.push("  Add: Add" + (entity.name) + ",\n");
            out.push("  CreateButton: Create" + (entity.name) + "Button,\n");
            out.push("  ");
            entity.actions.forEach((action)=>{
                out.push("\n");
                out.push("  " + (action.fullName) + ": " + (action.fullName) + "Button,\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("}");
            return out.join('');
        }
    },
    compile: function() {
        this.alias = [
            "forms-form-fragments"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/form-fragment.njs.js.map
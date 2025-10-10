module.exports = {
    alias: [
        "forms-list"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        const listActions = entity.actions.filter((a)=>a.actionType === 'listAction');
        out.push("\n");
        const itemActions = entity.actions.filter((a)=>a.actionType === 'itemAction');
        out.push("\n");
        out.push("import React, { useContext, cloneElement } from \"react\";\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import {\n");
        out.push("  useTranslate,\n");
        out.push("  TopToolbar,\n");
        out.push("  ExportButton,\n");
        out.push("  sanitizeListRestProps\n");
        out.push("} from 'react-admin';\n");
        out.push("\n");
        if (listActions.length > 0) {
            out.push("\n");
            out.push("\n");
            out.push("const " + (entity.name) + "ActionButtons = (props) => {\n");
            out.push("  const uix = useContext(UIXContext);\n");
            out.push("  const translate = useTranslate();\n");
            out.push("\n");
            out.push("  return (\n");
            out.push("  <React.Fragment>\n");
            listActions.forEach((action)=>{
                out.push("\n");
                out.push("    <uix." + (entity.name) + "." + (action.fullName) + " {...props} />\n");
            });
            out.push("\n");
            out.push("    {/* Add the default bulk delete action */}\n");
            out.push("    <uix.BulkDeleteButton {...props} />\n");
            out.push("  </React.Fragment>\n");
            out.push(");}\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("const ListView = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const translate = useTranslate();\n");
        out.push("  return (\n");
        out.push("  <uix.List {...props}\n");
        out.push("  filters={<uix." + (entity.name) + ".Filter />}\n");
        out.push("  actions={<ListActions permissions={props.permissions} />}\n");
        out.push("  title={translate(\"resources." + (entity.name) + ".name\", { smart_count:2 })}\n");
        if (listActions.length > 0) {
            out.push("\n");
            out.push("  bulkActionButtons={<" + (entity.name) + "ActionButtons />}\n");
        }
        out.push("\n");
        out.push("  >\n");
        out.push("    <uix." + (entity.name) + ".Grid />\n");
        out.push("  </uix.List>\n");
        out.push(");}\n");
        out.push("\n");
        out.push("export default ListView;\n");
        out.push("\n");
        out.push("const ListActions = ({\n");
        out.push("  currentSort,\n");
        out.push("  className,\n");
        out.push("  resource,\n");
        out.push("  filters,\n");
        out.push("  displayedFilters,\n");
        out.push("  exporter, // you can hide ExportButton if exporter = (null || false)\n");
        out.push("  filterValues,\n");
        out.push("  permanentFilter,\n");
        out.push("  hasCreate, // you can hide CreateButton if hasCreate = false\n");
        out.push("  basePath,\n");
        out.push("  selectedIds,\n");
        out.push("  onUnselectItems,\n");
        out.push("  showFilter,\n");
        out.push("  maxResults,\n");
        out.push("  total,\n");
        out.push("  permissions,\n");
        out.push("  ...rest\n");
        out.push("}) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>\n");
        out.push("      {filters &&\n");
        out.push("        cloneElement(filters, {\n");
        out.push("          resource,\n");
        out.push("          showFilter,\n");
        out.push("          displayedFilters,\n");
        out.push("          filterValues,\n");
        out.push("          context: 'button',\n");
        out.push("        })}\n");
        out.push("      <uix." + (entity.name) + ".CreateButton\n");
        out.push("        {...rest}\n");
        out.push("        label=\"ra.action.create\"\n");
        out.push("        resource={resource}\n");
        out.push("      />\n");
        out.push("      <ExportButton\n");
        out.push("        disabled={total === 0}\n");
        out.push("        resource={resource}\n");
        out.push("        sort={currentSort}\n");
        out.push("        filter={{ ...filterValues, ...permanentFilter }}\n");
        out.push("        exporter={exporter}\n");
        out.push("        maxResults={maxResults}\n");
        out.push("      />\n");
        out.push("    </TopToolbar>\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("ListActions.defaultProps = {\n");
        out.push("  selectedIds: [],\n");
        out.push("  onUnselectItems: () => null,\n");
        out.push("};");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-list"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/list.njs.js.map
module.exports = {
    alias: [
        "forms-form"
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
        const btRels = entity.props.filter((f)=>f.ref).filter((r)=>r.verb === 'BelongsTo');
        out.push("\n");
        out.push("\n");
        out.push("import React, { useContext } from \"react\";\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push("  const CreateFormToolbar = (props) => {\n");
        out.push("    const uix = useContext(UIXContext);\n");
        out.push("    return (\n");
        out.push("      <uix.Toolbar {...props}>\n");
        out.push("        <uix.SaveButton/>\n");
        out.push("        <uix.SaveButton\n");
        out.push("          label=\"uix.actions.create_and_add\"\n");
        out.push("          redirect={false}\n");
        out.push("          submitOnEnter={false}\n");
        out.push("          variant=\"text\"\n");
        out.push("        />\n");
        out.push("      </uix.Toolbar>\n");
        out.push("    );\n");
        out.push("  }\n");
        out.push("\n");
        out.push("const EditSimple" + (entity.name) + "Actions = ({ basePath, data }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("    return (\n");
        out.push("    <uix.TopToolbar>\n");
        out.push("  ");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("      <uix." + (entity.name) + "." + (action.fullName) + " record={data}/>\n");
            out.push("  ");
        });
        out.push("\n");
        out.push("      <uix.ShowButton record={data} basePath={basePath} />\n");
        out.push("    </uix.TopToolbar>\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("const EditTabbed" + (entity.name) + "Actions = ({ basePath, data }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.TopToolbar>\n");
        out.push("  ");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("      <uix." + (entity.name) + "." + (action.fullName) + " record={data} />\n");
            out.push("  ");
        });
        out.push("\n");
        out.push("      <uix.ShowButton record={data} basePath={basePath} />\n");
        out.push("    </uix.TopToolbar>\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("const ShowSimple" + (entity.name) + "Actions = ({ basePath, data }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.TopToolbar>\n");
        out.push("  ");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("      <uix." + (entity.name) + "." + (action.fullName) + " record={data}/>\n");
            out.push("  ");
        });
        out.push("\n");
        out.push("      <uix.EditButton record={data} basePath={basePath} />\n");
        out.push("    </uix.TopToolbar>\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("const ShowTabbed" + (entity.name) + "Actions = ({ basePath, data }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("  <uix.TopToolbar>\n");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("    <uix." + (entity.name) + "." + (action.fullName) + " record={data}/>\n");
        });
        out.push("\n");
        out.push("    <uix.EditButton record={data} basePath={basePath} />\n");
        out.push("  </uix.TopToolbar>\n");
        out.push(");}\n");
        out.push("\n");
        out.push("export const SimpleForm = (props)=>{\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.SimpleForm {...props}>\n");
        out.push("      <uix.HeaderLabel text=\"resources." + (entity.name) + ".summary\" />\n");
        out.push("      " + (partial({
            entity: {
                ...entity,
                props: entity.lists.all
            },
            source: '',
            sectionLabel: true,
            grid: false
        }, 'display-edit-entity')) + "\n");
        out.push("    </uix.SimpleForm>\n");
        out.push("  )\n");
        out.push("}\n");
        out.push("\n");
        out.push("export const CreateFormSimple = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  " + (content('init-record', btRels)) + "\n");
        out.push("  return (\n");
        out.push("  <uix.Create {...props} >\n");
        out.push("    <uix." + (entity.name) + ".SimpleForm toolbar={<CreateFormToolbar />}\n");
        out.push("    ");
        if (btRels.length > 0) {
            out.push(" redirect={redirect} ");
        }
        out.push("\n");
        out.push("    />\n");
        out.push("  </uix.Create >\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("export const EditFormSimple = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("  <uix.Edit title={<uix." + (entity.name) + ".Title />} {...props} actions={<EditSimple" + (entity.name) + "Actions />} >\n");
        out.push("    <uix." + (entity.name) + ".SimpleForm/>\n");
        out.push("  </uix.Edit >\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("export const TabbedForm = (props) =>{\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.TabbedForm {...props}>\n");
        out.push("      <uix.FormTab label=\"resources." + (entity.name) + ".summary\">\n");
        out.push("      " + (partial({
            entity: {
                ...entity,
                props: entity.lists.summary
            },
            source: '',
            sectionLabel: false,
            grid: false
        }, 'display-edit-entity')) + "\n");
        out.push("      </uix.FormTab>\n");
        out.push("\n");
        entity.props.filter((f)=>f.ref).filter((f)=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.edit[f.name] !== false).forEach((f)=>{
            const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name);
            if (f.single && !embedded) {
                return;
            }
            out.push("\n");
            out.push("      <uix.FormTab label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" path=\"" + (f.name) + "\">\n");
            out.push("        " + (partial({
                entity: {
                    ...entity,
                    props: entity.props.filter((fl)=>fl.name === f.name)
                },
                source: ``,
                sectionLabel: false,
                grid: false
            }, 'display-edit-entity')) + "\n");
            out.push("      </uix.FormTab>\n");
        });
        out.push("\n");
        out.push("    </uix.TabbedForm>\n");
        out.push("  )\n");
        out.push("}\n");
        out.push("\n");
        out.push("// tabbed forms\n");
        out.push("export const CreateFormTabbed = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push(" " + (content('init-record', btRels)) + "\n");
        out.push("  return (\n");
        out.push("  <uix.Create {...props} >\n");
        out.push("    <uix." + (entity.name) + ".TabbedForm toolbar={<CreateFormToolbar />}\n");
        out.push("     ");
        if (btRels.length > 0) {
            out.push(" redirect={redirect} ");
        }
        out.push("/>\n");
        out.push("  </uix.Create >\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("export const EditFormTabbed = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("  <uix.Edit title={<uix." + (entity.name) + ".Title />} {...props} actions={<EditTabbed" + (entity.name) + "Actions />}>\n");
        out.push("    <uix." + (entity.name) + ".TabbedForm />\n");
        out.push("  </uix.Edit >\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("export const ShowSimpleView = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  return (\n");
        out.push("    <uix.Show title={<uix." + (entity.name) + ".Title />} {...props} actions={<ShowSimple" + (entity.name) + "Actions />}>\n");
        out.push("      <uix.SimpleShowLayout>\n");
        out.push("      <uix.HeaderLabel text=\"resources." + (entity.name) + ".summary\" />\n");
        out.push("      " + (partial({
            entity: {
                ...entity,
                props: entity.lists.all
            },
            source: '',
            sectionLabel: true,
            grid: false
        }, 'display-show-entity')) + "\n");
        out.push("      </uix.SimpleShowLayout>\n");
        out.push("    </uix.Show>\n");
        out.push("  );\n");
        out.push("};\n");
        out.push("\n");
        out.push("export const ShowTabbedView = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("\n");
        out.push("  return (\n");
        out.push("    <uix.Show title={<uix." + (entity.name) + ".Title />} {...props} actions={<ShowTabbed" + (entity.name) + "Actions />}>\n");
        out.push("      <uix.TabbedShowLayout>\n");
        out.push("        <uix.Tab label=\"resources." + (entity.name) + ".summary\">\n");
        out.push("          " + (partial({
            entity: {
                ...entity,
                props: entity.lists.summary
            },
            source: '',
            sectionLabel: false,
            grid: false
        }, 'display-show-entity')) + "\n");
        out.push("        </uix.Tab>\n");
        entity.props.filter((f)=>f.ref).filter((f)=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.edit[f.name] !== false).forEach((f)=>{
            const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name);
            if (f.single && !embedded) {
                return;
            }
            out.push("\n");
            out.push("        <uix.Tab label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" path=\"" + (f.name) + "\">\n");
            out.push("          " + (partial({
                entity: {
                    ...entity,
                    props: entity.props.filter((fl)=>fl.name === f.name)
                },
                source: ``,
                emdedded: true,
                sectionLabel: false,
                grid: false
            }, 'display-show-entity')) + "\n");
            out.push("        </uix.Tab>\n");
            out.push("      ");
        });
        out.push("\n");
        out.push("      </uix.TabbedShowLayout>\n");
        out.push("    </uix.Show>\n");
        out.push("  );\n");
        out.push("};");
        return out.join('');
    },
    blocks: {
        "init-record": function(btRels, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = btRels;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            out.push("\n");
            out.push("\n");
            if (btRels.length > 0) {
                out.push("\n");
                out.push("  let redirect = 'edit';\n");
                out.push("  if(props.location && props.location.state && props.location.state.pathname){\n");
                out.push("    redirect =  props.location.state.pathname;\n");
                out.push("  }\n");
            }
            out.push("");
            return out.join('');
        }
    },
    compile: function() {
        this.alias = [
            "forms-form"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/form.njs.js.map
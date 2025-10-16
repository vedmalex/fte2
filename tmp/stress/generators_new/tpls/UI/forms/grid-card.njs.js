module.exports = {
    alias: [
        "grid-card"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React, { useContext } from 'react'\n");
        out.push("import Card from '@material-ui/core/Card';\n");
        out.push("import CardActions from '@material-ui/core/CardActions';\n");
        out.push("import CardContent from '@material-ui/core/CardContent';\n");
        out.push("import CardHeader from '@material-ui/core/CardHeader';\n");
        out.push("import { useTranslate } from 'react-admin';\n");
        out.push("\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import { prepareExcludeList } from '../';\n");
        out.push("\n");
        out.push("const cardStyle = {\n");
        out.push("  margin: '0.5rem',\n");
        out.push("  display: 'inline-block',\n");
        out.push("  verticalAlign: 'top',\n");
        out.push("};\n");
        out.push("\n");
        out.push("const Label = ({ label }) => {\n");
        out.push("  const translate = useTranslate();\n");
        out.push("  return (\n");
        out.push("  <label>{translate(label)}:&nbsp;</label>\n");
        out.push(");}\n");
        out.push("\n");
        out.push("const CardView = ({ ids, data, basePath, fields }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("\n");
        out.push("  const excludedField = prepareExcludeList(fields)\n");
        out.push("  return (\n");
        out.push("  <div style={{ margin: '1em' }}>\n");
        out.push("    { ids.length > 0 ? (\n");
        out.push("      ids.map(id => (\n");
        out.push("        <Card key={id} style={cardStyle}>\n");
        out.push("          <CardHeader title={<uix." + (entity.name) + ".SelectTitle record={data[id]} />} />\n");
        out.push("          <CardContent>\n");
        out.push("            <div>");
        entity.props.filter((f)=>!f.ref && f.name !== "id").filter((f)=>entity.UI.list[f.name]).forEach((f)=>{
            out.push("\n");
            out.push("              {!excludedField.hasOwnProperty('" + (f.name) + "') && <div>\n");
            out.push("                <Label label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" />\n");
            out.push("                <uix.primitive." + (f.type) + ".Field record={data[id]} source=\"" + (f.name) + "\" />\n");
            out.push("              </div>}\n");
        });
        entity.props.filter((f)=>f.ref).filter((f)=>entity.UI.list[f.name]).forEach((f)=>{
            if (f.single && !f.ref.embedded) {
                out.push("{!excludedField.hasOwnProperty('" + (f.name) + "') && <div>\n");
                out.push("                <Label label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" />\n");
                out.push("                <uix.ReferenceField basePath=\"/" + (entity.model.entityPathMapper[f.ref.entity]) + "\" record={data[id]} label=\"resources." + (f.inheritedFrom || entity.name) + ".fields." + (f.name) + "\" sortable={false} source=\"" + (f.name) + "\" reference=\"" + (entity.model.entityPathMapper[f.ref.entity]) + "\"");
                if (!f.required) {
                    out.push(" allowEmpty ");
                }
                out.push(">\n");
                out.push("                  <uix." + (f.ref.entity) + ".SelectTitle />\n");
                out.push("                </uix.ReferenceField>\n");
                out.push("              </div>}\n");
            }
        });
        out.push("\n");
        out.push("            </div>\n");
        out.push("          </CardContent>\n");
        out.push("          <CardActions style={{ textAlign: 'right' }}>\n");
        out.push("          ");
        entity.actions.forEach((action)=>{
            out.push("\n");
            out.push("              <uix." + (entity.name) + "." + (action.fullName) + " record={data}/>\n");
            out.push("          ");
        });
        out.push("\n");
        if (!(entity.embedded || entity.abstract)) {
            out.push("\n");
            out.push("            <uix.EditButton\n");
            out.push("              resource=\"" + (entity.model.entityPathMapper[entity.name]) + "\"\n");
            out.push("              basePath=\"/" + (entity.model.entityPathMapper[entity.name]) + "\"\n");
            out.push("              record={data[id]}\n");
            out.push("            />\n");
            out.push("            <uix.ShowButton\n");
            out.push("              resource=\"" + (entity.model.entityPathMapper[entity.name]) + "\"\n");
            out.push("              basePath=\"/" + (entity.model.entityPathMapper[entity.name]) + "\"\n");
            out.push("              record={data[id]}\n");
            out.push("            />\n");
            out.push("            <uix.CloneButton\n");
            out.push("              resource=\"" + (entity.model.entityPathMapper[entity.name]) + "\"            \n");
            out.push("              basePath=\"/" + (entity.model.entityPathMapper[entity.name]) + "\"\n");
            out.push("              record={data[id]}\n");
            out.push("            />\n");
            out.push("            <uix.DeleteButton\n");
            out.push("              resource=\"" + (entity.model.entityPathMapper[entity.name]) + "\"            \n");
            out.push("              basePath=\"/" + (entity.model.entityPathMapper[entity.name]) + "\"\n");
            out.push("              record={data[id]}\n");
            out.push("            />\n");
        }
        out.push("\n");
        out.push("          </CardActions>\n");
        out.push("        </Card>\n");
        out.push("      ))\n");
        out.push("    ) : (\n");
        out.push("      <div style={{ height: '10vh' }} />\n");
        out.push("    )}\n");
        out.push("  </div>\n");
        out.push(");\n");
        out.push("}\n");
        out.push("\n");
        out.push("CardView.defaultProps = {\n");
        out.push("  data: {},\n");
        out.push("  ids: [],\n");
        out.push("};\n");
        out.push("\n");
        out.push("export default CardView;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "grid-card"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/grid-card.njs.js.map
module.exports = {
    alias: [
        "forms-index"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React, { useContext } from 'react';\n");
        out.push("import useMediaQuery from '@material-ui/core/useMediaQuery';\n");
        out.push("import Title  from './title';\n");
        out.push("import SelectTitle, { inputText }  from './selectTitle';\n");
        out.push("import Filter  from './filter';\n");
        out.push("import { buttons, actions }  from './fragments';\n");
        out.push("import {\n");
        out.push("  CreateFormSimple,\n");
        out.push("  EditFormSimple,\n");
        out.push("  CreateFormTabbed,\n");
        out.push("  EditFormTabbed,\n");
        out.push("  ShowSimpleView,\n");
        out.push("  ShowTabbedView,\n");
        out.push("  TabbedForm,\n");
        out.push("  SimpleForm,\n");
        out.push("}  from './form';\n");
        out.push("import List  from './list';\n");
        out.push("import Grid  from './grid';\n");
        out.push("import CardView  from './cardView';\n");
        out.push("import GridView  from './gridView';\n");
        out.push("import ListView  from './listView';\n");
        out.push("import Preview  from './preview';\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("\n");
        out.push("const Show = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n");
        out.push("  const Result = isSmall ? uix." + (entity.name) + ".ShowSimpleView : uix." + (entity.name) + ".ShowTabbedView\n");
        out.push("  return (\n");
        out.push("    <Result {...props} />\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("const Edit = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n");
        out.push("  const Result = isSmall ? uix." + (entity.name) + ".EditFormSimple : uix." + (entity.name) + ".EditFormTabbed\n");
        out.push("  return (\n");
        out.push("    <Result {...props} />\n");
        out.push("  );\n");
        out.push("}\n");
        out.push("\n");
        out.push("const Create = (props) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n");
        out.push("  const Result = isSmall ? uix." + (entity.name) + ".CreateFormSimple : uix." + (entity.name) + ".CreateFormTabbed\n");
        out.push("  return (\n");
        out.push("    <Result {...props} />\n");
        out.push(");}\n");
        out.push("\n");
        out.push("export default {\n");
        out.push("  name: '" + (entity.name) + "',\n");
        out.push("  Title,\n");
        out.push("  SelectTitle,\n");
        out.push("  inputText,\n");
        out.push("  Filter,\n");
        out.push("  List,\n");
        out.push("  Create,\n");
        out.push("  Edit,\n");
        out.push("  Show,\n");
        out.push("  TabbedForm,\n");
        out.push("  SimpleForm,\n");
        out.push("  CreateFormSimple,\n");
        out.push("  CreateFormTabbed,\n");
        out.push("  EditFormSimple,\n");
        out.push("  EditFormTabbed,\n");
        out.push("  ShowSimpleView,\n");
        out.push("  ShowTabbedView,\n");
        out.push("  Preview,\n");
        out.push("  Grid,\n");
        out.push("  CardView,\n");
        out.push("  GridView,\n");
        out.push("  ListView,\n");
        out.push("  ...buttons,\n");
        out.push("  ...actions,\n");
        out.push("};");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-index"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/index.njs.js.map
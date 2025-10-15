module.exports = {
    alias: [
        "forms-title"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React, { useContext } from \"react\";\n");
        out.push("import { UIXContext } from '../contexts';\n");
        out.push("import { useTranslate } from 'react-admin';\n");
        out.push("\n");
        out.push("const Title = ({ record }) => {\n");
        out.push("  const uix = useContext(UIXContext);\n");
        out.push("  const translate = useTranslate();\n");
        out.push("\n");
        out.push("  return (\n");
        out.push("  <span>\n");
        out.push("    {translate('resources." + (entity.name) + ".name', {smart_count : 1})} \"<uix." + (entity.name) + ".SelectTitle record={record}/>\"\n");
        out.push("  </span>\n");
        out.push(");}\n");
        out.push("\n");
        out.push("export default Title;");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "forms-title"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/UI/forms/title.njs.js.map
module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        const [namespace, name] = context.name.split('.');
        out.push("\n");
        out.push("Ext.directFn({\n");
        out.push("  namespace: '" + (namespace) + "',\n");
        out.push("  name: '" + (name) + "',\n");
        out.push("  locationType:\"" + (context.locationType) + "\",\n");
        out.push("  body: function(para) {\n");
        out.push("    let context = this;\n");
        out.push("    let prm = para.data.shift();\n");
        out.push("    prm.context = context;\n");
        out.push("    ");
        const hasCondition = context.queryRunCondition !== 'true' && context.queryRunCondition != true && context.queryRunCondition != '' && context.queryRunCondition !== null && context.queryRunCondition !== undefined;
        out.push("\n");
        out.push("    ");
        if (hasCondition) {
            out.push("\n");
            out.push("    if(" + (context.queryRunCondition) + "){\n");
            out.push("    ");
        }
        out.push("\n");
        out.push("    CustomQuery['" + (name) + "'].call(this, this.db, prm, function(err, data) {\n");
        out.push("      if (!err) context.success(data);\n");
        out.push("      else context.failure(err);\n");
        out.push("    })\n");
        out.push("    ");
        if (hasCondition) {
            out.push("\n");
            out.push("    } else {\n");
            out.push("      context.success(" + (context.queryEmptyResult ? context.queryEmptyResult : context.queryIsListResult ? [] : 'null') + ")\n");
            out.push("    }\n");
            out.push("    ");
        }
        out.push("\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Query/meta.query.direct.njs.js.map
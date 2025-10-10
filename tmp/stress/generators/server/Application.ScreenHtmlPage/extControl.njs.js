module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        out.push("Ext.define(\n");
        out.push("  'Modeleditor.view." + (context.controller ? context.controller : "base") + "." + (context.name) + "',\n");
        out.push("  {\n");
        out.push("    extend: 'Ext.ux.IFrame',\n");
        out.push("    alias: 'widget." + (context.widgetName) + "',\n");
        out.push("    src: '/page/" + (context.name) + "',\n");
        out.push("    autoScroll: false,\n");
        out.push("    title: _t(\n");
        out.push("      '" + (context.title) + "',\n");
        out.push("      '" + (context.controller ? context.controller : "base") + "." + (context.name) + "',\n");
        out.push("      'titles',\n");
        out.push("    ),\n");
        out.push("  },\n");
        out.push(")");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.ScreenHtmlPage/extControl.njs.js.map
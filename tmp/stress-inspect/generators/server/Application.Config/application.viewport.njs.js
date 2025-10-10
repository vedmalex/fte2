module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define(\"Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".Viewport\", {\n");
        out.push("  extend: \"Ext.panel.Panel\",\n");
        out.push("  require: [\n");
        out.push("    //'Admin.SpeedTestToolbar'\n");
        out.push("    ],\n");
        out.push("  alias: \"widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "viewport\",\n");
        out.push("\n");
        out.push("  initComponent: function() {\n");
        out.push("    Ext.apply(this, {\n");
        out.push("      layout:\"border\",\n");
        out.push("      items: [{\n");
        out.push("        region: \"north\",\n");
        out.push("        xtype: \"panel\",\n");
        out.push("        border: false,\n");
        out.push("        dockedItems: [{\n");
        out.push("          xtype: \"" + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "toolbar\"\n");
        out.push("        }]\n");
        out.push("      },\n");
        out.push("      ");
        if (context.currentProfile?.navItem?.length > 0) {
            out.push("\n");
            out.push("      {\n");
            out.push("        xtype: \"" + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "navigation\",\n");
            out.push("        region: \"west\"\n");
            out.push("      },\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      {\n");
        out.push("        xtype: \"" + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "screencontainer\",\n");
        out.push("        itemId: \"mainContainer\",\n");
        out.push("        region:\"center\",\n");
        out.push("        margin: 2\n");
        out.push("      },\n");
        out.push("      ");
        if (!context.noHealthCheck) {
            out.push("\n");
            out.push("      {\n");
            out.push("        region: 'south',\n");
            out.push("        xtype: 'panel',\n");
            out.push("        border: false,\n");
            out.push("        dockedItems: [\n");
            out.push("          {\n");
            out.push("            xtype: 'speedtesttoolbar',\n");
            out.push("          },\n");
            out.push("        ],\n");
            out.push("      },\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      ]\n");
        out.push("    });\n");
        out.push("\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/application.viewport.njs.js.map
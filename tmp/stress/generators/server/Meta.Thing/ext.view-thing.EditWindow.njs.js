module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".EditWindow." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Modeleditor.view.base.baseWindow',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "editwindow',\n");
        out.push("  widget: \"" + (context.$widgetName) + "\",\n");
        out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  initComponent: function(){\n");
        out.push("    Ext.apply( this, {\n");
        out.push("\n");
        out.push("      title: _t('" + (context.$namespace) + "." + (context.$name) + "','" + (context.$namespace) + "." + (context.$name) + "','titles','EditWindow'),\n");
        out.push("      layout: 'anchor',\n");
        out.push("      autoScroll: true,\n");
        out.push("      defaults:{\n");
        out.push("        anchor: '100%'\n");
        out.push("      },\n");
        out.push("      dockedItems: [\n");
        out.push("        {\n");
        out.push("          xtype: '" + (context.$widgetName) + "formnavigationtoolbar'\n");
        out.push("        }\n");
        out.push("      ],\n");
        out.push("\n");
        out.push("      items:[\n");
        out.push("        {\n");
        out.push("          xtype: \"" + (context.$widgetName) + "edit\",\n");
        out.push("          hideable: true,\n");
        out.push("          required: true,\n");
        out.push("          toDisplay: _t('General', 'SYSTEM', 'titles'),\n");
        out.push("          margin: \"5 15 5 15\",\n");
        out.push("          relGroup: [_t('General', 'SYSTEM', 'titles'),]\n");
        out.push("        }\n");
        out.push("      ],\n");
        out.push("\n");
        out.push("      relNames: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].relNames,\n");
        out.push("      groupedRels: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].groupedRels,\n");
        out.push("\n");
        out.push("      buttons: [\n");
        out.push("        {\n");
        out.push("          text: _t('Apply','SYSTEM', 'buttons'),\n");
        out.push("          itemId: 'applyButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Edit Window Apply Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          text: _t('Ok','SYSTEM', 'buttons'),\n");
        out.push("          itemId: 'okButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Edit Window OK Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          text: _t('Cancel', 'SYSTEM', 'buttons'),\n");
        out.push("          itemId: 'cancelButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Edit Window Cancel Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        }\n");
        out.push("      ]\n");
        out.push("    });\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.EditWindow.njs.js.map
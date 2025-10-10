module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".SearchWindow." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Modeleditor.view.base.baseWindow',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "searchwindow',\n");
        out.push("  widget: \"" + (context.$widgetName) + "\",\n");
        out.push("  queryName: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + ",\n");
        out.push("  iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  ");
        if (context.queryResult || context.legacySearch) {
            out.push("\n");
            out.push("  customSearch: true,\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  initComponent: function(){\n");
        out.push("    Ext.apply( this, {\n");
        out.push("      title: _t('Search', 'SYSTEM', 'titles') + ': ' + _t('" + (context.$namespace) + "." + (context.$name) + "','" + (context.$namespace) + "." + (context.$name) + "', 'titles', 'SearchWindow'),\n");
        out.push("      layout: 'card',\n");
        out.push("      // closable: true,\n");
        out.push("      items: [\n");
        out.push("        {\n");
        out.push("          xtype: 'panel',\n");
        out.push("          border: false,\n");
        out.push("          layout: 'anchor',\n");
        out.push("          autoScroll: true,\n");
        out.push("          defaults:{\n");
        out.push("            anchor: '100%'\n");
        out.push("          },\n");
        out.push("          items:[\n");
        out.push("            {\n");
        out.push("              xtype: \"" + (context.$widgetName) + "search\",\n");
        out.push("              ");
        if (context.queryResult || context.legacySearch) {
            out.push("\n");
            out.push("              customSearch: true,\n");
            out.push("              ");
        }
        out.push("\n");
        out.push("            }\n");
        out.push("          ]\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          dockedItems: [\n");
        out.push("            {\n");
        out.push("              xtype: \"basesearchgridtoolbar\"\n");
        out.push("            }\n");
        out.push("          ],\n");
        out.push("          xtype: \"" + (context.$widgetName) + "listsearch\",\n");
        out.push("          border: 0,\n");
        out.push("          paginator: false,\n");
        out.push("          store: Ext.create('Modeleditor.store." + (context.$namespace) + ".Search." + (context.$name) + "')\n");
        out.push("        }\n");
        out.push("      ],\n");
        out.push("\n");
        out.push("      buttons: [\n");
        out.push("        {\n");
        out.push("          text: _t('Search','SYSTEM','buttons'),\n");
        out.push("          action: \"startSearch\",\n");
        out.push("          resultGrid: \"" + (context.$widgetName) + "listsearch\",\n");
        out.push("          itemId: 'startSearchButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Search Window Start Search', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          text: _t('Reset','SYSTEM','buttons'),\n");
        out.push("          action: \"resetSearch\",\n");
        out.push("          itemId: 'resetSearchButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Search Window Reset', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          text: _t('Back','SYSTEM', 'buttons'),\n");
        out.push("          action: \"backSearch\",\n");
        out.push("          disable: true,\n");
        out.push("          hidden: true,\n");
        out.push("          itemId: 'backSearchButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Search Window Back', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          text: _t('Close','SYSTEM', 'buttons'),\n");
        out.push("          itemId: 'closeButton',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Search Window Close', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
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

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.SearchWindow.njs.js.map
module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        const config = context.getThingConfig(context);
        out.push("\n");
        out.push("Ext.define(\"Modeleditor.view." + (context.namespace) + ".EditDictionary." + (context.$name) + "\", {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend:\"Modeleditor.view.base.baseWindowDictionarySingle\",\n");
        out.push("  alias: \"widget." + (context.$widgetName) + "editdictionary\",\n");
        out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  // tobe passed from Dictinary Call\n");
        out.push("  // {\n");
        out.push("  //   catalogPaginator: false,\n");
        out.push("  //   catalogPlugins: [],\n");
        out.push("  //   catalogStore: customFieldsetStore\n");
        out.push("  //   catalogBbar: undefined\n");
        out.push("  // }\n");
        out.push("  initComponent: function(){\n");
        out.push("    const me = this;\n");
        out.push("    DirectCacheLogger.userStories('Edit Dictionary Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
        out.push("    const catalogConfig = {\n");
        out.push("      xtype: '" + (context.$widgetName) + "catalog',\n");
        out.push("    }\n");
        out.push("    if(me.hasOwnProperty('catalogPaginator')){\n");
        out.push("      catalogConfig.catalogPaginator = me.catalogPaginator\n");
        out.push("    }\n");
        out.push("    if(me.hasOwnProperty('catalogPlugins')){\n");
        out.push("      catalogConfig.catalogPlugins = me.catalogPlugins\n");
        out.push("    }\n");
        out.push("    if(me.hasOwnProperty('catalogStore')){\n");
        out.push("      catalogConfig.catalogStore = me.catalogStore\n");
        out.push("    }\n");
        out.push("    if(me.hasOwnProperty('catalogBbar')){\n");
        out.push("      catalogConfig.catalogBbar = me.catalogBbar\n");
        out.push("    }\n");
        out.push("\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      itemId: \"EditDictionary\",\n");
        out.push("      editDictionary: true,\n");
        out.push("      title: this.title || this.toDisplay ||_t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles', 'EditDictionary', ),\n");
        out.push("      border: true,\n");
        out.push("      layout: 'fit',\n");
        out.push("      defaults:{\n");
        out.push("        border: false,\n");
        out.push("        margin: '2'\n");
        out.push("      },\n");
        out.push("      items: [\n");
        out.push("        catalogConfig,\n");
        out.push("      ],\n");
        out.push("      buttons: [\n");
        out.push("        {\n");
        out.push("          text: _t('Ok', 'SYSTEM', 'buttons'),\n");
        out.push("          itemId: 'okOne',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Edit Dictionary OK Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          text: _t('Cancel', 'SYSTEM', 'buttons'),\n");
        out.push("          itemId: 'dictCancel',\n");
        out.push("          listeners: {\n");
        out.push("            click: function(btn) {\n");
        out.push("              DirectCacheLogger.userStories('Edit Dictionary Cancel Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: btn.up('window').id });\n");
        out.push("            }\n");
        out.push("          }\n");
        out.push("        }\n");
        out.push("      ],\n");
        out.push("      listeners: {\n");
        out.push("        show: function(window) {\n");
        out.push("          DirectCacheLogger.userStories('Edit Dictionary Show', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
        out.push("        },\n");
        out.push("        beforeclose: function(window) {\n");
        out.push("          DirectCacheLogger.userStories('Edit Dictionary Before Close', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
        out.push("        }\n");
        out.push("      }\n");
        out.push("    })\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.grid-thing.EditDictionary.njs.js.map
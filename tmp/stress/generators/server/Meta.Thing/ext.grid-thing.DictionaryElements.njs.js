module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        let properties = context.gridviewProps;
        const config = context.getThingConfig(context);
        const hasDictionaryFields = properties.filter((p)=>p.forDictionary).length > 0;
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.namespace) + ".DictionaryElements." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "elements',\n");
        out.push("  itemId: \"DictionaryElements\",\n");
        out.push("  //iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  plugins: [\n");
        out.push("    ");
        if (config.filterForDicElements && hasDictionaryFields) {
            out.push("\n");
            out.push("    {\n");
            out.push("      ptype: 'filterbar',\n");
            out.push("      pluginId: \"filterbar\",\n");
            out.push("      renderHidden: false,\n");
            out.push("      showShowHideButton: true,\n");
            out.push("      showClearAllButton: true,\n");
            out.push("    }\n");
            out.push("    ");
        }
        out.push("\n");
        out.push("    ],\n");
        out.push("  initComponent: function(){\n");
        out.push("    let me = this;\n");
        out.push("    const store = Ext.create('Modeleditor.store." + (context.namespace) + ".Selected." + (context.$name) + "',{filters: this.filters})\n");
        out.push("\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
        out.push("      autoRender: true,\n");
        out.push("      overflowY: 'auto',\n");
        out.push("      store,\n");
        out.push("      ");
        if (config.pageSizeEmbedded !== -1) {
            out.push("\n");
            out.push("      bbar:{\n");
            out.push("        xtype: 'pagingtoolbar',\n");
            out.push("        store,\n");
            out.push("        displayInfo: true,\n");
            out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
            out.push("        emptyMsg: 'No data to display',\n");
            out.push("      },\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      viewConfig: {\n");
        out.push("        plugins: {\n");
        out.push("          ptype: 'gridviewdragdrop',\n");
        out.push("          pluginId: \"gridviewdragdrop\",\n");
        out.push("          dragGroup: 'elements',\n");
        out.push("          dropGroup: 'catalog'\n");
        out.push("        },\n");
        out.push("      },\n");
        out.push("\n");
        out.push("      columns: [\n");
        out.push("        {\n");
        out.push("          xtype: 'rownumberer',\n");
        out.push("          width:40\n");
        out.push("        },\n");
        out.push("      ");
        for(let i = 0; i < properties.length; i++){
            let property = properties[i].property;
            let g = properties[i];
            if (g.generated && ((hasDictionaryFields && g.forDictionary) || !hasDictionaryFields)) {
                out.push("\n");
                out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                out.push("        ");
            }
        }
        out.push("\n");
        out.push("      ],\n");
        out.push("\n");
        out.push("      listeners: {\n");
        out.push("        'selectionchange': function(view, records) {\n");
        out.push("          DirectCacheLogger.userStories('Dictionary Elements Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, selectedCount: records.length });\n");
        out.push("        },\n");
        out.push("        'itemdblclick': function(view, record, item, index, e, eOpts) {\n");
        out.push("          DirectCacheLogger.userStories('Dictionary Elements Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
        out.push("        },\n");
        out.push("        'itemclick': function(view, record, item, index, e, eOpts) {\n");
        out.push("          DirectCacheLogger.userStories('Dictionary Elements Item Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
        out.push("        }\n");
        out.push("      }\n");
        out.push("    });\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.grid-thing.DictionaryElements.njs.js.map
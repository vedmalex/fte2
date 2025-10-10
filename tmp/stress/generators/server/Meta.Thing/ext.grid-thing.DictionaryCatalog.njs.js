module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        let properties = context.gridviewProps;
        const config = context.getThingConfig(context);
        const hasDictionaryFields = properties.filter((p)=>p.forDictionary).length > 0;
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.namespace) + ".DictionaryCatalog." + (context.$name) + "',{\n");
        out.push("  serverModel: '" + (context.$namespace) + "." + (context.$name) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "catalog',\n");
        out.push("  itemId: \"DictionaryCatalog\",\n");
        out.push("  //iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  btns: true,\n");
        out.push("  initComponent: function(){\n");
        out.push("    let me = this;\n");
        out.push("    DirectCacheLogger.userStories('Dictionary Catalog Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id });\n");
        out.push("    // {\n");
        out.push("    //   catalogPaginator: false,\n");
        out.push("    //   catalogPlugins: [],\n");
        out.push("    //   catalogStore: customFieldsetStore\n");
        out.push("    //   catalogBbar: undefined\n");
        out.push("    // }\n");
        out.push("    const store = me.hasOwnProperty('catalogStore') ? me.catalogStore: Ext.create('Modeleditor.store." + (context.namespace) + ".Catalog." + (context.$name) + "')\n");
        out.push("\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      plugins: me.hasOwnProperty('catalogPlugins') ? me.catalogPlugins: [\n");
        out.push("      ");
        if (config.filterForDicCatalog && hasDictionaryFields) {
            out.push("\n");
            out.push("        {\n");
            out.push("          ptype: 'filterbar',\n");
            out.push("          pluginId: \"filterbar\",\n");
            out.push("          renderHidden: false,\n");
            out.push("          showShowHideButton: true,\n");
            out.push("          showClearAllButton: true,\n");
            out.push("        }\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      ],\n");
        out.push("      store,\n");
        out.push("      tbar: (this.btns === true) ? [\n");
        out.push("        {\n");
        out.push("          xtype: \"basecreatebutton\"\n");
        out.push("        }\n");
        out.push("      ] : undefined,\n");
        out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
        out.push("      autoRender: true,\n");
        out.push("      overflowY: 'auto',\n");
        out.push("    ");
        if (config.pageSizeEmbedded !== -1) {
            out.push("\n");
            out.push("      bbar: me.hasOwnProperty('catalogBbar') ? me.catalogBbar :\n");
            out.push("      me.hasOwnProperty('catalogPaginator') && !me.catalogPaginator ? undefined: {\n");
            out.push("        xtype: \"pagingtoolbar\",\n");
            out.push("        store,\n");
            out.push("        displayInfo: true,\n");
            out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
            out.push("        emptyMsg: \"No data to display\"\n");
            out.push("      },\n");
            out.push("    ");
        }
        out.push("\n");
        out.push("      listeners: {\n");
        out.push("        filterupdated: function(filters){\n");
        out.push("          DirectCacheLogger.userStories('Dictionary Catalog Filter Updated', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id, filtersCount: filters.length });\n");
        out.push("          let grid = this;\n");
        out.push("          if(grid.defaultFilters && grid.defaultFilters.length > 0)\n");
        out.push("            grid.getStore().filter(grid.defaultFilters);\n");
        out.push("        },\n");
        out.push("        selectionchange: function(view, records) {\n");
        out.push("          DirectCacheLogger.userStories('Dictionary Catalog Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id, selectedCount: records.length });\n");
        out.push("        },\n");
        out.push("        itemdblclick: function(view, record, item, index, e, eOpts) {\n");
        out.push("          DirectCacheLogger.userStories('Dictionary Catalog Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id, recordId: record.getId(), index: index });\n");
        out.push("        }\n");
        out.push("      },\n");
        out.push("\n");
        out.push("      columns: [{\n");
        out.push("          xtype: 'rownumberer',\n");
        out.push("          width:40\n");
        out.push("        },\n");
        for(let i = 0; i < properties.length; i++){
            let property = properties[i].property;
            let g = properties[i];
            if (g.generated && ((hasDictionaryFields && g.forDictionary) || !hasDictionaryFields)) {
                out.push("\n");
                out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                out.push("          ");
            }
        }
        out.push("\n");
        out.push("      ],\n");
        out.push("    });\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.grid-thing.DictionaryCatalog.njs.js.map
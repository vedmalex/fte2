module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const getToolbar = context.getToolbar;
        let properties = context.gridviewProps;
        const config = context.getThingConfig(context);
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".ListSearch." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "listsearch',\n");
        out.push("  widget: '" + (context.$widgetName) + "',\n");
        out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  ");
        if (context.periodicalRel) {
            out.push("\n");
            out.push("  periodicalRel:{\n");
            out.push("    from:'" + (context.periodicalRel.from) + "',\n");
            out.push("    to:'" + (context.periodicalRel.to) + "',\n");
            out.push("    fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
            out.push("    toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
            out.push("  },\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  border: true,\n");
        out.push("  calendarMapping: " + (!!context.cal_mapping) + ",\n");
        out.push("  searchQuery: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + ",\n");
        out.push("  // tbar: " + (JSON.stringify(getToolbar(context.gridsettings))) + ",\n");
        out.push("  initComponent: function(){\n");
        out.push("    let me = this;\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      ");
        if (!(context.queryResult || context.legacySearch) && config.pageSizeSearch !== -1 && !context.staticStore) {
            out.push("\n");
            out.push("      bbar: {\n");
            out.push("        xtype: \"pagingtoolbar\",\n");
            out.push("        store: this.store,\n");
            out.push("        displayInfo: true,\n");
            out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
            out.push("        emptyMsg: \"No data to display\"\n");
            out.push("      },\n");
            out.push("      ");
        }
        out.push("\n");
        out.push("      title: this.title || this.toDisplay || _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','List'),\n");
        out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
        out.push("      autoRender: true,\n");
        out.push("      overflowY: 'auto',\n");
        out.push("      columns: [{xtype: 'rownumberer', width:40},");
        for(let i = 0; i < properties.length; i++){
            let property = properties[i].property;
            let g = properties[i];
            if (g.generated) {
                out.push("\n");
                out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                out.push("          ");
            }
        }
        out.push("\n");
        out.push("      ],\n");
        out.push("\n");
        out.push("      listeners: {\n");
        out.push("        'selectionchange': function(view, records) {\n");
        out.push("          DirectCacheLogger.userStories('Search Grid Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, selectedCount: records.length });\n");
        out.push("          let rbutton = this.down('#removeButton');\n");
        out.push("          let ubutton = this.down('#unlinkButton');\n");
        out.push("          let dbutton = this.down('#detailsButton');\n");
        out.push("          if(rbutton) rbutton.setDisabled(!records.length);\n");
        out.push("          if(ubutton) ubutton.setDisabled(!records.length);\n");
        out.push("          if(dbutton) dbutton.setDisabled(records.length-1);\n");
        out.push("        },\n");
        out.push("        'itemdblclick': function(view, record, item, index, e, eOpts) {\n");
        out.push("          DirectCacheLogger.userStories('Search Grid Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
        out.push("        },\n");
        out.push("        'itemclick': function(view, record, item, index, e, eOpts) {\n");
        out.push("          DirectCacheLogger.userStories('Search Grid Item Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
        out.push("        }\n");
        out.push("      },\n");
        out.push("    });\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.grid-thing.ListSearch.njs.js.map
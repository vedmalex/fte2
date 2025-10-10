module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".Search." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Ext.form.Panel',\n");
        out.push("  property: { root:1 },\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "search',\n");
        out.push("  layout: 'column',\n");
        out.push("  border: false,\n");
        out.push("  widget: '" + (context.$widgetName) + "',\n");
        out.push("  // iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  embedKey: '" + (context.$namespace) + (context.$name) + "',\n");
        out.push("  modelName: 'Modeleditor.model." + (context.$namespace) + "." + (context.$name) + "',\n");
        out.push("  defaults: {\n");
        out.push("    margin: '0 5 5 5',\n");
        out.push("    xtype: 'textfield',\n");
        out.push("    columnWidth: 1\n");
        out.push("  },\n");
        out.push("  ");
        const localStateMachine = context.stateMachine;
        if (localStateMachine && localStateMachine.event && localStateMachine.event.length > 0) {
            out.push("\n");
            out.push("  stateMachineHash: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].stateMachineHash,\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  ");
        if (context.queryResult || context.legacySearch) {
            out.push("\n");
            out.push("  customSearch: true,\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("\n");
        out.push("  initComponent: function() {\n");
        out.push("    const me = this\n");
        out.push("    DirectCacheLogger.userStories('Search Form Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, customSearch: this.customSearch });\n");
        out.push("    let items = [\n");
        out.push("      {\n");
        out.push("        name: 'id',\n");
        out.push("        fieldLabel: _t('id','SYSTEM', 'labels'),\n");
        out.push("        hidden: true\n");
        out.push("      },\n");
        out.push("      {\n");
        out.push("        name: '_id',\n");
        out.push("        fieldLabel: _t('id','SYSTEM', 'labels'),\n");
        out.push("        hidden: true\n");
        out.push("      },\n");
        out.push("      ");
        function builItems(items) {
            for(let i = 0; i < items.length; i += 1){
                const item = items[i];
                switch(item.type){
                    case 'property':
                        const f = item.item;
                        const property = f.property;
                        if (!f.hiddenForSearch) {
                            out.push("\n");
                            out.push("                Grainjs.metadata['searchfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`](me.customSearch),\n");
                            out.push("              ");
                        }
                        break;
                    case 'fieldset':
                        const fs = item.item;
                        if (fs.formItems?.length > 0 && !fs.hiddenForSearch) {
                            out.push("\n");
                            out.push("            Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "'][`" + (fs.displayName) + "${me.customSearch ? '':'-search'}`]([");
                            builItems(fs.formItems);
                            out.push("]),\n");
                            out.push("            ");
                        }
                        break;
                }
            }
        }
        builItems(context.formItems);
        out.push("\n");
        out.push("    ];\n");
        out.push("    if(!me.customSearch) {\n");
        out.push("      items.splice(1,0, {\n");
        out.push("        xtype:'fieldset',\n");
        out.push("        layout:         'column',\n");
        out.push("        collapsible:    true,\n");
        out.push("        collapsed:      true,\n");
        out.push("        title:         _t('Search params','SYSTEM', 'labels'),\n");
        out.push("        defaults: {\n");
        out.push("          margin: '0 5 5 5',\n");
        out.push("          columnWidth: 1,\n");
        out.push("          xtype: 'textfield',\n");
        out.push("        },\n");
        out.push("        items: [{\n");
        out.push("          name: 'ensure',\n");
        out.push("          fieldLabel: _t('Ensure it exists','SYSTEM', 'labels'),\n");
        out.push("          columnWidth: 0.5,\n");
        out.push("          xtype: 'checkbox',\n");
        out.push("          hidden: this.property.root,\n");
        out.push("        },{\n");
        out.push("          name: 'absent',\n");
        out.push("          fieldLabel: _t('Ensure it absent','SYSTEM', 'labels'),\n");
        out.push("          columnWidth: 0.5,\n");
        out.push("          xtype: 'checkbox',\n");
        out.push("          hidden: this.property.root,\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          name: 'json',\n");
        out.push("          xtype: 'textareafield',\n");
        out.push("          extraSearchOption:true,\n");
        out.push("          optionName: \"json\",\n");
        out.push("          propertyName: 'root',\n");
        out.push("          rows: 3,\n");
        out.push("          grow: true,\n");
        out.push("          labelWidth: 0,\n");
        out.push("        }]\n");
        out.push("      })\n");
        out.push("    }\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      items,\n");
        out.push("      listeners: {\n");
        out.push("        render: function(form) {\n");
        out.push("          DirectCacheLogger.userStories('Search Form Render', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, customSearch: this.customSearch });\n");
        out.push("        },\n");
        out.push("        fieldchange: function(form, field, newValue, oldValue) {\n");
        out.push("          DirectCacheLogger.userStories('Search Form Field Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, fieldName: field.name, newValue: newValue, oldValue: oldValue });\n");
        out.push("        },\n");
        out.push("        reset: function(form) {\n");
        out.push("          DirectCacheLogger.userStories('Search Form Reset', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
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

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.Search.njs.js.map
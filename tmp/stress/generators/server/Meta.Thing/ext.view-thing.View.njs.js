module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        const _ = require('lodash');
        const smartSort = context.smartSort;
        const fieldsets = context.fieldset;
        const inFieldset = context.inFieldset;
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".View." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Modeleditor.view.base.baseForm',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "view',\n");
        out.push("  // iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "'),\n");
        out.push("  layout: 'column',\n");
        out.push("  border: false,\n");
        out.push("  widget: '" + (context.$widgetName) + "',\n");
        if (context.periodicalRel) {
            out.push("\n");
            out.push("  periodicalRel:{\n");
            out.push("    from:'" + (context.periodicalRel.from) + "',\n");
            out.push("    to:'" + (context.periodicalRel.to) + "',\n");
            out.push("    fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
            out.push("    toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
            out.push("  },\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("  embedKey: '" + (context.$namespace) + (context.$name) + "',\n");
        out.push("  modelName: 'Modeleditor.model." + (context.$namespace) + "." + (context.$name) + "',\n");
        out.push("  defaults: {\n");
        out.push("    margin: '0 5 5 5',\n");
        out.push("    xtype: 'textfield',\n");
        out.push("    columnWidth: 1\n");
        out.push("  },\n");
        out.push("  initComponent: function() {\n");
        out.push("    DirectCacheLogger.userStories('View Form Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      items: [\n");
        out.push("        {\n");
        out.push("          name: 'id',\n");
        out.push("          fieldLabel: _t('id','SYSTEM', 'labels'),\n");
        out.push("          hidden: true\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          name: '_id',\n");
        out.push("          fieldLabel: _t('id','SYSTEM', 'labels'),\n");
        out.push("          hidden: true\n");
        out.push("        },\n");
        out.push("        ");
        function builItems(items) {
            const fiit = items.filter((i)=>i.type != 'fieldset');
            const fsit = items.filter((i)=>i.type == 'fieldset');
            for(let i = 0; i < fiit.length; i += 1){
                const item = fiit[i];
                switch(item.type){
                    case 'property':
                        const f = item.item;
                        const property = f.property;
                        if (f.generated) {
                            out.push("\n");
                            out.push("                  Grainjs.metadata['viewfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`],\n");
                            out.push("                ");
                        }
                        break;
                    case 'fieldset':
                        const fs = item.item;
                        if (fs.formItems?.length > 0) {
                            out.push("\n");
                            out.push("              Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "']['" + (fs.displayName) + "']([\n");
                            out.push("                ");
                            builItems(fs.formItems);
                            out.push("]),\n");
                            out.push("              ");
                        }
                        break;
                }
            }
            for(let i = 0; i < fsit.length; i += 1){
                const item = fsit[i];
                switch(item.type){
                    case 'property':
                        const f = item.item;
                        const property = f.property;
                        if (f.generated) {
                            out.push("\n");
                            out.push("                  Grainjs.metadata['viewfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`],\n");
                            out.push("                ");
                        }
                        break;
                    case 'fieldset':
                        const fs = item.item;
                        if (fs.formItems?.length > 0) {
                            out.push("\n");
                            out.push("              Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "']['" + (fs.displayName) + "']([\n");
                            out.push("                ");
                            builItems(fs.formItems);
                            out.push("]),\n");
                            out.push("              ");
                        }
                        break;
                }
            }
        }
        builItems(context.formItems);
        out.push("\n");
        out.push("      ],\n");
        out.push("      listeners: {\n");
        out.push("        recordloaded: function(form, record, operation) {\n");
        out.push("          DirectCacheLogger.userStories('View Form Record Loaded', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
        out.push("        },\n");
        out.push("        beforerecordload: function(form, record, operation) {\n");
        out.push("          DirectCacheLogger.userStories('View Form Before Record Load', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
        out.push("        },\n");
        out.push("        render: function(form) {\n");
        out.push("          DirectCacheLogger.userStories('View Form Render', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
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

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.View.njs.js.map
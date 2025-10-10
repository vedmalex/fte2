module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".Edit." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  // requires: [" + (context.requires) + "],\n");
        out.push("  extend: 'Modeleditor.view.base.baseForm',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "edit',\n");
        out.push("  layout: 'column',\n");
        out.push("  bodyPadding: 10,\n");
        out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  widget: '" + (context.$widgetName) + "',\n");
        out.push("  ");
        if (context.periodicalRel) {
            out.push("\n");
            out.push("    periodicalRel:{\n");
            out.push("      from:'" + (context.periodicalRel.from) + "',\n");
            out.push("      to:'" + (context.periodicalRel.to) + "',\n");
            out.push("      fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
            out.push("      toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
            out.push("    },\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  embedKey: '" + (context.$namespace) + (context.$name) + "',\n");
        out.push("  modelName: 'Modeleditor.model." + (context.$namespace) + "." + (context.$name) + "',\n");
        out.push("  defaults: {\n");
        out.push("    margin: '0 5 5 5',\n");
        out.push("    xtype: 'textfield',\n");
        out.push("    columnWidth: 1\n");
        out.push("  },\n");
        out.push("\n");
        out.push("  initComponent: function() {\n");
        out.push("    DirectCacheLogger.userStories('Edit Form Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
        out.push("    Ext.apply(this,{\n");
        out.push("      title: this.title || this.toDisplay || _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','List'),\n");
        out.push("      items: [\n");
        out.push("        {\n");
        out.push("          name: 'id',\n");
        out.push("          fieldLabel: _t('id', 'SYSTEM', 'labels'),\n");
        out.push("          hidden: true\n");
        out.push("        },\n");
        out.push("        {\n");
        out.push("          name: '_id',\n");
        out.push("          fieldLabel: _t('id', 'SYSTEM', 'labels'),\n");
        out.push("          hidden: true\n");
        out.push("        },\n");
        out.push("        ");
        function builItems(items) {
            for(let i = 0; i < items.length; i += 1){
                const item = items[i];
                switch(item.type){
                    case 'property':
                        const f = item.item;
                        const property = f.property;
                        if (f.generated) {
                            out.push("\n");
                            out.push("                  Grainjs.metadata['editfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`](),\n");
                            out.push("                ");
                        }
                        break;
                    case 'method':
                        const method = item.item.clientmethod;
                        out.push("\n");
                        out.push("                Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].buttons['" + (method.name) + "'](),\n");
                        out.push("              ");
                        break;
                    case 'fieldset':
                        const fs = item.item;
                        if (fs.formItems?.length > 0) {
                            out.push("\n");
                            out.push("              Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "']['" + (fs.displayName) + "']([");
                            builItems(fs.formItems);
                            out.push("]),\n");
                            out.push("              ");
                        }
                        break;
                }
            }
        }
        builItems(context.formItems);
        if (context.periodicalRel) {
            out.push(",\n");
            out.push("        {\n");
            out.push("          xtype: 'periodicaleventbar',\n");
            out.push("          panelWidget: '" + (context.$widgetName) + "edit',\n");
            out.push("          startProp: '" + (context.startProp) + "',\n");
            out.push("          endProp: '" + (context.endProp) + "',\n");
            out.push("        },");
        }
        out.push("\n");
        out.push("      ],\n");
        out.push("      listeners: {\n");
        out.push("        recordloaded: function(form, record, operation) {\n");
        out.push("          DirectCacheLogger.userStories('Edit Form Record Loaded', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
        out.push("        },\n");
        out.push("        beforerecordload: function(form, record, operation) {\n");
        out.push("          DirectCacheLogger.userStories('Edit Form Before Record Load', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
        out.push("        },\n");
        out.push("        fieldchange: function(form, field, newValue, oldValue) {\n");
        out.push("          DirectCacheLogger.userStories('Edit Form Field Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, fieldName: field.name, newValue: newValue, oldValue: oldValue });\n");
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

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.Edit.njs.js.map
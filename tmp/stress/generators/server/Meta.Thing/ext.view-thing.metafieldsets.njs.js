module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const _ = require('lodash');
        const fieldsets = context.fieldset;
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Grainjs.metafieldsets." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  override: 'Grainjs.metadata',\n");
        out.push("  statics:{\n");
        out.push("    'metafieldsets." + (context.$namespace) + "." + (context.$name) + "':{");
        if (fieldsets) {
            for(let i = 0; i < fieldsets.length; i++){
                let fs = fieldsets[i];
                if (fs.formItems?.length > 0) {
                    out.push("\n");
                    out.push("            '" + (fs.displayName) + "':  (items)=>{\n");
                    out.push("              const res = {\n");
                    out.push("                xtype:          'fieldset',\n");
                    out.push("                ");
                    if (fs.displayName !== '_') {
                        out.push("\n");
                        out.push("                title:          _t('" + (fs.displayName) + "','" + (context.$namespace) + "." + (context.$name) + "', 'fieldset'),\n");
                        out.push("                ");
                    } else {
                        out.push("\n");
                        out.push("                cls: 'fieldset-empty-title',\n");
                        out.push("                ");
                    }
                    out.push("\n");
                    out.push("                columnWidth:    " + (fs.columnWidth) + ",\n");
                    out.push("                height:         " + (fs.height) + ",\n");
                    out.push("                collapsible:    " + (fs.collapsible) + ",\n");
                    out.push("\n");
                    out.push("                collapsed:      " + (fs.collapsed) + ",\n");
                    out.push("                layout:         'column',\n");
                    out.push("                defaults: {\n");
                    out.push("                  margin: '0 5 5 5',\n");
                    out.push("                  columnWidth: 1,\n");
                    out.push("                  xtype: 'textfield'\n");
                    out.push("                },\n");
                    out.push("                items,\n");
                    out.push("              }\n");
                    out.push("            ");
                    if (fs.extraOptions && fs.extraOptions !== '{}') {
                        out.push("\n");
                        out.push("            return {\n");
                        out.push("                ...res,\n");
                        out.push("                ..." + (fs.extraOptions) + ",\n");
                        out.push("              }\n");
                        out.push("            ");
                    } else {
                        out.push("\n");
                        out.push("            return res\n");
                        out.push("            ");
                    }
                    out.push("\n");
                    out.push("            },\n");
                    out.push("            '" + (fs.displayName) + "-search':  (items)=>({\n");
                    out.push("                xtype:          'fieldset',\n");
                    out.push("                collapsible:    " + (fs.collapsible) + ",\n");
                    out.push("                collapsed:      " + (fs.collapsed) + ",\n");
                    out.push("                ");
                    if (fs.displayName !== '_') {
                        out.push("\n");
                        out.push("                title:          _t('" + (fs.displayName) + "','" + (context.$namespace) + "." + (context.$name) + "', 'fieldset'),\n");
                        out.push("                ");
                    } else {
                        out.push("\n");
                        out.push("                cls: 'fieldset-empty-title',\n");
                        out.push("                ");
                    }
                    out.push("\n");
                    out.push("                items,\n");
                    out.push("            }),\n");
                    out.push("            ");
                }
            }
        }
        out.push("\n");
        out.push("    }\n");
        out.push("  }\n");
        out.push("})");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.metafieldsets.njs.js.map
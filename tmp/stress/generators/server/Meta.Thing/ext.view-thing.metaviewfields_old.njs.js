module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const _ = require('lodash');
        const arrayToHash = context.arrayToHash;
        const getFormat = context.getFormat;
        let properties = arrayToHash(context.formviewProps, "propertyName");
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Grainjs.metaviewfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  override: 'Grainjs.metadata',\n");
        out.push("  statics:{\n");
        out.push("    'viewfields." + (context.$namespace) + "." + (context.$name) + "': {");
        for(let pName in properties){
            if (Object.prototype.hasOwnProperty.call(properties, pName)) {
                let property = properties[pName][0];
                let fviews = arrayToHash(property.formview, "profile", property, "form");
                const _fArr = (fviews[context.$$$profile] !== undefined) ? fviews[context.$$$profile] : fviews['default'];
                const fArr = _.sortBy(_fArr, [
                    'order',
                    'displayName'
                ]);
                for(let k = 0; k < fArr.length; k++){
                    let f = fArr[k];
                    out.push("\n");
                    out.push("              [`" + (property.propertyName) + "::" + (f.displayName) + "`]:{\n");
                    out.push("                name:           '" + (property.propertyName) + "',\n");
                    out.push("                ");
                    if (f.displayName !== '_') {
                        out.push("\n");
                        out.push("                fieldLabel:     _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'labels','" + (property.propertyName) + "'),\n");
                        out.push("                cls:   \"displayFld custom-x-field\",\n");
                        out.push("                ");
                    } else {
                        out.push("\n");
                        out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                        out.push("                ");
                    }
                    out.push("\n");
                    out.push("                hidden:         " + (f.hidden) + ",\n");
                    out.push("                ");
                    if (f.labelWidth) {
                        out.push("\n");
                        out.push("                labelStyle:     'min-width:" + (f.labelWidth) + "px;',\n");
                        out.push("                ");
                    }
                    out.push("\n");
                    out.push("                labelAlign:     " + (JSON.stringify(f.labelAlign)) + ",\n");
                    out.push("                labelWidth:     " + (f.labelWidth) + ",\n");
                    out.push("                columnWidth:    " + (f.columnWidth) + ",\n");
                    out.push("                renderer:       " + (context.getDisplayFieldRenderer(f)) + ",\n");
                    out.push("                dataType:       '" + (property.type.toLowerCase()) + "',\n");
                    out.push("                grow:           " + (f.grow) + ",\n");
                    out.push("                format:         " + (getFormat(f)) + ",\n");
                    out.push("                margin: \"4px\",\n");
                    out.push("\n");
                    out.push("                ");
                    if (f.fieldtype === 'checkbox') {
                        out.push("\n");
                        out.push("                xtype:         'checkbox',\n");
                        out.push("                readOnly:       true,\n");
                        out.push("                inputValue:         1,\n");
                        out.push("                uncheckedValue:     0,\n");
                        out.push("                ");
                    } else {
                        out.push("\n");
                        out.push("                xtype:         'displayfield',\n");
                        out.push("                ");
                    }
                    if (f.fieldtype === "combobox") {
                        out.push("\n");
                        out.push("                comboOptions:   Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions['" + (property.propertyName) + "'],\n");
                        out.push("                ");
                        if (f.comboForcePreload) {
                            out.push("\n");
                            out.push("                renderStore: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                            out.push("                ");
                        } else {
                            out.push("\n");
                            out.push("                // renderStore: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "]?.store(),\n");
                            out.push("                ");
                        }
                    }
                    out.push("\n");
                    out.push("              },\n");
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

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.metaviewfields_old.njs.js.map
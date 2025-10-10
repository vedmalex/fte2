module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const _ = require('lodash');
        const getFormat = context.getFormat;
        const needClear = context.needClear;
        let properties = context.formview.filter((fv)=>fv.generated);
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Grainjs.metaeditfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  override: 'Grainjs.metadata',\n");
        out.push("  statics:{\n");
        out.push("    'editfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
        out.push("    ");
        for(let i = 0; i < properties.length; i += 1){
            const f = properties[i];
            let property = f.property;
            out.push("\n");
            out.push("            [`" + (property.propertyName) + "::" + (f.displayName) + "`]: ()=>{\n");
            out.push("              const res = {\n");
            out.push("                name:               '" + (property.propertyName) + "',\n");
            out.push("                ");
            if (f.displayName !== '_') {
                out.push("\n");
                out.push("                ");
                if (f.fieldtype !== 'filecontainer') {
                    out.push("cls:\"custom-x-field\",");
                }
                out.push("\n");
                out.push("                fieldLabel:         _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "','labels','" + (property.propertyName) + "'),\n");
                out.push("                ");
            } else {
                out.push("\n");
                out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                out.push("                ");
            }
            out.push("\n");
            out.push("                hidden:             " + (f.hidden) + ",\n");
            out.push("                readOnly:           " + (f.readOnly) + ",\n");
            out.push("                emptyText:          _t(" + (JSON.stringify(f.emptyText)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'emptyTexts', '" + (property.propertyName) + "'),\n");
            out.push("                labelAlign:         " + (JSON.stringify(f.labelAlign)) + ",\n");
            out.push("                ");
            if (f.labelWidth) {
                out.push("\n");
                out.push("                labelStyle:     'min-width:" + (f.labelWidth) + "px;',\n");
                out.push("                ");
            }
            out.push("\n");
            out.push("                labelWidth:         " + (f.labelWidth) + ",\n");
            out.push("                columnWidth:        " + (f.columnWidth) + ",\n");
            out.push("                enableKeyEvents:    " + (f.enableKeyEvents) + ",\n");
            out.push("                grow:               " + (f.grow) + ",\n");
            out.push("                format:             " + (getFormat(f)) + ",\n");
            out.push("                plugins:            ");
            if (needClear(f)) {
                out.push("[`clearbutton`]");
            } else {
                out.push("[]");
            }
            out.push(",\n");
            out.push("              ");
            if (property.event) {
                out.push("\n");
                out.push("                listeners: {\n");
                out.push("                  change: function(el, newValue, oldValue){\n");
                out.push("                    let form = this.up('form');\n");
                out.push("                    let record = form.getRecord();");
                property.event.forEach(function(evnt) {
                    out.push("\n");
                    out.push("                    form." + (evnt.fnName) + "(newValue, record , '" + (evnt.propertyName.toLowerCase()) + "')");
                });
                out.push("\n");
                out.push("                  }\n");
                out.push("                },\n");
                out.push("              ");
            }
            out.push("\n");
            out.push("              ");
            if (f.fieldtype == 'textfield' && (property.required || f.required)) {
                out.push("\n");
                out.push("                allowOnlyWhitespace: false,\n");
                out.push("              ");
            } else if (f.fieldtype == 'checkbox') {
                out.push("\n");
                out.push("                  margin: \"0 5 5\",\n");
                out.push("                  inputValue:         1,\n");
                out.push("                  uncheckedValue:     0,\n");
                out.push("              ");
            } else if (f.fieldtype == 'numberfield') {
                out.push("\n");
                out.push("                  step:" + (f.step) + ",\n");
                out.push("                  fieldStyle:\"text-align: right;\",\n");
                out.push("                  ");
                if (property.enableMin) {
                    out.push("\n");
                    out.push("                      minValue:" + (property.min ? property.min : 0) + ",\n");
                    out.push("                  ");
                }
                out.push("\n");
                out.push("                  ");
                if (property.enableMax) {
                    out.push("\n");
                    out.push("                      maxValue:" + (property.max ? property.max : 0) + ",\n");
                    out.push("                  ");
                }
                out.push("\n");
                out.push("                  ");
                if (property.type.toLowerCase() == "integer") {
                    out.push("\n");
                    out.push("                      allowDecimals:false,\n");
                    out.push("                  ");
                }
                out.push("\n");
                out.push("                ");
            } else if (f.fieldtype == 'combobox') {
                if (f.comboData && f.comboData != "" && f.comboData != "{}") {
                    let cdata = JSON.parse(f.comboData);
                    if (cdata.store != undefined && cdata.displayField != undefined && cdata.valueField != undefined) {
                        out.push("\n");
                        out.push("                      store: ");
                        if (typeof (cdata.store) == "string") {
                            out.push("Ext.create('Modeleditor.store." + (cdata.store) + "', {\n");
                            out.push("                        remoteFilter: false,\n");
                            out.push("                        remoteSort: false,\n");
                            out.push("                        pageSize: -1\n");
                            out.push("                      }),");
                        } else if (typeof (cdata.store) == "object") {
                            out.push("Ext.create(\"Ext.data.Store\", {\n");
                            out.push("                          " + (JSON.stringify(cdata.store)) + "\n");
                            out.push("                        }),");
                        }
                        out.push("\n");
                        out.push("                      displayField: '" + (cdata.displayField) + "',\n");
                        out.push("                      valueField: '" + (cdata.valueField) + "',\n");
                        out.push("                      queryMode: 'local',\n");
                        out.push("                      // queryParam: \"filter::" + (cdata.valueField) + "\",\n");
                        out.push("                      listeners: {\n");
                        out.push("                        focus: function(combo, event, eOpts ){\n");
                        out.push("                          let store = combo.getStore();\n");
                        out.push("                          combo.queryFilter = false;\n");
                        out.push("                          store.clearFilter(true);\n");
                        out.push("                        },\n");
                        out.push("                        afterrender: function (combo, opts) {\n");
                        out.push("                          let store = combo.getStore();\n");
                        out.push("                          store.clearFilter(true); // If true the filter is cleared silently;\n");
                        out.push("                          if(store.isLoading()){\n");
                        out.push("                            combo.setLoading(true);\n");
                        out.push("                            store.on({\n");
                        out.push("                              load: {\n");
                        out.push("                                fn: function(st, records, success, opts){\n");
                        out.push("                                  if(success) {\n");
                        out.push("                                    this.setLoading(false);\n");
                        out.push("                                  }\n");
                        out.push("                                },\n");
                        out.push("                                scope: combo,\n");
                        out.push("                                single: true\n");
                        out.push("                              }\n");
                        out.push("                            });\n");
                        out.push("                          }else{\n");
                        out.push("                            if (!store.loaded) {\n");
                        out.push("                              combo.setLoading(true);\n");
                        out.push("                              store.load(function(records, operation, success){\n");
                        out.push("                                if(success){\n");
                        out.push("                                  store.loaded = true;\n");
                        out.push("                                  combo.setLoading(false);\n");
                        out.push("                                }\n");
                        out.push("                              });\n");
                        out.push("                            };\n");
                        out.push("                          }\n");
                        out.push("                        }\n");
                        out.push("                      },\n");
                        out.push("                      ");
                    } else if (cdata.customStore != undefined && cdata.customStore === true) {
                        out.push("\n");
                        out.push("                      ");
                        if (cdata.tpl) {
                            out.push("\n");
                            out.push("                        tpl: " + (JSON.stringify(cdata.tpl)) + ",\n");
                            out.push("                      ");
                        }
                        out.push("\n");
                        out.push("                      store: Ext.create(\"Ext.data.Store\", {\n");
                        out.push("                        autoSync: ");
                        if (cdata.autoSync) {
                            out.push((cdata.autoSync));
                        } else {
                            out.push("false");
                        }
                        out.push(",");
                        if (cdata.model) {
                            out.push("\n");
                            out.push("                        model: \"" + (cdata.model) + "\",");
                        } else {
                            out.push("\n");
                            out.push("                        fields: ");
                            if (cdata.fields) {
                                out.push((JSON.stringify(cdata.fields)));
                            } else {
                                out.push("['name', 'value']");
                            }
                        }
                        ;
                        if (cdata.sorters) {
                            out.push(",\n");
                            out.push("                        sorters: " + (JSON.stringify(cdata.sorters)));
                        }
                        ;
                        if (cdata.apiRead) {
                            out.push(",\n");
                            out.push("                        autoLoad: ");
                            if (cdata.autoLoad) {
                                out.push((cdata.autoLoad));
                            } else {
                                out.push("false");
                            }
                            out.push(",\n");
                            out.push("                        proxy: {\n");
                            out.push("                          type: ");
                            if (cdata.proxyType) {
                                out.push("\n");
                                out.push("                                  \"" + (cdata.proxyType) + "\",\n");
                                out.push("                                ");
                            } else {
                                out.push("\n");
                                out.push("                                  \"direct\",\n");
                                out.push("                                ");
                            }
                            out.push("\n");
                            out.push("                          api: {\n");
                            out.push("                            read: " + (cdata.apiRead) + "\n");
                            out.push("                          }\n");
                            out.push("                          ");
                            if (cdata.extraParams) {
                                out.push(",\n");
                                out.push("                          extraParams: " + (JSON.stringify(cdata.extraParams)));
                            }
                            ;
                            if (cdata.reader) {
                                out.push(",\n");
                                out.push("                          reader: " + (JSON.stringify(cdata.reader)));
                            }
                            ;
                            if (cdata.writer) {
                                out.push(",\n");
                                out.push("                          writer: " + (JSON.stringify(cdata.writer)));
                            }
                            out.push("\n");
                            out.push("                        }");
                        } else {
                            out.push(",\n");
                            out.push("                        data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, [");
                            if (cdata.displayField) {
                                out.push("\"" + (cdata.displayField) + "\"");
                            } else {
                                out.push("'name'");
                            }
                            out.push("]: _t(item[");
                            if (cdata.displayField) {
                                out.push("\"" + (cdata.displayField) + "\"");
                            } else {
                                out.push("'name'");
                            }
                            out.push("],'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                            out.push("                        ");
                        }
                        out.push("\n");
                        out.push("                      }),\n");
                        out.push("                      displayField: ");
                        if (cdata.displayField) {
                            out.push("\"" + (cdata.displayField) + "\"");
                        } else {
                            out.push("'name'");
                        }
                        out.push(",\n");
                        out.push("                      valueField: ");
                        if (cdata.valueField) {
                            out.push("\"" + (cdata.valueField) + "\"");
                        } else {
                            out.push("\"value\"");
                        }
                        out.push(",\n");
                        out.push("                      queryMode: ");
                        if (cdata.queryMode) {
                            out.push("\"" + (cdata.queryMode) + "\"");
                        } else {
                            out.push("\"local\"");
                        }
                        out.push(",");
                    } else {
                        out.push("\n");
                        out.push("                      store: Ext.create('Ext.data.Store', {\n");
                        out.push("                        fields: ['name', 'value'],\n");
                        out.push("                        data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, name: _t(item.name,'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                        out.push("                      }),\n");
                        out.push("                      displayField: 'name',\n");
                        out.push("                      valueField: 'value',\n");
                        out.push("                      queryMode: 'local',\n");
                        out.push("                      listeners: {\n");
                        out.push("                        focus: function(combo, event, eOpts ){\n");
                        out.push("                          let store = combo.getStore();\n");
                        out.push("                          combo.queryFilter = false;\n");
                        out.push("                          store.clearFilter(true);\n");
                        out.push("                        },\n");
                        out.push("                        afterrender: function (combo, opts) {\n");
                        out.push("                          let store = combo.getStore();\n");
                        out.push("                          store.clearFilter(true); // If true the filter is cleared silently;\n");
                        out.push("                          if(store.isLoading()){\n");
                        out.push("                            combo.setLoading(true);\n");
                        out.push("                            store.on({\n");
                        out.push("                              load: {\n");
                        out.push("                                fn: function(st, records, success, opts){\n");
                        out.push("                                  if(success) {\n");
                        out.push("                                    this.setLoading(false);\n");
                        out.push("                                  }\n");
                        out.push("                                },\n");
                        out.push("                                scope: combo,\n");
                        out.push("                                single: true\n");
                        out.push("                              }\n");
                        out.push("                            });\n");
                        out.push("                          }else{\n");
                        out.push("                            if (!store.loaded) {\n");
                        out.push("                              combo.setLoading(true);\n");
                        out.push("                              store.load(function(records, operation, success){\n");
                        out.push("                                if(success){\n");
                        out.push("                                  store.loaded = true;\n");
                        out.push("                                  combo.setLoading(false);\n");
                        out.push("                                }\n");
                        out.push("                              });\n");
                        out.push("                            };\n");
                        out.push("                          }\n");
                        out.push("                        }\n");
                        out.push("                      },\n");
                        out.push("                      ");
                    }
                }
                out.push("\n");
                out.push("                  forceSelection: " + (f.forceSelection) + ",\n");
                out.push("                  editable: " + (f.comboAutocomplete) + ",\n");
                out.push("                  ");
            }
            ;
            if (f.validator) {
                out.push("\n");
                out.push("                validator: function(value){\n");
                out.push("                  " + (f.validator) + "\n");
                out.push("                },");
            }
            out.push("\n");
            out.push("                dataType: '" + (property.type.toLowerCase()) + "',\n");
            out.push("                xtype: '" + (f.fieldtype) + "'\n");
            out.push("            }\n");
            out.push("            res.allowBlank = " + (!(property.required || f.required || property.clientRequired)) + "\n");
            out.push("            ");
            if (property.required || f.required || property.clientRequired) {
                out.push("\n");
                out.push("            res.afterLabelTextTpl = '<span style=\"color:red;\" data-qtip=\"Required\">*</span>'\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("            ");
            if (f.extraOptions && f.extraOptions !== '{}') {
                out.push("\n");
                out.push("            return {\n");
                out.push("                ...res,\n");
                out.push("                ..." + (f.extraOptions) + ",\n");
                out.push("              }\n");
                out.push("            ");
            } else {
                out.push("\n");
                out.push("            return res\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("            },\n");
            out.push("            ");
        }
        out.push("\n");
        out.push("    },\n");
        out.push("  }\n");
        out.push("})");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.metaeditfields.njs.js.map
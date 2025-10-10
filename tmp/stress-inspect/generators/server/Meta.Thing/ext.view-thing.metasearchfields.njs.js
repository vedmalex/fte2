module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const _ = require('lodash');
        const getFormat = context.getFormat;
        const needClear = context.needClear;
        let properties = context.formview.filter((fv)=>!fv.hiddenForSearch);
        const searchTypes = {
            baseimage: 'textfield',
            baselabel: 'textfield',
            basetemplateeditor: 'textareafield',
            checkbox: 'checkbox',
            codeeditor: 'textareafield',
            combobox: 'combobox',
            datefield: 'datefield',
            datetimefield: 'datetimefield',
            displayfield: 'displayfield',
            extcalendarcombo: 'extcalendarcombo',
            extentionsGrid: 'textareafield',
            filecontainer: 'textfield',
            numberfield: 'numberfield',
            tbspacer: 'tbspacer',
            textareafield: 'textareafield',
            textfield: 'textfield',
            timefield: 'timefield'
        };
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Grainjs.metasearchfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  override: 'Grainjs.metadata',\n");
        out.push("  statics:{\n");
        out.push("    'searchfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
        out.push("    ");
        for(let i = 0; i < properties.length; i += 1){
            const f = properties[i];
            let property = f.property;
            out.push("\n");
            out.push("            [`" + (property.propertyName) + "::" + (f.displayName) + "`]: (legacy)=>{\n");
            out.push("              const res = {\n");
            out.push("                name:               '" + (property.propertyName) + "',\n");
            out.push("                format:             " + (getFormat(f)) + ",\n");
            out.push("                plugins: ");
            if (needClear(f, true)) {
                out.push("[`clearbutton`]");
            } else {
                out.push("[]");
            }
            out.push(",\n");
            out.push("              ");
            if (f.fieldtype == 'checkbox') {
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
                out.push("              ");
            }
            ;
            out.push("\n");
            out.push("              ");
            if (f.prepareForSearch !== undefined) {
                out.push("\n");
                out.push("\t\t\t\t\t\t\t\tprepareFn: function (value) {\n");
                out.push("\t\t\t\t\t\t\t\t\t" + (f.prepareForSearch) + "\n");
                out.push("\t\t\t\t\t\t\t\t},");
            }
            out.push("\n");
            out.push("                dataType: '" + (property.type.toLowerCase()) + "',\n");
            out.push("                xtype: '" + (searchTypes[f.fieldtype]) + "',\n");
            out.push("                ");
            if (f.displayName !== '_') {
                out.push("\n");
                out.push("                cls:   \"custom-x-field\",\n");
                out.push("                fieldLabel: _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "','labels','" + (property.propertyName) + "'),\n");
                out.push("                ");
            } else {
                out.push("\n");
                out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                out.push("                ");
            }
            out.push("\n");
            out.push("                ");
            if (f.labelWidth) {
                out.push("\n");
                out.push("                labelStyle: 'min-width:" + (f.labelWidth) + "px;',\n");
                out.push("                ");
            }
            out.push("\n");
            out.push("            }\n");
            out.push("            if(!legacy) {\n");
            out.push("              return {\n");
            out.push("                xtype: 'fieldcontainer',\n");
            out.push("                layout: 'hbox',\n");
            out.push("                columnWidth: 1,\n");
            out.push("                grow: true,\n");
            out.push("                items: [\n");
            out.push("                  {\n");
            out.push("                    ...res,\n");
            out.push("                    flex:1,\n");
            out.push("                    grow: true,\n");
            out.push("                  },\n");
            out.push("                  {\n");
            out.push("                    xtype: 'tbspacer',\n");
            out.push("                  },\n");
            out.push("                  {\n");
            out.push("                    flex:0.5,\n");
            out.push("                    xtype: 'fieldcontainer',\n");
            out.push("                    layout: 'hbox',\n");
            out.push("                    items:[\n");
            out.push("                      {\n");
            out.push("                        extraSearchOption:true,\n");
            out.push("                        optionName:'exists',\n");
            out.push("                        propertyName: '" + (property.propertyName) + "',\n");
            out.push("                        flex: 0.20,\n");
            out.push("                        xtype: 'checkbox',\n");
            out.push("                        boxLabel  : 'exists',\n");
            out.push("                        name: '" + (property.propertyName) + "|exists',\n");
            out.push("                        margin: \"0 5 5\",\n");
            out.push("                      },\n");
            out.push("                      {\n");
            out.push("                        extraSearchOption:true,\n");
            out.push("                        optionName:'existsValue',\n");
            out.push("                        propertyName: '" + (property.propertyName) + "',\n");
            out.push("                        flex: 0.3,\n");
            out.push("                        xtype: 'radiogroup',\n");
            out.push("                        layout: 'hbox',\n");
            out.push("                        items:[\n");
            out.push("                          {\n");
            out.push("                            extraSearchOption:true,\n");
            out.push("                            optionName:'existsValue',\n");
            out.push("                            propertyName: '" + (property.propertyName) + "',\n");
            out.push("                            margin: \"0 5 5\",\n");
            out.push("                            boxLabel: 'Y',\n");
            out.push("                            name: '" + (property.propertyName) + "|exists_yn',\n");
            out.push("                            inputValue: true,\n");
            out.push("                            checked : true\n");
            out.push("                          },\n");
            out.push("                          {\n");
            out.push("                            extraSearchOption:true,\n");
            out.push("                            optionName:'existsValue',\n");
            out.push("                            propertyName: '" + (property.propertyName) + "',\n");
            out.push("                            margin: \"0 5 0\",\n");
            out.push("                            boxLabel: 'N',\n");
            out.push("                            name: '" + (property.propertyName) + "|exists_yn',\n");
            out.push("                            inputValue: false\n");
            out.push("                          },\n");
            out.push("                        ]\n");
            out.push("                      },\n");
            out.push("                      {\n");
            out.push("                        flex: 0.5,\n");
            out.push("                        extraSearchOption:true,\n");
            out.push("                        optionName: \"json\",\n");
            out.push("                        propertyName: '" + (property.propertyName) + "',\n");
            out.push("                        name: '" + (property.propertyName) + "|json',\n");
            out.push("                        xtype: 'textfield',\n");
            out.push("                        labelWidth: 0,\n");
            out.push("                      }\n");
            out.push("                    ]\n");
            out.push("                  },\n");
            out.push("                ]\n");
            out.push("              }\n");
            out.push("            } else {\n");
            out.push("              return {\n");
            out.push("                xtype: 'fieldcontainer',\n");
            out.push("                grow: true,\n");
            out.push("                labelAlign:         " + (JSON.stringify(f.labelAlign)) + ",\n");
            out.push("                labelWidth:         " + (f.labelWidth) + ",\n");
            out.push("                columnWidth:        " + (f.columnWidth) + ",\n");
            out.push("                grow:               " + (f.grow) + ",\n");
            out.push("                ...res\n");
            out.push("              }\n");
            out.push("            }\n");
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

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.metasearchfields.njs.js.map
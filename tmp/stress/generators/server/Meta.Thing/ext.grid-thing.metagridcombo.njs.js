module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        let properties = [
            ...context.gridviewProps
        ].sort((a, b)=>a.property.propertyName > b.property.propertyName ? 1 : -1);
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Grainjs.metagridcombo." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  override: 'Grainjs.metadata',\n");
        out.push("  statics:{\n");
        out.push("    'gridcombo." + (context.$namespace) + "." + (context.$name) + "': {\n");
        out.push("      comboOptions: {");
        for(let i = 0; i < properties.length; i++){
            let property = properties[i].property;
            const props = context.formPropsHash[property.propertyName].filter((f)=>f.generated);
            if (props.length === 0) {
                out.push("\n");
                out.push("          " + (JSON.stringify(property.propertyName)) + ": {},\n");
                out.push("          ");
            } else {
                for(let j = 0; j < props.length; j++){
                    const f = props[j];
                    out.push("\n");
                    out.push("          " + (JSON.stringify(property.propertyName)) + ": {");
                    if (f.comboData && f.comboData != "" && f.comboData != "{}") {
                        let cdata = JSON.parse(f.comboData);
                        if (cdata.store != undefined && cdata.displayField != undefined && cdata.valueField != undefined) {
                            if (cdata.tpl) {
                                out.push("\n");
                                out.push("                tpl: " + (JSON.stringify(cdata.tpl)) + ",");
                            }
                            out.push("\n");
                            out.push("                store:");
                            if (typeof (cdata.store) == "string") {
                                out.push("\n");
                                out.push("                  ()=>Ext.create('Modeleditor.store." + (cdata.store) + "', {\n");
                                out.push("                  autoLoad: true,\n");
                                out.push("                  remoteFilter: false,\n");
                                out.push("                  remoteSort: false,\n");
                                out.push("                  pageSize: -1\n");
                                out.push("                }),");
                            } else if (typeof (cdata.store) == "object") {
                                out.push("\n");
                                out.push("                  ()=>Ext.create(\"Ext.data.Store\", {\n");
                                out.push("                    " + (JSON.stringify(cdata.store)) + "\n");
                                out.push("                  }),");
                            }
                            out.push("\n");
                            out.push("                displayField: '" + (cdata.displayField) + "',\n");
                            out.push("                valueField: '" + (cdata.valueField) + "',\n");
                            out.push("                queryMode: 'local',\n");
                            out.push("                // queryParam: \"filter::" + (cdata.valueField) + "\",\n");
                            out.push("                listeners:{\n");
                            out.push("                  focus: function(combo, event, eOpts ) {\n");
                            out.push("                    let store = combo.getStore();\n");
                            out.push("                    combo.queryFilter = false;\n");
                            out.push("                    store.clearFilter(true);\n");
                            out.push("                  },\n");
                            out.push("                  afterrender: function (combo, opts) {\n");
                            out.push("                    let store = combo.getStore();\n");
                            out.push("                    store.clearFilter(true); // If true the filter is cleared silently;\n");
                            out.push("                    if(store.isLoading()){\n");
                            out.push("                      combo.setLoading(true);\n");
                            out.push("                      store.on({\n");
                            out.push("                        load: {\n");
                            out.push("                          fn: function(st, records, success, opts){\n");
                            out.push("                            if(success) {\n");
                            out.push("                              this.setLoading(false);\n");
                            out.push("                            }\n");
                            out.push("                          },\n");
                            out.push("                          scope: combo,\n");
                            out.push("                          single: true\n");
                            out.push("                        }\n");
                            out.push("                      });\n");
                            out.push("                    }else{\n");
                            out.push("                      if (!store.loaded) {\n");
                            out.push("                        combo.setLoading(true);\n");
                            out.push("                        store.load(function(records, operation, success){\n");
                            out.push("                          if(success){\n");
                            out.push("                            store.loaded = true;\n");
                            out.push("                            combo.setLoading(false);\n");
                            out.push("                          }\n");
                            out.push("                        });\n");
                            out.push("                      };\n");
                            out.push("                    }\n");
                            out.push("                  },\n");
                            out.push("                },");
                        } else if (cdata.customStore != undefined && cdata.customStore === true) {
                            out.push("\n");
                            out.push("                store: ()=>Ext.create(\"Ext.data.Store\", {\n");
                            out.push("                  autoSync:");
                            if (cdata.autoSync) {
                                out.push("\n");
                                out.push("                    " + (cdata.autoSync) + ",");
                            } else {
                                out.push("\n");
                                out.push("                    false,");
                            }
                            if (cdata.model) {
                                out.push("\n");
                                out.push("                  model: \"" + (cdata.model) + "\",");
                            } else {
                                out.push("\n");
                                out.push("                  fields:");
                                if (cdata.fields) {
                                    out.push("\n");
                                    out.push("                      " + (JSON.stringify(cdata.fields)) + ",");
                                } else {
                                    out.push("\n");
                                    out.push("                    ['name', 'value'],");
                                }
                            }
                            if (cdata.sorters) {
                                out.push("\n");
                                out.push("                  sorters: " + (JSON.stringify(cdata.sorters)) + ",");
                            }
                            if (cdata.apiRead) {
                                out.push("\n");
                                out.push("                  autoLoad: ");
                                if (cdata.autoLoad) {
                                    out.push((cdata.autoLoad));
                                } else {
                                    out.push("false");
                                }
                                out.push(",\n");
                                out.push("                  proxy: {\n");
                                out.push("                    type:");
                                if (cdata.proxyType) {
                                    out.push("\n");
                                    out.push("                      \"" + (cdata.proxyType) + "\",");
                                } else {
                                    out.push("\n");
                                    out.push("                      \"direct\",");
                                }
                                out.push("\n");
                                out.push("                    api: {\n");
                                out.push("                      read: " + (cdata.apiRead) + "\n");
                                out.push("                    },");
                                if (cdata.extraParams) {
                                    out.push("\n");
                                    out.push("                    extraParams: " + (JSON.stringify(cdata.extraParams)) + ",");
                                }
                                if (cdata.reader) {
                                    out.push("\n");
                                    out.push("                    reader: " + (JSON.stringify(cdata.reader)));
                                }
                                if (cdata.writer) {
                                    out.push(",\n");
                                    out.push("                    writer: " + (JSON.stringify(cdata.writer)));
                                }
                                out.push("\n");
                                out.push("                  },");
                            } else {
                                out.push(",\n");
                                out.push("                  data: (" + (JSON.stringify(cdata.data)) + " || [])");
                                const displayField = cdata.displayField ? cdata.displayField : 'name';
                                out.push("\n");
                                out.push("                  .map(item=>({\n");
                                out.push("                    ...item,\n");
                                out.push("                    ['" + (displayField) + "']:\n");
                                out.push("                      _t(item['" + (displayField) + "'],\n");
                                out.push("                      '" + (context.$namespace) + "." + (context.$name) + "',\n");
                                out.push("                      'combobox',\n");
                                out.push("                      '" + (property.propertyName) + "')\n");
                                out.push("                    }))");
                            }
                            out.push("\n");
                            out.push("                }),\n");
                            out.push("                displayField: ");
                            if (cdata.displayField) {
                                out.push("\"" + (cdata.displayField) + "\"");
                            } else {
                                out.push("'name'");
                            }
                            out.push(",\n");
                            out.push("                valueField: ");
                            if (cdata.valueField) {
                                out.push("\"" + (cdata.valueField) + "\"");
                            } else {
                                out.push("\"value\"");
                            }
                            out.push(",\n");
                            out.push("                queryMode: ");
                            if (cdata.queryMode) {
                                out.push("\"" + (cdata.queryMode) + "\"");
                            } else {
                                out.push("\"local\"");
                            }
                            out.push(",");
                        } else {
                            out.push("\n");
                            out.push("                store:()=> Ext.create('Ext.data.Store', {\n");
                            out.push("                  autoLoad: true,\n");
                            out.push("                  fields: ['name', 'value'],\n");
                            out.push("                  data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, name: _t(item.name,'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                            out.push("                }),\n");
                            out.push("                displayField: 'name',\n");
                            out.push("                valueField: 'value',\n");
                            out.push("                queryMode: 'local',\n");
                            out.push("                listeners: {\n");
                            out.push("                  focus: function(combo, event, eOpts ){\n");
                            out.push("                    let store = combo.getStore();\n");
                            out.push("                    combo.queryFilter = false;\n");
                            out.push("                    store.clearFilter(true);\n");
                            out.push("                  },\n");
                            out.push("                  afterrender: function (combo, opts) {\n");
                            out.push("                    let store = combo.getStore();\n");
                            out.push("                    store.clearFilter(true); // If true the filter is cleared silently;\n");
                            out.push("                    if(store.isLoading()){\n");
                            out.push("                      combo.setLoading(true);\n");
                            out.push("                      store.on({\n");
                            out.push("                        load: {\n");
                            out.push("                          fn: function(st, records, success, opts){\n");
                            out.push("                            if(success) {\n");
                            out.push("                              this.setLoading(false);\n");
                            out.push("                            }\n");
                            out.push("                          },\n");
                            out.push("                          scope: combo,\n");
                            out.push("                          single: true\n");
                            out.push("                        }\n");
                            out.push("                      });\n");
                            out.push("                    }else{\n");
                            out.push("                      if (!store.loaded) {\n");
                            out.push("                        combo.setLoading(true);\n");
                            out.push("                        store.load(function(records, operation, success){\n");
                            out.push("                          if(success){\n");
                            out.push("                            store.loaded = true;\n");
                            out.push("                            combo.setLoading(false);\n");
                            out.push("                          }\n");
                            out.push("                        });\n");
                            out.push("                      };\n");
                            out.push("                    }\n");
                            out.push("                  },\n");
                            out.push("                },\n");
                            out.push("                ");
                        }
                    }
                    out.push("\n");
                    out.push("          },");
                }
            }
        }
        out.push("\n");
        out.push("      },\n");
        out.push("    },\n");
        out.push("  },\n");
        out.push("})");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.grid-thing.metagridcombo.njs.js.map
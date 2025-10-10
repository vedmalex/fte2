module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        const getFormat = context.getFormat;
        let properties = [
            ...context.gridviewProps
        ].sort((a, b)=>a.property.propertyName > b.property.propertyName ? 1 : -1);
        out.push("\n");
        out.push("  Ext.define('Grainjs.metagridfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("    override: 'Grainjs.metadata',\n");
        out.push("    statics:{\n");
        out.push("      'gridfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
        out.push("        fields: {\n");
        out.push("        ");
        for(let i = 0; i < properties.length; i++){
            let property = properties[i].property;
            let g = properties[i];
            const viewProps = context.formPropsHash[property.propertyName].filter((f)=>f.generated);
            let f;
            if (viewProps.length > 0) {
                f = viewProps[0];
            } else {
                f = {};
            }
            out.push("\n");
            out.push("          [`" + (property.propertyName) + "::" + (g.columnText) + "`]:()=> ({\n");
            out.push("            dataIndex:\"" + (property.propertyName) + "\",\n");
            out.push("            text:      _t(" + (JSON.stringify(g.columnText)) + ",'" + (context.$namespace) + "." + (context.$name) + "','labels','" + (property.propertyName) + "'),\n");
            out.push("            flex:      " + (g.flex) + ",");
            if (g.width && g.width > 0) {
                out.push("\n");
                out.push("            width:    " + (g.width) + ",");
            }
            out.push("\n");
            out.push("            hidden:      " + (g.hidden) + ",\n");
            out.push("            filterable:  " + (property.isVirtual ? false : g.filterable) + ",\n");
            out.push("            ");
            if (g.filterable) {
                out.push("\n");
                out.push("            filter:\n");
                out.push("            ");
                if (g.enforceFilter === 'none' || !g.enforceFilter) {
                    out.push("\n");
                    out.push("            ");
                    if (!property.isVirtual) {
                        if (f.fieldtype === "combobox" && g.filterable) {
                            out.push("{\n");
                            out.push("              type: 'combo',\n");
                            out.push("              ");
                            if (f.comboForcePreload) {
                                out.push("\n");
                                out.push("              store: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                                out.push("              ");
                            } else {
                                out.push("\n");
                                out.push("              store: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].store(),\n");
                                out.push("              ");
                            }
                            out.push("\n");
                            out.push("              displayField:  Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].displayField,\n");
                            out.push("              valueField:  Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].valueField\n");
                            out.push("            }\n");
                            out.push("            ");
                        } else if (!(g.filter || g.filterable) && property.relation) {
                            out.push("\n");
                            out.push("              \"key\"\n");
                            out.push("            ");
                        } else if (g.filter || g.filterable) {
                            out.push("\n");
                            out.push("              " + ((g.filter || g.filterable)) + "\n");
                            out.push("            ");
                        }
                    } else {
                        out.push("false");
                    }
                    out.push("\n");
                    out.push("            ");
                } else if (g.enforceFilter === 'key') {
                    out.push("\n");
                    out.push("            \"key\"\n");
                    out.push("            ");
                } else if (g.enforceFilter === 'filter') {
                    out.push("\n");
                    out.push("            true\n");
                    out.push("            ");
                }
                out.push("\n");
                out.push("            ,\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("            sortable:     " + (g.sortable) + ",\n");
            out.push("            hideable:     " + (g.hideable) + ",\n");
            out.push("            draggable:    " + (g.draggable) + ",\n");
            out.push("            resizeable:   " + (g.resizeable) + ",\n");
            out.push("            menuDisabled: " + (g.menuDisabled) + ",\n");
            out.push("            format:      " + (getFormat(g)) + ",\n");
            out.push("            xtype:      \"" + (g.columntype) + "\"");
            if (!g.columnRenderer && f.fieldtype === "combobox") {
                out.push(",\n");
                out.push("            ");
                if (f.comboForcePreload) {
                    out.push("\n");
                    out.push("            renderStore: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                    out.push("            ");
                } else {
                    out.push("\n");
                    out.push("            // renderStore: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].store(),\n");
                    out.push("            ");
                }
                out.push("\n");
                out.push("            renderer:  function(value, me){\n");
                out.push("              let res = value;\n");
                out.push("              let options = Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "];\n");
                out.push("              let store = me.column.renderStore ?? options.store();\n");
                out.push("              if(store?.loadState !== Ext.data.LoggedStore.STATE_LOADED && !me.column.renderStoreLoaded) {\n");
                out.push("                const grid = me.column.up('grid')\n");
                out.push("                const column = me.column\n");
                out.push("                column.renderStoreLoaded = true\n");
                out.push("                column.renderStore = store\n");
                out.push("                Promisify.event(store, 'load').then(_=> {\n");
                out.push("                  grid.view.refresh();\n");
                out.push("                })\n");
                out.push("              }\n");
                out.push("              let index = store?.findExact(options.valueField, value) ?? -1;\n");
                out.push("              if (index != -1) {\n");
                out.push("                let result = store.getAt(index).data;\n");
                out.push("                res = result[options.displayField];\n");
                out.push("              }\n");
                out.push("              return res;\n");
                out.push("            }");
            } else if (!g.columnRenderer && g.columntype === "numbercolumn") {
                out.push(",\n");
                out.push("              renderer: function(value) {\n");
                out.push("                return Ext.String.format('<div style=\"text-align: right;\">{0}</div>', Ext.util.Format.number(value, " + (getFormat(g)) + "));\n");
                out.push("              }\n");
                out.push("            ");
            } else if (g.columnRenderer) {
                out.push(",\n");
                out.push("            renderer:  function(value){\n");
                out.push("              " + (g.columnRenderer) + "\n");
                out.push("            }");
            }
            if (context.periodicalRel && property.propertyName == context.titleProp) {
                out.push(",\n");
                out.push("              xtype: \"gridcolumn\",\n");
                out.push("              renderer: function(val, metaData, record){\n");
                out.push("                let styling = false;\n");
                out.push("                let txt = \"\";\n");
                out.push("                let color = \"#E8E8E8\";\n");
                out.push("\n");
                out.push("                if (record.get(\"_isperiodical\")) {\n");
                out.push("                  styling = true;\n");
                out.push("                  txt = \"P\";\n");
                out.push("                  color = \"#F5DEB3\";\n");
                out.push("                } else if (record.get(\"_isperiodicalroot\")) {\n");
                out.push("                  styling = true;\n");
                out.push("                  txt = \"R\";\n");
                out.push("                  color = \"#E8E8E8\";\n");
                out.push("                }\n");
                out.push("\n");
                out.push("                if (styling) {\n");
                out.push("                  return '<div>'+\n");
                out.push("                    '<div style=\"float:left\";>' +\n");
                out.push("                      val +\n");
                out.push("                    '</div>'+\n");
                out.push("                    '<div style=\"padding:1px 4px;'+\n");
                out.push("                      ' margin:0 0 0 10px;'+\n");
                out.push("                      ' -moz-border-radius:3px;'+\n");
                out.push("                      ' -webkit-border-radius:3px;'+\n");
                out.push("                      ' border-radius:3px;'+\n");
                out.push("                      ' background-color: '+color+';'+\n");
                out.push("                      ' float:right;>'+\n");
                out.push("                      ' -moz-box-shadow: 0 0 2px #888;'+\n");
                out.push("                      ' -webkit-box-shadow: 0 0 2px#888;'+\n");
                out.push("                      ' box-shadow: 0 0 2px #888;'+\n");
                out.push("                    '\">'+txt+\n");
                out.push("                    '</div>'+\n");
                out.push("                  '</div>'\n");
                out.push("                } else {\n");
                out.push("                  return val;\n");
                out.push("                }\n");
                out.push("              }\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("          ");
            if (g.extraOptions && g.extraOptions !== '{}') {
                out.push(",..." + (g.extraOptions) + ",");
            }
            out.push("\n");
            out.push("          }),\n");
            out.push("              ");
        }
        out.push("\n");
        out.push("      }\n");
        out.push("    }\n");
        out.push("  }\n");
        out.push("})\n");
        out.push("\n");
        out.push("\n");
        out.push("");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.grid-thing.metagridfields.njs.js.map
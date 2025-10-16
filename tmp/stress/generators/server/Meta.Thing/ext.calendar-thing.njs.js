module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const config = context.getThingConfig(context);
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".Calendar." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$namespace) + "." + (context.$name) + "',\n");
        out.push("  extend: 'Modeleditor.view.base.extCalendar',\n");
        out.push("  alias: 'widget." + (context.$widgetName) + "calendar',\n");
        out.push("  widget: '" + (context.$widgetName) + "',\n");
        out.push("  //iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
        if (context.iconCls) {
            out.push("|| \"" + (context.iconCls) + "\"");
        }
        out.push(" ,\n");
        out.push("  name:'" + (context.$name) + "',\n");
        out.push("  namespace:'" + (context.$namespace) + "',\n");
        out.push("\n");
        out.push("  fnLoad : function(view) {\n");
        out.push("    DirectCacheLogger.userStories('Calendar Load Function', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, embedded: !!view.embeddedKey });\n");
        out.push("    if (view.embeddedKey) {\n");
        out.push("      view.record = this.rec;\n");
        out.push("      view.embeddedKey = this.embeddedKey;\n");
        out.push("      view.eventStore = view.rec[this.embeddedKey]();\n");
        out.push("      view.allowCreateNew = " + (context.cal_mapping.allowCreateEmbedded) + ";\n");
        out.push("      view.readOnly =  " + (context.cal_mapping.readOnlyEmbedded) + ";\n");
        out.push("      view.showUnassignedPanel = " + (context.cal_mapping.showUnassignedPanelEmbedded) + ";\n");
        out.push("    } else {\n");
        out.push("      view.sortPanels = [");
        let spAll = context.cal_mapping.cal_sortBy;
        if (spAll) {
            let sortPanels = spAll.filter(function(item) {
                return !item.disable;
            });
            for(let k = 0; k < sortPanels.length; k++){
                out.push("\n");
                out.push("        {");
                if (sortPanels[k].fields) {
                    out.push("\n");
                    out.push("        fields: \"" + ([
                        sortPanels[k].fields.match(/[A-Za-z0-9]*[A-Za-z0-9]/g)
                    ].join(',')) + "\",");
                }
                if (sortPanels[k].filterDisplayField) {
                    out.push("\n");
                    out.push("        filterDisplayField: \"" + (sortPanels[k].filterDisplayField) + "\",");
                }
                if (sortPanels[k].name) {
                    out.push("\n");
                    out.push("        name: \"" + (sortPanels[k].name) + "\",");
                }
                if (sortPanels[k].sortBy) {
                    out.push("\n");
                    out.push("        sortByQuery: \"" + (sortPanels[k].sortBy) + "\",");
                }
                if (sortPanels[k].sortByStore) {
                    out.push("\n");
                    out.push("        sortByStore: Ext.create('Modeleditor.store." + (sortPanels[k].sortByStore) + "', {\n");
                    out.push("                  extKeys: [],\n");
                    out.push("                  remoteFilter: false,\n");
                    out.push("                  remoteSort: false,\n");
                    out.push("                  proxy: {\n");
                    out.push("                      type: \"direct\",\n");
                    out.push("                      directFn: ReadByQuery." + (sortPanels[k].sortByStore.replace(/\./g, "")) + ",\n");
                    out.push("                      reader: {\n");
                    out.push("                          type: 'jsonmn',\n");
                    out.push("                          root: 'data'\n");
                    out.push("                      }\n");
                    out.push("                  },\n");
                    out.push("                  pageSize: -1\n");
                    out.push("              }),");
                }
                if (sortPanels[k].thingFilter) {
                    out.push("\n");
                    out.push("        thingFilter: \"" + (sortPanels[k].thingFilter) + "\",");
                }
                if (sortPanels[k].thingFilter) {
                    out.push("\n");
                    out.push("        filterStore: Ext.create('Modeleditor.store." + (sortPanels[k].thingFilter) + "', {\n");
                    out.push("                  extKeys: [],\n");
                    out.push("                  remoteFilter: false,\n");
                    out.push("                  remoteSort: false,\n");
                    out.push("                  proxy: {\n");
                    out.push("                      type: \"direct\",\n");
                    out.push("                      directFn: ReadByQuery." + (sortPanels[k].thingFilter.replace(/\./g, "")) + ",\n");
                    out.push("                      reader: {\n");
                    out.push("                          type: 'jsonmn',\n");
                    out.push("                          root: 'data'\n");
                    out.push("                      }\n");
                    out.push("                  },\n");
                    out.push("                  pageSize: -1\n");
                    out.push("              }),");
                }
                if (sortPanels[k].key) {
                    out.push("\n");
                    out.push("        key:\"" + (sortPanels[k].key) + "\",");
                }
                if (sortPanels[k].fromKey) {
                    out.push("\n");
                    out.push("        fromKey:\"" + (sortPanels[k].fromKey) + "\",");
                }
                if (sortPanels[k].id) {
                    out.push("\n");
                    out.push("        id:\"" + (sortPanels[k].id) + "\",");
                }
                out.push("\n");
                out.push("\n");
                out.push("        pUid:\"_" + ('PFCAL00' + k) + "\"\n");
                out.push("      }");
                if (k != sortPanels.length - 1) {
                    out.push("\n");
                    out.push("          ,");
                }
            }
        }
        out.push("];" + "\n");
        out.push("      view.eventStore = Ext.create('Modeleditor.store." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("                extKeys: [],\n");
        out.push("                remoteFilter: false,\n");
        out.push("                remoteSort: false,\n");
        out.push("                proxy: {\n");
        out.push("                    type: \"direct\",\n");
        out.push("                    directFn: ReadByQuery." + (context.$namespace) + (context.$name) + ",\n");
        out.push("                    reader: {\n");
        out.push("                        type: 'jsonmn',\n");
        out.push("                        root: 'data'\n");
        out.push("                    }\n");
        out.push("                },\n");
        out.push("                pageSize: -1\n");
        out.push("            });\n");
        out.push("            view.defaultReadFn = \"" + (context.$namespace) + (context.$name) + "\";\n");
        out.push("      view.allowCreateNew = " + (context.cal_mapping.allowCreate) + ";\n");
        out.push("      view.readOnly =  " + (context.cal_mapping.readOnly) + ";\n");
        out.push("      view.showUnassignedPanel = " + (context.cal_mapping.showUnassignedPanel) + ";\n");
        out.push("    }\n");
        out.push("\n");
        out.push("    view.filterCfg =");
        if (context.cal_mapping.cal_filter) {
            out.push("\n");
            out.push("    {\n");
            out.push("      queryName:'" + (context.cal_mapping.cal_filter.queryRef) + "',\n");
            out.push("      props: function(){" + (context.cal_mapping.cal_filter.filterProps) + "}\n");
            out.push("    }");
        } else {
            out.push("\n");
            out.push("    false");
        }
        out.push("\n");
        out.push("    ;\n");
        out.push("\n");
        out.push("    view.jumpToFormat = '" + (context.cal_mapping.jumpToFormat) + "';\n");
        out.push("\n");
        out.push("    view.multiDayViewCfg = {\n");
        out.push("      showMultiDayView: " + (context.cal_mapping.showMultiDayView) + ",\n");
        out.push("      dayCount: " + (context.cal_mapping.dayCount) + "\n");
        out.push("    };\n");
        out.push("\n");
        out.push("    view.multiWeekViewCfg = {\n");
        out.push("      showMultiWeekView: " + (context.cal_mapping.showMultiWeekView) + ",\n");
        out.push("      weekCount: " + (context.cal_mapping.weekCount) + "\n");
        out.push("    };\n");
        out.push("\n");
        out.push("        view.viewConfig = {\n");
        out.push("          enableEventResize: " + (context.cal_mapping.enableResize) + ",\n");
        out.push("      ddIncrement: " + (context.cal_mapping.ddIncrement) + ",\n");
        out.push("      minEventDisplayMinutes: " + (context.cal_mapping.minEventDisplayMinutes) + ",\n");
        out.push("      viewStartHour: " + (context.cal_mapping.viewStartHour) + ",\n");
        out.push("      viewEndHour: " + (context.cal_mapping.viewEndHour) + ",\n");
        out.push("      scrollStartHour: " + (context.cal_mapping.scrollStartHour) + ",\n");
        out.push("      hourHeight: " + (context.cal_mapping.hourHeight) + ",\n");
        out.push("            contextMenuCfg: " + (JSON.stringify(context.cal_mapping.contextMenuCfg)) + "\n");
        out.push("        };\n");
        out.push("\n");
        out.push("        view.colorSchemes = [");
        let schemes = context.cal_mapping.cal_colorScheme;
        if (schemes) {
            for(let k = 0; k < schemes.length; k++){
                if (!schemes[k].disable) {
                    out.push("\n");
                    out.push("        {\n");
                    out.push("      name: '" + (schemes[k].name) + "',\n");
                    out.push("      func: function(record, callback){\n");
                    out.push("        " + (schemes[k].function) + "\n");
                    out.push("      }\n");
                    out.push("    }");
                    if (k != schemes.length - 1) {
                        out.push("\n");
                        out.push("    ,");
                    }
                }
            }
        }
        out.push("\n");
        out.push("    ];\n");
        out.push("  },\n");
        out.push("\n");
        out.push("  listeners: {\n");
        out.push("    render: function(view){\n");
        out.push("      DirectCacheLogger.userStories('Calendar Render', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id });\n");
        out.push("      view.fnLoad(view);\n");
        out.push("    },\n");
        out.push("    eventclick: function(view, record, htmlEl) {\n");
        out.push("      DirectCacheLogger.userStories('Calendar Event Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, eventId: record.getId() });\n");
        out.push("    },\n");
        out.push("    eventdblclick: function(view, record, htmlEl) {\n");
        out.push("      DirectCacheLogger.userStories('Calendar Event Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, eventId: record.getId() });\n");
        out.push("    },\n");
        out.push("    dayclick: function(view, date, allDay, htmlEl) {\n");
        out.push("      DirectCacheLogger.userStories('Calendar Day Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, date: date, allDay: allDay });\n");
        out.push("    }\n");
        out.push("  },\n");
        out.push("\n");
        out.push("  initComponent: function() {\n");
        out.push("    let me = this;\n");
        out.push("    DirectCacheLogger.userStories('Calendar Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: me.id });\n");
        out.push("    me.fnLoad(me);\n");
        out.push("    me.grid = Ext.widget('" + (context.$widgetName) + "list');\n");
        out.push("\n");
        out.push("    Ext.apply(this, {\n");
        out.push("      calendarStore: Ext.create('PF_Calendar.calendar.data.MemoryCalendarStore', {\n");
        out.push("        data: PF_Calendar.calendar.data.EventColors\n");
        out.push("      })\n");
        out.push("    });\n");
        out.push("\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.calendar-thing.njs.js.map
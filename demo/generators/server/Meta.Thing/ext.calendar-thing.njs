<#@ noContent #>

<#
  const config = context.getThingConfig(context)
#>

Ext.define('Modeleditor.view.#{context.$namespace}.Calendar.#{context.$name}', {
  serverModel: '#{context.$namespace}.#{context.$name}',
  extend: 'Modeleditor.view.base.extCalendar',
  alias: 'widget.#{context.$widgetName}calendar',
  widget: '#{context.$widgetName}',
  //iconCls: _r('iconCls', '', '#{context.$namespace}.#{context.$name}') <#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  name:'#{context.$name}',
  namespace:'#{context.$namespace}',

  fnLoad : function(view) {
    DirectCacheLogger.userStories('Calendar Load Function', { serverModel: '#{context.$namespace}.#{context.$name}', calendarId: view.id, embedded: !!view.embeddedKey });
    if (view.embeddedKey) {
      view.record = this.rec;
      view.embeddedKey = this.embeddedKey;
      view.eventStore = view.rec[this.embeddedKey]();
      view.allowCreateNew = #{context.cal_mapping.allowCreateEmbedded};
      view.readOnly =  #{context.cal_mapping.readOnlyEmbedded};
      view.showUnassignedPanel = #{context.cal_mapping.showUnassignedPanelEmbedded};
    } else {
      view.sortPanels = [
<#-
      let spAll = context.cal_mapping.cal_sortBy;
      if (spAll){
        let sortPanels = spAll.filter(function(item){return !item.disable;})
        for (let k = 0; k < sortPanels.length; k++){
#>
        {

        <#-if(sortPanels[k].fields){#>
        fields: "#{[sortPanels[k].fields.match(/[A-Za-z0-9]*[A-Za-z0-9]/g)].join(',')}",
        <#-}#>

        <#-if(sortPanels[k].filterDisplayField){#>
        filterDisplayField: "#{sortPanels[k].filterDisplayField}",
        <#-}#>

        <#-if(sortPanels[k].name){#>
        name: "#{sortPanels[k].name}",
        <#-}#>

        <#-if(sortPanels[k].sortBy){#>
        sortByQuery: "#{sortPanels[k].sortBy}",
        <#-}#>

        <#-if(sortPanels[k].sortByStore){#>
        sortByStore: Ext.create('Modeleditor.store.#{sortPanels[k].sortByStore}', {
                  extKeys: [],
                  remoteFilter: false,
                  remoteSort: false,
                  proxy: {
                      type: "direct",
                      directFn: ReadByQuery.#{sortPanels[k].sortByStore.replace(/\./g, "")},
                      reader: {
                          type: 'jsonmn',
                          root: 'data'
                      }
                  },
                  pageSize: -1
              }),
              <#-}#>
        <#-if(sortPanels[k].thingFilter){#>
        thingFilter: "#{sortPanels[k].thingFilter}",<#-}#>
        <#-if(sortPanels[k].thingFilter){#>
        filterStore: Ext.create('Modeleditor.store.#{sortPanels[k].thingFilter}', {
                  extKeys: [],
                  remoteFilter: false,
                  remoteSort: false,
                  proxy: {
                      type: "direct",
                      directFn: ReadByQuery.#{sortPanels[k].thingFilter.replace(/\./g, "")},
                      reader: {
                          type: 'jsonmn',
                          root: 'data'
                      }
                  },
                  pageSize: -1
              }),
              <#-}#>

        <#-if(sortPanels[k].key){#>
        key:"#{sortPanels[k].key}",
        <#-}#>

        <#-if(sortPanels[k].fromKey){#>
        fromKey:"#{sortPanels[k].fromKey}",
        <#- }#>

        <#-if(sortPanels[k].id){#>
        id:"#{sortPanels[k].id}",
        <#-}#>

        pUid:"_#{'PFCAL00'+k}"
      }
          <#-if (k!=sortPanels.length-1){#>
          ,
          <#-}#>
        <#-}
      }-#>];

      view.eventStore = Ext.create('Modeleditor.store.#{context.$namespace}.#{context.$name}', {
                extKeys: [],
                remoteFilter: false,
                remoteSort: false,
                proxy: {
                    type: "direct",
                    directFn: ReadByQuery.#{context.$namespace}#{context.$name},
                    reader: {
                        type: 'jsonmn',
                        root: 'data'
                    }
                },
                pageSize: -1
            });
            view.defaultReadFn = "#{context.$namespace}#{context.$name}";
      view.allowCreateNew = #{context.cal_mapping.allowCreate};
      view.readOnly =  #{context.cal_mapping.readOnly};
      view.showUnassignedPanel = #{context.cal_mapping.showUnassignedPanel};
    }

    view.filterCfg = <#-if(context.cal_mapping.cal_filter){#>
    {
      queryName:'#{context.cal_mapping.cal_filter.queryRef}',
      props: function(){#{context.cal_mapping.cal_filter.filterProps}}
    }
    <#-} else {#>
    false
    <#-}#>
    ;

    view.jumpToFormat = '#{context.cal_mapping.jumpToFormat}';

    view.multiDayViewCfg = {
      showMultiDayView: #{context.cal_mapping.showMultiDayView},
      dayCount: #{context.cal_mapping.dayCount}
    };

    view.multiWeekViewCfg = {
      showMultiWeekView: #{context.cal_mapping.showMultiWeekView},
      weekCount: #{context.cal_mapping.weekCount}
    };

        view.viewConfig = {
          enableEventResize: #{context.cal_mapping.enableResize},
      ddIncrement: #{context.cal_mapping.ddIncrement},
      minEventDisplayMinutes: #{context.cal_mapping.minEventDisplayMinutes},
      viewStartHour: #{context.cal_mapping.viewStartHour},
      viewEndHour: #{context.cal_mapping.viewEndHour},
      scrollStartHour: #{context.cal_mapping.scrollStartHour},
      hourHeight: #{context.cal_mapping.hourHeight},
            contextMenuCfg: #{JSON.stringify(context.cal_mapping.contextMenuCfg)}
        };

        view.colorSchemes = [
        <#-
        let schemes = context.cal_mapping.cal_colorScheme;
        if (schemes){ for (let k = 0; k < schemes.length; k++){
          if(!schemes[k].disable){#>
        {
      name: '#{schemes[k].name}',
      func: function(record, callback){
        #{schemes[k].function}
      }
    }
    <#-if (k!=schemes.length-1){#>
    ,
    <#-}#>
    <#-}}}#>
    ];
  },

  listeners: {
    render: function(view){
      DirectCacheLogger.userStories('Calendar Render', { serverModel: '#{context.$namespace}.#{context.$name}', calendarId: view.id });
      view.fnLoad(view);
    },
    eventclick: function(view, record, htmlEl) {
      DirectCacheLogger.userStories('Calendar Event Click', { serverModel: '#{context.$namespace}.#{context.$name}', calendarId: view.id, eventId: record.getId() });
    },
    eventdblclick: function(view, record, htmlEl) {
      DirectCacheLogger.userStories('Calendar Event Double Click', { serverModel: '#{context.$namespace}.#{context.$name}', calendarId: view.id, eventId: record.getId() });
    },
    dayclick: function(view, date, allDay, htmlEl) {
      DirectCacheLogger.userStories('Calendar Day Click', { serverModel: '#{context.$namespace}.#{context.$name}', calendarId: view.id, date: date, allDay: allDay });
    }
  },

  initComponent: function() {
    let me = this;
    DirectCacheLogger.userStories('Calendar Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', calendarId: me.id });
    me.fnLoad(me);
    me.grid = Ext.widget('#{context.$widgetName}list');

    Ext.apply(this, {
      calendarStore: Ext.create('PF_Calendar.calendar.data.MemoryCalendarStore', {
        data: PF_Calendar.calendar.data.EventColors
      })
    });

    this.callParent(arguments);
  }
});
<#@ noContent #>
<#-
  //Helpers for generation
  const getToolbar = context.getToolbar

  let properties = context.gridviewProps
  const config = context.getThingConfig(context)

-#>

Ext.define('Modeleditor.view.#{context.$namespace}.List.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  extend: 'Modeleditor.view.base.baseGrid',
  alias: 'widget.#{context.$widgetName}list',
  store: Ext.create('Modeleditor.store.#{context.namespace}.#{context.$name}'),
  widget: '#{context.$widgetName}',
  iconCls:  _r('iconCls', '', '#{context.$namespace}.#{context.$name}') <#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  <#-if(context.periodicalRel){#>
  periodicalRel:{
    from:'#{context.periodicalRel.from}',
    to:'#{context.periodicalRel.to}',
    fromKeyField:'#{context.periodicalRel.fromKeyField}',
    toKeyField:'#{context.periodicalRel.toKeyField}',
  },
  <#-}#>
  border: true,
  plugins: [
    {
      ptype: "filterbar",
      pluginId: "filterbar",
      renderHidden: false,
      showShowHideButton: true,
      showClearAllButton: true
    }
  ],

  calendarMapping: #{!!context.cal_mapping },
  searchQuery: #{context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined},
  tbar: #{JSON.stringify(getToolbar(context.gridsettings))},
  initComponent: function(){
    let me = this;
    Ext.apply(this,{
      <#- if(!context.queryResult && config.pageSize !== -1 && !context.staticStore){#>
      bbar: {
        xtype: "pagingtoolbar",
        store: this.store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        emptyMsg: "No data to display"
      },
      <#- }#>
      title: this.title || this.toDisplay || _t("#{context.$name}",'#{context.$namespace}.#{context.$name}', 'titles','List'),
      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),
      autoRender: true,
      overflowY: 'auto',
      columns: [{xtype: 'rownumberer', width:40},
    <#
        for(let i=0; i<properties.length; i++){
          let property = properties[i].property;
          let g = properties[i]
          if(g.generated){#>
          Grainjs.metadata['gridfields.#{context.$namespace}.#{context.$name}'].fields[`#{property.propertyName}::#{g.columnText}`](),
          <#
          }
        }
        #>
      ],

      listeners: {
        'selectionchange': function(view, records) {
          DirectCacheLogger.userStories('Grid Selection Change', { serverModel: '#{context.$namespace}.#{context.$name}', gridId: this.id, selectedCount: records.length });
          let rbutton = this.down('#removeButton');
          let ubutton = this.down('#unlinkButton');
          let dbutton = this.down('#detailsButton');
          if(rbutton) rbutton.setDisabled(!records.length);
          if(ubutton) ubutton.setDisabled(!records.length);
          if(dbutton) dbutton.setDisabled(records.length-1);
        },
        'itemdblclick': function(view, record, item, index, e, eOpts) {
          DirectCacheLogger.userStories('Grid Item Double Click', { serverModel: '#{context.$namespace}.#{context.$name}', gridId: this.id, recordId: record.getId(), index: index });
        },
        'itemclick': function(view, record, item, index, e, eOpts) {
          DirectCacheLogger.userStories('Grid Item Click', { serverModel: '#{context.$namespace}.#{context.$name}', gridId: this.id, recordId: record.getId(), index: index });
        }
      },
    });
    this.callParent(arguments);
  }
});

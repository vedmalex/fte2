<#@ noContent #>
<#-
  //Helpers for generation
  let properties = context.gridviewProps
  const config = context.getThingConfig(context)
  const hasDictionaryFields = properties.filter(p=>p.forDictionary).length > 0

#>

Ext.define('Modeleditor.view.#{context.namespace}.DictionaryElements.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: 'Modeleditor.view.base.baseGrid',
  alias: 'widget.#{context.$widgetName}elements',
  itemId: "DictionaryElements",
  //iconCls: _r('iconCls', '', '#{context.$namespace}.#{context.$name}')<#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  plugins: [
    <#- if(config.filterForDicElements && hasDictionaryFields){#>
    {
      ptype: 'filterbar',
      pluginId: "filterbar",
      renderHidden: false,
      showShowHideButton: true,
      showClearAllButton: true,
    }
    <#- }#>
    ],
  initComponent: function(){
    let me = this;
    const store = Ext.create('Modeleditor.store.#{context.namespace}.Selected.#{context.$name}',{filters: this.filters})

    Ext.apply(this,{
      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),
      autoRender: true,
      overflowY: 'auto',
      store,
      <#-  if(config.pageSizeEmbedded !== -1){#>
      bbar:{
        xtype: 'pagingtoolbar',
        store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        emptyMsg: 'No data to display',
      },
      <#- }#>
      viewConfig: {
        plugins: {
          ptype: 'gridviewdragdrop',
          pluginId: "gridviewdragdrop",
          dragGroup: 'elements',
          dropGroup: 'catalog'
        },
      },

      columns: [
        {
          xtype: 'rownumberer',
          width:40
        },
      <#-
        for(let i=0; i<properties.length; i++){
          let property = properties[i].property;
          let g = properties[i]
          if(g.generated  && ((hasDictionaryFields && g.forDictionary) || !hasDictionaryFields)){#>
          Grainjs.metadata['gridfields.#{context.$namespace}.#{context.$name}'].fields[`#{property.propertyName}::#{g.columnText}`](),
        <#- }
        }
        #>
      ],

      listeners: {
        'selectionchange': function(view, records) {
          DirectCacheLogger.userStories('Dictionary Elements Selection Change', { serverModel: '#{context.$namespace}.#{context.$name}', gridId: this.id, selectedCount: records.length });
        },
        'itemdblclick': function(view, record, item, index, e, eOpts) {
          DirectCacheLogger.userStories('Dictionary Elements Item Double Click', { serverModel: '#{context.$namespace}.#{context.$name}', gridId: this.id, recordId: record.getId(), index: index });
        },
        'itemclick': function(view, record, item, index, e, eOpts) {
          DirectCacheLogger.userStories('Dictionary Elements Item Click', { serverModel: '#{context.$namespace}.#{context.$name}', gridId: this.id, recordId: record.getId(), index: index });
        }
      }
    });
    this.callParent(arguments);
  }
});
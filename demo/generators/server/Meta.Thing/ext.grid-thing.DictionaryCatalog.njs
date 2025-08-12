<#@ noContent #>
<#-
  //Helpers for generation

  let properties = context.gridviewProps
  const config = context.getThingConfig(context)
  const hasDictionaryFields = properties.filter(p=>p.forDictionary).length > 0

-#>
Ext.define('Modeleditor.view.#{context.namespace}.DictionaryCatalog.#{context.$name}',{
  serverModel: '#{context.$namespace}.#{context.$name}',
  // requires: [#{context.requires}],
  extend: 'Modeleditor.view.base.baseGrid',
  alias: 'widget.#{context.$widgetName}catalog',
  itemId: "DictionaryCatalog",
  //iconCls:  _r('iconCls', '', '#{context.$namespace}.#{context.$name}') <#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  btns: true,
  initComponent: function(){
    let me = this;
    DirectCacheLogger.userStories('Dictionary Catalog Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', catalogId: this.id });
    // {
    //   catalogPaginator: false,
    //   catalogPlugins: [],
    //   catalogStore: customFieldsetStore
    //   catalogBbar: undefined
    // }
    const store = me.hasOwnProperty('catalogStore') ? me.catalogStore: Ext.create('Modeleditor.store.#{context.namespace}.Catalog.#{context.$name}')

    Ext.apply(this,{
      plugins: me.hasOwnProperty('catalogPlugins') ? me.catalogPlugins: [
      <#- if(config.filterForDicCatalog && hasDictionaryFields){#>
        {
          ptype: 'filterbar',
          pluginId: "filterbar",
          renderHidden: false,
          showShowHideButton: true,
          showClearAllButton: true,
        }
      <#- }#>
      ],
      store,
      tbar: (this.btns === true) ? [
        {
          xtype: "basecreatebutton"
        }
      ] : undefined,
      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),
      autoRender: true,
      overflowY: 'auto',
    <#- if(config.pageSizeEmbedded !== -1){#>
      bbar: me.hasOwnProperty('catalogBbar') ? me.catalogBbar :
      me.hasOwnProperty('catalogPaginator') && !me.catalogPaginator ? undefined: {
        xtype: "pagingtoolbar",
        store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        emptyMsg: "No data to display"
      },
    <#- }#>
      listeners: {
        filterupdated: function(filters){
          DirectCacheLogger.userStories('Dictionary Catalog Filter Updated', { serverModel: '#{context.$namespace}.#{context.$name}', catalogId: this.id, filtersCount: filters.length });
          let grid = this;
          if(grid.defaultFilters && grid.defaultFilters.length > 0)
            grid.getStore().filter(grid.defaultFilters);
        },
        selectionchange: function(view, records) {
          DirectCacheLogger.userStories('Dictionary Catalog Selection Change', { serverModel: '#{context.$namespace}.#{context.$name}', catalogId: this.id, selectedCount: records.length });
        },
        itemdblclick: function(view, record, item, index, e, eOpts) {
          DirectCacheLogger.userStories('Dictionary Catalog Item Double Click', { serverModel: '#{context.$namespace}.#{context.$name}', catalogId: this.id, recordId: record.getId(), index: index });
        }
      },

      columns: [{
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
    });
    this.callParent(arguments);
  }
});

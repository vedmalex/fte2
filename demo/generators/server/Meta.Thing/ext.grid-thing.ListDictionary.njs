<#@ noContent #>
<#
const config = context.getThingConfig(context)
#>
Ext.define("Modeleditor.view.#{context.namespace}.ListDictionary.#{context.$name}", {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  filters:[],
  extend:"Modeleditor.view.base.baseWindowDictionaryList",
  iconCls: _r('iconCls', '', '#{context.$namespace}.#{context.$name}')<#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  alias: "widget.#{context.$widgetName}listdictionary",
  initComponent: function(){
    const me = this
    DirectCacheLogger.userStories('List Dictionary Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: this.id });
    const catalogConfig = {
      xtype: '#{context.$widgetName}catalog',
    }
    if(me.hasOwnProperty('catalogPaginator')){
      catalogConfig.catalogPaginator = me.catalogPaginator
    }
    if(me.hasOwnProperty('catalogPlugins')){
      catalogConfig.catalogPlugins = me.catalogPlugins
    }
    if(me.hasOwnProperty('catalogStore')){
      catalogConfig.catalogStore = me.catalogStore
    }
    if(me.hasOwnProperty('catalogBbar')){
      catalogConfig.catalogBbar = me.catalogBbar
    }
    Ext.apply(this,{
      itemId: "ListDictionary",
      listDictionary: true,
      title: _t("#{context.$name}",'#{context.$namespace}.#{context.$name}', 'titles','ListDictionary'),
      border: true,
      layout: {
        type:"hbox",
        align: "stretch"
      },
      defaults:{
        flex: 1,
        margin: '2'
      },
      items: [
        {
          ...catalogConfig,
          btns: true,
          viewConfig: {
            // copy: true,
            plugins: {
              ptype: 'gridviewdragdrop',
              pluginId: "gridviewdragdrop",
              dragGroup: 'catalog',
              dropGroup: 'elements'
            },
          }
        },
        Ext.widget('#{context.$widgetName}elements', {
          filters: this.filters
        }),
      ],
      buttons : [
        {
          text: _t('Ok','SYSTEM', 'buttons'),
          itemId: 'okMany',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('List Dictionary OK Button', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Cancel','SYSTEM', 'buttons'),
          itemId: 'dictCancel',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('List Dictionary Cancel Button', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: btn.up('window').id });
            }
          }
        }
      ],
      listeners: {
        show: function(window) {
          DirectCacheLogger.userStories('List Dictionary Show', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: this.id });
        },
        beforeclose: function(window) {
          DirectCacheLogger.userStories('List Dictionary Before Close', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: this.id });
        }
      }
    });
    this.callParent(arguments);
  }
});
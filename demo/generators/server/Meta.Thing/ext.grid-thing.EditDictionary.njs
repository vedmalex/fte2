<#@ noContent #>
<#
const config = context.getThingConfig(context)
#>
Ext.define("Modeleditor.view.#{context.namespace}.EditDictionary.#{context.$name}", {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend:"Modeleditor.view.base.baseWindowDictionarySingle",
  alias: "widget.#{context.$widgetName}editdictionary",
  iconCls:  _r('iconCls', '', '#{context.$namespace}.#{context.$name}')<#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  // tobe passed from Dictinary Call
  // {
  //   catalogPaginator: false,
  //   catalogPlugins: [],
  //   catalogStore: customFieldsetStore
  //   catalogBbar: undefined
  // }
  initComponent: function(){
    const me = this;
    DirectCacheLogger.userStories('Edit Dictionary Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: this.id });
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
      itemId: "EditDictionary",
      editDictionary: true,
      title: this.title || this.toDisplay ||_t("#{context.$name}",'#{context.$namespace}.#{context.$name}', 'titles', 'EditDictionary', ),
      border: true,
      layout: 'fit',
      defaults:{
        border: false,
        margin: '2'
      },
      items: [
        catalogConfig,
      ],
      buttons: [
        {
          text: _t('Ok', 'SYSTEM', 'buttons'),
          itemId: 'okOne',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Edit Dictionary OK Button', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Cancel', 'SYSTEM', 'buttons'),
          itemId: 'dictCancel',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Edit Dictionary Cancel Button', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: btn.up('window').id });
            }
          }
        }
      ],
      listeners: {
        show: function(window) {
          DirectCacheLogger.userStories('Edit Dictionary Show', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: this.id });
        },
        beforeclose: function(window) {
          DirectCacheLogger.userStories('Edit Dictionary Before Close', { serverModel: '#{context.$namespace}.#{context.$name}', dictionaryId: this.id });
        }
      }
    })
    this.callParent(arguments);
  }
});

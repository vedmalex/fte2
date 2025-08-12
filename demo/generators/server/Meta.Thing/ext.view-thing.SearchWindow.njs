<#@ noContent #>

Ext.define('Modeleditor.view.#{context.$namespace}.SearchWindow.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: 'Modeleditor.view.base.baseWindow',
  alias: 'widget.#{context.$widgetName}searchwindow',
  widget: "#{context.$widgetName}",
  queryName: #{context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined},
  iconCls: _r('iconCls', '', '#{context.$namespace}.#{context.$name}')<#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  <#- if(context.queryResult || context.legacySearch){#>
  customSearch: true,
  <#}#>
  initComponent: function(){
    Ext.apply( this, {
      title: _t('Search', 'SYSTEM', 'titles') + ': ' + _t('#{context.$namespace}.#{context.$name}','#{context.$namespace}.#{context.$name}', 'titles', 'SearchWindow'),
      layout: 'card',
      // closable: true,
      items: [
        {
          xtype: 'panel',
          border: false,
          layout: 'anchor',
          autoScroll: true,
          defaults:{
            anchor: '100%'
          },
          items:[
            {
              xtype: "#{context.$widgetName}search",
              <#- if(context.queryResult || context.legacySearch){#>
              customSearch: true,
              <#}#>
            }
          ]
        },
        {
          dockedItems: [
            {
              xtype: "basesearchgridtoolbar"
            }
          ],
          xtype: "#{context.$widgetName}listsearch",
          border: 0,
          paginator: false,
          store: Ext.create('Modeleditor.store.#{context.$namespace}.Search.#{context.$name}')
        }
      ],

      buttons: [
        {
          text: _t('Search','SYSTEM','buttons'),
          action: "startSearch",
          resultGrid: "#{context.$widgetName}listsearch",
          itemId: 'startSearchButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Search Window Start Search', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Reset','SYSTEM','buttons'),
          action: "resetSearch",
          itemId: 'resetSearchButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Search Window Reset', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Back','SYSTEM', 'buttons'),
          action: "backSearch",
          disable: true,
          hidden: true,
          itemId: 'backSearchButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Search Window Back', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Close','SYSTEM', 'buttons'),
          itemId: 'closeButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Search Window Close', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        }
      ]
    });
    this.callParent(arguments);
  }
});
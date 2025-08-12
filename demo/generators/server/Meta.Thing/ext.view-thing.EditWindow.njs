<#@ noContent #>
Ext.define('Modeleditor.view.#{context.$namespace}.EditWindow.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: 'Modeleditor.view.base.baseWindow',
  alias: 'widget.#{context.$widgetName}editwindow',
  widget: "#{context.$widgetName}",
  iconCls:  _r('iconCls', '', '#{context.$namespace}.#{context.$name}') <#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  initComponent: function(){
    Ext.apply( this, {

      title: _t('#{context.$namespace}.#{context.$name}','#{context.$namespace}.#{context.$name}','titles','EditWindow'),
      layout: 'anchor',
      autoScroll: true,
      defaults:{
        anchor: '100%'
      },
      dockedItems: [
        {
          xtype: '#{context.$widgetName}formnavigationtoolbar'
        }
      ],

      items:[
        {
          xtype: "#{context.$widgetName}edit",
          hideable: true,
          required: true,
          toDisplay: _t('General', 'SYSTEM', 'titles'),
          margin: "5 15 5 15",
          relGroup: [_t('General', 'SYSTEM', 'titles'),]
        }
      ],

      relNames: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].relNames,
      groupedRels: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].groupedRels,

      buttons: [
        {
          text: _t('Apply','SYSTEM', 'buttons'),
          itemId: 'applyButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Edit Window Apply Button', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Ok','SYSTEM', 'buttons'),
          itemId: 'okButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Edit Window OK Button', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        },
        {
          text: _t('Cancel', 'SYSTEM', 'buttons'),
          itemId: 'cancelButton',
          listeners: {
            click: function(btn) {
              DirectCacheLogger.userStories('Edit Window Cancel Button', { serverModel: '#{context.$namespace}.#{context.$name}', windowId: btn.up('window').id });
            }
          }
        }
      ]
    });
    this.callParent(arguments);
  }
});

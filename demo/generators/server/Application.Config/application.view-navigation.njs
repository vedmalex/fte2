<#@ noContent #>
Ext.define('Modeleditor.view.#{context.name}#{context.currentProfile.name}.Navigation', {
extend: 'Ext.tab.Panel',
alias: 'widget.#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}navigation',

initComponent: function() {
  DirectCacheLogger.userStories('Navigation Init Component', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}' });
  Ext.apply(this, {
      plain: true,
      activeTab: 0,
      margin: "2 0 2 2",
      collapsible: true,
      iconCls: _r('Navigation','', 'SYSTEM', 'iconCls'),
      width: 200,
      defaults: {
        xtype: 'treepanel',
        rootVisible: false,
        bodyStyle: "border: 0px;"
      },
      items:[
        {
          title: _t('Navigation', 'SYSTEM', 'titles'),
          itemId: 'applicationNavigation',
          store: Ext.create('Ext.data.TreeStore', {
              autoLoad:true,
              autoSync:false,
              fields:[
                {name: 'id',      type: 'string'},
                {name: 'text',      type: 'string'},
                {name: 'name',      type: 'string'},
                {name: 'type',      type: 'string'},
                {name: 'require',    type: 'string'},
                {name: 'reference',    type: 'string'},
                {name: 'widgetName',  type: 'string'},
                {name: 'queryResult',  type: 'boolean',  defaultValue: false},
                {name: 'disable',    type: 'boolean',  defaultValue: false},
              ],
              proxy: {
                type: 'direct',
                api:{
                  read: #{context.name}.read#{context.name}#{context.currentProfile.name}Navigation
                }
              },
              listeners: {
                load: function(store, records, successful, operation) {
                  DirectCacheLogger.userStories('Navigation Store Load', { applicationName: '#{context.name}', profileName: '#{context.currentProfile.name}', recordCount: records.length, successful: successful });
                }
              }
            })
          }
        ]
      });
      
      this.callParent(arguments);
    }
  });

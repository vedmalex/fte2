module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".Navigation', {\n");
        out.push("extend: 'Ext.tab.Panel',\n");
        out.push("alias: 'widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "navigation',\n");
        out.push("\n");
        out.push("initComponent: function() {\n");
        out.push("  DirectCacheLogger.userStories('Navigation Init Component', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
        out.push("  Ext.apply(this, {\n");
        out.push("      plain: true,\n");
        out.push("      activeTab: 0,\n");
        out.push("      margin: \"2 0 2 2\",\n");
        out.push("      collapsible: true,\n");
        out.push("      iconCls: _r('Navigation','', 'SYSTEM', 'iconCls'),\n");
        out.push("      width: 200,\n");
        out.push("      defaults: {\n");
        out.push("        xtype: 'treepanel',\n");
        out.push("        rootVisible: false,\n");
        out.push("        bodyStyle: \"border: 0px;\"\n");
        out.push("      },\n");
        out.push("      items:[\n");
        out.push("        {\n");
        out.push("          title: _t('Navigation', 'SYSTEM', 'titles'),\n");
        out.push("          itemId: 'applicationNavigation',\n");
        out.push("          store: Ext.create('Ext.data.TreeStore', {\n");
        out.push("              autoLoad:true,\n");
        out.push("              autoSync:false,\n");
        out.push("              fields:[\n");
        out.push("                {name: 'id',      type: 'string'},\n");
        out.push("                {name: 'text',      type: 'string'},\n");
        out.push("                {name: 'name',      type: 'string'},\n");
        out.push("                {name: 'type',      type: 'string'},\n");
        out.push("                {name: 'require',    type: 'string'},\n");
        out.push("                {name: 'reference',    type: 'string'},\n");
        out.push("                {name: 'widgetName',  type: 'string'},\n");
        out.push("                {name: 'queryResult',  type: 'boolean',  defaultValue: false},\n");
        out.push("                {name: 'disable',    type: 'boolean',  defaultValue: false},\n");
        out.push("              ],\n");
        out.push("              proxy: {\n");
        out.push("                type: 'direct',\n");
        out.push("                api:{\n");
        out.push("                  read: " + (context.name) + ".read" + (context.name) + (context.currentProfile.name) + "Navigation\n");
        out.push("                }\n");
        out.push("              },\n");
        out.push("              listeners: {\n");
        out.push("                load: function(store, records, successful, operation) {\n");
        out.push("                  DirectCacheLogger.userStories('Navigation Store Load', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "', recordCount: records.length, successful: successful });\n");
        out.push("                }\n");
        out.push("              }\n");
        out.push("            })\n");
        out.push("          }\n");
        out.push("        ]\n");
        out.push("      });\n");
        out.push("      \n");
        out.push("      this.callParent(arguments);\n");
        out.push("    }\n");
        out.push("  });");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/application.view-navigation.njs.js.map
<#@ noContent #>
Ext.define("Modeleditor.view.#{context.name}#{context.currentProfile.name}.Viewport", {
  extend: "Ext.panel.Panel",
  require: [
    //'Admin.SpeedTestToolbar'
    ],
  alias: "widget.#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}viewport",

  initComponent: function() {
    Ext.apply(this, {
      layout:"border",
      items: [{
        region: "north",
        xtype: "panel",
        border: false,
        dockedItems: [{
          xtype: "#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}toolbar"
        }]
      },
      <#- if (context.currentProfile?.navItem?.length>0){#>
      {
        xtype: "#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}navigation",
        region: "west"
      },
      <#-} #>
      {
        xtype: "#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}screencontainer",
        itemId: "mainContainer",
        region:"center",
        margin: 2
      },
      <#-if(!context.noHealthCheck){#>
      {
        region: 'south',
        xtype: 'panel',
        border: false,
        dockedItems: [
          {
            xtype: 'speedtesttoolbar',
          },
        ],
      },
      <#}-#>
      ]
    });

    this.callParent(arguments);
  }
});

<#@ noContent #>
Ext.define('Modeleditor.view.#{context.name}#{context.currentProfile.name}.ScreenContainer', {
<#-
    let mainContainerType = "Modeleditor.view.content.TabPanel"; // defaultPanel
      let printErr = false;

    let screenItem = context.currentProfile.rootScreen;
    if (screenItem && screenItem.layoutType != "") {
      mainContainerType = screenItem.layoutType;
    } else {
      printErr = true;
    }
#>
  extend: "#{mainContainerType}",
  contentType: "#{mainContainerType}",

  alias: 'widget.#{context.name.toLowerCase()}#{context.currentProfile.name.toLowerCase()}screencontainer',

  initComponent: function() {
  <#- if(printErr){#>
    console.warn(_t('Your screen configuration have no main container! Now using default container (Tab panel)', 'SYSTEM', 'messages'));
  <#- }#>
    this.callParent(arguments);
  }
});
module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".ScreenContainer', {");
        let mainContainerType = "Modeleditor.view.content.TabPanel";
        let printErr = false;
        let screenItem = context.currentProfile.rootScreen;
        if (screenItem && screenItem.layoutType != "") {
            mainContainerType = screenItem.layoutType;
        } else {
            printErr = true;
        }
        out.push("\n");
        out.push("  extend: \"" + (mainContainerType) + "\",\n");
        out.push("  contentType: \"" + (mainContainerType) + "\",\n");
        out.push("\n");
        out.push("  alias: 'widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "screencontainer',\n");
        out.push("\n");
        out.push("  initComponent: function() {");
        if (printErr) {
            out.push("\n");
            out.push("    console.warn(_t('Your screen configuration have no main container! Now using default container (Tab panel)', 'SYSTEM', 'messages'));");
        }
        out.push("\n");
        out.push("    this.callParent(arguments);\n");
        out.push("  }\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/application.view-screencontainer.njs.js.map
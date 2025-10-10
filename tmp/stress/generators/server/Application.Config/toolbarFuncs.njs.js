module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        if (context && context.currentProfile && context.currentProfile.toolBarItem) {
            out.push("\n");
            out.push("/*START TOOLBAR FUNCTIONS*/\n");
            let toolbars = context.currentProfile.toolBarItem;
            for(let i = 0; i < toolbars.length; i++){
                out.push("\n");
                out.push("  " + (toolbars[i].itemId) + "Func: function(){\n");
                out.push("    DirectCacheLogger.userStories('Toolbar Function', { toolbarItemId: '" + (toolbars[i].itemId) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
                out.push("    " + (toolbars[i].func) + "\n");
                out.push("  },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("/*END TOOLBAR FUNCTIONS*/\n");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/toolbarFuncs.njs.js.map
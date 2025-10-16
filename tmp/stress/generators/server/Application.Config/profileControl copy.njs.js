module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context && context.currentProfile && context.currentProfile.toolBarItem) {
            let toolbars = context.currentProfile.toolBarItem;
            let len = toolbars?.length ?? 0;
            out.push("\n");
            out.push("me.control({");
            for(let i = 0; i < len; i++){
                out.push("\n");
                out.push("  \"button[itemId=" + (toolbars[i].itemId) + "]\": {click: this." + (toolbars[i].itemId) + "Func},");
            }
            out.push("\n");
            out.push("});");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/profileControl copy.njs.js.map
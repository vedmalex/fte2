module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context && context.currentProfile && context.currentProfile.module) {
            if (context.currentProfile.module) {
                for(let i = 0; i < context.currentProfile.module.length; i++){
                    if (context.currentProfile.module[i].controllerName) {
                        out.push("\n");
                        out.push("self.loadModule(\"" + (context.currentProfile.module[i].controllerName) + "\");\n");
                    }
                }
            }
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/registerModules.njs.js.map
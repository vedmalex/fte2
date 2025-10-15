module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Grainjs.RegisterProfile('" + (context.currentProfile.name) + "')\n");
        out.push("\n");
        out.push("let gl = require(global.global.USEGLOBAL('/app/server/direct/global.js'))\n");
        out.push("// register profile code need to refactor\n");
        out.push("Ext.directFn({\n");
        out.push("    namespace: '" + (context.name) + "',\n");
        out.push("    name: 'read" + (context.name) + (context.currentProfile.name) + "Navigation',\n");
        out.push("    locationType: 'system',\n");
        out.push("    body: function (para) {\n");
        out.push("      para.appName = '" + (context.name) + "'\n");
        out.push("      para.profileName = '" + (context.currentProfile.name) + "'\n");
        out.push("      gl.readAppNavigation(para, this)\n");
        out.push("    },\n");
        out.push("  })");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/application.view-navigation.direct.njs.js.map
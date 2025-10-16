module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        let requireNs = Object.keys(context.nsList);
        if (requireNs.length > 0) {
            out.push("\n");
            out.push("Ext.require([");
            for(let i = 0; i < requireNs.length; i++){
                out.push("\n");
                out.push("    \"things." + (requireNs[i]) + "\",");
            }
            out.push("\n");
            out.push("], function() {\n");
            out.push("    me.loadProfile();\n");
            out.push("});");
        } else {
            out.push("\n");
            out.push("    me.loadProfile();");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/requireThings.njs.js.map
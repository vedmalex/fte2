module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        let $namespace = "";
        let nsa = [];
        for(let i = 0; i < context.normalizedName.length - 1; i++){
            nsa.push(context.normalizedName[i]);
        }
        const config = context.getThingConfig(context);
        $namespace = nsa.join(".");
        let name = context.normalizedName[context.normalizedName.length - 1];
        out.push("\n");
        out.push("\n");
        out.push("Ext.define('Modeleditor.store." + ($namespace) + "." + (name) + "', {\n");
        out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
        out.push("  requires:['Modeleditor.model." + ($namespace) + "." + (name) + "'],\n");
        out.push("  extend: 'Ext.data.LoggedStore',\n");
        out.push("  model: 'Modeleditor.model." + ($namespace) + "." + (name) + "',\n");
        out.push("  ");
        if (context.extension) {
            out.push((context.extension) + ",");
        }
        out.push("\n");
        out.push("  staticStore:" + (context.staticStore) + ",\n");
        out.push("  autoLoad:false,\n");
        out.push("  autoSync:false,");
        if (!context.staticStore && !context.queryResult) {
            out.push("\n");
            out.push("  remoteFilter:true,\n");
            out.push("  remoteSort:true,\n");
            out.push("  pageSize: " + (config.pageSize) + ",");
        } else {
            out.push("\n");
            out.push("  remoteFilter:false,\n");
            out.push("  remoteSort:false,\n");
            out.push("  pageSize: -1,\n");
            out.push("  ");
        }
        if (context.sortProperty && context.sortProperty.length > 0) {
            out.push("\n");
            out.push("  sorters: [");
            let sortPr;
            for(let i = 0, len = context.sortProperty.length; i < len; i++){
                sortPr = context.sortProperty[i];
                if (i > 0) {
                    out.push(", ");
                }
                out.push("{\n");
                out.push("    property:'" + (sortPr.property) + "',\n");
                out.push("    direction:'" + (sortPr.direction) + "'\n");
                out.push("  }");
            }
            out.push("\n");
            out.push("  ]\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.store.njs.js.map
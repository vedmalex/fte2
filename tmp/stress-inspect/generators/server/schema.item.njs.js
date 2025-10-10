module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("var schema = require(USEGLOBAL(\"schemaExport/registerImport.js\"));\n");
        out.push("\n");
        out.push("schema.register(\"" + (context.itemType) + "\"," + (context.itemValue) + ");");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/schema.item.njs.js.map
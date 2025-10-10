module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if ("string" === typeof context.queryText) {
            out.push("\n");
            out.push("function query(prm){\n");
            out.push("    return " + (context.queryText) + "\n");
            out.push("}\n");
        } else if ("function" === typeof context.queryText) {
            out.push("\n");
            out.push("  " + (context.queryText) + "\n");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Query/query.query.njs.js.map
module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        if (context.extractor) {
            out.push("\n");
            if ("string" === typeof context.extractor) {
                if (/^function extractData/.test(context.extractor.trim())) {
                    out.push("\n");
                    out.push((context.extractor) + "\n");
                } else {
                    out.push("\n");
                    out.push("function extractData(db, prm, data, callback) {\n");
                    out.push("  " + (context.extractor) + "\n");
                    out.push("}\n");
                }
                out.push("\n");
            } else if ("function" === typeof context.extractor) {
                out.push("\n");
                out.push((context.extractor) + "\n");
            }
            out.push("\n");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Query/query.extractor.njs.js.map
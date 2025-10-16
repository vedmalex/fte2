module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context.extractor) {
            if ("string" === typeof context.extractor) {
                if (/^function extractData/.test(context.extractor.trim())) {
                    out.push("\n");
                    out.push((context.extractor));
                } else {
                    out.push("\n");
                    out.push("function extractData(db, prm, data, callback) {\n");
                    out.push("  " + (context.extractor) + "\n");
                    out.push("}");
                }
            } else if ("function" === typeof context.extractor) {
                out.push("\n");
                out.push((context.extractor));
            }
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Query/query.extractor.njs.js.map
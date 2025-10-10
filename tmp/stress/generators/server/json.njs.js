module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        if (context.body) {
            out.push("\n");
            out.push("function json (){\n");
            out.push("  return " + (context.body) + "\n");
            out.push("}\n");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/json.njs.js.map
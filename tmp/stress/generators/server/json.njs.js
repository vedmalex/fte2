module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context.body) {
            out.push("function json (){" + "  return " + (context.body) + "\n");
            out.push("}");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/json.njs.js.map
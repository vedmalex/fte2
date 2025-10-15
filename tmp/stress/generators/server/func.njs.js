module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context.body) {
            out.push("\n");
            out.push("function " + (context.name ?? 'func') + "(" + (context.params ? context.params : '') + "){\n");
            out.push("  " + (context.body) + "\n");
            out.push("}\n");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/func.njs.js.map
module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context.body) {
            out.push("(" + (context.params ? context.params : '') + ")=>{\n");
            out.push("    " + (context.body) + "\n");
            out.push("}");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/func_lambda.njs.js.map
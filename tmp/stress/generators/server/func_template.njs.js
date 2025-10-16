module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        if (context.body) {
            out.push("\n");
            out.push("(" + (context.params ? context.params : '') + ") =>`" + (context.body) + "`");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/func_template.njs.js.map
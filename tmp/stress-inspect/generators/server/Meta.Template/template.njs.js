module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push((context.template));
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Template/template.njs.js.map
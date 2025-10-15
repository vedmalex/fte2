module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push((context.thingType) + "\n");
        out.push((context.name) + "\n");
        out.push((JSON.stringify(context)));
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/undefined.njs.js.map
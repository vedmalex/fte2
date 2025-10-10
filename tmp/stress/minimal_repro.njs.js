module.exports = {
    alias: [
        "minimal_repro.njs"
    ],
    script: function(data, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = data;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("\n");
        out.push("\n");
        out.push("\n");
        out.push((partial(context, 'core')) + "");
        return out.join('');
    },
    compile: function() {
        this.alias = [
            "minimal_repro.njs"
        ];
        this.aliases = {};
        this.aliases["name': 'es6module.ts.njs"] = "alias': 'core";
        this.factory.ensure("alias': 'core");
    },
    dependency: {
        "alias': 'core": true,
        "name': 'es6module.ts.njs": true
    }
};

//# sourceMappingURL=minimal_repro.njs.js.map
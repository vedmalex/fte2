module.exports = {
    alias: [
        "es6module.njs"
    ],
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("export default " + (partial(context, "core")) + ";");
        return out.join("");
    },
    compile: function() {
        this.alias = [
            "es6module.njs"
        ];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.ts.njs";
        this.factory.ensure("MainTemplate.ts.njs");
    },
    dependency: {
        "MainTemplate.ts.njs": true,
        "core": true
    }
};

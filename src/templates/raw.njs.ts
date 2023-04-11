export default {
    alias: [
        "raw.njs"
    ],
    aliases: {
        "core": "MainTemplate.njs"
    },
    script: function(context, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("(function(){\n");
        out.push("  return " + (partial(context, "core")) + ";\n");
        out.push("})();");
        return out.join("");
    },
    compile: function(this: {
        factory: {
            ensure: (template: string) => any;
        };
        parent: string;
        mergeParent: (template: any) => void;
    }) {
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": true,
        "core": true
    }
};

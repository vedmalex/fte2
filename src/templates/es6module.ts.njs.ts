export default {
    alias: [
        "es6module.njs"
    ],
    aliases: {
        "core": "MainTemplate.ts.njs"
    },
    script: function(context, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push("export default " + (partial(context, "core")) + ";");
        return out.join("");
    },
    compile: function(this: {
        factory: {
            ensure: (template: string) => any;
        };
        parent: string;
        mergeParent: (template: any) => void;
    }) {
        this.factory.ensure("MainTemplate.ts.njs");
    },
    dependency: {
        "MainTemplate.ts.njs": true,
        "core": true
    }
};

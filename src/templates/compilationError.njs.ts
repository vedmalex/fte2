export default {
    alias: [
        "compilationError.njs"
    ],
    script: function(context, _content, partial, slot, options) {
        var out: Array<string> = [];
        out.push((context.error.message) + ";\n");
        out.push((context.compiledFile) + ";");
        return out.join("");
    },
    compile: function(this: {
        factory: {
            ensure: (template: string) => any;
        };
        parent: string;
        mergeParent: (template: any) => void;
    }) {},
    dependency: {}
};

module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("/*/////////////////////////////////////////////////////////////////////////////////\n");
        out.push("DO NOT TRY TO EDIT THIS CODE, ALL CHANGES WILL BE LOST AFTER CODEGENERATION\n");
        out.push("BE SURE YOU SAVE ALL YOUR CHANGES BEFORE CODEGENERATION\n");
        out.push("Module \"" + (context.name) + "\"\n");
        out.push("/////////////////////////////////////////////////////////////////////////////////*/\n");
        out.push("\n");
        out.push((context.body));
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Module/module.njs.js.map
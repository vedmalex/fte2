module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("var Factory = require(\"fte.js\").Factory;\n");
        out.push("global.fte = new Factory();");
        var item;
        for(var i = 0, len = context.length; i < len; i++){
            item = context[i];
            out.push("fte.load(require(\"./" + (context[i]) + "\"),\"" + (context[i]) + "\");");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/web/compile.njs.js.map
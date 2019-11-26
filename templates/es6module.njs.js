module.exports = { alias: ["es6module.njs"], script: function (context, _content, partial, slot) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = '';
        function applyIndent(_str, _indent) {
            var str = String(_str);
            var indent = '';
            if (typeof _indent == 'number' && _indent > 0) {
                var res = '';
                for (var i = 0; i < _indent; i++) {
                    res += ' ';
                }
                indent = res;
            }
            if (typeof _indent == 'string' && _indent.length > 0) {
                indent = _indent;
            }
            if (indent && str) {
                return str.split('\n').map(function (s) {
                    return indent + s;
                }).join('\n');
            }
            else {
                return str;
            }
        }
        /*3:1*/
        out += "export default";
        /*3:15*/
        out += applyIndent(partial(context, 'core'), " ");
        /*3:43*/
        out += ";";
        return out;
    },
    compile: function () {
        this.alias = ["es6module.njs"];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.njs";
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": 1,
    }
};

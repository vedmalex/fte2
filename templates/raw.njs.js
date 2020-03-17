module.exports = { alias: ["raw.njs"], script: function (context, _content, partial, slot) {
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
        out += "(function(){\n  return";
        /*4:9*/
        out += applyIndent(partial(context, 'core'), " ");
        /*4:37*/
        out += ";\n})();";
        return out;
    },
    compile: function () {
        this.alias = ["raw.njs"];
        this.aliases = {};
        this.aliases["core"] = "MainTemplate.njs";
        this.factory.ensure("MainTemplate.njs");
    },
    dependency: {
        "MainTemplate.njs": 1,
    }
};

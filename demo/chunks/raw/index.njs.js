module.exports = { script: function (context, _content, partial, slot) {
        var _partial = partial;
        partial = function (obj, template) {
            var result = _partial(obj, template);
            if (Array.isArray(result)) {
                result.forEach(function (r) {
                    chunkEnsure(r.name, r.content);
                });
                return '';
            }
            else {
                return result;
            }
        };
        var main = 'index.txt';
        var current = main;
        var outStack = [current];
        var result;
        function chunkEnsure(name, content) {
            if (!result) {
                result = {};
            }
            if (!result.hasOwnProperty(name)) {
                result[name] = content ? content : '';
            }
        }
        function chunkStart(name) {
            chunkEnsure(name);
            chunkEnd();
            current = name;
            out = '';
        }
        function chunkEnd() {
            result[current] += out;
            out = '';
            current = outStack.pop() || main;
        }
        var out = '';
        chunkStart(main);
        /*3:1*/
        out += "\n";
        /*4:1*/
        chunkStart("dir.txt");
        /*4:28*/
        out += "\n";
        /*5:1*/
        out += partial(null, 'file.njs');
        chunkEnd();
        out = Object.keys(result)
            .map(function (curr) { return ({ name: curr, content: result[curr] }); });
        return out;
    },
    compile: function () { },
    dependency: {}
};

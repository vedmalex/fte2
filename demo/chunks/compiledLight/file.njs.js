(function () {
    return { script: function (context, _content, partial, slot) {
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
            var main = 'main.file.txt';
            var current = main;
            var outStack = [current];
            var result;
            function chunkEnsure(name) {
                if (!result) {
                    result = {};
                }
                if (!result.hasOwnProperty(name)) {
                    result[name] = '';
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
            chunkStart("filename1.txt");
            /*4:34*/
            out += "\nfile1\n\n";
            /*7:1*/
            chunkStart("filename2.txt");
            /*7:33*/
            out += "\nfile2\n\n";
            /*10:1*/
            chunkStart("filename3.txt");
            /*10:34*/
            out += "\nfile3\n\n";
            /*13:1*/
            chunkEnd();
            /*13:17*/
            out += "\n!!!\n";
            /*15:1*/
            chunkStart("filename4.txt");
            /*15:34*/
            out += "\nfile4\n\n";
            /*18:1*/
            chunkStart("filename5.txt");
            /*18:34*/
            out += "\nfile5\n\n";
            /*21:1*/
            chunkStart("filename6.txt");
            /*21:34*/
            out += "\nfile6\n";
            chunkEnd();
            out = Object.keys(result)
                .map(function (curr) { return ({ name: curr, content: result[curr] }); });
            return out;
        },
        compile: function () { },
        dependency: {}
    };
})();

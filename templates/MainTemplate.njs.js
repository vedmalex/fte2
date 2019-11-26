module.exports = { alias: ["MainTemplate.njs"], script: function (context, _content, partial, slot) {
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
        function processRequire(item) {
            var requires = item.name.split(',').map(function (i) { return i.trim(); });
            return { name: requires[0], alias: requires[1] };
        }
        function processContextName(item) {
            return item.name.split(',')[0].trim();
        }
        function processAsync(item) {
            return item.name.split(',')[0].trim();
        }
        function processAlias(item) {
            return item.name.split(',').map(function (a) { return a.trim(); });
        }
        function processnoIndent(item) {
            return !!item;
        }
        var templateAlias = '';
        var reqList = [];
        var contextName = 'context';
        var noIndent = false;
        var alias = '';
        var useChunks = '';
        var useHash = '';
        var item, directives = context.directives, extend = '';
        for (var i = 0, len = directives.length; i < len; i++) {
            item = directives[i];
            if (item.content === 'extend') {
                extend = item.name.trim();
            }
            if (item.content === 'requireAs') {
                reqList.push(processRequire(item));
            }
            if (item.content === 'context') {
                contextName = processContextName(item);
            }
            if (item.content === 'noIndent') {
                noIndent = processnoIndent(item);
            }
            if (item.content === 'alias') {
                alias = processAlias(item);
            }
            if (item.content === 'chunks') {
                useChunks = processAsync(item);
            }
            if (item.content === 'useHash') {
                useHash = !!item;
            }
        }
        /*59:1*/
        out += "{";
        /*59:2*/
        if (alias) {
            /*61:3*/
            out += " alias:";
            /*61:10*/
            out += applyIndent(JSON.stringify(alias), " ");
            /*61:35*/
            out += ",";
            /*61:36*/
        }
        /*63:1*/
        out += "  script: function (";
        /*63:21*/
        out += contextName;
        /*63:35*/
        out += ", _content, partial, slot){\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx =";
        /*65:50*/
        out += applyIndent(contextName, " ");
        /*65:65*/
        out += ";\n      return _content(blockName, ctx, content, partial, slot);\n    }\n    ";
        /*68:5*/
        if (useChunks) {
            /*68:23*/
            out += "\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template);\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content);\n        })\n        return '';\n      } else {\n        return result;\n      }\n    }\n    let current = '";
            /*81:20*/
            out += useChunks;
            /*81:32*/
            out += "';\n    let outStack = [current];\n    let result;\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {};\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content :'';\n      }\n    }\n\n    function chunkStart(name) {\n      chunkEnd();\n      chunkEnsure(current);\n      result[current] += out;\n      chunkEnsure(name);\n      result[name] = out = '';\n      outStack.push(name);\n      current = name;\n    }\n\n    function chunkEnd() {\n      chunkEnsure(current);\n      result[current] += out;\n      if (outStack.length > 1) {\n        current = outStack.pop();\n      } else {\n        current = outStack[0];\n      }\n      out = ''\n    }\n\n    ";
            /*115:5*/
        }
        /*115:10*/
        out += "\n    var out = '';";
        /*116:18*/
        var blocks = { blocks: context.main, noIndent: noIndent };
        /*118:1*/
        out += applyIndent(partial(blocks, 'codeblock'), "    ");
        /*118:35*/
        out += "\n    ";
        /*119:5*/
        if (useChunks) {
            /*119:23*/
            out += "\n      chunkEnd();\n      out = result;\n      ";
            /*122:7*/
            if (!useHash) {
                /*122:24*/
                out += "\n        out = Object.keys(result).filter(i => i !== '";
                /*123:54*/
                out += useChunks;
                /*123:66*/
                out += "').map(curr => ({ name: curr, content: result[curr] }))\n      ";
                /*124:7*/
            }
            else {
                /*124:19*/
                out += "\n        delete out['";
                /*125:21*/
                out += useChunks;
                /*125:33*/
                out += "'];\n      ";
                /*126:7*/
            }
            /*126:12*/
            out += "\n    ";
            /*127:5*/
        }
        /*127:10*/
        out += "\n      return out;\n  },\n";
        /*130:1*/
        var cb = context.blocks;
        if (cb) {
            /*133:1*/
            out += "  blocks : {\n";
            /*134:1*/
            for (var cbn in cb) {
                /*135:1*/
                var blockConetxtName = contextName;
                var bdirvs = cb[cbn].directives;
                var item = bdirvs[i];
                var blkNoIndent = false;
                var blAsyncType = '';
                for (var i = 0, len = bdirvs.length; i < len; i++) {
                    item = bdirvs[i];
                    if (item.content === 'context') {
                        blockConetxtName = processContextName(item);
                    }
                    if (item.content === 'noIndent') {
                        blkNoIndent = processnoIndent(item);
                    }
                    if (item.content === 'async') {
                        blAsyncType = processAsync(item);
                    }
                }
                /*153:1*/
                out += "    \"";
                /*153:6*/
                out += cbn;
                /*153:12*/
                out += "\": function(";
                /*153:24*/
                out += blockConetxtName;
                /*153:43*/
                out += ",  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx =";
                /*155:52*/
                out += applyIndent(contextName, " ");
                /*155:67*/
                out += ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';";
                /*158:20*/
                var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent };
                /*160:1*/
                out += applyIndent(partial(blocks, 'codeblock'), "      ");
                /*160:38*/
                out += "\n      return out;\n    },\n";
                /*163:1*/
            }
            /*164:1*/
            out += "  },";
            /*164:5*/
        }
        /*166:1*/
        var cb = context.slots;
        if (cb) {
            /*169:1*/
            out += "  slots : {\n";
            /*170:1*/
            for (var cbn in cb) {
                /*171:1*/
                var blockConetxtName = contextName;
                var bdirvs = cb[cbn].directives;
                var item = bdirvs[i];
                var blkNoIndent = false;
                var blAsyncType = '';
                for (var i = 0, len = bdirvs.length; i < len; i++) {
                    item = bdirvs[i];
                    if (item.content === 'context') {
                        blockConetxtName = processContextName(item);
                    }
                    if (item.content === 'noIndent') {
                        blkNoIndent = processnoIndent(item);
                    }
                    if (item.content === 'async') {
                        blAsyncType = processAsync(item);
                    }
                }
                /*189:1*/
                out += "    \"";
                /*189:6*/
                out += cbn;
                /*189:12*/
                out += "\": function(";
                /*189:24*/
                out += blockConetxtName;
                /*189:43*/
                out += ",  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx =";
                /*191:52*/
                out += applyIndent(contextName, " ");
                /*191:67*/
                out += ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';";
                /*194:20*/
                var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent };
                /*196:1*/
                out += applyIndent(partial(blocks, 'codeblock'), "      ");
                /*196:38*/
                out += "\n      return out;\n    },\n";
                /*199:1*/
            }
            /*200:1*/
            out += "  },";
            /*200:5*/
        }
        /*202:1*/
        out += "  compile: function() {";
        /*202:24*/
        if (alias) {
            /*203:17*/
            out += "\n    this.alias =";
            /*204:17*/
            out += applyIndent(JSON.stringify(alias), " ");
            /*204:42*/
            out += ";";
            /*204:43*/
        }
        /*206:1*/
        if (reqList.length > 0) {
            /*207:1*/
            out += "    this.aliases={};\n";
            /*208:1*/
            var rq;
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                /*212:1*/
                out += "    this.aliases[\"";
                /*212:19*/
                out += rq.alias;
                /*212:30*/
                out += "\"] = \"";
                /*212:36*/
                out += rq.name;
                /*212:46*/
                out += "\";\n    this.factory.ensure(\"";
                /*213:26*/
                out += rq.name;
                /*213:36*/
                out += "\");\n";
                /*214:1*/
            }
        }
        /*217:1*/
        if (extend) {
            /*218:18*/
            out += "\n    this.parent =";
            /*219:18*/
            out += applyIndent(JSON.stringify(extend), " ");
            /*219:44*/
            out += ";\n    this.mergeParent(this.factory.ensure(this.parent))\n";
            /*221:1*/
        }
        /*222:1*/
        out += "  },\n  dependency: {\n  ";
        /*224:3*/
        if (extend) {
            /*225:1*/
            out += applyIndent(JSON.stringify(extend), "    ");
            /*225:30*/
            out += ": 1,\n  ";
            /*226:3*/
        }
        /*227:1*/
        if (reqList.length > 0) {
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                /*231:1*/
                out += "    \"";
                /*231:6*/
                out += rq.name;
                /*231:16*/
                out += "\": 1,\n";
                /*232:1*/
            }
        }
        /*235:1*/
        out += "  }\n}\n";
        return out;
    },
    compile: function () {
        this.alias = ["MainTemplate.njs"];
        this.aliases = {};
        this.aliases["codeblock"] = "codeblock.njs";
        this.factory.ensure("codeblock.njs");
    },
    dependency: {
        "codeblock.njs": 1,
    }
};

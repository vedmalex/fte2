module.exports = { alias: ["MainTemplate.njs"], script: function (context, _content, partial, slot) {
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
        var inludeMainchunkInOutput = false;
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
            if (item.content === 'includeMainChunk') {
                inludeMainchunkInOutput = processnoIndent(item);
            }
            if (item.content === 'useHash') {
                useHash = !!item;
            }
        }
        /*63:1*/
        out += "{";
        /*63:2*/
        if (alias) {
            /*65:3*/
            out += " alias:";
            /*65:10*/
            out += applyIndent(JSON.stringify(alias), " ");
            /*65:35*/
            out += ",";
            /*65:36*/
        }
        /*67:1*/
        out += "  script: function (";
        /*67:21*/
        out += contextName;
        /*67:35*/
        out += ", _content, partial, slot){";
        /*67:62*/
        if (context.blocks || context.slots) {
            /*69:1*/
            out += "    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx =";
            /*70:50*/
            out += applyIndent(contextName, " ");
            /*70:65*/
            out += ";\n      return _content(blockName, ctx, content, partial, slot);\n    }";
            /*72:6*/
        }
        /*74:1*/
        out += "    ";
        /*74:5*/
        if (useChunks) {
            /*74:23*/
            out += "\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template);\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content);\n        })\n        return '';\n      } else {\n        return result;\n      }\n    }\n    const main = '";
            /*87:19*/
            out += useChunks;
            /*87:31*/
            out += "';\n    var current = main;\n    let outStack = [current];\n    let result;\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {};\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content : '';\n      }\n    }\n    function chunkStart(name) {\n      chunkEnsure(name);\n      chunkEnd();\n      current = name;\n      out = '';\n    }\n    function chunkEnd() {\n      result[current] += out;\n      out = '';\n      current = outStack.pop() || main;\n    }\n\n    ";
            /*112:5*/
        }
        /*112:10*/
        out += "\n    var out = '';\n    ";
        /*114:5*/
        if (useChunks) {
            /*114:23*/
            out += "\n      chunkStart(main);\n    ";
            /*116:5*/
        }
        /*116:10*/
        var blocks = { blocks: context.main, noIndent: noIndent };
        /*118:1*/
        out += applyIndent(partial(blocks, 'codeblock'), "    ");
        /*118:35*/
        out += "\n    ";
        /*119:5*/
        if (useChunks) {
            /*119:23*/
            out += "\n      chunkEnd();\n      ";
            /*121:7*/
            if (!useHash) {
                /*121:24*/
                out += "\n        out = Object.keys(result)\n        ";
                /*123:9*/
                if (!inludeMainchunkInOutput) {
                    /*123:42*/
                    out += "\n        .filter(i => i !== '";
                    /*124:29*/
                    out += useChunks;
                    /*124:41*/
                    out += "')\n        ";
                    /*125:9*/
                }
                /*125:14*/
                out += "\n        .map(curr => ({ name: curr, content: result[curr] }))\n      ";
                /*127:7*/
            }
            else {
                /*127:19*/
                out += "\n        out = result;\n        ";
                /*129:9*/
                if (!inludeMainchunkInOutput) {
                    /*129:42*/
                    out += "\n        delete out['";
                    /*130:21*/
                    out += useChunks;
                    /*130:33*/
                    out += "'];\n        ";
                    /*131:9*/
                }
                /*131:14*/
                out += "\n      ";
                /*132:7*/
            }
            /*132:12*/
            out += "\n    ";
            /*133:5*/
        }
        /*133:10*/
        out += "\n      return out;\n  },\n";
        /*136:1*/
        var cb = context.blocks;
        if (cb) {
            /*139:1*/
            out += "  blocks : {\n";
            /*140:1*/
            for (var cbn in cb) {
                /*141:1*/
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
                /*159:1*/
                out += "    \"";
                /*159:6*/
                out += cbn;
                /*159:12*/
                out += "\": function(";
                /*159:24*/
                out += blockConetxtName;
                /*159:43*/
                out += ",  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx =";
                /*161:52*/
                out += applyIndent(contextName, " ");
                /*161:67*/
                out += ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';";
                /*164:20*/
                var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent };
                /*166:1*/
                out += applyIndent(partial(blocks, 'codeblock'), "      ");
                /*166:38*/
                out += "\n      return out;\n    },\n";
                /*169:1*/
            }
            /*170:1*/
            out += "  },";
            /*170:5*/
        }
        /*172:1*/
        var cb = context.slots;
        if (cb) {
            /*175:1*/
            out += "  slots : {\n";
            /*176:1*/
            for (var cbn in cb) {
                /*177:1*/
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
                /*195:1*/
                out += "    \"";
                /*195:6*/
                out += cbn;
                /*195:12*/
                out += "\": function(";
                /*195:24*/
                out += blockConetxtName;
                /*195:43*/
                out += ",  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx =";
                /*197:52*/
                out += applyIndent(contextName, " ");
                /*197:67*/
                out += ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';";
                /*200:20*/
                var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent };
                /*202:1*/
                out += applyIndent(partial(blocks, 'codeblock'), "      ");
                /*202:38*/
                out += "\n      return out;\n    },\n";
                /*205:1*/
            }
            /*206:1*/
            out += "  },";
            /*206:5*/
        }
        /*208:1*/
        out += "  compile: function() {";
        /*208:24*/
        if (alias) {
            /*209:17*/
            out += "\n    this.alias =";
            /*210:17*/
            out += applyIndent(JSON.stringify(alias), " ");
            /*210:42*/
            out += ";";
            /*210:43*/
        }
        /*212:1*/
        if (reqList.length > 0) {
            /*213:1*/
            out += "    this.aliases={};\n";
            /*214:1*/
            var rq;
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                /*218:1*/
                out += "    this.aliases[\"";
                /*218:19*/
                out += rq.alias;
                /*218:30*/
                out += "\"] = \"";
                /*218:36*/
                out += rq.name;
                /*218:46*/
                out += "\";\n    this.factory.ensure(\"";
                /*219:26*/
                out += rq.name;
                /*219:36*/
                out += "\");\n";
                /*220:1*/
            }
        }
        /*223:1*/
        if (extend) {
            /*224:18*/
            out += "\n    this.parent =";
            /*225:18*/
            out += applyIndent(JSON.stringify(extend), " ");
            /*225:44*/
            out += ";\n    this.mergeParent(this.factory.ensure(this.parent))\n";
            /*227:1*/
        }
        /*228:1*/
        out += "  },\n  dependency: {\n  ";
        /*230:3*/
        if (extend) {
            /*231:1*/
            out += applyIndent(JSON.stringify(extend), "    ");
            /*231:30*/
            out += ": 1,\n  ";
            /*232:3*/
        }
        /*233:1*/
        if (reqList.length > 0) {
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                /*237:1*/
                out += "    \"";
                /*237:6*/
                out += rq.name;
                /*237:16*/
                out += "\": 1,\n";
                /*238:1*/
            }
        }
        /*241:1*/
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

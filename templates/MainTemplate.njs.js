module.exports = {
    alias: [
        "MainTemplate.njs"
    ],
    script: function(context, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (null == ctx) ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        var directives = context.directives;
        out.push("{\n");
        if (directives.chunks) out.push("\nchunks: " + JSON.stringify(directives.chunks) + ",\n");
        out.push("\n");
        if (directives.alias) out.push("\nalias: " + JSON.stringify(directives.alias) + ",\n");
        out.push("script: function (" + directives.context + ", _content, partial, slot, options){\n    " + content("maincontent", directives) + "\n    var out = []\n    " + content("chunks-start", directives) + "\n    " + partial(context.main, "codeblock") + "\n    " + content("chunks-finish", directives) + "\n     return out.join('')\n  },\n\n");
        var blockNames = Object.keys(context.blocks);
        if (blockNames.length > 0) {
            out.push("blocks : {\n\n");
            for(var i = 0; i < blockNames.length; i += 1){
                var block = context.blocks[blockNames[i]];
                out.push('"' + blockNames[i] + '": function(' + block.directives.context + ",  _content, partial, slot, options) {\n      " + content("maincontent", block.directives) + "\n      var out = []\n      " + partial(block.main, "codeblock") + "\n      return out.join('')\n    },\n");
            }
            out.push("\n  },");
        }
        var slotNames = Object.keys(context.slots);
        if (slotNames.length > 0) {
            out.push("slots : {\n\n");
            for(var i1 = 0; i1 < slotNames.length; i1 += 1){
                var slot1 = context.blocks[slotNames[i1]];
                out.push('"' + slotNames[i1] + '": function(' + slot1.directives.context + ",  _content, partial, slot, options){\n      " + content("maincontent", slot1.directives) + "\n      var out = []\n      " + partial(slot1.main, "codeblock") + "\n      return out.join('')\n    },\n");
            }
            out.push("\n  },\n");
        }
        out.push("\n  compile: function() {\n");
        if (directives.alias) out.push("\n    this.alias = " + JSON.stringify(directives.alias) + "\n");
        out.push("\n");
        if (directives.requireAs.length > 0) {
            out.push("\n    this.aliases={}\n");
            var rq;
            for(var i2 = 0, len = directives.requireAs.length; i2 < len; i2++){
                rq = directives.requireAs[i2];
                out.push('\n    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n    this.factory.ensure("' + rq.name + '")\n\n');
            }
        }
        out.push("\n\n");
        if (directives.extend) out.push("\n    this.parent = " + JSON.stringify(directives.extend) + "\n    this.mergeParent(this.factory.ensure(this.parent))\n");
        out.push("\n  },\n  dependency: {\n  ");
        if (directives.extend) out.push(JSON.stringify(directives.extend) + ": true,\n  ");
        if (directives.requireAs.length > 0) for(var i2 = 0, len = directives.requireAs.length; i2 < len; i2++){
            rq = directives.requireAs[i2];
            out.push('\n    "' + rq.name + '": true,\n    "' + rq.alias + '": true,\n\n');
        }
        out.push("\n  }\n}\n");
        return out.join("");
    },
    blocks: {
        maincontent: function(directives, _content, partial, slot, options) {
            var out = [];
            if (directives.escapeIt) out.push("\n    const {escapeIt} = options\n  ");
            if (directives.content) out.push("\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx = " + directives.context + "\n      return _content(blockName, ctx, content, partial, slot)\n    }\n  ");
            return out.join("");
        },
        "chunks-start": function(directives, _content, partial, slot, options) {
            var out = [];
            if (directives.chunks) out.push("\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template)\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content)\n        })\n        return ''\n      } else {\n        return result\n      }\n    }\n    const main = '" + directives.chunks + "'\n    var current = main\n    let outStack = [current]\n    let result\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {}\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content : []\n      }\n    }\n    function chunkStart(name) {\n      chunkEnsure(name)\n      chunkEnd()\n      current = name\n      out = []\n    }\n    function chunkEnd() {\n      result[current].push(out)\n      out = []\n      current = outStack.pop() || main\n    }\n    chunkStart(main)\n  ");
            return out.join("");
        },
        "chunks-finish": function(directives, _content, partial, slot, options) {
            var out = [];
            if (directives.chunks) {
                out.push("\n    chunkEnd()\n    ");
                if (directives.useHash) {
                    out.push("\n    out = result\n      ");
                    if (!directives.includeMainChunk) out.push("\n    delete out['" + directives.chunks + "']\n      ");
                    out.push("\n    ");
                } else {
                    out.push("\n    out = Object.keys(result)\n      ");
                    if (!directives.includeMainChunk) out.push("\n      .filter(i => i !== '" + directives.chunks + "')\n      ");
                    out.push("\n      .map(curr => ({ name: curr, content: result[curr] }))\n      ");
                }
                out.push("\n  ");
            }
            return out.join("");
        }
    },
    compile: function() {
        this.alias = [
            "MainTemplate.njs"
        ];
        this.aliases = {};
        this.aliases["codeblock"] = "codeblock.njs";
        this.factory.ensure("codeblock.njs");
    },
    dependency: {
        "codeblock.njs": true,
        codeblock: true
    }
};

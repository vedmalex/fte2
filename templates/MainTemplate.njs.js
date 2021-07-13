module.exports = {
  alias: ['MainTemplate.njs'],
  script: function (context, _content, partial, slot) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = ''
    try {
      var line
      var column
      function applyIndent(_str, _indent) {
        var str = String(_str)
        var indent = ''
        if (typeof _indent == 'number' && _indent > 0) {
          var res = ''
          for (var i = 0; i < _indent; i++) {
            res += ' '
          }
          indent = res
        }
        if (typeof _indent == 'string' && _indent.length > 0) {
          indent = _indent
        }
        if (indent && str) {
          return str
            .split('\n')
            .map((s) => indent + s)
            .join('\n')
        } else {
          return str
        }
      }
      /*3:1*/
      line = 3
      column = 1
      function processRequire(item) {
        var requires = item.name.split(',').map(function (i) {
          return i.trim()
        })
        return { name: requires[0], alias: requires[1] }
      }
      function processContextName(item) {
        return item.name.split(',')[0].trim()
      }
      function processAsync(item) {
        return item.name.split(',')[0].trim()
      }
      function processAlias(item) {
        return item.name.split(',').map((a) => a.trim())
      }
      function processnoIndent(item) {
        return !!item
      }
      var templateAlias = ''
      var reqList = []
      var contextName = 'context'
      var noIndent = false
      var alias = ''
      var useChunks = ''
      var inludeMainchunkInOutput = false
      var useHash = ''
      var item,
        directives = context.directives,
        extend = ''
      for (var i = 0, len = directives.length; i < len; i++) {
        item = directives[i]
        if (item.content === 'extend') {
          extend = item.name.trim()
        }
        if (item.content === 'requireAs') {
          reqList.push(processRequire(item))
        }
        if (item.content === 'context') {
          contextName = processContextName(item)
        }
        if (item.content === 'noIndent') {
          noIndent = processnoIndent(item)
        }
        if (item.content === 'alias') {
          alias = processAlias(item)
        }
        if (item.content === 'chunks') {
          useChunks = processAsync(item)
        }
        if (item.content === 'includeMainChunk') {
          inludeMainchunkInOutput = processnoIndent(item)
        }
        if (item.content === 'useHash') {
          useHash = !!item
        }
      }
      /*63:1*/
      line = 63
      column = 1
      out += '{'
      /*63:2*/
      line = 63
      column = 2
      if (alias) {
        /*65:3*/
        line = 65
        column = 3
        out += ' alias:'
        /*65:10*/
        line = 65
        column = 10
        out += applyIndent(JSON.stringify(alias), ' ')
        /*65:35*/
        line = 65
        column = 35
        out += ','
        /*65:36*/
        line = 65
        column = 36
      }
      /*67:1*/
      line = 67
      column = 1
      const useDirectContent = context.blocks || context.slots
      /*67:64*/
      line = 67
      column = 64
      out += '\n  script: function ('
      /*68:21*/
      line = 68
      column = 21
      out += contextName
      /*68:35*/
      line = 68
      column = 35
      out +=
        ', _content, partial, slot){\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx ='
      /*70:50*/
      line = 70
      column = 50
      out += applyIndent(contextName, ' ')
      /*70:65*/
      line = 70
      column = 65
      out +=
        ';\n      return _content(blockName, ctx, content, partial, slot);\n    }\n    '
      /*73:5*/
      line = 73
      column = 5
      if (useChunks) {
        /*73:23*/
        line = 73
        column = 23
        out +=
          "\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template);\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content);\n        })\n        return '';\n      } else {\n        return result;\n      }\n    }\n    const main = '"
        /*86:19*/
        line = 86
        column = 19
        out += useChunks
        /*86:31*/
        line = 86
        column = 31
        out +=
          "';\n    var current = main;\n    let outStack = [current];\n    let result;\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {};\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content : '';\n      }\n    }\n    function chunkStart(name) {\n      chunkEnsure(name);\n      chunkEnd();\n      current = name;\n      out = '';\n    }\n    function chunkEnd() {\n      result[current] += out;\n      out = '';\n      current = outStack.pop() || main;\n    }\n\n    "
        /*111:5*/
        line = 111
        column = 5
      }
      /*111:10*/
      line = 111
      column = 10
      out += "\n    var out = '';\n    "
      /*113:5*/
      line = 113
      column = 5
      if (useChunks) {
        /*113:23*/
        line = 113
        column = 23
        out += '\n      chunkStart(main);\n    '
        /*115:5*/
        line = 115
        column = 5
      }
      /*115:10*/
      line = 115
      column = 10
      var blocks = { blocks: context.main, noIndent: noIndent }
      /*117:1*/
      line = 117
      column = 1
      out += applyIndent(partial(blocks, 'codeblock'), '    ')
      /*117:35*/
      line = 117
      column = 35
      out += '\n    '
      /*118:5*/
      line = 118
      column = 5
      if (useChunks) {
        /*118:23*/
        line = 118
        column = 23
        out += '\n      chunkEnd();\n      '
        /*120:7*/
        line = 120
        column = 7
        if (!useHash) {
          /*120:24*/
          line = 120
          column = 24
          out += '\n        out = Object.keys(result)\n        '
          /*122:9*/
          line = 122
          column = 9
          if (!inludeMainchunkInOutput) {
            /*122:42*/
            line = 122
            column = 42
            out += "\n        .filter(i => i !== '"
            /*123:29*/
            line = 123
            column = 29
            out += useChunks
            /*123:41*/
            line = 123
            column = 41
            out += "')\n        "
            /*124:9*/
            line = 124
            column = 9
          }
          /*124:14*/
          line = 124
          column = 14
          out +=
            '\n        .map(curr => ({ name: curr, content: result[curr] }))\n      '
          /*126:7*/
          line = 126
          column = 7
        } else {
          /*126:19*/
          line = 126
          column = 19
          out += '\n        out = result;\n        '
          /*128:9*/
          line = 128
          column = 9
          if (!inludeMainchunkInOutput) {
            /*128:42*/
            line = 128
            column = 42
            out += "\n        delete out['"
            /*129:21*/
            line = 129
            column = 21
            out += useChunks
            /*129:33*/
            line = 129
            column = 33
            out += "'];\n        "
            /*130:9*/
            line = 130
            column = 9
          }
          /*130:14*/
          line = 130
          column = 14
          out += '\n      '
          /*131:7*/
          line = 131
          column = 7
        }
        /*131:12*/
        line = 131
        column = 12
        out += '\n    '
        /*132:5*/
        line = 132
        column = 5
      }
      /*132:10*/
      line = 132
      column = 10
      out += '\n      return out;\n  },\n'
      /*135:1*/
      line = 135
      column = 1
      var cb = context.blocks
      if (cb) {
        /*138:1*/
        line = 138
        column = 1
        out += '  blocks : {\n'
        /*139:1*/
        line = 139
        column = 1
        for (var cbn in cb) {
          /*140:1*/
          line = 140
          column = 1
          var blockConetxtName = contextName
          var bdirvs = cb[cbn].directives
          var item = bdirvs[i]
          var blkNoIndent = false
          var blAsyncType = ''
          for (var i = 0, len = bdirvs.length; i < len; i++) {
            item = bdirvs[i]
            if (item.content === 'context') {
              blockConetxtName = processContextName(item)
            }
            if (item.content === 'noIndent') {
              blkNoIndent = processnoIndent(item)
            }
            if (item.content === 'async') {
              blAsyncType = processAsync(item)
            }
          }
          /*158:1*/
          line = 158
          column = 1
          out += '    "'
          /*158:6*/
          line = 158
          column = 6
          out += cbn
          /*158:12*/
          line = 158
          column = 12
          out += '": function('
          /*158:24*/
          line = 158
          column = 24
          out += blockConetxtName
          /*158:43*/
          line = 158
          column = 43
          out +=
            ',  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx ='
          /*160:52*/
          line = 160
          column = 52
          out += applyIndent(contextName, ' ')
          /*160:67*/
          line = 160
          column = 67
          out +=
            ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';"
          /*163:20*/
          line = 163
          column = 20
          var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent }
          /*165:1*/
          line = 165
          column = 1
          out += applyIndent(partial(blocks, 'codeblock'), '      ')
          /*165:38*/
          line = 165
          column = 38
          out += '\n      return out;\n    },\n'
          /*168:1*/
          line = 168
          column = 1
        }
        /*169:1*/
        line = 169
        column = 1
        out += '  },'
        /*169:5*/
        line = 169
        column = 5
      }
      /*171:1*/
      line = 171
      column = 1
      var cb = context.slots
      if (cb) {
        /*174:1*/
        line = 174
        column = 1
        out += '  slots : {\n'
        /*175:1*/
        line = 175
        column = 1
        for (var cbn in cb) {
          /*176:1*/
          line = 176
          column = 1
          var blockConetxtName = contextName
          var bdirvs = cb[cbn].directives
          var item = bdirvs[i]
          var blkNoIndent = false
          var blAsyncType = ''
          for (var i = 0, len = bdirvs.length; i < len; i++) {
            item = bdirvs[i]
            if (item.content === 'context') {
              blockConetxtName = processContextName(item)
            }
            if (item.content === 'noIndent') {
              blkNoIndent = processnoIndent(item)
            }
            if (item.content === 'async') {
              blAsyncType = processAsync(item)
            }
          }
          /*194:1*/
          line = 194
          column = 1
          out += '    "'
          /*194:6*/
          line = 194
          column = 6
          out += cbn
          /*194:12*/
          line = 194
          column = 12
          out += '": function('
          /*194:24*/
          line = 194
          column = 24
          out += blockConetxtName
          /*194:43*/
          line = 194
          column = 43
          out +=
            ',  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx ='
          /*196:52*/
          line = 196
          column = 52
          out += applyIndent(contextName, ' ')
          /*196:67*/
          line = 196
          column = 67
          out +=
            ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';"
          /*199:20*/
          line = 199
          column = 20
          var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent }
          /*201:1*/
          line = 201
          column = 1
          out += applyIndent(partial(blocks, 'codeblock'), '      ')
          /*201:38*/
          line = 201
          column = 38
          out += '\n      return out;\n    },\n'
          /*204:1*/
          line = 204
          column = 1
        }
        /*205:1*/
        line = 205
        column = 1
        out += '  },'
        /*205:5*/
        line = 205
        column = 5
      }
      /*207:1*/
      line = 207
      column = 1
      out += '  compile: function() {'
      /*207:24*/
      line = 207
      column = 24
      if (alias) {
        /*208:17*/
        line = 208
        column = 17
        out += '\n    this.alias ='
        /*209:17*/
        line = 209
        column = 17
        out += applyIndent(JSON.stringify(alias), ' ')
        /*209:42*/
        line = 209
        column = 42
        out += ';'
        /*209:43*/
        line = 209
        column = 43
      }
      /*211:1*/
      line = 211
      column = 1
      if (reqList.length > 0) {
        /*212:1*/
        line = 212
        column = 1
        out += '    this.aliases={};\n'
        /*213:1*/
        line = 213
        column = 1
        var rq
        for (var i = 0, len = reqList.length; i < len; i++) {
          rq = reqList[i]
          /*217:1*/
          line = 217
          column = 1
          out += '    this.aliases["'
          /*217:19*/
          line = 217
          column = 19
          out += rq.alias
          /*217:30*/
          line = 217
          column = 30
          out += '"] = "'
          /*217:36*/
          line = 217
          column = 36
          out += rq.name
          /*217:46*/
          line = 217
          column = 46
          out += '";\n    this.factory.ensure("'
          /*218:26*/
          line = 218
          column = 26
          out += rq.name
          /*218:36*/
          line = 218
          column = 36
          out += '");\n'
          /*219:1*/
          line = 219
          column = 1
        }
      }
      /*222:1*/
      line = 222
      column = 1
      if (extend) {
        /*223:18*/
        line = 223
        column = 18
        out += '\n    this.parent ='
        /*224:18*/
        line = 224
        column = 18
        out += applyIndent(JSON.stringify(extend), ' ')
        /*224:44*/
        line = 224
        column = 44
        out += ';\n    this.mergeParent(this.factory.ensure(this.parent))\n'
        /*226:1*/
        line = 226
        column = 1
      }
      /*227:1*/
      line = 227
      column = 1
      out += '  },\n  dependency: {\n  '
      /*229:3*/
      line = 229
      column = 3
      if (extend) {
        /*230:1*/
        line = 230
        column = 1
        out += applyIndent(JSON.stringify(extend), '    ')
        /*230:30*/
        line = 230
        column = 30
        out += ': 1,\n  '
        /*231:3*/
        line = 231
        column = 3
      }
      /*232:1*/
      line = 232
      column = 1
      if (reqList.length > 0) {
        for (var i = 0, len = reqList.length; i < len; i++) {
          rq = reqList[i]
          /*236:1*/
          line = 236
          column = 1
          out += '    "'
          /*236:6*/
          line = 236
          column = 6
          out += rq.name
          /*236:16*/
          line = 236
          column = 16
          out += '": 1,\n'
          /*237:1*/
          line = 237
          column = 1
        }
      }
      /*240:1*/
      line = 240
      column = 1
      out += '  }\n}\n'
    } catch (e) {
      throw new Error(`
       error at ${line}:${column}
       message: ${e.message}
       stack: ${e.stack}
     `)
    }
    return out
  },
  compile: function () {
    this.alias = ['MainTemplate.njs']
    this.aliases = {}
    this.aliases['codeblock'] = 'codeblock.njs'
    this.factory.ensure('codeblock.njs')
  },
  dependency: {
    'codeblock.njs': 1,
  },
}

module.exports = {
  alias: ['MainTemplate.njs'],
  script: function (context, _content, partial, slot) {
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
            .map(function (s) {
              return indent + s
            })
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
        return item.name.split(',').map(function (a) {
          return a.trim()
        })
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
      out += '  script: function ('
      /*67:21*/
      line = 67
      column = 21
      out += contextName
      /*67:35*/
      line = 67
      column = 35
      out += ', _content, partial, slot){'
      /*67:62*/
      line = 67
      column = 62
      if (context.blocks || context.slots) {
        /*69:1*/
        line = 69
        column = 1
        out +=
          '    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx ='
        /*70:50*/
        line = 70
        column = 50
        out += applyIndent(contextName, ' ')
        /*70:65*/
        line = 70
        column = 65
        out +=
          ';\n      return _content(blockName, ctx, content, partial, slot);\n    }'
        /*72:6*/
        line = 72
        column = 6
      }
      /*74:1*/
      line = 74
      column = 1
      out += '    '
      /*74:5*/
      line = 74
      column = 5
      if (useChunks) {
        /*74:23*/
        line = 74
        column = 23
        out +=
          "\n    const _partial = partial\n    partial = function(obj, template) {\n      const result = _partial(obj, template);\n      if(Array.isArray(result)){\n        result.forEach(r => {\n          chunkEnsure(r.name, r.content);\n        })\n        return '';\n      } else {\n        return result;\n      }\n    }\n    const main = '"
        /*87:19*/
        line = 87
        column = 19
        out += useChunks
        /*87:31*/
        line = 87
        column = 31
        out +=
          "';\n    var current = main;\n    let outStack = [current];\n    let result;\n\n    function chunkEnsure(name, content) {\n      if (!result) {\n        result = {};\n      }\n      if (!result.hasOwnProperty(name)) {\n        result[name] = content ? content : '';\n      }\n    }\n    function chunkStart(name) {\n      chunkEnsure(name);\n      chunkEnd();\n      current = name;\n      out = '';\n    }\n    function chunkEnd() {\n      result[current] += out;\n      out = '';\n      current = outStack.pop() || main;\n    }\n\n    "
        /*112:5*/
        line = 112
        column = 5
      }
      /*112:10*/
      line = 112
      column = 10
      out += "\n    var out = '';\n    "
      /*114:5*/
      line = 114
      column = 5
      if (useChunks) {
        /*114:23*/
        line = 114
        column = 23
        out += '\n      chunkStart(main);\n    '
        /*116:5*/
        line = 116
        column = 5
      }
      /*116:10*/
      line = 116
      column = 10
      var blocks = { blocks: context.main, noIndent: noIndent }
      /*118:1*/
      line = 118
      column = 1
      out += applyIndent(partial(blocks, 'codeblock'), '    ')
      /*118:35*/
      line = 118
      column = 35
      out += '\n    '
      /*119:5*/
      line = 119
      column = 5
      if (useChunks) {
        /*119:23*/
        line = 119
        column = 23
        out += '\n      chunkEnd();\n      '
        /*121:7*/
        line = 121
        column = 7
        if (!useHash) {
          /*121:24*/
          line = 121
          column = 24
          out += '\n        out = Object.keys(result)\n        '
          /*123:9*/
          line = 123
          column = 9
          if (!inludeMainchunkInOutput) {
            /*123:42*/
            line = 123
            column = 42
            out += "\n        .filter(i => i !== '"
            /*124:29*/
            line = 124
            column = 29
            out += useChunks
            /*124:41*/
            line = 124
            column = 41
            out += "')\n        "
            /*125:9*/
            line = 125
            column = 9
          }
          /*125:14*/
          line = 125
          column = 14
          out +=
            '\n        .map(curr => ({ name: curr, content: result[curr] }))\n      '
          /*127:7*/
          line = 127
          column = 7
        } else {
          /*127:19*/
          line = 127
          column = 19
          out += '\n        out = result;\n        '
          /*129:9*/
          line = 129
          column = 9
          if (!inludeMainchunkInOutput) {
            /*129:42*/
            line = 129
            column = 42
            out += "\n        delete out['"
            /*130:21*/
            line = 130
            column = 21
            out += useChunks
            /*130:33*/
            line = 130
            column = 33
            out += "'];\n        "
            /*131:9*/
            line = 131
            column = 9
          }
          /*131:14*/
          line = 131
          column = 14
          out += '\n      '
          /*132:7*/
          line = 132
          column = 7
        }
        /*132:12*/
        line = 132
        column = 12
        out += '\n    '
        /*133:5*/
        line = 133
        column = 5
      }
      /*133:10*/
      line = 133
      column = 10
      out += '\n      return out;\n  },\n'
      /*136:1*/
      line = 136
      column = 1
      var cb = context.blocks
      if (cb) {
        /*139:1*/
        line = 139
        column = 1
        out += '  blocks : {\n'
        /*140:1*/
        line = 140
        column = 1
        for (var cbn in cb) {
          /*141:1*/
          line = 141
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
          /*159:1*/
          line = 159
          column = 1
          out += '    "'
          /*159:6*/
          line = 159
          column = 6
          out += cbn
          /*159:12*/
          line = 159
          column = 12
          out += '": function('
          /*159:24*/
          line = 159
          column = 24
          out += blockConetxtName
          /*159:43*/
          line = 159
          column = 43
          out +=
            ',  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx ='
          /*161:52*/
          line = 161
          column = 52
          out += applyIndent(contextName, ' ')
          /*161:67*/
          line = 161
          column = 67
          out +=
            ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';"
          /*164:20*/
          line = 164
          column = 20
          var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent }
          /*166:1*/
          line = 166
          column = 1
          out += applyIndent(partial(blocks, 'codeblock'), '      ')
          /*166:38*/
          line = 166
          column = 38
          out += '\n      return out;\n    },\n'
          /*169:1*/
          line = 169
          column = 1
        }
        /*170:1*/
        line = 170
        column = 1
        out += '  },'
        /*170:5*/
        line = 170
        column = 5
      }
      /*172:1*/
      line = 172
      column = 1
      var cb = context.slots
      if (cb) {
        /*175:1*/
        line = 175
        column = 1
        out += '  slots : {\n'
        /*176:1*/
        line = 176
        column = 1
        for (var cbn in cb) {
          /*177:1*/
          line = 177
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
          /*195:1*/
          line = 195
          column = 1
          out += '    "'
          /*195:6*/
          line = 195
          column = 6
          out += cbn
          /*195:12*/
          line = 195
          column = 12
          out += '": function('
          /*195:24*/
          line = 195
          column = 24
          out += blockConetxtName
          /*195:43*/
          line = 195
          column = 43
          out +=
            ',  _content, partial, slot){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx ='
          /*197:52*/
          line = 197
          column = 52
          out += applyIndent(contextName, ' ')
          /*197:67*/
          line = 197
          column = 67
          out +=
            ";\n        return _content(blockName, ctx, content, partial, slot);\n      }\n      var out = '';"
          /*200:20*/
          line = 200
          column = 20
          var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent }
          /*202:1*/
          line = 202
          column = 1
          out += applyIndent(partial(blocks, 'codeblock'), '      ')
          /*202:38*/
          line = 202
          column = 38
          out += '\n      return out;\n    },\n'
          /*205:1*/
          line = 205
          column = 1
        }
        /*206:1*/
        line = 206
        column = 1
        out += '  },'
        /*206:5*/
        line = 206
        column = 5
      }
      /*208:1*/
      line = 208
      column = 1
      out += '  compile: function() {'
      /*208:24*/
      line = 208
      column = 24
      if (alias) {
        /*209:17*/
        line = 209
        column = 17
        out += '\n    this.alias ='
        /*210:17*/
        line = 210
        column = 17
        out += applyIndent(JSON.stringify(alias), ' ')
        /*210:42*/
        line = 210
        column = 42
        out += ';'
        /*210:43*/
        line = 210
        column = 43
      }
      /*212:1*/
      line = 212
      column = 1
      if (reqList.length > 0) {
        /*213:1*/
        line = 213
        column = 1
        out += '    this.aliases={};\n'
        /*214:1*/
        line = 214
        column = 1
        var rq
        for (var i = 0, len = reqList.length; i < len; i++) {
          rq = reqList[i]
          /*218:1*/
          line = 218
          column = 1
          out += '    this.aliases["'
          /*218:19*/
          line = 218
          column = 19
          out += rq.alias
          /*218:30*/
          line = 218
          column = 30
          out += '"] = "'
          /*218:36*/
          line = 218
          column = 36
          out += rq.name
          /*218:46*/
          line = 218
          column = 46
          out += '";\n    this.factory.ensure("'
          /*219:26*/
          line = 219
          column = 26
          out += rq.name
          /*219:36*/
          line = 219
          column = 36
          out += '");\n'
          /*220:1*/
          line = 220
          column = 1
        }
      }
      /*223:1*/
      line = 223
      column = 1
      if (extend) {
        /*224:18*/
        line = 224
        column = 18
        out += '\n    this.parent ='
        /*225:18*/
        line = 225
        column = 18
        out += applyIndent(JSON.stringify(extend), ' ')
        /*225:44*/
        line = 225
        column = 44
        out += ';\n    this.mergeParent(this.factory.ensure(this.parent))\n'
        /*227:1*/
        line = 227
        column = 1
      }
      /*228:1*/
      line = 228
      column = 1
      out += '  },\n  dependency: {\n  '
      /*230:3*/
      line = 230
      column = 3
      if (extend) {
        /*231:1*/
        line = 231
        column = 1
        out += applyIndent(JSON.stringify(extend), '    ')
        /*231:30*/
        line = 231
        column = 30
        out += ': 1,\n  '
        /*232:3*/
        line = 232
        column = 3
      }
      /*233:1*/
      line = 233
      column = 1
      if (reqList.length > 0) {
        for (var i = 0, len = reqList.length; i < len; i++) {
          rq = reqList[i]
          /*237:1*/
          line = 237
          column = 1
          out += '    "'
          /*237:6*/
          line = 237
          column = 6
          out += rq.name
          /*237:16*/
          line = 237
          column = 16
          out += '": 1,\n'
          /*238:1*/
          line = 238
          column = 1
        }
      }
      /*241:1*/
      line = 241
      column = 1
      out += '  }\n}\n'
    } catch (e) {
      throw new Error(
        '\n       error at ' +
          line +
          ':' +
          column +
          '\n       message: ' +
          e.message +
          '\n       stack: ' +
          e.stack +
          '\n     ',
      )
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

module.exports = {
  alias: ['MainTemplate.njs'],
  script: function (context, _content, partial, slot, options) {
    var out = []
    debugger
    const { applyIndent } = options
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
      debugger
      item = directives[i]
      if (item.content.indexOf('extend') > -1) {
        extend = item.name.trim()
      }
      if (item.content.indexOf('requireAs') > -1) {
        reqList.push(processRequire(item))
      }
      if (item.content.indexOf('context') > -1) {
        contextName = processContextName(item)
      }
      if (item.content.indexOf('noIndent') > -1) {
        noIndent = processnoIndent(item)
      }
      if (item.content.indexOf('alias') > -1) {
        alias = processAlias(item)
      }
      if (item.content.indexOf('chunks') > -1) {
        useChunks = processAsync(item)
      }
      if (item.content.indexOf('includeMainChunk') > -1) {
        inludeMainchunkInOutput = processnoIndent(item)
      }
      if (item.content.indexOf('useHash') > -1) {
        useHash = !!item
      }
    }
    out.push('{')
    if (alias) {
      out.push(' alias:')
      out.push(applyIndent(JSON.stringify(alias), ' '))
      out.push(',')
    }
    out.push('', '  script: function (')
    out.push(contextName)
    out.push(
      ', _content, partial, slot, options){',
      '    function content(blockName, ctx) {',
      '      if(ctx === undefined || ctx === null) ctx =',
    )
    out.push(applyIndent(contextName, ' '))
    out.push(
      '',
      '      return _content(blockName, ctx, content, partial, slot)',
      '    }',
      '    ',
    )
    if (useChunks) {
      out.push(
        '',
        '    const _partial = partial',
        '    partial = function(obj, template) {',
        '      const result = _partial(obj, template)',
        '      if(Array.isArray(result)){',
        '        result.forEach(r => {',
        '          chunkEnsure(r.name, r.content)',
        '        })',
        "        return ''",
        '      } else {',
        '        return result',
        '      }',
        '    }',
        "    const main = '",
      )
      out.push(useChunks)
      out.push(
        "'",
        '    var current = main',
        '    let outStack = [current]',
        '    let result',
        '',
        '    function chunkEnsure(name, content) {',
        '      if (!result) {',
        '        result = {}',
        '      }',
        '      if (!result.hasOwnProperty(name)) {',
        '        result[name] = content ? content : []',
        '      }',
        '    }',
        '    function chunkStart(name) {',
        '      chunkEnsure(name)',
        '      chunkEnd()',
        '      current = name',
        '      out = []',
        '    }',
        '    function chunkEnd() {',
        '      result[current].push(out)',
        '      out = []',
        '      current = outStack.pop() || main',
        '    }',
        '',
        '    ',
      )
    }
    out.push(
      '',
      '    const { SourceNode } = require("source-map-generator")',
      '',
      '    var out = []',
      '    ',
    )
    if (useChunks) {
      out.push('', '      chunkStart(main)', '    ')
    }
    var blocks = { blocks: context.main, noIndent: noIndent }
    out.push(applyIndent(partial(blocks, 'codeblock'), '    '))
    out.push('', '    ')
    if (useChunks) {
      out.push('', '      chunkEnd()', '      ')
      if (!useHash) {
        out.push('', '        out = Object.keys(result)', '        ')
        if (!inludeMainchunkInOutput) {
          out.push('', "        .filter(i => i !== '")
          out.push(useChunks)
          out.push("')", '        ')
        }
        out.push(
          '',
          '        .map(curr => ({ name: curr, content: result[curr] }))',
          '      ',
        )
      } else {
        out.push('', '        out = result', '        ')
        if (!inludeMainchunkInOutput) {
          out.push('', "        delete out['")
          out.push(useChunks)
          out.push("']", '        ')
        }
        out.push('', '      ')
      }
      out.push('', '    ')
    }
    out.push('', "     return out.join('\\n')", '  },', '')
    var cb = context.blocks
    if (cb) {
      out.push('  blocks : {', '')
      for (var cbn in cb) {
        var blockConetxtName = contextName
        var bdirvs = cb[cbn].directives
        var item = bdirvs[i]
        var blkNoIndent = false
        var blAsyncType = ''
        for (var i = 0, len = bdirvs.length; i < len; i++) {
          item = bdirvs[i]
          if (item.content.indexOf('context') > -1) {
            blockConetxtName = processContextName(item)
          }
          if (item.content.indexOf('noIndent') > -1) {
            blkNoIndent = processnoIndent(item)
          }
          if (item.content.indexOf('async') > -1) {
            blAsyncType = processAsync(item)
          }
        }
        out.push('    "')
        out.push(cbn)
        out.push('": function(')
        out.push(blockConetxtName)
        out.push(
          ',  _content, partial, slot){',
          '      function content(blockName, ctx) {',
          '        if(ctx === undefined || ctx === null) ctx =',
        )
        out.push(applyIndent(contextName, ' '))
        out.push(
          '',
          '        return _content(blockName, ctx, content, partial, slot)',
          '      }',
          '      var out = []',
        )
        var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent }
        out.push(applyIndent(partial(blocks, 'codeblock'), '      '))
        out.push('', "      return out.join('\\n')", '    },', '')
      }
      out.push('  },')
    }
    var cb = context.slots
    if (cb) {
      out.push('  slots : {', '')
      for (var cbn in cb) {
        var blockConetxtName = contextName
        var bdirvs = cb[cbn].directives
        var item = bdirvs[i]
        var blkNoIndent = false
        var blAsyncType = ''
        for (var i = 0, len = bdirvs.length; i < len; i++) {
          item = bdirvs[i]
          if (item.content.indexOf('context') > -1) {
            blockConetxtName = processContextName(item)
          }
          if (item.content.indexOf('noIndent') > -1) {
            blkNoIndent = processnoIndent(item)
          }
          if (item.content.indexOf('async') > -1) {
            blAsyncType = processAsync(item)
          }
        }
        out.push('    "')
        out.push(cbn)
        out.push('": function(')
        out.push(blockConetxtName)
        out.push(
          ',  _content, partial, slot){',
          '      function content(blockName, ctx) {',
          '        if(ctx === undefined || ctx === null) ctx =',
        )
        out.push(applyIndent(contextName, ' '))
        out.push(
          '',
          '        return _content(blockName, ctx, content, partial, slot)',
          '      }',
          '      var out = []',
        )
        var blocks = { blocks: cb[cbn].main, noIndent: blkNoIndent }
        out.push(applyIndent(partial(blocks, 'codeblock'), '      '))
        out.push('', "      return out.join('\\n')", '    },', '')
      }
      out.push('  },')
    }
    out.push('  compile: function() {')
    if (alias) {
      out.push('', '    this.alias =')
      out.push(applyIndent(JSON.stringify(alias), ' '))
    }
    if (reqList.length > 0) {
      out.push('    this.aliases={}', '')
      var rq
      for (var i = 0, len = reqList.length; i < len; i++) {
        ;(rq = reqList[i]), out.push('    this.aliases["')
        out.push(rq.alias)
        out.push('"] = "')
        out.push(rq.name)
        out.push('"', '    this.factory.ensure("')
        out.push(rq.name)
        out.push('")', '')
      }
    }
    if (extend) {
      out.push('', '    this.parent =')
      out.push(applyIndent(JSON.stringify(extend), ' '))
      out.push('', '    this.mergeParent(this.factory.ensure(this.parent))', '')
    }
    out.push('  },', '  dependency: {', '  ')
    if (extend) {
      out.push(applyIndent(JSON.stringify(extend), '    '))
      out.push(': 1,', '  ')
    }
    if (reqList.length > 0) {
      for (var i = 0, len = reqList.length; i < len; i++) {
        ;(rq = reqList[i]), out.push('    "')
        out.push(rq.name)
        out.push('": 1,', '')
      }
    }
    out.push('  }', '}', '')
    return out.join('\n')
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

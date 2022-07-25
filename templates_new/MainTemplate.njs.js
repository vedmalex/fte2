module.exports = {
  alias: ['MainTemplate.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    function processRequire(directive) {
      return {
        name: directive.name,
        alias: directive.params[0],
      }
    }
    var reqList = []
    var contextName = 'context'
    var noIndent = false
    var alias = ''
    var useChunks = ''
    var inludeMainchunkInOutput = false
    var useHash = false
    var item,
      directives = context.directives,
      extend = ''
    let { noContent } = context
    for (var i = 0, len = directives.length; i < len; i++) {
      item = directives[i]
      if (item.name === 'extend') {
        extend = item.name.trim()
      }
      if (item.name === 'requireAs') {
        reqList.push(processRequire(item))
      }
      if (item.name === 'context') {
        contextName = item.params[0]
      }
      if (item.name === 'noIndent') {
        noIndent = true
      }
      if (item.name === 'alias') {
        alias = item.params[0]
      }
      if (item.name === 'chunks') {
        useChunks = item.params[0]
      }
      if (item.name === 'includeMainChunk') {
        inludeMainchunkInOutput = true
      }
      if (item.name === 'useHash') {
        useHash = !!item
      }
    }
    out.push('{\n')
    if (alias) {
      out.push(' alias:' + ' ' + JSON.stringify(alias) + ',\n')
    }
    out.push(
      '  script: function (' +
        contextName +
        ', _content, partial, slot, options){\n' +
        '    var {applyIndent, escapeIt} = options\n' +
        '    \n',
    )
    if (noContent) {
      out.push(
        '\n' +
          '    function content(blockName, ctx) {\n' +
          '      if(ctx === undefined || ctx === null) ctx =' +
          ' ' +
          contextName +
          '\n' +
          '      return _content(blockName, ctx, content, partial, slot)\n' +
          '    }\n' +
          '    \n',
      )
    }
    out.push('\n' + '    \n')
    if (useChunks) {
      out.push(
        '\n' +
          '    const _partial = partial\n' +
          '    partial = function(obj, template) {\n' +
          '      const result = _partial(obj, template)\n' +
          '      if(Array.isArray(result)){\n' +
          '        result.forEach(r => {\n' +
          '          chunkEnsure(r.name, r.content)\n' +
          '        })\n' +
          "        return ''\n" +
          '      } else {\n' +
          '        return result\n' +
          '      }\n' +
          '    }\n' +
          "    const main = '" +
          useChunks +
          "'\n" +
          '    var current = main\n' +
          '    let outStack = [current]\n' +
          '    let result\n' +
          '\n' +
          '    function chunkEnsure(name, content) {\n' +
          '      if (!result) {\n' +
          '        result = {}\n' +
          '      }\n' +
          '      if (!result.hasOwnProperty(name)) {\n' +
          '        result[name] = content ? content : []\n' +
          '      }\n' +
          '    }\n' +
          '    function chunkStart(name) {\n' +
          '      chunkEnsure(name)\n' +
          '      chunkEnd()\n' +
          '      current = name\n' +
          '      out = []\n' +
          '    }\n' +
          '    function chunkEnd() {\n' +
          '      result[current].push(out)\n' +
          '      out = []\n' +
          '      current = outStack.pop() || main\n' +
          '    }\n' +
          '\n' +
          '    \n',
      )
    }
    out.push('\n' + '    var out = []\n' + '    \n')
    if (useChunks) {
      out.push('\n' + '      chunkStart(main)\n' + '    \n')
    }
    var blocks = {
      blocks: context.main,
      noIndent: noIndent,
    }
    out.push('    ' + partial(blocks, 'codeblock') + '\n' + '    \n')
    if (useChunks) {
      out.push('\n' + '      chunkEnd()\n' + '      \n')
      if (!useHash) {
        out.push('\n' + '        out = Object.keys(result)\n' + '        \n')
        if (!inludeMainchunkInOutput) {
          out.push(
            '\n' +
              "        .filter(i => i !== '" +
              useChunks +
              "')\n" +
              '        \n',
          )
        }
        out.push(
          '\n' +
            '        .map(curr => ({ name: curr, content: result[curr] }))\n' +
            '      \n',
        )
      } else {
        out.push('\n' + '        out = result\n' + '        \n')
        if (!inludeMainchunkInOutput) {
          out.push(
            '\n' + "        delete out['" + useChunks + "']\n" + '        \n',
          )
        }
        out.push('\n' + '      \n')
      }
      out.push('\n' + '    \n')
    }
    out.push('\n' + "     return out.join('\\n')\n" + '  },\n' + '\n')
    var cb = context.blocks
    if (cb) {
      out.push('  blocks : {\n' + '\n')
      for (var cbn in cb) {
        var blockConetxtName = contextName
        var bdirvs = cb[cbn].directives
        var item = bdirvs[i]
        var blkNoIndent = false
        for (var i = 0, len = bdirvs.length; i < len; i++) {
          item = bdirvs[i]
          if (item.name === 'context') {
            blockConetxtName = item.params[0]
          }
          if (item.name === 'noIndent') {
            blkNoIndent = true
          }
        }
        out.push(
          '    "' +
            cbn +
            '": function(' +
            blockConetxtName +
            ',  _content, partial, slot, options){\n' +
            '      \n',
        )
        if (noContent) {
          out.push(
            '\n' +
              '      function content(blockName, ctx) {\n' +
              '        if(ctx === undefined || ctx === null) ctx =' +
              ' ' +
              contextName +
              '\n' +
              '        return _content(blockName, ctx, content, partial, slot)\n' +
              '      }\n' +
              '      \n',
          )
        }
        out.push(
          '\n' +
            '      var {applyIndent, escapeIt} = options\n' +
            '      var out = []\n',
        )
        var blocks = {
          blocks: cb[cbn].main,
          noIndent: blkNoIndent,
        }
        out.push(
          '      ' +
            partial(blocks, 'codeblock') +
            '\n' +
            "      return out.join('\\n')\n" +
            '    },\n' +
            '\n',
        )
      }
      out.push('  },\n')
    }
    var cb = context.slots
    if (cb) {
      out.push('  slots : {\n' + '\n')
      for (var cbn in cb) {
        var blockConetxtName = contextName
        var bdirvs = cb[cbn].directives
        var item = bdirvs[i]
        var blkNoIndent = false
        for (var i = 0, len = bdirvs.length; i < len; i++) {
          item = bdirvs[i]
          if (item.name === 'context') {
            blockConetxtName = item.params[0]
          }
          if (item.name === 'noIndent') {
            blkNoIndent = true
          }
        }
        out.push(
          '    "' +
            cbn +
            '": function(' +
            blockConetxtName +
            ',  _content, partial, slot){\n' +
            '      function content(blockName, ctx) {\n' +
            '        if(ctx === undefined || ctx === null) ctx =' +
            ' ' +
            contextName +
            '\n' +
            '        return _content(blockName, ctx, content, partial, slot)\n' +
            '      }\n' +
            '      var out = []\n',
        )
        var blocks = {
          blocks: cb[cbn].main,
          noIndent: blkNoIndent,
        }
        out.push(
          '      ' +
            partial(blocks, 'codeblock') +
            '\n' +
            "      return out.join('\\n')\n" +
            '    },\n' +
            '\n',
        )
      }
      out.push('  },\n')
    }
    out.push('  compile: function() {\n')
    if (alias) {
      out.push('\n' + '    this.alias =' + ' ' + JSON.stringify(alias))
    }
    if (reqList.length > 0) {
      out.push('    this.aliases={}\n' + '\n')
      var rq
      for (var i = 0, len = reqList.length; i < len; i++) {
        rq = reqList[i]
        out.push(
          '    this.aliases["' +
            rq.alias +
            '"] = "' +
            rq.name +
            '"\n' +
            '    this.factory.ensure("' +
            rq.name +
            '")\n' +
            '\n',
        )
      }
    }
    if (extend) {
      out.push(
        '\n' +
          '    this.parent =' +
          ' ' +
          JSON.stringify(extend) +
          '\n' +
          '    this.mergeParent(this.factory.ensure(this.parent))\n' +
          '\n',
      )
    }
    out.push('  },\n' + '  dependency: {\n' + '  \n')
    if (extend) {
      out.push('    ' + JSON.stringify(extend) + ': 1,\n' + '  \n')
    }
    if (reqList.length > 0) {
      for (var i = 0, len = reqList.length; i < len; i++) {
        rq = reqList[i]
        out.push('    "' + rq.name + '": 1,\n' + '\n')
      }
    }
    out.push('  }\n' + '}\n' + '\n')
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

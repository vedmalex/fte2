module.exports = {
  alias: ['MainTemplate.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push('\n' + '' + '\n' + '' + '\n' + '\n')
    const { directives, blocks } = context
    out.push('\n' + '{\n' + '\n')
    if (directives.alias) {
      out.push(
        '\n' + 'alias: ' + JSON.stringify(directives.alias) + ',\n' + '\n',
      )
    }
    out.push(
      '\n' +
        '\n' +
        '' +
        '\n' +
        '' +
        '\n' +
        '' +
        '\n' +
        '  script: function (' +
        directives.context +
        ', _content, partial, slot, options){\n' +
        '    ' +
        content('maincontent', directives) +
        '\n' +
        '    var out = []\n' +
        '    ' +
        content('chunks-start', directives) +
        '\n' +
        '    ' +
        partial(context.main, 'codeblock') +
        '\n' +
        '    ' +
        content('chunks-finish', directives) +
        '\n' +
        "     return out.join('\\n')\n" +
        '  },\n' +
        '\n',
    )
    const blockNames = Object.keys(context.blocks)
    if (blockNames.length > 0) {
      out.push('\n' + '  blocks : {\n' + '\n')
      for (let i = 0; i < blockNames.length; i += 1) {
        const block = context.blocks[blockNames[i]]
        out.push(
          '\n' +
            '    "' +
            blockNames[i] +
            '": function(' +
            block.directives.context +
            ',  _content, partial, slot, options) {\n' +
            '      ' +
            content('maincontent', block.directives) +
            '\n' +
            '      var out = []\n' +
            '      ' +
            partial(block.main, 'codeblock') +
            '\n' +
            "      return out.join('\\n')\n" +
            '    },\n' +
            '\n',
        )
      }
      out.push('\n' + '  },\n' + '\n')
    }
    out.push('\n' + '\n')
    const slotNames = Object.keys(context.slots)
    if (slotNames.length > 0) {
      out.push('\n' + '  slots : {\n' + '\n')
      for (let i = 0; i < slotNames.length; i += 1) {
        const slot = context.blocks[slotNames[i]]
        out.push(
          '\n' +
            '    "' +
            slotNames[i] +
            '": function(' +
            slot.directives.context +
            ',  _content, partial, slot, options){\n' +
            '      ' +
            content('maincontent', slot.directives) +
            '\n' +
            '      var out = []\n' +
            '      ' +
            partial(slot.main, 'codeblock') +
            '\n' +
            "      return out.join('\\n')\n" +
            '    },\n' +
            '\n',
        )
      }
      out.push('\n' + '  },\n' + '\n')
    }
    out.push('\n' + '  compile: function() {\n' + '\n')
    if (directives.alias) {
      out.push(
        '\n' +
          '    this.alias = ' +
          JSON.stringify(directives.alias) +
          '\n' +
          '\n',
      )
    }
    out.push('\n' + '\n')
    if (directives.requireAs.length > 0) {
      out.push('\n' + '    this.aliases={}\n' + '\n')
      var rq
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push(
          '\n' +
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
    out.push('\n' + '\n' + '\n')
    if (directives.extend) {
      out.push(
        '\n' +
          '    this.parent = ' +
          JSON.stringify(directives.extend) +
          '\n' +
          '    this.mergeParent(this.factory.ensure(this.parent))\n' +
          '\n',
      )
    }
    out.push('\n' + '  },\n' + '  dependency: {\n' + '  \n')
    if (directives.extend) {
      out.push(
        '\n' + '    ' + JSON.stringify(directives.extend) + ': 1,\n' + '  \n',
      )
    }
    out.push('\n' + '\n')
    if (directives.requireAs.length > 0) {
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push(
          '\n' +
            '    "' +
            rq.name +
            '": 1,\n' +
            '    "' +
            rq.alias +
            '": 1,\n' +
            '\n',
        )
      }
    }
    out.push('\n' + '  }\n' + '}\n' + '\n')
    return out.join('\n')
  },
  blocks: {
    maincontent: function (directives, _content, partial, slot, options) {
      const { escapeIt } = options
      function content(blockName, ctx) {
        if (ctx === undefined || ctx === null) ctx = directives
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push('\n' + '' + '\n' + '  \n')
      if (directives.escapeIt) {
        out.push('\n' + '    const {escapeIt} = options\n' + '  \n')
      }
      out.push('\n' + '\n' + '  \n')
      if (directives.content) {
        out.push(
          '\n' +
            '    function content(blockName, ctx) {\n' +
            '      if(ctx === undefined || ctx === null) ctx = ' +
            directives.context +
            '\n' +
            '      return _content(blockName, ctx, content, partial, slot)\n' +
            '    }\n' +
            '  \n',
        )
      }
      out.push('\n' + '\n')
      return out.join('\n')
    },
    'chunks-start': function (directives, _content, partial, slot, options) {
      const { escapeIt } = options
      function content(blockName, ctx) {
        if (ctx === undefined || ctx === null) ctx = directives
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push('\n' + '  ' + '\n' + '  \n')
      if (directives.chunks) {
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
            directives.chunks +
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
            '    chunkStart(main)\n' +
            '  \n',
        )
      }
      out.push('\n' + '\n')
      return out.join('\n')
    },
    'chunks-finish': function (directives, _content, partial, slot, options) {
      const { escapeIt } = options
      function content(blockName, ctx) {
        if (ctx === undefined || ctx === null) ctx = directives
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push('\n' + '  ' + '\n' + '  \n')
      if (directives.chunks) {
        out.push('\n' + '    chunkEnd()\n' + '    \n')
        if (!useHash) {
          out.push('\n' + '    out = Object.keys(result)\n' + '      \n')
          if (!directives.includeMainChunk) {
            out.push(
              '\n' +
                "      .filter(i => i !== '" +
                directives.chunks +
                "')\n" +
                '      \n',
            )
          }
          out.push(
            '\n' +
              '      .map(curr => ({ name: curr, content: result[curr] }))\n' +
              '      \n',
          )
        } else {
          out.push('\n' + '    out = result\n' + '      \n')
          if (!directives.includeMainChunk) {
            out.push(
              '\n' +
                "    delete out['" +
                directives.chunks +
                "']\n" +
                '      \n',
            )
          }
          out.push('\n' + '    \n')
        }
        out.push('\n' + '  \n')
      }
      out.push('\n' + '\n')
      return out.join('\n')
    },
  },
  compile: function () {
    this.alias = ['MainTemplate.njs']
    this.aliases = {}
    this.aliases['codeblock'] = 'codeblock.njs'
    this.factory.ensure('codeblock.njs')
  },
  dependency: {
    'codeblock.njs': 1,
    codeblock: 1,
  },
}

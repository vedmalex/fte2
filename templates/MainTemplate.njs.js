module.exports = {
  alias: ['MainTemplate.njs'],
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    const { directives, blocks } = context
    out.push('{')
    if (directives.alias) {
      out.push('alias: ' + JSON.stringify(directives.alias) + ',')
    }
    out.push(
      '  script: function (' +
        directives.context +
        ', _content, partial, slot, options){',
    )
    out.push('    ' + content('maincontent', directives))
    out.push('    var out = []')
    out.push('    ' + content('chunks-start', directives))
    out.push('    ' + partial(context.main, 'codeblock'))
    out.push('    ' + content('chunks-finish', directives))
    out.push("     return out.join('\\n')")
    out.push('  },')
    const blockNames = Object.keys(context.blocks)
    if (blockNames.length > 0) {
      out.push('  blocks : {')
      for (let i = 0; i < blockNames.length; i += 1) {
        const block = context.blocks[blockNames[i]]
        out.push(
          '    "' +
            blockNames[i] +
            '": function(' +
            block.directives.context +
            ',  _content, partial, slot, options) {',
        )
        out.push('      ' + content('maincontent', block.directives))
        out.push('      var out = []')
        out.push('      ' + partial(block.main, 'codeblock'))
        out.push("      return out.join('\\n')")
        out.push('    },')
      }
      out.push('  },')
    }
    const slotNames = Object.keys(context.slots)
    if (slotNames.length > 0) {
      out.push('  slots : {')
      for (let i = 0; i < slotNames.length; i += 1) {
        const slot = context.blocks[slotNames[i]]
        out.push(
          '    "' +
            slotNames[i] +
            '": function(' +
            slot.directives.context +
            ',  _content, partial, slot, options){',
        )
        out.push('      ' + content('maincontent', slot.directives))
        out.push('      var out = []')
        out.push('      ' + partial(slot.main, 'codeblock'))
        out.push("      return out.join('\\n')")
        out.push('    },')
      }
      out.push('  },')
    }
    out.push('  compile: function() {')
    if (directives.alias) {
      out.push('    this.alias = ' + JSON.stringify(directives.alias))
    }
    if (directives.requireAs.length > 0) {
      out.push('    this.aliases={}')
      var rq
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('    this.aliases["' + rq.alias + '"] = "' + rq.name + '"')
        out.push('    this.factory.ensure("' + rq.name + '")')
      }
    }
    if (directives.extend) {
      out.push('    this.parent = ' + JSON.stringify(directives.extend))
      out.push('    this.mergeParent(this.factory.ensure(this.parent))')
    }
    out.push('  },')
    out.push('  dependency: {')
    out.push('  ')
    if (directives.extend) {
      out.push(JSON.stringify(directives.extend) + ': 1,')
      out.push('  ')
    }
    if (directives.requireAs.length > 0) {
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('    "' + rq.name + '": 1,')
        out.push('    "' + rq.alias + '": 1,')
      }
    }
    out.push('  }')
    out.push('}')
    return out.join('\n')
  },
  blocks: {
    maincontent: function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.escapeIt) {
        out.push('    const {escapeIt} = options')
        out.push('  ')
      }
      out.push('  ')
      if (directives.content) {
        out.push('    function content(blockName, ctx) {')
        out.push(
          '      if(ctx === undefined || ctx === null) ctx = ' +
            directives.context,
        )
        out.push(
          '      return _content(blockName, ctx, content, partial, slot)',
        )
        out.push('    }')
        out.push('  ')
      }
      return out.join('\n')
    },
    'chunks-start': function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.chunks) {
        out.push('    const _partial = partial')
        out.push('    partial = function(obj, template) {')
        out.push('      const result = _partial(obj, template)')
        out.push('      if(Array.isArray(result)){')
        out.push('        result.forEach(r => {')
        out.push('          chunkEnsure(r.name, r.content)')
        out.push('        })')
        out.push("        return ''")
        out.push('      } else {')
        out.push('        return result')
        out.push('      }')
        out.push('    }')
        out.push("    const main = '" + directives.chunks + "'")
        out.push('    var current = main')
        out.push('    let outStack = [current]')
        out.push('    let result')
        out.push('    function chunkEnsure(name, content) {')
        out.push('      if (!result) {')
        out.push('        result = {}')
        out.push('      }')
        out.push('      if (!result.hasOwnProperty(name)) {')
        out.push('        result[name] = content ? content : []')
        out.push('      }')
        out.push('    }')
        out.push('    function chunkStart(name) {')
        out.push('      chunkEnsure(name)')
        out.push('      chunkEnd()')
        out.push('      current = name')
        out.push('      out = []')
        out.push('    }')
        out.push('    function chunkEnd() {')
        out.push('      result[current].push(out)')
        out.push('      out = []')
        out.push('      current = outStack.pop() || main')
        out.push('    }')
        out.push('    chunkStart(main)')
        out.push('  ')
      }
      return out.join('\n')
    },
    'chunks-finish': function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.chunks) {
        out.push('    chunkEnd()')
        out.push('    ')
        if (!useHash) {
          out.push('    out = Object.keys(result)')
          out.push('      ')
          if (!directives.includeMainChunk) {
            out.push("      .filter(i => i !== '" + directives.chunks + "')")
            out.push('      ')
          }
          out.push(
            '      .map(curr => ({ name: curr, content: result[curr] }))',
          )
          out.push('      ')
        } else {
          out.push('    out = result')
          out.push('      ')
          if (!directives.includeMainChunk) {
            out.push("    delete out['" + directives.chunks + "']")
            out.push('      ')
          }
          out.push('    ')
        }
        out.push('  ')
      }
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

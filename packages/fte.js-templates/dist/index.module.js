var codeblock_njs = {
  alias: ['codeblock.njs'],
  script: function (blockList, _content, partial, slot, options) {
    var out = []
    var textQuote = false
    do {
      const cur = blockList.shift()
      if (cur.type !== 'empty' || (cur.type === 'text' && cur.content.trim())) {
        blockList.unshift(cur)
        break
      }
      if (blockList.length == 0) break
    } while (true)
    do {
      const cur = blockList.pop()
      if (cur.type !== 'empty' || (cur.type === 'text' && cur.content.trim())) {
        blockList.push(cur)
        break
      }
      if (blockList.length == 0) break
    } while (true)
    blockList[blockList.length - 1].eol = false
    for (var i = 0, len = blockList.length; i < len; i++) {
      var last = i === blockList.length - 1
      var block = blockList[i]
      var next = i + 1 < len ? blockList[i + 1] : null
      var cont = block === null || block === void 0 ? void 0 : block.content
      switch (block.type) {
        case 'text':
          {
            let res = ''
            if (!textQuote) {
              textQuote = true
              res = 'out.push('
            } else {
              let lasItem = out.pop()
              res = lasItem + ' + '
            }
            if (!block.eol) {
              res += JSON.stringify(cont)
            } else {
              res += JSON.stringify(cont + '\n')
              res += ');' + (last ? '' : '\n')
              textQuote = false
            }
            out.push(res)
          }
          break
        case 'uexpression':
          {
            let res = ''
            if (!textQuote) {
              textQuote = true
              res = 'out.push('
            } else {
              let lasItem = out.pop()
              res = lasItem + ' + '
            }
            let lcont = 'options.escapeIt(' + cont + ')'
            if (block.indent) {
              lcont = 'options.applyIndent(' + lcont + ", '" + block.indent + "')"
            }
            if (block.start && block.end) {
              res += '(' + lcont + ')'
            } else if (block.start) {
              res += '(' + lcont
            } else if (block.end) {
              res += lcont + ')'
            } else {
              res += lcont
            }
            if (!block.eol) {
              out.push(res)
            } else {
              out.push(res + ');' + (last ? '' : '\n'))
              textQuote = false
            }
          }
          break
        case 'expression':
          {
            let res = ''
            if (!textQuote) {
              textQuote = true
              res = 'out.push('
            } else {
              if (block.start) {
                let lasItem = out.pop()
                res = lasItem + ' + '
              }
            }
            if (block.indent) {
              cont = 'options.applyIndent(' + cont + ", '" + block.indent + "')"
            }
            if (block.start && block.end) {
              res += '(' + cont + ')'
            } else if (block.start) {
              res += '(' + cont
            } else if (block.end) {
              res += cont + ')'
            } else {
              res += cont
            }
            if (!block.eol) {
              out.push(res)
            } else {
              out.push(res + ');' + (last ? '' : '\n'))
              textQuote = false
            }
          }
          break
        case 'code':
          if (textQuote) {
            let item = out.pop()
            out.push(item + ');\n')
            textQuote = false
          }
          out.push(cont + (block.eol || (next === null || next === void 0 ? void 0 : next.type) != 'code' ? '\n' : ''))
          break
      }
    }
    if (textQuote) {
      let lasItem = out.pop()
      out.push(lasItem + ');')
    }
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var compilationError_njs = {
  alias: ['compilationError.njs'],
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push(context.error.message + ';\n')
    out.push(context.compiledFile + ';')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var compiled_njs = {
  alias: ['compiled.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('module.exports = ' + partial(context, 'core') + ';')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}

var es6module_njs = {
  alias: ['es6module.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('export default ' + partial(context, 'core') + ';')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}

var es6module_ts_njs = {
  alias: ['es6module.njs'],
  aliases: {
    core: 'MainTemplate.ts.njs',
  },
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('export default ' + partial(context, 'core') + ';')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.ts.njs')
  },
  dependency: {
    'MainTemplate.ts.njs': true,
    core: true,
  },
}

var MainTemplate_njs = {
  alias: ['MainTemplate.njs'],
  aliases: {
    codeblock: 'codeblock.njs',
  },
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    const { directives } = context
    out.push('{')
    if (directives.chunks) {
      out.push('\n')
      out.push('chunks: ' + JSON.stringify(directives.chunks) + ',')
    }
    if (directives.alias) {
      out.push('\n')
      out.push('alias: ' + JSON.stringify(directives.alias) + ',')
    }
    out.push('\n')
    out.push('\n')
    out.push('script: function (' + directives.context + ', _content, partial, slot, options){\n')
    out.push(options.applyIndent(content('maincontent', directives), '    ') + '\n')
    out.push('    var out = []\n')
    out.push(options.applyIndent(content('chunks-start', directives), '    ') + '\n')
    out.push(options.applyIndent(partial(context.main, 'codeblock'), '    ') + '\n')
    out.push(options.applyIndent(content('chunks-finish', directives), '    '))
    if (directives.chunks) {
      out.push('\n')
      out.push("    if(out.some(t=>typeof t == 'object')){\n")
      out.push('      return out.map(chunk=>(\n')
      out.push('          {...chunk,\n')
      out.push('            content:')
      if (directives.deindent) {
        out.push(' options.applyDeindent(')
      }
      out.push('\n')
      out.push('            Array.isArray(chunk.content)\n')
      out.push("              ? chunk.content.join('')\n")
      out.push('              : chunk.content')
      if (directives.deindent) {
        out.push(')')
      }
      out.push('\n')
      out.push('          }\n')
      out.push('        )\n')
      out.push('      )\n')
      out.push('    } else {\n')
      out.push('      return ')
      if (directives.deindent) {
        out.push(' options.applyDeindent(')
      }
      out.push('out')
      if (directives.deindent) {
        out.push(')')
      }
      out.push(".join('')\n")
      out.push('    }')
    } else {
      out.push('\n')
      out.push('      return ')
      if (directives.deindent) {
        out.push(' options.applyDeindent(')
      }
      out.push('out')
      if (directives.deindent) {
        out.push(')')
      }
      out.push(".join('')")
    }
    out.push('\n')
    out.push('  },')
    const blockNames = Object.keys(context.blocks)
    if (blockNames.length > 0) {
      out.push('\n')
      out.push('  blocks : {')
      for (let i = 0; i < blockNames.length; i += 1) {
        const block = context.blocks[blockNames[i]]
        out.push('\n')
        out.push(
          '    "' +
            blockNames[i] +
            '": function(' +
            block.directives.context +
            ',  _content, partial, slot, options) {\n',
        )
        out.push(options.applyIndent(content('maincontent', block.directives), '      ') + '\n')
        out.push('      var out = []\n')
        out.push(options.applyIndent(partial(block.main, 'codeblock'), '      '))
        if (directives.chunks) {
          out.push('\n')
          out.push("      if(out.some(t=>typeof t == 'object')){\n")
          out.push('        return out.map(chunk=>(\n')
          out.push('            {...chunk,\n')
          out.push('              content:')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('\n')
          out.push('              Array.isArray(chunk.content)\n')
          out.push("                ? chunk.content.join('')\n")
          out.push('                : chunk.content')
          if (directives.deindent) {
            out.push(')')
          }
          out.push('\n')
          out.push('            }\n')
          out.push('          )\n')
          out.push('        )\n')
          out.push('      } else {\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')\n")
          out.push('      }')
        } else {
          out.push('\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')")
        }
        out.push('\n')
        out.push('    },')
      }
      out.push('\n')
      out.push('  },')
    }
    const slotNames = Object.keys(context.slots)
    if (slotNames.length > 0) {
      out.push('\n')
      out.push('  slots : {')
      for (let i = 0; i < slotNames.length; i += 1) {
        const slot = context.blocks[slotNames[i]]
        out.push('\n')
        out.push(
          '    "' + slotNames[i] + '": function(' + slot.directives.context + ',  _content, partial, slot, options){\n',
        )
        out.push(options.applyIndent(content('maincontent', slot.directives), '      ') + '\n')
        out.push('      var out = []\n')
        out.push(options.applyIndent(partial(slot.main, 'codeblock'), '      '))
        if (directives.chunks) {
          out.push('\n')
          out.push("      if(out.some(t=>typeof t == 'object')){\n")
          out.push('        return out.map(chunk=>(\n')
          out.push('            {...chunk,\n')
          out.push('              content:')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('\n')
          out.push('              Array.isArray(chunk.content)\n')
          out.push("                ? chunk.content.join('')\n")
          out.push('                : chunk.content')
          if (directives.deindent) {
            out.push(')')
          }
          out.push('\n')
          out.push('            }\n')
          out.push('          )\n')
          out.push('        )\n')
          out.push('      } else {\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')\n")
          out.push('      }')
        } else {
          out.push('\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')")
        }
        out.push('\n')
        out.push('    },')
      }
      out.push('\n')
      out.push('  },')
    }
    out.push('\n')
    out.push('  compile: function() {')
    if (directives.alias) {
      out.push('\n')
      out.push('    this.alias = ' + JSON.stringify(directives.alias))
    }
    if (directives.requireAs.length > 0) {
      out.push('\n')
      out.push('    this.aliases={}')
      var rq
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('\n')
        out.push('    this.aliases["' + rq.alias + '"] = "' + rq.name + '"\n')
        out.push('    this.factory.ensure("' + rq.name + '")')
      }
    }
    if (directives.extend) {
      out.push('\n')
      out.push('    this.parent = ' + JSON.stringify(directives.extend) + '\n')
      out.push('    this.mergeParent(this.factory.ensure(this.parent))')
    }
    out.push('\n')
    out.push('  },\n')
    out.push('  dependency: {')
    if (directives.extend) {
      out.push('\n')
      out.push(options.applyIndent(JSON.stringify(directives.extend), '    ') + ': true,')
    }
    if (directives.requireAs.length > 0) {
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('\n')
        out.push('    "' + rq.name + '": true,\n')
        out.push('    "' + rq.alias + '": true,')
      }
    }
    out.push('\n')
    out.push('  }\n')
    out.push('}')
    return out.join('')
  },
  blocks: {
    maincontent: function (directives, _content, partial, slot, options) {
      var out = []
      if (directives === null || directives === void 0 ? void 0 : directives.content) {
        out.push('function content(blockName, ctx) {\n')
        out.push('  if(ctx === undefined || ctx === null) ctx = ' + directives.context + '\n')
        out.push('  return _content(blockName, ctx, content, partial, slot)\n')
        out.push('}')
      }
      out.push('')
      return out.join('')
    },
    'chunks-start': function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.chunks) {
        out.push('\n')
        out.push('const _partial = partial\n')
        out.push('partial = function(obj, template) {\n')
        out.push('  const result = _partial(obj, template)\n')
        out.push('  if(Array.isArray(result)){\n')
        out.push('    result.forEach(r => {\n')
        out.push('      chunkEnsure(r.name, r.content)\n')
        out.push('    })\n')
        out.push("    return ''\n")
        out.push('  } else {\n')
        out.push('    return result\n')
        out.push('  }\n')
        out.push('}\n')
        out.push("const main = '" + directives.chunks + "'\n")
        out.push('var current = main\n')
        out.push('let outStack = [current]\n')
        out.push('let result\n')
        out.push('\n')
        out.push('function chunkEnsure(name, content) {\n')
        out.push('  if (!result) {\n')
        out.push('    result = {}\n')
        out.push('  }\n')
        out.push('  if (!result.hasOwnProperty(name)) {\n')
        out.push('    result[name] = content ? content : []\n')
        out.push('  }\n')
        out.push('}\n')
        out.push('function chunkStart(name) {\n')
        out.push('  chunkEnsure(name)\n')
        out.push('  chunkEnd()\n')
        out.push('  current = name\n')
        out.push('  out = []\n')
        out.push('}\n')
        out.push('function chunkEnd() {\n')
        out.push('  result[current].push(...out)\n')
        out.push('  out = []\n')
        out.push('  current = outStack.pop() || main\n')
        out.push('}\n')
        out.push('chunkStart(main)')
      }
      out.push('')
      return out.join('')
    },
    'chunks-finish': function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.chunks) {
        out.push('\n')
        out.push('    chunkEnd()')
        if (!directives.useHash) {
          out.push('\n')
          out.push('    out = Object.keys(result)')
          if (!directives.includeMainChunk) {
            out.push('\n')
            out.push("      .filter(i => i !== '" + directives.chunks + "')")
          }
          out.push('\n')
          out.push('      .map(curr => ({ name: curr, content: result[curr] }))')
        } else {
          out.push('\n')
          out.push('    out = result')
          if (!directives.includeMainChunk) {
            out.push('\n')
            out.push("    delete out['" + directives.chunks + "']")
          }
        }
      }
      out.push('')
      return out.join('')
    },
  },
  compile: function () {
    this.factory.ensure('codeblock.njs')
  },
  dependency: {
    'codeblock.njs': true,
    codeblock: true,
  },
}

var MainTemplate_ts_njs = {
  alias: ['MainTemplate.ts.njs'],
  aliases: {
    codeblock: 'codeblock.njs',
  },
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    const { directives } = context
    out.push('{')
    if (directives.chunks) {
      out.push('\n')
      out.push('chunks: ' + JSON.stringify(directives.chunks) + ',')
    }
    if (directives.alias) {
      out.push('\n')
      out.push('alias: ' + JSON.stringify(directives.alias) + ',')
    }
    if (directives.requireAs.length > 0) {
      out.push('\n')
      out.push('aliases: {')
      var rq
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('\n')
        out.push('    "' + rq.alias + '": "' + rq.name + '",')
      }
      out.push('\n')
      out.push('},\n')
    }
    out.push('\n')
    out.push('\n')
    out.push('script: function (' + directives.context + ', _content, partial, slot, options){\n')
    out.push(options.applyIndent(content('maincontent', directives), '    ') + '\n')
    out.push('    var out: Array<string> = []\n')
    out.push(options.applyIndent(content('chunks-start', directives), '    ') + '\n')
    out.push(options.applyIndent(partial(context.main, 'codeblock'), '    ') + '\n')
    out.push(options.applyIndent(content('chunks-finish', directives), '    '))
    if (directives.chunks) {
      out.push('\n')
      out.push("    if(out.some(t=>typeof t == 'object')){\n")
      out.push('      return out.map(chunk=>(\n')
      out.push('          {...chunk,\n')
      out.push('            content:')
      if (directives.deindent) {
        out.push(' options.applyDeindent(')
      }
      out.push('\n')
      out.push('            Array.isArray(chunk.content)\n')
      out.push("              ? chunk.content.join('')\n")
      out.push('              : chunk.content')
      if (directives.deindent) {
        out.push(')')
      }
      out.push('\n')
      out.push('          }\n')
      out.push('        )\n')
      out.push('      )\n')
      out.push('    } else {\n')
      out.push('      return ')
      if (directives.deindent) {
        out.push(' options.applyDeindent(')
      }
      out.push('out')
      if (directives.deindent) {
        out.push(')')
      }
      out.push(".join('')\n")
      out.push('    }')
    } else {
      out.push('\n')
      out.push('      return ')
      if (directives.deindent) {
        out.push(' options.applyDeindent(')
      }
      out.push('out')
      if (directives.deindent) {
        out.push(')')
      }
      out.push(".join('')")
    }
    out.push('\n')
    out.push('  },')
    const blockNames = Object.keys(context.blocks)
    if (blockNames.length > 0) {
      out.push('\n')
      out.push('  blocks : {')
      for (let i = 0; i < blockNames.length; i += 1) {
        const block = context.blocks[blockNames[i]]
        out.push('\n')
        out.push(
          '    "' +
            blockNames[i] +
            '": function(' +
            block.directives.context +
            ',  _content, partial, slot, options) {\n',
        )
        out.push(options.applyIndent(content('maincontent', block.directives), '      ') + '\n')
        out.push('      var out: Array<string> = []\n')
        out.push(options.applyIndent(partial(block.main, 'codeblock'), '      '))
        if (directives.chunks) {
          out.push('\n')
          out.push("      if(out.some(t=>typeof t == 'object')){\n")
          out.push('        return out.map(chunk=>(\n')
          out.push('            {...chunk,\n')
          out.push('              content:')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('\n')
          out.push('              Array.isArray(chunk.content)\n')
          out.push("                ? chunk.content.join('')\n")
          out.push('                : chunk.content')
          if (directives.deindent) {
            out.push(')')
          }
          out.push('\n')
          out.push('            }\n')
          out.push('          )\n')
          out.push('        )\n')
          out.push('      } else {\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')\n")
          out.push('      }')
        } else {
          out.push('\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')")
        }
        out.push('\n')
        out.push('    },')
      }
      out.push('\n')
      out.push('  },')
    }
    const slotNames = Object.keys(context.slots)
    if (slotNames.length > 0) {
      out.push('\n')
      out.push('  slots : {')
      for (let i = 0; i < slotNames.length; i += 1) {
        const slot = context.blocks[slotNames[i]]
        out.push('\n')
        out.push(
          '    "' + slotNames[i] + '": function(' + slot.directives.context + ',  _content, partial, slot, options){\n',
        )
        out.push(options.applyIndent(content('maincontent', slot.directives), '      ') + '\n')
        out.push('      var out: Array<string> = []\n')
        out.push(options.applyIndent(partial(slot.main, 'codeblock'), '      '))
        if (directives.chunks) {
          out.push('\n')
          out.push("      if(out.some(t=>typeof t == 'object')){\n")
          out.push('        return out.map(chunk=>(\n')
          out.push('            {...chunk,\n')
          out.push('              content:')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('\n')
          out.push('              Array.isArray(chunk.content)\n')
          out.push("                ? chunk.content.join('')\n")
          out.push('                : chunk.content')
          if (directives.deindent) {
            out.push(')')
          }
          out.push('\n')
          out.push('            }\n')
          out.push('          )\n')
          out.push('        )\n')
          out.push('      } else {\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')\n")
          out.push('      }')
        } else {
          out.push('\n')
          out.push('        return ')
          if (directives.deindent) {
            out.push(' options.applyDeindent(')
          }
          out.push('out')
          if (directives.deindent) {
            out.push(')')
          }
          out.push(".join('')")
        }
        out.push('\n')
        out.push('    },')
      }
      out.push('\n')
      out.push('  },')
    }
    out.push('\n')
    out.push(
      '  compile: function(this: {factory: {ensure:(template: string)=>any}, parent: string, mergeParent: (template: any)=>void}) {',
    )
    if (directives.requireAs.length > 0) {
      var rq
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('\n')
        out.push('    this.factory.ensure("' + rq.name + '")')
      }
      out.push('\n')
    }
    if (directives.extend) {
      out.push('\n')
      out.push('    this.parent = ' + JSON.stringify(directives.extend) + '\n')
      out.push('    this.mergeParent(this.factory.ensure(this.parent))')
    }
    out.push('\n')
    out.push('  },\n')
    out.push('  dependency: {')
    if (directives.extend) {
      out.push('\n')
      out.push(options.applyIndent(JSON.stringify(directives.extend), '    ') + ': true,')
    }
    if (directives.requireAs.length > 0) {
      for (var i = 0, len = directives.requireAs.length; i < len; i++) {
        rq = directives.requireAs[i]
        out.push('\n')
        out.push('    "' + rq.name + '": true,\n')
        out.push('    "' + rq.alias + '": true,')
      }
    }
    out.push('\n')
    out.push('  }\n')
    out.push('}')
    return out.join('')
  },
  blocks: {
    maincontent: function (directives, _content, partial, slot, options) {
      var out = []
      if (directives === null || directives === void 0 ? void 0 : directives.content) {
        out.push('function content<T>(blockName:string, ctx:T) {\n')
        out.push('  if(ctx === undefined || ctx === null) ctx = ' + directives.context + '\n')
        out.push('  return _content(blockName, ctx, content, partial, slot)\n')
        out.push('}')
      }
      out.push('')
      return out.join('')
    },
    'chunks-start': function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.chunks) {
        out.push('\n')
        out.push('const _partial = partial\n')
        out.push('partial = function(obj, template:string) {\n')
        out.push('  const result = _partial(obj, template)\n')
        out.push('  if(Array.isArray(result)){\n')
        out.push('    result.forEach(r => {\n')
        out.push('      chunkEnsure(r.name, r.content)\n')
        out.push('    })\n')
        out.push("    return ''\n")
        out.push('  } else {\n')
        out.push('    return result\n')
        out.push('  }\n')
        out.push('}\n')
        out.push("const main = '" + directives.chunks + "'\n")
        out.push('var current = main\n')
        out.push('let outStack = [current]\n')
        out.push('let result: Record<string, string[]>\n')
        out.push('\n')
        out.push('function chunkEnsure(name, content) {\n')
        out.push('  if (!result) {\n')
        out.push('    result = {}\n')
        out.push('  }\n')
        out.push('  if (!result.hasOwnProperty(name)) {\n')
        out.push('    result[name] = content ? content : []\n')
        out.push('  }\n')
        out.push('}\n')
        out.push('function chunkStart(name) {\n')
        out.push('  chunkEnsure(name)\n')
        out.push('  chunkEnd()\n')
        out.push('  current = name\n')
        out.push('  out = []\n')
        out.push('}\n')
        out.push('function chunkEnd() {\n')
        out.push('  result[current].push(...out)\n')
        out.push('  out = []\n')
        out.push('  current = outStack.pop() || main\n')
        out.push('}\n')
        out.push('chunkStart(main)')
      }
      out.push('')
      return out.join('')
    },
    'chunks-finish': function (directives, _content, partial, slot, options) {
      var out = []
      if (directives.chunks) {
        out.push('\n')
        out.push('    chunkEnd()')
        if (!directives.useHash) {
          out.push('\n')
          out.push('    out = Object.keys(result)')
          if (!directives.includeMainChunk) {
            out.push('\n')
            out.push("      .filter(i => i !== '" + directives.chunks + "')")
          }
          out.push('\n')
          out.push('      .map(curr => ({ name: curr, content: result[curr] }))')
        } else {
          out.push('\n')
          out.push('    out = result')
          if (!directives.includeMainChunk) {
            out.push('\n')
            out.push("    delete out['" + directives.chunks + "']")
          }
        }
      }
      out.push('')
      return out.join('')
    },
  },
  compile: function () {
    this.factory.ensure('codeblock.njs')
  },
  dependency: {
    'codeblock.njs': true,
    codeblock: true,
  },
}

var raw_njs = {
  alias: ['raw.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push('(function(){\n')
    out.push('  return ' + partial(context, 'core') + ';\n')
    out.push('})();')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}

var singlefile_es6_njs = {
  alias: ['singlefile.es6.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n")
    out.push('\n')
    out.push('export const templates = {')
    files.forEach(file => {
      out.push('\n')
      out.push("  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, 'core') + ',')
    })
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('export function run(context, name) {\n')
    out.push('  return F.run(context, name)\n')
    out.push('}\n')
    out.push('')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}

var singlefile_njs = {
  alias: ['singlefile.njs'],
  aliases: {
    core: 'MainTemplate.njs',
  },
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n")
    out.push('\n')
    out.push('const templates = {')
    files.forEach(file => {
      out.push('\n')
      out.push("  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, 'core') + ',')
    })
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('exports.templates = templates\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('function run(context, name){\n')
    out.push('  return F.run( context, name )\n')
    out.push('}\n')
    out.push('\n')
    out.push('exports.run = run')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.njs')
  },
  dependency: {
    'MainTemplate.njs': true,
    core: true,
  },
}

var singlefile_ts_njs = {
  alias: ['singlefile.ts.njs'],
  aliases: {
    core: 'MainTemplate.ts.njs',
  },
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'\n")
    out.push('\n')
    out.push('export const templates = {')
    files.forEach(file => {
      out.push('\n')
      out.push("  ['" + (file.template.alias || file.name) + "']: " + partial(file.template, 'core') + ',')
    })
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('export function run(context, name) {\n')
    out.push('  return F.run(context, name)\n')
    out.push('}\n')
    out.push('')
    return out.join('')
  },
  compile: function () {
    this.factory.ensure('MainTemplate.ts.njs')
  },
  dependency: {
    'MainTemplate.ts.njs': true,
    core: true,
  },
}

var standalone_es6_njs = {
  alias: ['standalone.es6.njs'],
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'")
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push('  import ' + files[i].name.replaceAll(/[\s\.]/g, '_') + " from '" + files[i].path + "'")
    }
    out.push('\n')
    out.push('\n')
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, '_') + ',')
    }
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('function run<T>(context:T, name:string) => {\n')
    out.push('  return F.run(context, name)\n')
    out.push('}\n')
    out.push('export default run')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var standalone_index_es6_njs = {
  alias: ['standalone.index.es6.njs'],
  script: function (files, _content, partial, slot, options) {
    var out = []
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push('  import ' + files[i].name.replaceAll(/[\s\.]/g, '_') + " from '" + files[i].path + "'")
    }
    out.push('\n')
    out.push('\n')
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, '_') + ',')
    }
    out.push('\n')
    out.push('}\n')
    out.push('export default templates')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var standalone_index_njs = {
  alias: ['standalone.index.njs'],
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': require('" + files[i].path + "'),")
    }
    out.push('\n')
    out.push('}\n')
    out.push('module.exports = templates')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var standalone_index_ts_njs = {
  alias: ['standalone.index.ts.njs'],
  script: function (files, _content, partial, slot, options) {
    var out = []
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push('  import ' + files[i].name.replaceAll(/[\s\.]/g, '_') + " from '" + files[i].path + "'")
    }
    out.push('\n')
    out.push('\n')
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, '_') + ',')
    }
    out.push('\n')
    out.push('}\n')
    out.push('export default templates')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var standalone_njs = {
  alias: ['standalone.njs'],
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push("const { Factory } = require('fte.js/lib/standalone.fte.js')\n")
    out.push('\n')
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': require('" + files[i].path + "'),")
    }
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('module.exports = (context, name) => {\n')
    out.push('  return F.run( context, name )\n')
    out.push('}')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

var standalone_ts_njs = {
  alias: ['standalone.ts.njs'],
  script: function (files, _content, partial, slot, options) {
    var out = []
    out.push("import { Factory } from 'fte.js/lib/standalone.fte.js'")
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push('  import ' + files[i].name.replaceAll(/[\s\.]/g, '_') + " from '" + files[i].path + "'")
    }
    out.push('\n')
    out.push('\n')
    out.push('const templates = {')
    for (let i = 0; i < files.length; i += 1) {
      out.push('\n')
      out.push("  '" + files[i].name + "': " + files[i].name.replaceAll(/[\s\.]/g, '_') + ',')
    }
    out.push('\n')
    out.push('}\n')
    out.push('\n')
    out.push('const F = new Factory(templates)\n')
    out.push('\n')
    out.push('function run<T>(context:T, name:string) => {\n')
    out.push('  return F.run(context, name)\n')
    out.push('}\n')
    out.push('export default run')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

const templates = {
  'codeblock.njs': codeblock_njs,
  'compilationError.njs': compilationError_njs,
  'compiled.njs': compiled_njs,
  'es6module.njs': es6module_njs,
  'es6module.ts.njs': es6module_ts_njs,
  'MainTemplate.njs': MainTemplate_njs,
  'MainTemplate.ts.njs': MainTemplate_ts_njs,
  'raw.njs': raw_njs,
  'singlefile.es6.njs': singlefile_es6_njs,
  'singlefile.njs': singlefile_njs,
  'singlefile.ts.njs': singlefile_ts_njs,
  'standalone.es6.njs': standalone_es6_njs,
  'standalone.index.es6.njs': standalone_index_es6_njs,
  'standalone.index.njs': standalone_index_njs,
  'standalone.index.ts.njs': standalone_index_ts_njs,
  'standalone.njs': standalone_njs,
  'standalone.ts.njs': standalone_ts_njs,
}

export { templates as default }
//# sourceMappingURL=index.module.js.map
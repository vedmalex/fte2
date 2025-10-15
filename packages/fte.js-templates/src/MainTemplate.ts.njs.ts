import type { TemplateBase } from 'fte.js-base'
export default {
  alias: ['MainTemplate.ts.njs'],
  aliases: {
    codeblock: 'codeblock.njs',
  },
  script: function (context, _content, partial, slot, options) {
    const templateContext = (context ?? {}) as any
    const directives = templateContext.directives ?? {}
    const contextParam =
      typeof directives.context === 'string' && directives.context.trim().length > 0
        ? directives.context
        : 'context'
    const requireAsList = Array.isArray(directives.requireAs)
      ? directives.requireAs
      : []
    const ensureRecord = (value: unknown): Record<string, any> =>
      value && typeof value === 'object' ? (value as Record<string, any>) : {}
    const ensureBlockList = (value: unknown): Array<any> =>
      Array.isArray(value) ? value : []
    const mainBlocks = ensureBlockList(templateContext.main)
    const blocks = ensureRecord(templateContext.blocks)
    const slots = ensureRecord(templateContext.slots)

    function content<T>(blockName: string, ctx: T) {
      if (ctx === undefined || ctx === null) ctx = templateContext
      return _content(blockName, ctx, content, partial, slot)
    }
    var out: Array<string> = []

    // Pass sourcemap options to partial
    const partialOptions = {
      ...options,
      sourceMap: options.sourceMap,
      sourceFile: options.sourceFile,
      sourceRoot: options.sourceRoot,
      inline: options.inline,
    } as any

    // Unwrap partial result which can be string or {code,map}
    const mainResult: any = partial(mainBlocks, 'codeblock', partialOptions)
    const mainCode: string =
      typeof mainResult === 'string' ? mainResult : mainResult.code
    out.push('{')
    if (directives.chunks) {
      out.push('\n')
      out.push('chunks: ' + JSON.stringify(directives.chunks) + ',')
    }
    if (directives.alias) {
      out.push('\n')
      out.push('alias: ' + JSON.stringify(directives.alias) + ',')
    }
    if (requireAsList.length > 0) {
      out.push('\n')
      out.push('aliases: {')
      var rq
      for (var i = 0, len = requireAsList.length; i < len; i++) {
        rq = requireAsList[i]
        out.push('\n')
        out.push('    "' + rq.alias + '": "' + rq.name + '",')
      }
      out.push('\n')
      out.push('},\n')
    }
    out.push('\n')
    out.push('\n')
    out.push(
      'script: function (' +
        contextParam +
        ', _content, partial, slot, options){\n',
    )
    out.push(
      options.applyIndent(content('maincontent', directives), '    ') + '\n',
    )
    out.push('    var out: Array<string> = []\n')
    out.push(
      options.applyIndent(content('chunks-start', directives), '    ') + '\n',
    )
    if (typeof mainCode !== 'string') {
      throw new Error(
        'MainTemplate.ts.njs: codeblock returned non-string for main',
      )
    }
    out.push(options.applyIndent(String(mainCode), '    ') + '\n')
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
    const blockNames = Object.keys(blocks)
    if (blockNames.length > 0) {
      out.push('\n')
      out.push('  blocks : {')
      for (let i = 0; i < blockNames.length; i += 1) {
        const block = blocks[blockNames[i]]
        const blockDirectives = block?.directives ?? {}
        const blockContextParam =
          typeof blockDirectives.context === 'string' &&
          blockDirectives.context.trim().length > 0
            ? blockDirectives.context
            : 'context'
        const blockMain = ensureBlockList(block?.main)
        out.push('\n')
        out.push(
          '    "' +
            blockNames[i] +
            '": function(' +
            blockContextParam +
            ',  _content, partial, slot, options) {\n',
        )
        out.push(
          options.applyIndent(
            content('maincontent', blockDirectives),
            '      ',
          ) + '\n',
        )
        out.push('      var out: Array<string> = []\n')
        const blockResult: any = partial(
          blockMain,
          'codeblock',
          partialOptions,
        )
        const blockCode: string =
          typeof blockResult === 'string' ? blockResult : blockResult.code
        if (typeof blockCode !== 'string') {
          throw new Error(
            "MainTemplate.ts.njs: codeblock returned non-string for block '" +
              blockNames[i] +
              "'",
          )
        }
        out.push(options.applyIndent(String(blockCode), '      '))
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
    const slotNames = Object.keys(slots)
    if (slotNames.length > 0) {
      out.push('\n')
      out.push('  slots : {')
      for (let i = 0; i < slotNames.length; i += 1) {
        const slot = slots[slotNames[i]]
        const slotDirectives = slot?.directives ?? {}
        const slotContextParam =
          typeof slotDirectives.context === 'string' &&
          slotDirectives.context.trim().length > 0
            ? slotDirectives.context
            : 'context'
        const slotMain = ensureBlockList(slot?.main)
        out.push('\n')
        out.push(
          '    "' +
            slotNames[i] +
            '": function(' +
            slotContextParam +
            ',  _content, partial, slot, options){\n',
        )
        out.push(
          options.applyIndent(
            content('maincontent', slotDirectives),
            '      ',
          ) + '\n',
        )
        out.push('      var out: Array<string> = []\n')
        const slotResult: any = partial(slotMain, 'codeblock', partialOptions)
        const slotCode: string =
          typeof slotResult === 'string' ? slotResult : slotResult.code
        if (typeof slotCode !== 'string') {
          throw new Error(
            "MainTemplate.ts.njs: codeblock returned non-string for slot '" +
              slotNames[i] +
              "'",
          )
        }
        out.push(options.applyIndent(String(slotCode), '      '))
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
    out.push('  compile: function(this: TemplateBase) {')
    if (directives.chunks) {
      out.push('\n')
      out.push('    this.chunks = ' + JSON.stringify(directives.chunks))
    }
    if (requireAsList.length > 0) {
      var rq
      for (var i = 0, len = requireAsList.length; i < len; i++) {
        rq = requireAsList[i]
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
      out.push(
        options.applyIndent(JSON.stringify(directives.extend), '    ') +
          ': true,',
      )
    }
    if (requireAsList.length > 0) {
      for (var i = 0, len = requireAsList.length; i < len; i++) {
        rq = requireAsList[i]
        out.push('\n')
        out.push('    "' + rq.name + '": true,\n')
        out.push('    "' + rq.alias + '": true,')
      }
    }
    out.push('\n')
    out.push('  }\n')
    out.push('}')
    const result = out.join('')
    if (mainResult && typeof mainResult !== 'string' && mainResult.map) {
      return { code: result, map: mainResult.map } as any
    }
    return { code: result } as any
  },
  blocks: {
    maincontent: function (directives, _content, partial, slot, options) {
      var out: Array<string> = []
      if (directives?.content) {
        out.push('function content<T>(blockName:string, ctx:T) {\n')
        out.push(
          '  if(ctx === undefined || ctx === null) ctx = ' +
            directives.context +
            '\n',
        )
        out.push('  return _content(blockName, ctx, content, partial, slot)\n')
        out.push('}')
      }
      out.push('')
      return out.join('')
    },
    'chunks-start': function (directives, _content, partial, slot, options) {
      var out: Array<string> = []
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
      var out: Array<string> = []
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
          out.push(
            '      .map(curr => ({ name: curr, content: result[curr] }))',
          )
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
  compile: function (this: TemplateBase) {
    this.factory.ensure('codeblock.njs')
  },
  dependency: {
    'codeblock.njs': true,
    codeblock: true,
  },
}

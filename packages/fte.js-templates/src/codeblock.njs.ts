import {
  SourceMapOptions,
  type TemplateBase,
  TemplateSourceMapGenerator,
} from 'fte.js-base'

export interface CodeBlockOptions {
  escapeIt: (str: string) => string
  applyIndent: (str: string, indent: string) => string
  sourceMap?: boolean
  sourceFile?: string
  sourceRoot?: string
  inline?: boolean
}

export default {
  alias: ['codeblock.njs'],
  script: function (
    blockList,
    _content,
    partial,
    slot,
    options: CodeBlockOptions,
  ) {
    var out: Array<string> = []
    var textQuote = false
    const asyncMode = !!(options as any)?.promise
    if (asyncMode) {
      out.push("const __isThenable = v => v && typeof v.then==='function'\n")
      out.push('const __then = (v,f) => __isThenable(v) ? v.then(f) : f(v)\n')
      out.push('const __esc = v => __then(v, options.escapeIt)\n')
      out.push(
        'const __ind = (v,i) => __then(v, x => options.applyIndent(x, i))\n',
      )
    }
    const SourceMapGeneratorCtor =
      typeof TemplateSourceMapGenerator === 'function'
        ? TemplateSourceMapGenerator
        : null
    const sourceMapGenerator =
      options.sourceMap && SourceMapGeneratorCtor
        ? new SourceMapGeneratorCtor({
            file: options.sourceFile,
            sourceRoot: options.sourceRoot,
            inline: options.inline,
          })
        : null

    let generatedLine = 1
    let generatedColumn = 0

    const addMapping = (block: any, content: string) => {
      if (!sourceMapGenerator || !block.sourceFile || !block.originalStart)
        return

      // Add mapping at current position
      sourceMapGenerator.addSegment({
        generatedLine,
        generatedColumn,
        originalLine: block.originalStart.line,
        originalColumn: block.originalStart.column,
        source: block.sourceFile,
        content: block.sourceContent,
        name: block.type,
      })

      // For each subsequent line in the emitted content, add a mapping at line start
      // This increases mapping granularity and aligns mapping lines with code lines
      const lines = content.split('\n')
      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i += 1) {
          const lineStartColumn = 0
          sourceMapGenerator.addSegment({
            generatedLine: generatedLine + i,
            generatedColumn: lineStartColumn,
            originalLine: block.originalStart.line,
            originalColumn: block.originalStart.column,
            source: block.sourceFile,
            content: block.sourceContent,
            name: block.type,
          })
        }
        generatedLine += lines.length - 1
        generatedColumn = lines[lines.length - 1].length
      } else {
        generatedColumn += content.length
      }
    }

    while (blockList.length > 0) {
      const cur = blockList[0]
      const isWhitespaceText =
        cur.type === 'text' && typeof cur.content === 'string'
          ? cur.content.trim().length === 0
          : false
      if (cur.type === 'empty' || isWhitespaceText) {
        blockList.shift()
      } else {
        break
      }
    }

    while (blockList.length > 0) {
      const cur = blockList[blockList.length - 1]
      const isWhitespaceText =
        cur.type === 'text' && typeof cur.content === 'string'
          ? cur.content.trim().length === 0
          : false
      if (cur.type === 'empty' || isWhitespaceText) {
        blockList.pop()
      } else {
        break
      }
    }
    if (blockList.length > 0) {
      blockList[blockList.length - 1].eol = false
      for (var i = 0, len = blockList.length; i < len; i++) {
        var last = i === blockList.length - 1
        var block = blockList[i]
        var next = i + 1 < len ? blockList[i + 1] : null
        var cont = block?.content
        switch (block.type) {
          case 'text':
            {
              if (asyncMode) {
                // In async mode, push each text segment separately to avoid mixing with thenables
                const content = JSON.stringify(cont + (block.eol ? '\n' : ''))
                addMapping(block, content)
                out.push('out.push(' + content + ');' + (last ? '' : '\n'))
                break
              }
              let res = ''
              if (!textQuote) {
                textQuote = true
                res = 'out.push('
              } else {
                const lasItem = out.pop()
                res = lasItem + ' + '
              }
              let content: string
              if (!block.eol) {
                content = JSON.stringify(cont)
                res += content
              } else {
                content = JSON.stringify(cont + '\n')
                res += content
                res += ');' + (last ? '' : '\n')
                textQuote = false
              }
              addMapping(block, content)
              out.push(res)
            }
            break
          case 'uexpression':
            {
              if (asyncMode) {
                let lcont = '__esc(' + cont + ')'
                if (block.indent) {
                  lcont = '__ind(' + lcont + ", '" + block.indent + "')"
                }
                const content = lcont
                addMapping(block, content)
                out.push(
                  'out.push(' + content + ');' + (block.eol ? '\n' : '\n'),
                )
                break
              }
              let res = ''
              if (!textQuote) {
                textQuote = true
                res = 'out.push('
              } else {
                const lasItem = out.pop()
                res = lasItem + ' + '
              }
              let lcont = asyncMode
                ? '__esc(' + cont + ')'
                : 'options.escapeIt(' + cont + ')'
              if (block.indent) {
                lcont = asyncMode
                  ? '__ind(' + lcont + ", '" + block.indent + "')"
                  : 'options.applyIndent(' + lcont + ", '" + block.indent + "')"
              }
              let content: string
              if (block.start && block.end) {
                content = '(' + lcont + ')'
                res += content
              } else if (block.start) {
                content = '(' + lcont
                res += content
              } else if (block.end) {
                content = lcont + ')'
                res += content
              } else {
                content = lcont
                res += content
              }
              if (!block.eol) {
                out.push(res)
              } else {
                if (block.start && block.end) {
                  out.push(res + '\n')
                } else if (block.start) {
                  out.push(res + '\n')
                } else if (block.end) {
                  out.push(res + ');' + (last ? '' : '\n'))
                  textQuote = false
                } else {
                  out.push(res + '\n')
                }
              }
              addMapping(block, content)
            }
            break
          case 'expression':
            {
              if (asyncMode) {
                if (block.indent) {
                  cont = '__ind(' + cont + ", '" + block.indent + "')"
                }
                const content = cont
                addMapping(block, content)
                out.push(
                  'out.push(' + content + ');' + (block.eol ? '\n' : '\n'),
                )
                break
              }
              let res = ''
              if (!textQuote) {
                textQuote = true
                res = 'out.push('
              } else {
                if (block.start) {
                  const lasItem = out.pop()
                  res = lasItem + ' + '
                }
              }
              if (block.indent) {
                cont = asyncMode
                  ? '__ind(' + cont + ", '" + block.indent + "')"
                  : 'options.applyIndent(' + cont + ", '" + block.indent + "')"
              }
              let content: string
              if (block.start && block.end) {
                content = '(' + cont + ')'
                res += content
              } else if (block.start) {
                content = '(' + cont
                res += content
              } else if (block.end) {
                content = cont + ')'
                res += content
              } else {
                content = cont
                res += content
              }
              if (!block.eol) {
                out.push(res)
              } else {
                if (block.start && block.end) {
                  out.push(res + '\n')
                } else if (block.start) {
                  out.push(res + '\n')
                } else if (block.end) {
                  out.push(res + ');' + (last ? '' : '\n'))
                  textQuote = false
                } else {
                  out.push(res + '\n')
                }
              }
              addMapping(block, content)
            }
            break
          case 'code': {
            if (textQuote) {
              const item = out.pop()
              out.push(item + ');\n')
              textQuote = false
            }
            const content =
              cont + (block.eol || next?.type != 'code' ? '\n' : '')
            addMapping(block, content)
            out.push(content)
            break
          }
        }
      }
    }
    if (textQuote) {
      const lasItem = out.pop()
      out.push(lasItem + ');')
    }

    let result = out.join('')

    // Добавляем source map если он включен
    if (sourceMapGenerator && options.sourceMap) {
      if (options.inline) {
        result += '\n' + sourceMapGenerator.toInlineSourceMap()
      } else if (options.sourceFile) {
        result += '\n//# sourceMappingURL=' + options.sourceFile + '.map'
      }
      return {
        code: result,
        map: sourceMapGenerator.toJSON(),
      } as any
    }

    // Без карт исходников возвращаем объект-обертку для обратной совместимости
    return {
      code: result,
    } as any
  },
  compile: function (this: TemplateBase) {},
  dependency: {},
}

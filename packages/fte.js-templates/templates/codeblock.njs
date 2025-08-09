<*
  создает струкруру блока кода
  текст или выражение
  все встраивается в MainTemplate.njs
*>
<#@ alias 'codeblock.njs' #>
<#@ noContent #>
<#@ context 'blockList' #>
const { TemplateSourceMapGenerator } = require("fte.js-base")

var textQuote = false
const sourceMapGenerator = options.sourceMap ? new TemplateSourceMapGenerator({
  file: options.sourceFile,
  sourceRoot: options.sourceRoot,
  inline: options.inline
}) : null

let generatedLine = 1
let generatedColumn = 0

function addMapping(block, content){
  if (sourceMapGenerator && block.sourceFile && block.originalStart) {
    sourceMapGenerator.addSegment({
      generatedLine,
      generatedColumn,
      originalLine: block.originalStart.line,
      originalColumn: block.originalStart.column,
      source: block.sourceFile,
      content: block.sourceContent,
      name: block.type
    })

    const lines = content.split('\n')
    if (lines.length > 1) {
      generatedLine += lines.length - 1
      generatedColumn = lines[lines.length - 1].length
    } else {
      generatedColumn += content.length
    }
  }
}

do {
  if(blockList.length == 0) break
  const cur = blockList.shift()
  if(cur.type !== 'empty' || (cur.type === 'text' && cur.content.trim())) {
    blockList.unshift(cur)
    break
  }
}
while(true)

do {
  if(blockList.length == 0) break
  const cur = blockList.pop()
  if(cur.type !== 'empty' || (cur.type === 'text' && cur.content.trim())) {
    blockList.push(cur)
    break
  }
}
while(true)
if(blockList.length > 0){
  blockList[blockList.length - 1].eol = false
  for (var i = 0, len = blockList.length; i < len; i++) {
    var last = i === blockList.length - 1
    var block = blockList[i]
    var next = (i + 1) < len ? blockList[i+1] : null
    var cont = block?.content
    switch (block.type) {
      case 'text': {
            let res = ''
            if (!textQuote) {
              textQuote = true
              res = 'out.push('
            } else {
              let lasItem = out.pop()
              res = lasItem + " + "
            }

            let content
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
      case 'uexpression': {
          let res = ''
          if (!textQuote) {
            textQuote = true
            res = 'out.push('
          } else {
            let lasItem = out.pop()
            res = lasItem + " + "
          }

          let lcont = "options.escapeIt("+cont+")"

          if(block.indent) {
            lcont = "options.applyIndent("+lcont+", '"+block.indent+"')"
          }

          let content
          if(block.start && block.end){
            content = "("+lcont+")"
            res += content
          } else if(block.start){
            content = "("+lcont
            res += content
          } else if(block.end){
            content = lcont+")"
            res += content
          } else {
            content = lcont
            res += content
          }

          //here always textQuote == true
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
      case 'expression': {
          let res = ''
          if (!textQuote) {
            textQuote = true
            res = 'out.push('
          } else {
            if(block.start){
              let lasItem = out.pop()
              res = lasItem+" + "
            }
          }

          if(block.indent) {
            cont = "options.applyIndent("+cont+", '"+block.indent+"')"
          }

          let content
          if(block.start && block.end){
            content = "("+cont+")"
            res += content
          } else if(block.start){
            content = "("+cont
            res += content
          } else if(block.end){
            content = cont+")"
            res += content
          } else {
            content = cont
            res += content
          }

          //here always textQuote == true
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
      case 'code':
        if (textQuote) {
          let item = out.pop()
          out.push(item+");\n")
          textQuote = false
        }
        const content = cont + ((block.eol || next?.type != 'code') ? '\n' : '')
        addMapping(block, content)
        out.push(content)
        break
    }
  }
}

if (textQuote) {
  let lasItem = out.pop()
  out.push(lasItem+");")
}

let result = out.join("")

if (sourceMapGenerator && options.sourceMap) {
  if (options.inline) {
    result += "\n" + sourceMapGenerator.toInlineSourceMap()
  } else if (options.sourceFile) {
    result += "\n//# sourceMappingURL=" + options.sourceFile + ".map"
  }
}

return {
  code: result,
  map: sourceMapGenerator?.toJSON()
}
#>
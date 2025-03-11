<*
  создает струкруру блока кода
  текст или выражение
  все встраивается в MainTemplate.njs
*>
<#@ alias 'codeblock.njs' #>
<#@ noContent #>
<#@ context 'blockList' #>
<#-
var textQuote = false
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

          if(block.start && block.end){
            res += "("+lcont+")"
          } else if(block.start){
            res += "("+lcont
          } else if(block.end){
            res += lcont+")"
          } else {
            res += lcont
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

          if(block.start && block.end){
            res += "("+cont+")"
          } else if(block.start){
            res += "("+cont
          } else if(block.end){
            res += cont+")"
          } else {
            res += cont
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
        }
        break
      case 'code':
        if (textQuote) {
          let item = out.pop()
          out.push(item+");\n")
          textQuote = false
        }
        out.push(cont + ((block.eol || next?.type != 'code') ? '\n' : ''))
        break
    }
  }
}

if (textQuote) {
  let lasItem = out.pop()
  out.push(lasItem+");")
}
#>
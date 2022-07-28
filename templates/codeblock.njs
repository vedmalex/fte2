<*
  создает струкруру блока кода
  текст или выражение
  все встраивается в MainTemplate.njs
*>
<#@ alias 'codeblock.njs' #>
<#@ noEscape #>
<#@ noContent #>
<#@ context 'blockList' #>
<#
var textQuote = false
for (var i = 0, len = blockList.length; i < len; i++) {
  var block = blockList[i]
  var cont = block.content
  switch (block.type) {
    case 'text':
      {
        let res = ''
        if (!textQuote) {
          textQuote = true
          res = 'out.push(\n'
        } else {
          let lasItem = out.pop()
          res = `${lasItem} + `
        }
        if (block.eol) {
          res += JSON.stringify(cont + '\n')
          res += '\n'
        //   textQuote = false
        } else {
          res += JSON.stringify(cont)
        }
        out.push(res)
      }
      break
    case 'uexpression':
      {
        let res = ''
        if (!textQuote) {
          textQuote = true
          res = 'out.push(\n'
        } else {
          let lasItem = out.pop()
          res = `${lasItem} + `
        }
        res += `escapeIt(${cont})`
        if (textQuote && !block.eol) {
          out.push(res)
        } else {
          // textQuote = false
          out.push(`${res}\n`)
        }
      }
      break
    case 'expression':
      {
        let res = ''
        if (!textQuote) {
          textQuote = true
          res = 'out.push(\n'
        } else {
          let lasItem = out.pop()
          res = `${lasItem} + `
        }
        res += `${cont}`
        if (textQuote && !block.eol) {
          out.push(res)
        } else {
          // textQuote = false
          out.push(`${res}\n`)
        }
      }
      break
    case 'code':
      if (textQuote) {
        let item = out.pop()
        out.push(`${item});\n`)
        textQuote = false
      }
      out.push(`${cont}${block.eol ? '\n' : ''}`)
      break
  }
}
if (textQuote) {
  let lasItem = out.pop()
  out.push(`${lasItem});\n`)
}
#>
module.exports = {
  alias: ['codeblock.njs'],
  script: function (blockList, _content, partial, slot, options) {
    var out = []
    out.push('\n' + '' + '\n' + '' + '\n' + '' + '\n' + '\n')
    var textQuote = false
    for (var i = 0, len = blockList.length; i < len; i++) {
      var block = blockList[i]
      var prevBlock = i - 1 >= 0 ? blockList[i - 1] : null
      var cont = block.content
      switch (block.type) {
        case 'text':
          {
            let res = ''
            if (!textQuote) {
              textQuote = true
              res = 'out.push('
            } else {
              let lasItem = out.pop()
              if (prevBlock?.type == 'text') {
                let item = lasItem.slice(0, -3)
                res = `${item}" + `
              } else {
                res = `${lasItem} + `
              }
            }
            res += `${cont
              .split('\n')
              .map(s => JSON.stringify(s + '\n'))
              .join('+ \n')}`
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
              if (prevBlock?.type == 'text') {
                let item = lasItem.slice(0, -3)
                res = `${item}" + `
              } else {
                res = `${lasItem} + `
              }
            }
            if (block.indent) {
              res += `${JSON.stringify(block.indent)} + `
            }
            res += `escapeIt(${cont})`
            if (textQuote) {
              out.push(res)
            } else {
              out.push(`${res})`)
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
              let lasItem = out.pop()
              if (prevBlock?.type == 'text') {
                let item = lasItem.slice(0, -3)
                res = `${item}" + `
              } else {
                res = `${lasItem} + `
              }
            }
            if (block.indent) {
              res += `${JSON.stringify(block.indent)} + `
            }
            res += `${cont}`
            if (textQuote) {
              out.push(res)
            } else {
              out.push(`${res})`)
            }
          }
          break
        case 'code':
          if (textQuote) {
            let item = out.pop()
            out.push(`${item})`)
            textQuote = false
          }
          if (block.indent) {
            out.push(block.indent)
          }
          out.push(cont)
          break
      }
    }
    if (textQuote) {
      out.push(')')
    }
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['codeblock.njs']
  },
  dependency: {},
}

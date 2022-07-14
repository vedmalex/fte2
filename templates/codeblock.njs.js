module.exports = {
  alias: ['codeblock.njs'],
  script: function (renderOptions, _content, partial, slot, options) {
    var { applyIndent, escapeIt } = options
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = renderOptions
      return _content(blockName, ctx, content, partial, slot)
    }
    const { SourceNode } = require('source-map-generator')
    var out = []
    var blockList = renderOptions.blocks
    var noIndent = renderOptions.noIndent
    for (var i = 0, len = blockList.length; i < len; i++) {
      var block = blockList[i]
      var contentList = block.content
      var blockIndent = block.indent && !noIndent
      var indent = ''
      if (block.indent) {
        indent = JSON.stringify(block.indent)
      }
      switch (block.type) {
        case 'text':
          contentList.forEach((cont) => {
            out.push(' out.push(')
            if (block.indent && !noIndent) {
              out.push(JSON.stringify(applyIndent(cont, block.indent)))
            } else if (indent) {
              out.push(indent)
              out.push(' +')
              out.push(' ' + JSON.stringify(cont))
            } else {
              out.push(JSON.stringify(cont))
            }
            out.push(')')
            out.push('')
          })
          break
        case 'uexpression':
          contentList.forEach((cont) => {
            out.push(' out.push(')
            if (indent && !noIndent) {
              out.push('applyIndent(escapeIt(')
              out.push(cont)
              out.push('),')
              out.push(' ' + indent)
              out.push(')')
            } else if (indent) {
              out.push(indent)
              out.push(' + escapeIt(')
              out.push(cont)
              out.push(')')
            } else {
              out.push('escapeIt(')
              out.push(cont)
              out.push(')')
            }
            out.push(')')
            out.push('')
          })
          break
        case 'expression':
          contentList.forEach((cont) => {
            out.push(' out.push(')
            if (indent && !noIndent) {
              out.push('applyIndent(')
              out.push(cont)
              out.push(',')
              out.push(' ' + indent)
              out.push(')')
            } else if (indent) {
              out.push(indent)
              out.push(' +')
              out.push(' ' + cont)
            } else {
              out.push(cont)
              out.push('')
              out.push('')
            }
            out.push(')')
            out.push('')
          })
          break
        case 'codeblock':
          contentList.forEach((cont) => {
            out.push(' ')
            if (blockIndent) {
              out.push(applyIndent(cont, block.indent))
            } else if (block.indent) {
              out.push(block.indent)
              out.push(cont)
            } else {
              out.push(cont)
            }
          })
          break
      }
    }
    return out.join('\n')
  },
  compile: function () {
    this.alias = ['codeblock.njs']
  },
  dependency: {},
}

module.exports = {
  alias: ['codeblock.njs'],
  script: function (renderOptions, _content, partial, slot) {
    var out = []
    var blockList = renderOptions.blocks
    var noIndent = renderOptions.noIndent
    function applyIndent(_str, _indent) {
      var str = String(_str)
      var indent = ''
      if (typeof _indent == 'number' && _indent > 0) {
        var res = ''
        for (var i = 0; i < _indent; i++) {
          res += ' '
        }
        indent = res
      }
      if (typeof _indent == 'string' && _indent.length > 0) {
        indent = _indent
      }
      if (indent && str) {
        return str
          .split('\n')
          .map((s) => indent + s)
          .join('\n')
      } else {
        return str
      }
    }
    for (var i = 0, len = blockList.length; i < len; i++) {
      var block = blockList[i]
      var contentList = block.content
      var blockIndent = block.indent && !noIndent
      var indent = ''
      if (block.indent) {
        indent = JSON.stringify(block.indent)
      }
      debugger
      out.push('\n\n')
      switch (block.type) {
        case 'text':
          contentList.forEach((content) => {
            out.push(' out.push(')
            if (block.indent && !noIndent) {
              out.push(JSON.stringify(applyIndent(content, block.indent)))
            } else if (indent) {
              out.push(indent)
              out.push(' +')
              out.push(' ' + JSON.stringify(content))
            } else {
              out.push(JSON.stringify(content))
            }
            out.push(');')
          })
          break
        case 'uexpression':
          contentList.forEach((content) => {
            out.push(' out.push(')
            if (indent && !noIndent) {
              out.push('applyIndent(escapeIt(')
              out.push(content)
              out.push('),')
              out.push(' ' + indent)
              out.push(')')
            } else if (indent) {
              out.push(indent)
              out.push(' + escapeIt(')
              out.push(content)
              out.push(')')
            } else {
              out.push('escapeIt(')
              out.push(content)
              out.push(')')
            }
            out.push(');')
          })
          break
        case 'expression':
          contentList.forEach((content) => {
            out.push(' out.push(')
            if (indent && !noIndent) {
              out.push('applyIndent(')
              out.push(content)
              out.push(',')
              out.push(' ' + indent)
              out.push(')\n')
            } else if (indent) {
              out.push(indent)
              out.push(' +')
              out.push(' ' + content)
              out.push('\n')
            } else {
              out.push(content)
              out.push('\n')
            }
            out.push(');')
          })
          break
        case 'codeblock':
          contentList.forEach((content) => {
            out.push(' ')
            if (blockIndent) {
              debugger
              out.push(applyIndent(content, block.indent))
            } else if (block.indent) {
              out.push(block.indent)
              out.push(content)
            } else {
              out.push(content)
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

module.exports = {
  alias: ['codeblock.njs'],
  script: function (renderOptions, _content, partial, slot) {
    var out = ''
    try {
      var line
      var column
      /*4:1*/
      line = 4
      column = 1
      out += 'try {\nvar line;\nvar column;\n'
      /*7:1*/
      line = 7
      column = 1
      var blockList = renderOptions.blocks
      var noIndent = renderOptions.noIndent
      var needToIndent = false
      if (!noIndent) {
        for (var i = 0, len = blockList.length; i < len; i++) {
          if (blockList[i].indent) {
            needToIndent = true
            break
          }
        }
      } else {
        needToIndent = !noIndent
      }
      /*22:1*/
      line = 22
      column = 1
      var escapeBlocks = false
      for (var i = 0, len = blockList.length; i < len; i++) {
        if (blockList[i].type === 'uexpression') {
          escapeBlocks = true
          break
        }
      }
      /*31:1*/
      line = 31
      column = 1
      if (escapeBlocks) {
        /*32:1*/
        line = 32
        column = 1
        out +=
          "var escapeExp = /[&<>\"]/,\n    escapeAmpExp = /&/g,\n    escapeLtExp = /</g,\n    escapeGtExp = />/g,\n    escapeQuotExp = /\"/g;\n\nfunction escapeIt (text) {\n  if (text == null) {\n    return '';\n  }\n\n  var result = text.toString();\n  if (!escapeExp.test(result)) {\n    return result;\n  }\n\n  return result.replace(escapeAmpExp, '&amp;')\n  .replace(escapeLtExp, '&lt;')\n  .replace(escapeGtExp, '&gt;')\n  .replace(escapeQuotExp, '&quot;');\n};\n"
        /*53:1*/
        line = 53
        column = 1
      }
      /*54:1*/
      line = 54
      column = 1
      if (needToIndent) {
        /*55:1*/
        line = 55
        column = 1
        out +=
          "function applyIndent(_str, _indent) {\n  var str = String(_str);\n  var indent = '';\n  if (typeof _indent == 'number' && _indent > 0) {\n    var res = '';\n    for (var i = 0; i < _indent; i++) {\n      res += ' ';\n    }\n    indent = res;\n  }\n  if (typeof _indent == 'string' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split('\\n').map((s)=> indent + s).join('\\n');\n  } else {\n    return str;\n  }\n}\n"
        /*74:1*/
        line = 74
        column = 1
      }
      /*75:1*/
      line = 75
      column = 1
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
        var content = block.content
        var blockIndent = block.indent && !noIndent
        var indent = ''
        if (block.indent) {
          indent = JSON.stringify(block.indent)
        }
        /*102:4*/
        line = 102
        column = 4
        out += '\n\n/*'
        /*104:3*/
        line = 104
        column = 3
        out += block.line
        /*104:16*/
        line = 104
        column = 16
        out += ':'
        /*104:17*/
        line = 104
        column = 17
        out += block.column
        /*104:32*/
        line = 104
        column = 32
        out += '*/\n\nline ='
        /*106:7*/
        line = 106
        column = 7
        out += ' ' + block.line
        /*106:21*/
        line = 106
        column = 21
        out += '\ncolumn ='
        /*107:9*/
        line = 107
        column = 9
        out += ' ' + block.column
        /*107:25*/
        line = 107
        column = 25
        out += '\n\n'
        /*109:1*/
        line = 109
        column = 1
        switch (block.type) {
          case 'text':
            /*112:3*/
            line = 112
            column = 3
            out += ' out +='
            /*112:10*/
            line = 112
            column = 10
            if (block.indent && !noIndent) {
              /*113:1*/
              line = 113
              column = 1
              out += JSON.stringify(applyIndent(content, block.indent))
              /*113:54*/
              line = 113
              column = 54
              out += ';'
              /*113:55*/
              line = 113
              column = 55
            } else if (indent) {
              /*115:1*/
              line = 115
              column = 1
              out += indent
              /*115:10*/
              line = 115
              column = 10
              out += ' +'
              /*115:12*/
              line = 115
              column = 12
              out += ' ' + JSON.stringify(content)
              /*115:39*/
              line = 115
              column = 39
              out += ';'
              /*115:40*/
              line = 115
              column = 40
            } else {
              /*117:1*/
              line = 117
              column = 1
              out += JSON.stringify(content)
              /*117:27*/
              line = 117
              column = 27
              out += ';'
              /*117:28*/
              line = 117
              column = 28
            }
            /*119:1*/
            line = 119
            column = 1
            break
          case 'uexpression':
            /*122:3*/
            line = 122
            column = 3
            out += ' out +='
            /*122:10*/
            line = 122
            column = 10
            if (indent && !noIndent) {
              /*123:1*/
              line = 123
              column = 1
              out += 'applyIndent(escapeIt('
              /*123:22*/
              line = 123
              column = 22
              out += content
              /*123:32*/
              line = 123
              column = 32
              out += '),'
              /*123:34*/
              line = 123
              column = 34
              out += ' ' + indent
              /*123:44*/
              line = 123
              column = 44
              out += ');'
              /*123:46*/
              line = 123
              column = 46
            } else if (indent) {
              /*125:1*/
              line = 125
              column = 1
              out += indent
              /*125:10*/
              line = 125
              column = 10
              out += ' + escapeIt('
              /*125:22*/
              line = 125
              column = 22
              out += content
              /*125:32*/
              line = 125
              column = 32
              out += ');'
              /*125:34*/
              line = 125
              column = 34
            } else {
              /*127:1*/
              line = 127
              column = 1
              out += 'escapeIt('
              /*127:10*/
              line = 127
              column = 10
              out += content
              /*127:20*/
              line = 127
              column = 20
              out += ');'
              /*127:22*/
              line = 127
              column = 22
            }
            /*129:1*/
            line = 129
            column = 1
            break
          case 'expression':
            /*132:3*/
            line = 132
            column = 3
            out += ' out +='
            /*132:10*/
            line = 132
            column = 10
            if (indent && !noIndent) {
              /*133:1*/
              line = 133
              column = 1
              out += 'applyIndent('
              /*133:13*/
              line = 133
              column = 13
              out += content
              /*133:23*/
              line = 133
              column = 23
              out += ','
              /*133:24*/
              line = 133
              column = 24
              out += ' ' + indent
              /*133:34*/
              line = 133
              column = 34
              out += ');'
              /*133:36*/
              line = 133
              column = 36
            } else if (indent) {
              /*135:1*/
              line = 135
              column = 1
              out += indent
              /*135:10*/
              line = 135
              column = 10
              out += ' +'
              /*135:12*/
              line = 135
              column = 12
              out += ' ' + content
              /*135:23*/
              line = 135
              column = 23
              out += ';'
              /*135:24*/
              line = 135
              column = 24
            } else {
              /*137:1*/
              line = 137
              column = 1
              out += content
              /*137:11*/
              line = 137
              column = 11
              out += ';\n'
              /*138:1*/
              line = 138
              column = 1
            }
            /*139:1*/
            line = 139
            column = 1
            break
          case 'codeblock':
            /*142:3*/
            line = 142
            column = 3
            out += ' '
            /*142:4*/
            line = 142
            column = 4
            if (blockIndent) {
              /*143:1*/
              line = 143
              column = 1
              out += applyIndent(content, block.indent)
              /*143:38*/
              line = 143
              column = 38
            } else if (block.indent) {
              /*145:1*/
              line = 145
              column = 1
              out += block.indent
              /*145:16*/
              line = 145
              column = 16
              out += content
              /*145:26*/
              line = 145
              column = 26
            } else {
              /*147:1*/
              line = 147
              column = 1
              out += content
              /*147:11*/
              line = 147
              column = 11
            }
            /*149:1*/
            line = 149
            column = 1
            break
        }
        /*153:1*/
        line = 153
        column = 1
      }
      /*154:1*/
      line = 154
      column = 1
      out +=
        '} catch (e) {\n  throw new Error(`\n  error at ${line}:${column}\n  message: ${e.message}\n  stack: ${e.stack}\n`)\n}'
    } catch (e) {
      throw new Error(`
       error at ${line}:${column}
       message: ${e.message}
       stack: ${e.stack}
     `)
    }
    return out
  },
  compile: function () {
    this.alias = ['codeblock.njs']
  },
  dependency: {},
}

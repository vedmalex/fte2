module.exports = {
  alias: ['codeblock.njs'],
  script: function(renderOptions, _content, partial, slot) {
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
          "function applyIndent(_str, _indent) {\n  var str = String(_str);\n  var indent = '';\n  if (typeof _indent == 'number' && _indent > 0) {\n    var res = '';\n    for (var i = 0; i < _indent; i++) {\n      res += ' ';\n    }\n    indent = res;\n  }\n  if (typeof _indent == 'string' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split('\\n').map(function (s) {\n        return indent + s;\n    }).join('\\n');\n  } else {\n    return str;\n  }\n}\n"
        /*76:1*/
        line = 76
        column = 1
      }
      /*77:1*/
      line = 77
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
            .map(function(s) {
              return indent + s
            })
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
        /*106:4*/
        line = 106
        column = 4
        out += '\n\n/*'
        /*108:3*/
        line = 108
        column = 3
        out += block.line
        /*108:16*/
        line = 108
        column = 16
        out += ':'
        /*108:17*/
        line = 108
        column = 17
        out += block.column
        /*108:32*/
        line = 108
        column = 32
        out += '*/\n\nline ='
        /*110:7*/
        line = 110
        column = 7
        out += ' ' + block.line
        /*110:21*/
        line = 110
        column = 21
        out += '\ncolumn ='
        /*111:9*/
        line = 111
        column = 9
        out += ' ' + block.column
        /*111:25*/
        line = 111
        column = 25
        out += '\n\n'
        /*113:1*/
        line = 113
        column = 1
        switch (block.type) {
          case 'text':
            /*116:3*/
            line = 116
            column = 3
            out += ' out +='
            /*116:10*/
            line = 116
            column = 10
            if (block.indent && !noIndent) {
              /*117:1*/
              line = 117
              column = 1
              out += JSON.stringify(applyIndent(content, block.indent))
              /*117:54*/
              line = 117
              column = 54
              out += ';'
              /*117:55*/
              line = 117
              column = 55
            } else if (indent) {
              /*119:1*/
              line = 119
              column = 1
              out += indent
              /*119:10*/
              line = 119
              column = 10
              out += ' +'
              /*119:12*/
              line = 119
              column = 12
              out += ' ' + JSON.stringify(content)
              /*119:39*/
              line = 119
              column = 39
              out += ';'
              /*119:40*/
              line = 119
              column = 40
            } else {
              /*121:1*/
              line = 121
              column = 1
              out += JSON.stringify(content)
              /*121:27*/
              line = 121
              column = 27
              out += ';'
              /*121:28*/
              line = 121
              column = 28
            }
            /*123:1*/
            line = 123
            column = 1
            break
          case 'uexpression':
            /*126:3*/
            line = 126
            column = 3
            out += ' out +='
            /*126:10*/
            line = 126
            column = 10
            if (indent && !noIndent) {
              /*127:1*/
              line = 127
              column = 1
              out += 'applyIndent(escapeIt('
              /*127:22*/
              line = 127
              column = 22
              out += content
              /*127:32*/
              line = 127
              column = 32
              out += '),'
              /*127:34*/
              line = 127
              column = 34
              out += ' ' + indent
              /*127:44*/
              line = 127
              column = 44
              out += ');'
              /*127:46*/
              line = 127
              column = 46
            } else if (indent) {
              /*129:1*/
              line = 129
              column = 1
              out += indent
              /*129:10*/
              line = 129
              column = 10
              out += ' + escapeIt('
              /*129:22*/
              line = 129
              column = 22
              out += content
              /*129:32*/
              line = 129
              column = 32
              out += ');'
              /*129:34*/
              line = 129
              column = 34
            } else {
              /*131:1*/
              line = 131
              column = 1
              out += 'escapeIt('
              /*131:10*/
              line = 131
              column = 10
              out += content
              /*131:20*/
              line = 131
              column = 20
              out += ');'
              /*131:22*/
              line = 131
              column = 22
            }
            /*133:1*/
            line = 133
            column = 1
            break
          case 'expression':
            /*136:3*/
            line = 136
            column = 3
            out += ' out +='
            /*136:10*/
            line = 136
            column = 10
            if (indent && !noIndent) {
              /*137:1*/
              line = 137
              column = 1
              out += 'applyIndent('
              /*137:13*/
              line = 137
              column = 13
              out += content
              /*137:23*/
              line = 137
              column = 23
              out += ','
              /*137:24*/
              line = 137
              column = 24
              out += ' ' + indent
              /*137:34*/
              line = 137
              column = 34
              out += ');'
              /*137:36*/
              line = 137
              column = 36
            } else if (indent) {
              /*139:1*/
              line = 139
              column = 1
              out += indent
              /*139:10*/
              line = 139
              column = 10
              out += ' +'
              /*139:12*/
              line = 139
              column = 12
              out += ' ' + content
              /*139:23*/
              line = 139
              column = 23
              out += ';'
              /*139:24*/
              line = 139
              column = 24
            } else {
              /*141:1*/
              line = 141
              column = 1
              out += content
              /*141:11*/
              line = 141
              column = 11
              out += ';\n'
              /*142:1*/
              line = 142
              column = 1
            }
            /*143:1*/
            line = 143
            column = 1
            break
          case 'codeblock':
            /*146:3*/
            line = 146
            column = 3
            out += ' '
            /*146:4*/
            line = 146
            column = 4
            if (blockIndent) {
              /*147:1*/
              line = 147
              column = 1
              out += applyIndent(content, block.indent)
              /*147:38*/
              line = 147
              column = 38
            } else if (block.indent) {
              /*149:1*/
              line = 149
              column = 1
              out += block.indent
              /*149:16*/
              line = 149
              column = 16
              out += content
              /*149:26*/
              line = 149
              column = 26
            } else {
              /*151:1*/
              line = 151
              column = 1
              out += content
              /*151:11*/
              line = 151
              column = 11
            }
            /*153:1*/
            line = 153
            column = 1
            break
        }
        /*157:1*/
        line = 157
        column = 1
      }
      /*158:1*/
      line = 158
      column = 1
      out +=
        '} catch (e) {\n  throw new Error(`\n  error at ${line}:${column}\n  message: ${e.message}\n  stack: ${e.stack}\n`)\n}'
    } catch (e) {
      throw new Error(
        '\n       error at ' +
          line +
          ':' +
          column +
          '\n       message: ' +
          e.message +
          '\n       stack: ' +
          e.stack +
          '\n     ',
      )
    }
    return out
  },
  compile: function() {
    this.alias = ['codeblock.njs']
  },
  dependency: {},
}

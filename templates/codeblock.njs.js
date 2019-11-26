module.exports = { alias: ["codeblock.njs"], script: function (renderOptions, _content, partial, slot) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = renderOptions;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = '';
        /*4:1*/
        var blockList = renderOptions.blocks;
        var noIndent = renderOptions.noIndent;
        var needToIndent = false;
        if (!noIndent) {
            for (var i = 0, len = blockList.length; i < len; i++) {
                if (blockList[i].indent) {
                    needToIndent = true;
                    break;
                }
            }
        }
        else {
            needToIndent = !noIndent;
        }
        /*19:1*/
        var escapeBlocks = false;
        for (var i = 0, len = blockList.length; i < len; i++) {
            if (blockList[i].type === 'uexpression') {
                escapeBlocks = true;
                break;
            }
        }
        /*28:1*/
        if (escapeBlocks) {
            /*29:1*/
            out += "var escapeExp = /[&<>\"]/,\n    escapeAmpExp = /&/g,\n    escapeLtExp = /</g,\n    escapeGtExp = />/g,\n    escapeQuotExp = /\"/g;\n\nfunction escapeIt (text) {\n  if (text == null) {\n    return '';\n  }\n\n  var result = text.toString();\n  if (!escapeExp.test(result)) {\n    return result;\n  }\n\n  return result.replace(escapeAmpExp, '&amp;')\n  .replace(escapeLtExp, '&lt;')\n  .replace(escapeGtExp, '&gt;')\n  .replace(escapeQuotExp, '&quot;');\n};\n";
            /*50:1*/
        }
        /*51:1*/
        if (needToIndent) {
            /*52:1*/
            out += "function applyIndent(_str, _indent) {\n  var str = String(_str);\n  var indent = '';\n  if (typeof _indent == 'number' && _indent > 0) {\n    var res = '';\n    for (var i = 0; i < _indent; i++) {\n      res += ' ';\n    }\n    indent = res;\n  }\n  if (typeof _indent == 'string' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split('\\n').map(function (s) {\n        return indent + s;\n    }).join('\\n');\n  } else {\n    return str;\n  }\n}\n";
            /*73:1*/
        }
        /*74:1*/
        function applyIndent(_str, _indent) {
            var str = String(_str);
            var indent = '';
            if (typeof _indent == 'number' && _indent > 0) {
                var res = '';
                for (var i = 0; i < _indent; i++) {
                    res += ' ';
                }
                indent = res;
            }
            if (typeof _indent == 'string' && _indent.length > 0) {
                indent = _indent;
            }
            if (indent && str) {
                return str.split('\n').map(function (s) {
                    return indent + s;
                }).join('\n');
            }
            else {
                return str;
            }
        }
        for (var i = 0, len = blockList.length; i < len; i++) {
            var block = blockList[i];
            var content = block.content;
            var blockIndent = block.indent && !noIndent;
            var indent = '';
            if (block.indent) {
                indent = JSON.stringify(block.indent);
            }
            /*103:4*/
            out += "\n/*";
            /*104:3*/
            out += block.line;
            /*104:16*/
            out += ":";
            /*104:17*/
            out += block.column;
            /*104:32*/
            out += "*/\n";
            /*105:1*/
            switch (block.type) {
                case 'text':
                    /*108:3*/
                    out += " out +=";
                    /*108:10*/
                    if (block.indent && !noIndent) {
                        /*109:1*/
                        out += JSON.stringify(applyIndent(content, block.indent));
                        /*109:54*/
                        out += ";";
                        /*109:55*/
                    }
                    else if (indent) {
                        /*111:1*/
                        out += indent;
                        /*111:10*/
                        out += " +";
                        /*111:12*/
                        out += " " + JSON.stringify(content);
                        /*111:39*/
                        out += ";";
                        /*111:40*/
                    }
                    else {
                        /*113:1*/
                        out += JSON.stringify(content);
                        /*113:27*/
                        out += ";";
                        /*113:28*/
                    }
                    /*115:1*/
                    break;
                case 'uexpression':
                    /*118:3*/
                    out += " out +=";
                    /*118:10*/
                    if (indent && !noIndent) {
                        /*119:1*/
                        out += "applyIndent(escapeIt(";
                        /*119:22*/
                        out += content;
                        /*119:32*/
                        out += "),";
                        /*119:34*/
                        out += " " + indent;
                        /*119:44*/
                        out += ");";
                        /*119:46*/
                    }
                    else if (indent) {
                        /*121:1*/
                        out += indent;
                        /*121:10*/
                        out += " + escapeIt(";
                        /*121:22*/
                        out += content;
                        /*121:32*/
                        out += ");";
                        /*121:34*/
                    }
                    else {
                        /*123:1*/
                        out += "escapeIt(";
                        /*123:10*/
                        out += content;
                        /*123:20*/
                        out += ");";
                        /*123:22*/
                    }
                    /*125:1*/
                    break;
                case 'expression':
                    /*128:3*/
                    out += " out +=";
                    /*128:10*/
                    if (indent && !noIndent) {
                        /*129:1*/
                        out += "applyIndent(";
                        /*129:13*/
                        out += content;
                        /*129:23*/
                        out += ",";
                        /*129:24*/
                        out += " " + indent;
                        /*129:34*/
                        out += ");";
                        /*129:36*/
                    }
                    else if (indent) {
                        /*131:1*/
                        out += indent;
                        /*131:10*/
                        out += " +";
                        /*131:12*/
                        out += " " + content;
                        /*131:23*/
                        out += ";";
                        /*131:24*/
                    }
                    else {
                        /*133:1*/
                        out += content;
                        /*133:11*/
                        out += ";\n";
                        /*134:1*/
                    }
                    /*135:1*/
                    break;
                case 'codeblock':
                    /*138:3*/
                    out += " ";
                    /*138:4*/
                    if (blockIndent) {
                        /*139:1*/
                        out += applyIndent(content, block.indent);
                        /*139:38*/
                    }
                    else if (block.indent) {
                        /*141:1*/
                        out += block.indent;
                        /*141:16*/
                        out += content;
                        /*141:26*/
                    }
                    else {
                        /*143:1*/
                        out += content;
                        /*143:11*/
                    }
                    /*145:1*/
                    break;
            }
            /*149:1*/
        }
        return out;
    },
    compile: function () {
        this.alias = ["codeblock.njs"];
    },
    dependency: {}
};

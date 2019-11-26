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
        !!;
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
        /*20:1*/
        var escapeBlocks = false;
        for (var i = 0, len = blockList.length; i < len; i++) {
            if (blockList[i].type === 'uexpression') {
                escapeBlocks = true;
                break;
            }
        }
        /*29:1*/
        if (escapeBlocks) {
            /*30:1*/
            out += "var escapeExp = /[&<>\"]/,\n    escapeAmpExp = /&/g,\n    escapeLtExp = /</g,\n    escapeGtExp = />/g,\n    escapeQuotExp = /\"/g;\n\nfunction escapeIt (text) {\n  if (text == null) {\n    return '';\n  }\n\n  var result = text.toString();\n  if (!escapeExp.test(result)) {\n    return result;\n  }\n\n  return result.replace(escapeAmpExp, '&amp;')\n  .replace(escapeLtExp, '&lt;')\n  .replace(escapeGtExp, '&gt;')\n  .replace(escapeQuotExp, '&quot;');\n};\n";
            /*51:1*/
        }
        /*52:1*/
        if (needToIndent) {
            /*53:1*/
            out += "function applyIndent(_str, _indent) {\n  var str = String(_str);\n  var indent = '';\n  if (typeof _indent == 'number' && _indent > 0) {\n    var res = '';\n    for (var i = 0; i < _indent; i++) {\n      res += ' ';\n    }\n    indent = res;\n  }\n  if (typeof _indent == 'string' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split('\\n').map(function (s) {\n        return indent + s;\n    }).join('\\n');\n  } else {\n    return str;\n  }\n}\n";
            /*74:1*/
        }
        /*75:1*/
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
            /*104:4*/
            out += "\n/*";
            /*105:3*/
            out += block.line;
            /*105:16*/
            out += ":";
            /*105:17*/
            out += block.column;
            /*105:32*/
            out += "*/\n";
            /*106:1*/
            switch (block.type) {
                case 'text':
                    /*109:3*/
                    out += " out +=";
                    /*109:10*/
                    if (block.indent && !noIndent) {
                        /*110:1*/
                        out += JSON.stringify(applyIndent(content, block.indent));
                        /*110:54*/
                        out += ";";
                        /*110:55*/
                    }
                    else if (indent) {
                        /*112:1*/
                        out += indent;
                        /*112:10*/
                        out += " +";
                        /*112:12*/
                        out += " " + JSON.stringify(content);
                        /*112:39*/
                        out += ";";
                        /*112:40*/
                    }
                    else {
                        /*114:1*/
                        out += JSON.stringify(content);
                        /*114:27*/
                        out += ";";
                        /*114:28*/
                    }
                    /*116:1*/
                    break;
                case 'uexpression':
                    /*119:3*/
                    out += " out +=";
                    /*119:10*/
                    if (indent && !noIndent) {
                        /*120:1*/
                        out += "applyIndent(escapeIt(";
                        /*120:22*/
                        out += content;
                        /*120:32*/
                        out += "),";
                        /*120:34*/
                        out += " " + indent;
                        /*120:44*/
                        out += ");";
                        /*120:46*/
                    }
                    else if (indent) {
                        /*122:1*/
                        out += indent;
                        /*122:10*/
                        out += " + escapeIt(";
                        /*122:22*/
                        out += content;
                        /*122:32*/
                        out += ");";
                        /*122:34*/
                    }
                    else {
                        /*124:1*/
                        out += "escapeIt(";
                        /*124:10*/
                        out += content;
                        /*124:20*/
                        out += ");";
                        /*124:22*/
                    }
                    /*126:1*/
                    break;
                case 'expression':
                    /*129:3*/
                    out += " out +=";
                    /*129:10*/
                    if (indent && !noIndent) {
                        /*130:1*/
                        out += "applyIndent(";
                        /*130:13*/
                        out += content;
                        /*130:23*/
                        out += ",";
                        /*130:24*/
                        out += " " + indent;
                        /*130:34*/
                        out += ");";
                        /*130:36*/
                    }
                    else if (indent) {
                        /*132:1*/
                        out += indent;
                        /*132:10*/
                        out += " +";
                        /*132:12*/
                        out += " " + content;
                        /*132:23*/
                        out += ";";
                        /*132:24*/
                    }
                    else {
                        /*134:1*/
                        out += content;
                        /*134:11*/
                        out += ";\n";
                        /*135:1*/
                    }
                    /*136:1*/
                    break;
                case 'codeblock':
                    /*139:3*/
                    out += " ";
                    /*139:4*/
                    if (blockIndent) {
                        /*140:1*/
                        out += applyIndent(content, block.indent);
                        /*140:38*/
                    }
                    else if (block.indent) {
                        /*142:1*/
                        out += block.indent;
                        /*142:16*/
                        out += content;
                        /*142:26*/
                    }
                    else {
                        /*144:1*/
                        out += content;
                        /*144:11*/
                    }
                    /*146:1*/
                    break;
            }
            /*150:1*/
        }
        return out;
    },
    compile: function () {
        this.alias = ["codeblock.njs"];
    },
    dependency: {}
};

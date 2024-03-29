module.exports = {
  alias: ["codeblock.njs"],
  script: function(blockList, _content, partial, slot, options) {
    var out = [];
    var textQuote = false;
    blockList = blockList.filter((block2) => block2 && block2.type != "empty");
    for (var i = 0, len = blockList.length; i < len; i++) {
      var last = i === blockList.length - 1;
      var block = blockList[i];
      var next = i + 1 < len ? blockList[i + 1] : null;
      var cont = block?.content;
      switch (block.type) {
        case "text":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = "out.push(";
            } else {
              let lasItem = out.pop();
              res = lasItem + " + ";
            }
            if (!block.eol) {
              res += JSON.stringify(cont);
            } else {
              res += JSON.stringify(cont + "\n");
              res += ");" + (last ? "" : "\n");
              textQuote = false;
            }
            out.push(res);
          }
          break;
        case "uexpression":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = "out.push(";
            } else {
              let lasItem = out.pop();
              res = lasItem + " + ";
            }
            let lcont = "options.escapeIt(" + cont + ")";
            if (block.indent) {
              lcont = "options.applyIndent(" + lcont + ", '" + block.indent + "')";
            }
            if (block.start && block.end) {
              res += "(" + lcont + ")";
            } else if (block.start) {
              res += "(" + lcont;
            } else if (block.end) {
              res += lcont + ")";
            } else {
              res += lcont;
            }
            if (!block.eol) {
              out.push(res);
            } else {
              out.push(res + ");" + (last ? "" : "\n"));
              textQuote = false;
            }
          }
          break;
        case "expression":
          {
            let res = "";
            if (!textQuote) {
              textQuote = true;
              res = "out.push(";
            } else {
              if (block.start) {
                let lasItem = out.pop();
                res = lasItem + " + ";
              }
            }
            if (block.indent) {
              cont = "options.applyIndent(" + cont + ", '" + block.indent + "')";
            }
            if (block.start && block.end) {
              res += "(" + cont + ")";
            } else if (block.start) {
              res += "(" + cont;
            } else if (block.end) {
              res += cont + ")";
            } else {
              res += cont;
            }
            if (!block.eol) {
              out.push(res);
            } else {
              out.push(res + ");" + (last ? "" : "\n"));
              textQuote = false;
            }
          }
          break;
        case "code":
          if (textQuote) {
            let item = out.pop();
            out.push(item + ");\n");
            textQuote = false;
          }
          out.push(cont + (block.eol || next?.type != "code" ? "\n" : ""));
          break;
      }
    }
    if (textQuote) {
      let lasItem = out.pop();
      out.push(lasItem + ");");
    }
    return out.join("");
  },
  compile: function() {
    this.alias = ["codeblock.njs"];
  },
  dependency: {}
};

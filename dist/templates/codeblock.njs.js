"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: [
        "codeblock.njs"
    ],
    script: function (blockList, _content, partial, slot, options) {
        var out = [];
        var textQuote = false;
        for (var i = 0, len = blockList.length; i < len; i++) {
            var block = blockList[i];
            var cont = block.content;
            switch (block.type) {
                case "text":
                    var res = "";
                    if (textQuote) {
                        var lasItem = out.pop();
                        res = "".concat(lasItem, " + ");
                    }
                    else {
                        textQuote = true;
                        res = ";out.push(\n";
                    }
                    if (block.eol) {
                        res += JSON.stringify(cont + "\n");
                        res += "\n";
                    }
                    else
                        res += JSON.stringify(cont);
                    out.push(res);
                    break;
                case "uexpression":
                    var res1 = "";
                    if (textQuote) {
                        var lasItem1 = out.pop();
                        res1 = "".concat(lasItem1, " + ");
                    }
                    else {
                        textQuote = true;
                        res1 = ";out.push(\n";
                    }
                    res1 += "escapeIt(".concat(cont, ")");
                    if (textQuote && !block.eol)
                        out.push(res1);
                    else
                        out.push("".concat(res1, "\n"));
                    break;
                case "expression":
                    var res2 = "";
                    if (textQuote) {
                        if (block.start) {
                            var lasItem2 = out.pop();
                            res2 = "".concat(lasItem2, " + ");
                        }
                    }
                    else {
                        textQuote = true;
                        res2 = ";out.push(\n";
                    }
                    if (block.start && block.end)
                        res2 += "(".concat(cont, ")");
                    else if (block.start)
                        res2 += "(".concat(cont);
                    else if (block.end)
                        res2 += "".concat(cont, ")");
                    else
                        res2 += "".concat(cont);
                    if (textQuote && !block.eol)
                        out.push(res2);
                    else
                        out.push("".concat(res2, "\n"));
                    break;
                case "code":
                    if (textQuote) {
                        var item = out.pop();
                        out.push("".concat(item, ");\n"));
                        textQuote = false;
                    }
                    out.push("".concat(cont).concat(block.eol ? "\n" : ""));
                    break;
            }
        }
        if (textQuote) {
            var lasItem3 = out.pop();
            out.push("".concat(lasItem3, ");\n"));
        }
        out.push("");
        return out.join("");
    },
    compile: function () {
        this.alias = [
            "codeblock.njs"
        ];
    },
    dependency: {}
};
//# sourceMappingURL=codeblock.njs.js.map
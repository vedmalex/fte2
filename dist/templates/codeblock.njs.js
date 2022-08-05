"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    alias: ["codeblock.njs"],
    script: function (blockList, _content, partial, slot, options) {
        var out = [];
        var textQuote = false;
        for (var i = 0, len = blockList.length; i < len; i++) {
            var block = blockList[i];
            var next = i + 1 < len ? blockList[i + 1] : null;
            var cont = block.content;
            switch (block.type) {
                case "text":
                    {
                        let res = "";
                        if (!textQuote) {
                            textQuote = true;
                            res = "out.push(\n";
                        }
                        else {
                            let lasItem = out.pop();
                            res = lasItem + " + ";
                        }
                        if (block.eol) {
                            res += JSON.stringify(cont + "\n");
                            res += "\n";
                        }
                        else {
                            res += JSON.stringify(cont);
                        }
                        out.push(res);
                    }
                    break;
                case "uexpression":
                    {
                        let res = "";
                        if (!textQuote) {
                            textQuote = true;
                            res = "out.push(\n";
                        }
                        else {
                            let lasItem = out.pop();
                            res = lasItem + " + ";
                        }
                        const lcont = "escapeIt(" + cont + ")";
                        if (block.start && block.end) {
                            res += "(" + lcont + ")";
                        }
                        else if (block.start) {
                            res += "(" + lcont;
                        }
                        else if (block.end) {
                            res += lcont + ")";
                        }
                        else {
                            res += lcont;
                        }
                        if (textQuote && !block.eol) {
                            out.push(res);
                        }
                        else {
                            out.push(res + "\n");
                        }
                    }
                    break;
                case "expression":
                    {
                        let res = "";
                        if (!textQuote) {
                            textQuote = true;
                            res = "out.push(\n";
                        }
                        else {
                            if (block.start) {
                                let lasItem = out.pop();
                                res = lasItem + " + ";
                            }
                        }
                        if (block.start && block.end) {
                            res += "(" + cont + ")";
                        }
                        else if (block.start) {
                            res += "(" + cont;
                        }
                        else if (block.end) {
                            res += cont + ")";
                        }
                        else {
                            res += cont;
                        }
                        if (textQuote && !block.eol) {
                            out.push(res);
                        }
                        else {
                            out.push(res + "\n");
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
            out.push(lasItem + ");\n");
        }
        out.push("");
        return out.join("");
    },
    compile: function () {
        this.alias = ["codeblock.njs"];
    },
    dependency: {}
};
//# sourceMappingURL=codeblock.njs.js.map
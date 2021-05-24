// Generated automatically by nearley, version 2.19.7
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require('./lexer').lexer
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "start$ebnf$1", "symbols": []},
    {"name": "start$ebnf$1$subexpression$1", "symbols": ["text"]},
    {"name": "start$ebnf$1$subexpression$1", "symbols": ["codeblocks"]},
    {"name": "start$ebnf$1", "symbols": ["start$ebnf$1", "start$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "start", "symbols": ["start$ebnf$1"]},
    {"name": "text", "symbols": [(lexer.has("stText1") ? {type: "stText1"} : stText1)]},
    {"name": "text", "symbols": [(lexer.has("stText2") ? {type: "stText2"} : stText2)]},
    {"name": "text", "symbols": [(lexer.has("stText3") ? {type: "stText3"} : stText3)]},
    {"name": "text", "symbols": [(lexer.has("midText1") ? {type: "midText1"} : midText1)]},
    {"name": "text", "symbols": [(lexer.has("midText2") ? {type: "midText2"} : midText2)]},
    {"name": "text", "symbols": [(lexer.has("midText3") ? {type: "midText3"} : midText3)]},
    {"name": "text", "symbols": [(lexer.has("endText1") ? {type: "endText1"} : endText1)]},
    {"name": "text", "symbols": [(lexer.has("endText2") ? {type: "endText2"} : endText2)]},
    {"name": "codeblocks", "symbols": ["expression"]},
    {"name": "codeblocks", "symbols": ["directive"]},
    {"name": "codeblocks", "symbols": ["codeblock"]},
    {"name": "expression", "symbols": [(lexer.has("eStart") ? {type: "eStart"} : eStart), (lexer.has("eBody") ? {type: "eBody"} : eBody), (lexer.has("eEnd") ? {type: "eEnd"} : eEnd)]},
    {"name": "directive", "symbols": [(lexer.has("dStart") ? {type: "dStart"} : dStart), (lexer.has("dBody") ? {type: "dBody"} : dBody), (lexer.has("dEnd") ? {type: "dEnd"} : dEnd)]},
    {"name": "codeblock$subexpression$1", "symbols": [(lexer.has("blStart") ? {type: "blStart"} : blStart)]},
    {"name": "codeblock$subexpression$1", "symbols": [(lexer.has("blStart2") ? {type: "blStart2"} : blStart2)]},
    {"name": "codeblock$subexpression$2", "symbols": [(lexer.has("cbBody") ? {type: "cbBody"} : cbBody)]},
    {"name": "codeblock$subexpression$2", "symbols": [(lexer.has("cbBody2") ? {type: "cbBody2"} : cbBody2)]},
    {"name": "codeblock", "symbols": ["codeblock$subexpression$1", "codeblock$subexpression$2", (lexer.has("cbEnd") ? {type: "cbEnd"} : cbEnd)]}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

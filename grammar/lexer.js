const moo = require('moo')

const lexer = moo.states({
  main: {
    dStart: { match:/<#@/, next:"directive" },
    blStart: { match:/<#(?![-@])/, next:"codeblock" },
    blStart2: { match:/<#-/, next:"codeblock" },
    eStart: {match:/#{|!{/, next: "expression"},
    midText1: { match:/(?<=#>)[^]+?(?=<#)/, lineBreaks:true},
    midText2: { match:/(?<=#>)[^]+?(?=#{)/, lineBreaks:true, next:"expression" },
    midText3: { match:/(?<=#>)[^]+?(?=!{)/, lineBreaks:true, next:"expression" },
    stText1: { match:/[^]+?(?=<#)/, lineBreaks:true },
    stText2: { match:/[^]+?(?=#{)/, lineBreaks:true, next:"expression" },
    stText3: { match:/[^]+?(?=!{)/, lineBreaks:true, next:"expression" },
    endText1: { match:/(?<=#>)[^]+/, lineBreaks:true },
    endText2: { match:/(?<=})[^]+/, lineBreaks:true },
  },
  expression: {
    eStart: {match:/#{|!{/},
    eBody:{ match:/[^}]+?(?=})/, lineBreaks: true },
    eEnd:{ match:/\}/, next: "main" },
  },
  directive: {
    dEnd:{ match:/\#\>/, next: "main" },
    dBody:{ match:/[^]+?(?=#>)/, lineBreaks: true },
  },
  codeblock: {
    cbEnd:{ match:/-?\#\>/, next:"main" },
    cbBody:{ match:/[^]+?(?=-#>)/, lineBreaks: true },
    cbBody2:{ match:/[^]+?(?=#>)/, lineBreaks: true }
  }
});

module.exports = { lexer }
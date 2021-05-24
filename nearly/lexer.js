const moo = require('moo')
// токенизатор режет строку на слайсики
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

/*

для удаления пробелов сделать
обработчик или для парсера, извлечение объекта
или как-то по другому

модифицировать парсер не получится, поэтому нужно будет как-то определять что за текущая операци
какие ее границы и уже output резать как надо
сделать source map
https://habr.com/ru/post/509250/
https://medium.com/@trungutt/yet-another-explanation-on-sourcemap-669797e418ce

написать тесты для грамматики и для выражений

придумать async есть слоты, но надо как-то упростить что ли...
*/
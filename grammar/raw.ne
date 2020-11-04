# nodemon --watch raw.ne --exec "nearleyc raw.ne -o raw.ne.js
@{%
const lexer = require('./lexer').lexer
%}

@lexer lexer

start -> (text | codeblocks):*

text ->
  %stText1
| %stText2
| %stText3
| %midText1
| %midText2
| %midText3
| %endText1
| %endText2

codeblocks ->
  expression
| directive
| codeblock

expression -> %eStart %eBody %eEnd

directive -> %dStart %dBody %dEnd

codeblock -> (%blStart|%blStart2) (%cbBody|%cbBody2) %cbEnd


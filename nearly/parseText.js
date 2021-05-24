const lexer = require('./lexer').lexer

lexer.reset(`
<#@ context 'name' #>
<#-
  function processRequire(item){
    var requires = item.name.split(',').map(function(i){return i.trim()});
    return {name:requires[0], alias:requires[1]};
  }
-#>
`)

let res = lexer.next()
while(res){
  console.log(res);
  res = lexer.next()
}


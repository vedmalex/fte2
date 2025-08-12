<#@ noContent #>
var Factory = require("fte.js").Factory;
global.fte = new Factory();
<#- var item;
for (var i = 0, len = context.length; i < len; i++) {
  item = context[i];
-#>
fte.load(require("./#{context[i]}"),"#{context[i]}");
<#-}#>
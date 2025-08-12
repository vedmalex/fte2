<#@ noContent #>
<#- if(context.extractor){ #>
<#- if("string" === typeof context.extractor) {
  if(/^function extractData/.test(context.extractor.trim())){
#>
#{context.extractor}
<#- } else {#>
function extractData(db, prm, data, callback) {
  #{context.extractor}
}
<#- }#>
<#-} else if("function" === typeof context.extractor){#>
#{context.extractor}
<#-}#>
<#-}#>
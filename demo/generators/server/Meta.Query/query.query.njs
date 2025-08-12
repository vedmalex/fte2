<#@ noContent #>
<#-if("string" === typeof context.queryText){#>
function query(prm){
    return #{context.queryText}
}
<#-} else if("function" === typeof context.queryText){#>
  #{context.queryText}
<#-}#>
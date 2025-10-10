<#@ noContent #>
<#- if(context.body){ -#>
function json (){
  return #{context.body}
}
<#- }#>
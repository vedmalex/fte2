<#@ noContent #>
<#- if(context.body){#>
function #{context.name??'func'}(#{context.params?context.params:''}){
  #{context.body}
}
<#- }#>
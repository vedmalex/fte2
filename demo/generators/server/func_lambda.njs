<#@ noContent #>
<#- if(context.body){ -#>
(#{context.params?context.params:''})=>{
#{context.body}
}
<#-}#>
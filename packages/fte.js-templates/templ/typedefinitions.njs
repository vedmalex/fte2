<#@ alias 'typedefs.ts.njs'#>
<#@ context 'typedefs' #>
<# block 'info' : #>
<#@ context 'info' #>
<#@ noContent #>
#{info.name}
#{info.type}
<#info.properties.forEach(prop=>{#>
  #{prop.name}: any
<#})#>
<# end #>

<# typedefs.forEach(({params, types, name})=>{#>
 // function #{name}
 <#params.forEach(param=>{#>
  #{content('info',param)}
 <#})#>

 <#types.forEach(param=>{#>
  #{content('info',param)}
 <#})#>
<#})#>


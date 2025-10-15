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

 <#types.filter(f=>f.type!== 'primitive' && f.type!== 'function').forEach(param=>{#>
  #{content('info',param)}
 <#})#>
<#})#>


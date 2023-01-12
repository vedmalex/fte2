<#@ alias 'standalone.index.njs' #>
<#@ context 'files' #>
<#@ noContent #>
<#@ noEscape #>
const templates = {
<# for (let i = 0; i < files.length; i+=1){ -#>
  '#{files[i].name}': require('#{files[i].path}'),
<#}#>
}
module.exports = templates
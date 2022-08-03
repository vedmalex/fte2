<#@ alias 'standalone.njs'#>
<#@ noContent #>
<#@ noEscape #>
<#@ context 'files' #>

const { Factory } = require('fte.js/lib/standalone.fte.js')

const templates = {
<# for (let i = 0; i < files.length; i+=1){ #>
  '#{files[i].name}': require('#{files[i].path}'),
<#}#>
}

const F = new Factory(templates)

module.exports = (context, name) => {
  F.run( context, name )
}

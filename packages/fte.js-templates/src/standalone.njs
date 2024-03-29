<#@ alias 'standalone.njs'#>
<#@ noContent #>
<#@ context 'files' #>

const Factory = require("fte.js-standalone").TemplateFactoryStandalone;

const templates = {
<#- for (let i = 0; i < files.length; i+=1){ #>
  '#{files[i].name}': require('#{files[i].path}'),
<#- }#>
}

const F = new Factory(templates)

module.exports = (context, name) => {
  return F.run( context, name )
}

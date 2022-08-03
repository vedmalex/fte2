<#@ alias 'standalone.es6.njs'#>
<#@ noContent #>
<#@ noEscape #>
<#@ context 'files' #>
import { Factory } from 'fte.js/lib/standalone.fte.js'

<# for (let i = 0; i < files.length; i+=1){ #>
  import #{files[i].name.replaceAll(/[\s\.]/g,'_')} from '#{files[i].path}'
<#}#>

const templates = {
<# for (let i = 0; i < files.length; i+=1){ #>
  '#{files[i].name}': #{files[i].name.replaceAll(/[\s\.]/g,'_')},
<#}#>
}

const F = new Factory(templates)

module.exports = (context, name) => {
  return F.run( context, name )
}

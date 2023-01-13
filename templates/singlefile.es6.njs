<#@ alias 'singlefile.es6.njs' #>
<#@ context 'files' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
import { Factory } from 'fte.js/lib/standalone.fte.js'

export const templates = {
<# files.forEach(file=>{-#>
  ['#{(file.template.alias || file.name)}']: #{partial(file.template, 'core')},
<#}) #>
}

const F = new Factory(templates)

export function run (context, name) {
  return F.run(context, name)
}


<#@ alias 'standalone.ts.njs'#>
<#@ noContent #>
<#@ context 'files' #>
import { Factory } from 'fte.js/lib/standalone.fte.js'

<#- for (let i = 0; i < files.length; i+=1){ #>
  import #{files[i].name.replaceAll(/[\s\.]/g,'_')} from '#{files[i].path}'
<#- }#>

const templates = {
<#- for (let i = 0; i < files.length; i+=1){ #>
  '#{files[i].name}': #{files[i].name.replaceAll(/[\s\.]/g,'_')},
<#- }#>
}

const F = new Factory(templates)

function run<T>(context:T, name:string) => {
  return F.run(context, name)
}
export default run

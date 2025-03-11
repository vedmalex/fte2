<#@ alias 'standalone.es6.njs'#>
<#@ noContent #>
<#@ context 'files' #>
import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";

<#- for (let i = 0; i < files.length; i+=1){ #>
  import #{files[i].name.replaceAll(/[\s\.]/g,'_')} from '#{files[i].path}'
<#- }#>

const templates = {
<#- for (let i = 0; i < files.length; i+=1){ #>
  '#{files[i].name}': #{files[i].name.replaceAll(/[\s\.]/g,'_')},
<#- }#>
}

const F = new Factory(templates)

function run(context, name:string) => {
  return F.run(context, name)
}
export default run

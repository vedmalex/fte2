<#@ alias 'standalone.index.ts.njs' #>
<#@ context 'files' #>
<#@ noContent #>

<#- for (let i = 0; i < files.length; i+=1){ #>
  import #{files[i].name.replaceAll(/[\s\.]/g,'_')} from '#{files[i].path}'
<#- }#>

const templates = {
<#- for (let i = 0; i < files.length; i+=1){ #>
  '#{files[i].name}': #{files[i].name.replaceAll(/[\s\.]/g,'_')},
<#- }#>
}
export default templates
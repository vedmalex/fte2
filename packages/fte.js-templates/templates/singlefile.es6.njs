<#@ alias 'singlefile.es6.njs' #>
<#@ context 'files' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";

export const templates = {
<#- files.forEach(file=>{ #>
  ['#{(file.template.alias || file.name)}']: #{(() => { const __core = partial(file.template, 'core'); return typeof __core === 'string' ? __core : __core.code })()},
<#-}) #>
}

const F = new Factory(templates)

export function run(context, name) {
  return F.run(context, name)
}


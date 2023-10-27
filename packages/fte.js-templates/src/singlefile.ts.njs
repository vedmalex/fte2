<#@ alias 'singlefile.ts.njs' #>
<#@ context 'files' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.ts.njs','core') #>

import { TemplateBase } from 'fte.js-base'
import { TemplateFactoryStandalone as Factory } from "fte.js-standalone";

export const templates = {
<#- files.forEach(file=>{ #>
  ['#{(file.template.alias || file.name)}']: #{partial(file.template, 'core')},
<#-}) #>
}

const F = new Factory(templates)

export function run(context, name) {
  return F.run(context, name)
}


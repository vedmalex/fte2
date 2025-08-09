<#@ alias 'singlefile.njs' #>
<#@ context 'files' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
const Factory = require("fte.js-standalone").TemplateFactoryStandalone;

const templates = {
<#- files.forEach(file=>{ #>
  ['#{(file.template.alias || file.name)}']: #{(() => { const __core = partial(file.template, 'core'); return typeof __core === 'string' ? __core : __core.code })()},
<#-}) #>
}

exports.templates = templates
const F = new Factory(templates)

function run(context, name){
  return F.run( context, name )
}

exports.run = run

<#@ alias 'singlefile.njs' #>
<#@ context 'files' #>
<#@ noEscape #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
const { Factory } = require('fte.js/lib/standalone.fte.js')

const templates = {
<# files.forEach(file=>{#>
  ['#{(file.template.alias || file.name)}']: #{partial(file.template, 'core')},
<#}) #>
}

exports.templates = template
const F = new Factory(templates)

function run(context, name){
  F.run({ context, name })
}

exports.run = run

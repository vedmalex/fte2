<#@ context 'data' #>
<#@ alias ['minimal_repro.njs'] #>
<#@ requireAs [{'alias': 'core', 'name': 'es6module.ts.njs'}] #>
#{partial(context, 'core')}

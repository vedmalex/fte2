<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.ts.njs','core') #>

export default #{partial(context, 'core')};

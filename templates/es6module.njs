<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>

export default #{partial(context, 'core')};

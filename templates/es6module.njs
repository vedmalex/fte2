<#@ alias 'es6module.njs' #>
<#@ noEscape #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
export default #{partial(context, 'core')};

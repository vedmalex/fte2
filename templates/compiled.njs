<#@ alias 'compiled.njs' #>
<#@ noEscape #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
module.exports = #{partial(context, 'core')};

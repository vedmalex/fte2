<#@ alias 'compiled.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
module.exports = #{partial(context, 'core')};

<#@ alias 'compiled.njs' #>
<#@ requireAs ('MainTemplate.njs','core') #>
module.exports = #{partial(context, 'core')};

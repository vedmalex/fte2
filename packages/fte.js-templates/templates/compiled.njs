<#@ alias 'compiled.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
module.exports = #{(() => { const __core = partial(context, 'core'); return typeof __core === 'string' ? __core : __core.code })()};

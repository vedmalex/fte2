<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>

export default #{(() => { const __core = partial(context, 'core'); return typeof __core === 'string' ? __core : __core.code })()};

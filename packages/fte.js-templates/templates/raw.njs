<#@ alias 'raw.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
(function(){
  const __core = #{partial(context, 'core')};
  return #{typeof __core === 'string' ? '__core' : '__core.code'};
})();
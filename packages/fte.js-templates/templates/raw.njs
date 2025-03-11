<#@ alias 'raw.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
(function(){
  return #{partial(context, 'core')};
})();
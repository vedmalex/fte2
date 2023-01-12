<#@ alias 'raw.njs' #>
<#@ noEscape #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
(function(){
  return #{partial(context, 'core')};
})();
<#@ alias 'raw.njs' #>
<#@ requireAs ('MainTemplate.njs','core') #>
(function(){
  return #{partial(context, 'core')};
})();
<#@ noContent #>
<#-
if(context && context.currentProfile && context.currentProfile.module){
  if (context.currentProfile.module) {
    for(let i=0; i<context.currentProfile.module.length; i++){
      if(context.currentProfile.module[i].controllerName){
#>
self.loadModule("#{context.currentProfile.module[i].controllerName}");
<#
      }
    }
  }
}#>

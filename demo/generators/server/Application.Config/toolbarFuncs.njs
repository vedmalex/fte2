<#@ noContent #>
<#-if(context && context.currentProfile && context.currentProfile.toolBarItem){#>
/*START TOOLBAR FUNCTIONS*/
<#-
  let toolbars = context.currentProfile.toolBarItem;
  for(let i=0; i<toolbars.length; i++){#>
  #{toolbars[i].itemId}Func: function(){
    DirectCacheLogger.userStories('Toolbar Function', { toolbarItemId: '#{toolbars[i].itemId}', profileName: '#{context.currentProfile.name}' });
    #{toolbars[i].func}
  },
  <#-
    }
  #>
/*END TOOLBAR FUNCTIONS*/
<#-}#>
<#@ noContent #>
<#-
if(context && context.currentProfile && context.currentProfile.toolBarItem){
let toolbars = context.currentProfile.toolBarItem
let len = toolbars?.length ?? 0;#>
me.control({
<#- for(let i = 0; i < len; i++ ){#>
  "button[itemId=#{toolbars[i].itemId}]": {click: this.#{toolbars[i].itemId}Func},
<#-}#>
});
<#-}#>
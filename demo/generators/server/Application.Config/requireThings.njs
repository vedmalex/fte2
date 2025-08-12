<#@ noContent #>
<#- let requireNs = Object.keys(context.nsList);
if(requireNs.length > 0){#>
Ext.require([
<#- for(let i = 0; i<requireNs.length; i++){#>
    "things.#{requireNs[i]}",
<#- }#>
], function() {
    me.loadProfile();
});
<#-} else {#>
    me.loadProfile();
<#-}#>
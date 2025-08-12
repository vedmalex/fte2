<#@ context "model" -#>
<#@ alias "ui-next-js" -#>
<#@ chunks "$$$main$$$" -#>

#{partial(model, 'ui-data-adapters')}
#{partial(model, 'ui-next-js-root')}
#{partial(model, 'ui-root')}
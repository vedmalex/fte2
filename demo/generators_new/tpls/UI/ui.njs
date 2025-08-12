<#@ context "model" -#>
<#@ alias "ui" -#>
<#@ chunks "$$$main$$$" -#>

#{partial(model, 'ui-index')}
<# for (const entity of model.entities) {#>
  #{partial(entity, 'ui-forms')}
<#}#>
<# for (const enumDef of model.enums) {#>
  #{partial(enumDef, 'ui-enums')}
<#}#>
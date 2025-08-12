<#@ context "ctx" -#>
<#@ alias 'display-edit-field' -#>
<#-
const {entity, f, source, readonly} = ctx;
-#>
<#-
const type = `${(f.calculated || f.readonly || readonly) ? 'Readonly' + f.type :f.type}`;
-#>
<uix.primitive.#{type}.Input
  <#-if(f.defaultValue){#>
  defaultValue={#{f.defaultValue}}<#}#>
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
<#if(f.hint){-#>
  helperText="resources.#{f.inheritedFrom || entity.name}.helpers.#{f.name}"
<#} else {-#>
  helperText={false}
<#}#>
  source={`#{source}#{f.name}`}
  <# if (!f.required){-#>
  allowEmpty<#} else {-#>
  validate={uix.required()}<#}#>
/>
<#@ context "ctx" -#>
<#@ alias 'display-edit-rel-single-not-embed' -#>
<#-
  const {entity, f, source, sectionLabel, readonly} = ctx;
-#>
<uix.ReferenceInput
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
  source={`#{source}#{f.ref.backField}`}
<#if(f.hint){-#>
  helperText="resources.#{f.inheritedFrom || entity.name}.helpers.#{f.name}"
<#} else {-#>
  helperText={false}
<#}#>
<# const empty = '{}'#>
  filter={#{f.ref.editFilter ? f.ref.editFilter : empty}}
  reference="#{entity.model.entityPathMapper[f.ref.entity]}"
  <#- if (!f.required){#>
  allowEmpty<#} else {-#>
  validate={uix.required()}<#}#>
>
  <#if(f.ref.autocomplete){-#>
    <uix.AutocompleteInput optionText={uix.#{f.ref.entity}.inputText} />
  <#} else {-#>
    <uix.SelectInput optionText={<uix.#{f.ref.entity}.SelectTitle />} />
  <#}-#>
</uix.ReferenceInput>
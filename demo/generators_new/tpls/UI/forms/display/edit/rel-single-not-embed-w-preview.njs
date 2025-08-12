<#@ context "ctx" -#>
<#@ alias 'display-edit-rel-single-not-embed-w-preview' -#>
<#-
  const {entity, f, source, sectionLabel, readonly} = ctx;
-#>
<uix.InputWithPreview
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
  source={`#{source}#{f.ref.backField}`}
  reference="#{entity.model.entityPathMapper[f.ref.entity]}"
  entity="#{f.ref.entity}"
  perPage={10000}
<#if(f.hint){-#>
  helperText="resources.#{f.inheritedFrom || entity.name}.helpers.#{f.name}"
<#} else {-#>
  helperText={false}
<#}#>
<# const empty = '{}'#>
  filter={#{f.ref.editFilter ? f.ref.editFilter : empty}}
  Select={
  <#-if(f.ref.autocomplete){-#>
    uix.AutocompleteInput
  <#} else {-#>
    uix.SelectInput
  <#-}-#>
  }
  <#- if (!f.required){#>
  allowEmpty<#} else {-#>
  validate={uix.required()}<#}#>
  optionText={
  <#-if(f.ref.autocomplete){-#>
    uix.#{f.ref.entity}.inputText
  <#} else {-#>
    <uix.#{f.ref.entity}.SelectTitle />
  <#-}-#>
  }
  >
    <uix.SimpleForm resource="#{entity.model.entityPathMapper[entity.name]}">
  <# const e = entity.model.entities.find(e => e.name === f.ref.entity)
    const context = {
      entity: {
        ...e,
        props: e.lists.quickCreate
      },
      source: '',
      sectionLabel,
      readonly,
    }
  #>
    #{partial(context, 'display-edit-entity')}
    </uix.SimpleForm>
  </uix.InputWithPreview>
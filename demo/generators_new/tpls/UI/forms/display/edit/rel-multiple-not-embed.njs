<#@ context "ctx" -#>
<#@ alias 'display-edit-rel-multiple-not-embed' -#>
<#-
  const {entity, f, source, sectionLabel, readonly} = ctx;
-#>
<uix.FormDataConsumer>
  {({ formData, ...rest }) => (
    <div style={{display:'flex'}}>
      <# if(sectionLabel) {#>
      <uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
      <#}#>
      <uix.ReferenceArrayInput
        {...rest}
        label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
        source={`#{source}#{f.ref.backField}`}
        <# const empty = '{}'#>
        filter={#{f.ref.editFilter ? f.ref.editFilter : empty}}
        reference="#{entity.model.entityPathMapper[f.ref.entity]}"
        <# if (!f.required){#>allowEmpty<#} else {-#>
        validate={uix.required()}<#}#>
      >
    <#if(f.ref.autocomplete){-#>
      <uix.AutocompleteArrayInput optionText={uix.#{f.ref.entity}.inputText } />
    <#} else {-#>
      <uix.SelectArrayInput optionText={<uix.#{f.ref.entity}.SelectTitle />} />
    <#}-#>
      </uix.ReferenceArrayInput>
      <uix.#{f.ref.entity}.Add {...rest} target={'#{f.ref.opposite}'} label="resources.#{f.inheritedFrom || entity.name}.actions.#{f.name}" />
    </div>
  )}
</uix.FormDataConsumer>
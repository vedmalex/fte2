<#@ context "ctx" -#>
<#@ alias 'display-edit-show-rel-multiple-not-embed' -#>
<#-
  const {entity, f, source, sectionLabel, readonly} = ctx;
-#>
<uix.FormDataConsumer>
  {({ formData, ...rest }) => (
  <uix.Fragment>
    <# if(sectionLabel) {#>
    <uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
    <#}#>

    <#if(f.ref.using){#>
    <uix.ReferenceArrayField
      {...rest}
      label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
      reference="#{entity.model.entityPathMapper[f.ref.entity]}"
      source="#{f.name}"
    >
      <uix.#{f.ref.entity}.Grid fields={'!#{f.ref.opposite}'}/>
    </uix.ReferenceArrayField>
    <#} else {#>
    <uix.ReferenceManyField
      {...rest}
      label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
      reference="#{entity.model.entityPathMapper[f.ref.entity]}"
      <# const empty = '{}'#>
      filter={#{f.ref.showFilter ? f.ref.showFilter : empty}}
      target="#{f.ref.opposite}"
    >
      <uix.#{f.ref.using ?  f.ref.using.entity : f.ref.entity}.Grid fields={'!#{f.ref.opposite}'}/>
    </uix.ReferenceManyField>
    <#}#>
    <uix.#{f.ref.using ?  f.ref.using.entity : f.ref.entity}.Add {...rest} target={'#{f.ref.using ? f.ref.using.field: f.ref.opposite}'} label="resources.#{f.inheritedFrom || entity.name}.actions.#{f.name}"/>
  </uix.Fragment>
  )}
</uix.FormDataConsumer>
<#@ context "ctx" -#>
<#@ alias 'display-show-rel-multiple-not-embed' -#>
<#-
  const {entity, f, source, sectionLabel, customizable} = ctx;
-#>
<#if(sectionLabel && customizable){#>
<>
<#}#>
<# if(sectionLabel) {#>
<uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
<#}#>
<#if(f.ref.using){#>
<uix.ReferenceArrayField
  <# if(sectionLabel) {#>
    addLabel={false}
  <#} else {#>
    label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
  <#}#>
  reference="#{entity.model.entityPathMapper[f.ref.entity]}"
  source="#{f.name}"
>
  <uix.#{f.ref.entity}.Grid/>
</uix.ReferenceArrayField>
<#} else {#>
<uix.ReferenceManyField
  <# if(sectionLabel) {#>
    addLabel={false}
  <#} else {#>
    label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
  <#}#>
  reference="#{entity.model.entityPathMapper[f.ref.entity]}"
<# const empty = '{}'#>
  filter={#{f.ref.showFilter ? f.ref.showFilter : empty}}
  target="#{f.ref.opposite}"
>
  <uix.#{f.ref.using ?  f.ref.using.entity : f.ref.entity}.Grid fields={'!#{f.ref.opposite}'}/>
</uix.ReferenceManyField>
<#}#>
<#if(sectionLabel && customizable){#>
</>
<#}#>
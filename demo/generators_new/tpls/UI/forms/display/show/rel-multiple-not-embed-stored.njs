<#@ context "ctx" -#>
<#@ alias 'display-show-rel-multiple-not-embed-stored' -#>
<#-
  const {entity, f, source, sectionLabel, customizable} = ctx;
-#>
<#if(sectionLabel && customizable){#>
<>
<#}#>
<# if(sectionLabel) {#>
<uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
<#}#>
<uix.ReferenceArrayField
<# if(sectionLabel) {#>
  addLabel={false}
<#} else {#>
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
<#}#>
  reference="#{entity.model.entityPathMapper[!(f.verb==='BelongsToMany' && f.ref.using)? f.ref.entity: f.ref.using.entity]}"
<# const empty = '{}'#>
  filter={#{f.ref.showFilter ? f.ref.showFilter : empty}}
  source={`#{source}#{f.ref.backField}`}
>
  <uix.#{!(f.verb==='BelongsToMany' && f.ref.using)? f.ref.entity: f.ref.using.entity}.Grid fields={'!#{f.name}'}/>
</uix.ReferenceArrayField>
<#if(sectionLabel && customizable){#>
</>
<#}#>
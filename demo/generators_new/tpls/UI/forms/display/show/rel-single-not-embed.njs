<#@ context "ctx" -#>
<#@ alias 'display-show-rel-single-not-embed' -#>
<#-
  const {entity, f, source, sectionLabel, customizable} = ctx;
-#>
<#if(sectionLabel && customizable){#>
<>
<#}#>
<# if(sectionLabel) {#>
<uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
<#}#>
<uix.ReferenceField
<#
if(sectionLabel) {#>
  addLabel={false}
<#} else {#>
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
<#}#>
  source={`#{source}#{f.ref.backField}`}
<# const empty = '{}'#>
  filter={#{f.ref.showFilter ? f.ref.showFilter : empty}}
  reference="#{entity.model.entityPathMapper[f.ref.entity]}"
  link="show"
>
  <uix.#{f.ref.entity}.SelectTitle />
</uix.ReferenceField>
<#if(sectionLabel && customizable){#>
</>
<#}#>
<#@ context "ctx" -#>
<#@ alias 'display-edit-rel-single-embed' -#>
<#-
  const {entity, f, source, sectionLabel, readonly, grid, customizable} = ctx;
-#>
<# const e = entity.model.entities.find(e => e.name === f.ref.entity)
  const context = {
    entity: {
      ...e,
      props: e.lists.all,
    },
    source: source ? `${source}${f.ref.backField}.` : `${f.ref.backField}.`,
    sectionLabel: !grid && sectionLabel,
    readonly,
    customizable,
  }
#>
<#if(customizable){#>
<>
<#}#>
<# if(sectionLabel) {#>
<uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
<#}#>
#{partial(context, 'display-edit-entity')}
<#if(customizable){#>
</>
<#}#>
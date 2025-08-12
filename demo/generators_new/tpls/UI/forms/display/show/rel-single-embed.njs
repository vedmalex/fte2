<#@ context "ctx" -#>
<#@ alias 'display-show-rel-single-embed' -#>
<#-
  const {entity, f, source, grid, embedded, sectionLabel, customizable} = ctx;
-#>
<# const e = entity.model.entities.find(e => e.name === f.ref.entity)
  const context = {
    entity: {
      ...e,
      props: e.lists.all.filter(fl=>fl.name !== f.name )
    },
    source: source ? `${source}${f.name}.` : `${f.name}.`,
    grid,
    embedded,
    sectionLabel: !grid && sectionLabel,
    customizable,
  }
#>
<# if(sectionLabel) {#>
<uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
<#}#>
#{partial(context, 'display-show-entity')}


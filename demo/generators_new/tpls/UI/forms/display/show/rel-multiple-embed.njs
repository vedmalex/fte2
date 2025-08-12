<#@ context "ctx" -#>
<#@ alias 'display-show-rel-multiple-embed' -#>
<#-
  const {entity, f, source, embedded, sectionLabel, grid, customizable} = ctx;

-#>
<#if(sectionLabel && customizable){#>
<>
<#}#>
<# if(sectionLabel) {#>
<uix.HeaderLabel text="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
<#}#>
<uix.ArrayField
<# if(sectionLabel) {#>
  addLabel={false}
<#} else {#>
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
<#}#>
  source={`#{source}#{f.ref.backField}`}
  >
<# const e = entity.model.entities.find(e => e.name === f.ref.entity)
    const context = {
      entity: {
        ...e,
        props: e.lists.all.filter(fl=>fl.name !== f.name )
      },
      source: "", //source ? `${source}${f.ref.backField}.` : `${f.ref.backField}.`,
      grid: true,
      embedded: f.embedded,
      sectionLabel:  !grid && sectionLabel,
    }
  #>
  <uix.Datagrid {...props} <#if(!e.embedded){#>rowClick="edit"<#}#> >
    #{partial(context, 'display-show-entity')}
    <# e.actions.forEach(action=>{ #>
        <uix.#{e.name}.#{action.fullName} />
    <#})#>
<# if(!(e.embedded || e.abstract)){#>
    <uix.ShowButton label="" />
    <uix.CloneButton label="" />
<#}#>
  </uix.Datagrid>
</uix.ArrayField>
<#if(sectionLabel && customizable){#>
</>
<#}#>
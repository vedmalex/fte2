<#@ context "ctx" -#>
<#@ alias 'display-edit-rel-multiple-embed' -#>
<#-
  const { entity, f, source, sectionLabel, readonly } = ctx;
-#>
<uix.ArrayInput
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}"
  source={`#{source}#{f.ref.backField}`}
  allowEmpty
>
  <uix.SimpleFormIterator>
  <# const e = entity.model.entities.find(e => e.name === f.ref.entity)
    const context = {
      entity: {
        ...e,
        props: !readonly ? e.lists.all : e.lists.all.map(f=>({...f, readonly})),
      },
      sectionLabel : true,
      source: '',
    }
  #>
    #{partial(context, 'display-edit-entity')}
  </uix.SimpleFormIterator>
</uix.ArrayInput>
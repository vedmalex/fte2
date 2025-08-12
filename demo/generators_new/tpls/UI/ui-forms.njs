<#@ context "entity" -#>
<#@ alias "ui-forms" -#>
<#@ chunks "$$$main$$$" -#>
<#if(!entity.embedded) {#>
<#- chunkStart(`${entity.name}/index.js`); -#>
#{partial(entity, 'forms-index')}

<#- chunkStart(`${entity.name}/title.js`); -#>
#{partial(entity, 'forms-title')}

<#- chunkStart(`${entity.name}/selectTitle.js`); -#>
#{partial(entity, 'forms-select-title')}

<#- chunkStart(`${entity.name}/list.js`); -#>
#{partial(entity, 'forms-list')}

<#- chunkStart(`${entity.name}/grid.js`); -#>
#{partial(entity, 'forms-grid')}

<#- chunkStart(`${entity.name}/filter.js`); -#>
#{partial(entity, 'forms-filter')}

<#- chunkStart(`${entity.name}/form.js`); -#>
#{partial(entity, 'forms-form')}

<#- chunkStart(`${entity.name}/preview.js`); -#>
#{partial(entity, 'forms-preview')}

<#- chunkStart(`${entity.name}/fragments.js`); -#>
#{partial(entity, 'forms-form-fragments')}

<#- chunkStart(`${entity.name}/cardView.js`); -#>
#{partial(entity, 'grid-card')}

<#- chunkStart(`${entity.name}/listView.js`); -#>
#{partial(entity, 'forms-grid-list')}

<#- chunkStart(`${entity.name}/gridView.js`); -#>
#{partial(entity, 'forms-grid-view')}

<#- chunkStart(`${entity.name}/styles.js`); -#>
const styles = theme => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
});

export default styles;
<#}#>

<#- chunkStart(`i18n/${entity.name}.js`); -#>
#{partial(entity, 'forms-i18n')}
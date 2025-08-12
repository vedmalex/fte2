<#@ context "ctx" -#>
<#@ alias 'display-show-field' -#>
<#-
  const {entity, f, source, grid, embedded} = ctx;
-#>
<uix.primitive.#{f.type}.Field 
  label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" 
  source={`#{source}#{f.name}<#if(f.isFile){#>.src<#}#>`}
  <# if(grid && embedded) {#>sortable={false}<#}#>
<#if(f.isFile){#>title={`#{source}#{f.name}.name`}<#}#>
/>
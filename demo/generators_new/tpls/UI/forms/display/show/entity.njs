<#@ context "context" #>
<#@ alias 'display-show-entity' #>
<# const {source, entity, grid, embedded, sectionLabel, customizable} = context#>
<# entity.props.forEach((f, index) => {
  const ctx = {
    entity,
    f,
    source,
    grid,
    embedded,
    sectionLabel,
    customizable,
  }
  const useForEmbeding = f.single && entity?.UI?.embedded?.hasOwnProperty(f.name);
#>
<#if(customizable && !useForEmbeding){#>
{ !excludedField.hasOwnProperty('#{source}#{f.name}') && 

<#}#>
<#if (!f.ref || f.isFile) {
  if (f.isFile) {
    if(f.isImage) {
      ctx.f.type = 'Image';
    } else {
      ctx.f.type = 'File';
    }
  }
  #>
    #{partial(ctx, "display-show-field")}
<#} else { 
    const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name); #>
  <#if ( f.single ) {#>
    <#if (embedded) {#>
  
      #{partial(ctx, "display-show-rel-single-embed")}
    <#} else {#>
      <# if(f.ref.stored) {#>
        #{partial(ctx, "display-show-rel-single-not-embed")}
      <#} else {#>
        #{partial(ctx, "display-show-rel-single-not-embed")}
      <#}#>
    <#}#>
  <#} else {#>
    <#if(embedded){ #>
      #{partial(ctx, "display-show-rel-multiple-embed")}
      <#} else {#>
      <#if(f.verb!=='BelongsToMany' || (f.verb==='BelongsToMany' && f.ref.using)){#>
        #{partial(ctx, "display-show-rel-multiple-not-embed")}
        <#} else {#>
        #{partial(ctx, "display-show-rel-multiple-not-embed-stored")}
      <#}#>
    <#}#>
  <#}#>
<#}#>
<#if(customizable && !useForEmbeding) {#>
}
<#}#>
<#});#>
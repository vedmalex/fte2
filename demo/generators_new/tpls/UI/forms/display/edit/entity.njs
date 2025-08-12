<#@ context "context" #>
<#@ alias 'display-edit-entity' #>
<# const {source, entity, sectionLabel, readonly, customizable } = context#>
<# 
entity.props.forEach((f, index) => {
  const ctx = {
    entity,
    f,
    source,
    sectionLabel,
    readonly,
    customizable,
  }
#>
<#if(customizable){#>
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
    #{partial(ctx, "display-edit-field")}
<#} else { 
    const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name);
    if((f.calculated || f.readonly) && !readonly) {
      ctx.readonly = true
    }
    #>
  <#if ( f.single ) {#>
    <#if (embedded) {#>
      #{partial(ctx, "display-edit-rel-single-embed")}
    <#} else {#>
      <# if(f.ref.stored) {#>
        #{partial(ctx, "display-edit-rel-single-not-embed-w-preview")}
      <#} else {#>
        #{partial(ctx, "display-edit-rel-single-not-embed")}
      <#}#>
    <#}#>
  <#} else {#>
    <#if(embedded){ #>
      #{partial(ctx, "display-edit-rel-multiple-embed")}
    <#} else {#>
      <#if(f.verb!=='BelongsToMany' || (f.verb==='BelongsToMany' && f.ref.using)){#>
        #{partial(ctx, "display-edit-show-rel-multiple-not-embed")}
        <#} else {#>
        #{partial(ctx, "display-edit-rel-multiple-not-embed")}
      <#}#>
    <#}#>
  <#}#>
<#}#>
<#if(customizable) {#>
}
<#}#>
<#});#>
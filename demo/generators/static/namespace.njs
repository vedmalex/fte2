// model
// #{context.name}

<#- context.metaview.forEach((file)=>{#>
#{file}
<#})-#>

<# context.metamodel.forEach((file)=>{#>
#{file}
<#})-#>

<# context.model.forEach((file)=>{#>
#{file}
<#})-#>

// stores
<# context.store.forEach((file)=>{#>
#{file}
<#})#>
<# context.metagridcombo.forEach((file)=>{#>
#{file}
<#})-#>
<# context.renderstore.forEach((file)=>{#>
#{file}
<#})#>
//metadata
<#- context.metafieldsets.forEach((file)=>{#>
#{file}
<#})-#>
<# context.metaclientmethods.forEach((file)=>{#>
#{file}
<#})-#>
<# context.metagridfields.forEach((file)=>{#>
#{file}
<#})-#>
<# context.metaviewfields.forEach((file)=>{#>
#{file}
<#})-#>
<# context.metaeditfields.forEach((file)=>{#>
#{file}
<#})-#>
<# context.metasearchfields.forEach((file)=>{#>
#{file}
<#})#>
//extjs
<# context.view.forEach((file)=>{#>
#{file}
<#})-#>
<# context.domain.forEach((file)=>{#>
#{file}
<#})-#>
<# context.controller.forEach((file)=>{#>
#{file}
<#})-#>

<#if(context.reqThings.length > 0){#>
Ext.require(#{JSON.stringify(context.reqThings)},
    function(){
        Ext.define('namespace.#{context.name}',{});
    }
)
<#} else {#>
Ext.define('namespace.#{context.name}',{});
<#}#>


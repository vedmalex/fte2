<#@ chunks "$$$main$$$" #>
<# const [ns, thingType] = context.thingType.split('.') #>

<#- chunkStart(`./${thingType}.js`); -#>

<# const chunks = ['model','store','metadata','app'] #>
Ext.require(#{JSON.stringify(chunks.map(chunk=> `things.${ns}.${chunk}.${thingType}`))},
    function(){
        Ext.define('things.#{context.thingType}',{});
    }
)
<#- chunkStart(`./model/${thingType}.js`); -#>
// model
<# context.metaview.forEach((file)=>{#>
#{file}
<#})-#>

<# context.metamodel.forEach((file)=>{#>
#{file}
<#})-#>

<# context.model.forEach((file)=>{#>
#{file}
<#})-#>
Ext.define('things.#{ns}.model.#{thingType}',{});

<#- chunkStart(`./store/${thingType}.js`); -#>
Ext.require('things.#{ns}.model.#{thingType}', function() {
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

    Ext.define('things.#{ns}.store.#{thingType}',{});
})

<#- chunkStart(`./metadata/${thingType}.js`); -#>
Ext.require(['things.#{ns}.model.#{thingType}','things.#{ns}.store.#{thingType}'], function() {
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
    Ext.define('things.#{ns}.metadata.#{thingType}',{});
})

<#- chunkStart(`./app/${thingType}.js`); -#>
Ext.require(['things.#{ns}.model.#{thingType}','things.#{ns}.store.#{thingType}','things.#{ns}.metadata.#{thingType}'], function(){
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
    Ext.define('things.#{ns}.app.#{thingType}',{});
})
<# chunkEnd(); -#>



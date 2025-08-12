<#@ noContent #>
<#
let $namespace="";
let nsa = [];
for(let i = 0; i < context.normalizedName.length-1;i++){
  nsa.push(context.normalizedName[i]);
}
const config = context.getThingConfig(context)

$namespace = nsa.join(".");
let name = context.normalizedName[context.normalizedName.length-1];
#>

Ext.define('Modeleditor.store.#{$namespace}.#{name}', {
  serverModel: '#{context.$normalizedName}',
  requires:['Modeleditor.model.#{$namespace}.#{name}'],
  extend: 'Ext.data.LoggedStore',
  model: 'Modeleditor.model.#{$namespace}.#{name}',
  <#- if(context.extension){#>#{context.extension},<#}#>
  staticStore:#{context.staticStore},
  autoLoad:false,
  autoSync:false,<#if(!context.staticStore && !context.queryResult){#>
  remoteFilter:true,
  remoteSort:true,
  pageSize: #{config.pageSize},<#} else {#>
  remoteFilter:false,
  remoteSort:false,
  pageSize: -1,
  <#- }#><#
  if(context.sortProperty && context.sortProperty.length > 0){#>
  sorters: [<#
  let sortPr;
  for (let i = 0, len = context.sortProperty.length; i < len; i++) {
    sortPr = context.sortProperty[i];
    if(i > 0){#>, <#}
  #>{
    property:'#{sortPr.property}',
    direction:'#{sortPr.direction}'
  }<#}#>
  ]
  <#- }#>
});
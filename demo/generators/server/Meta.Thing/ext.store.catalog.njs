<#@ noContent #>
<#
let $namespace="";
let nsa = [];
for(let i = 0; i < context.normalizedName.length-1;i++){
  nsa.push(context.normalizedName[i]);
}
$namespace = nsa.join(".");
const config = context.getThingConfig(context)

let name = context.normalizedName[context.normalizedName.length-1];
#>
Ext.define('Modeleditor.store.#{$namespace}.Catalog.#{name}', {
  serverModel: '#{context.$normalizedName}',
  requires:['Modeleditor.model.#{$namespace}.Catalog.#{name}'],
  extend: 'Ext.data.LoggedStore',
  model: 'Modeleditor.model.#{$namespace}.Catalog.#{name}',
  staticStore:#{context.staticStore},
  autoLoad:false,
  autoSync:false,<#if(!context.staticStore && !context.queryResult){#>
  remoteFilter:true,
  remoteSort:true,
  pageSize: #{config.pageSizeEmbedded},<#} else {#>
  remoteFilter:false,
  remoteSort:false,
  pageSize: -1,
  <#- }#>extKeys:{},  <#
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
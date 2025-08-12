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

Ext.define('Modeleditor.store.#{$namespace}.Search.#{name}', {
  storeId: "#{context.$namespace}.Search.#{context.$name}",
  serverModel: '#{context.$normalizedName}',
  requires:['Modeleditor.model.#{$namespace}.#{name}'],
  extend: 'Ext.data.LoggedStore',
  model: 'Modeleditor.model.#{$namespace}.#{name}',
  autoLoad:false,
  autoSync:false,
  remoteFilter:true,
  remoteSort:true,
  pageSize: #{config.pageSizeSearch},
  <#-
  if(context.sortProperty && context.sortProperty.length > 0){#>
  sorters: [<#
  let sortPr;
  for (let i = 0, len = context.sortProperty.length; i < len; i++) {
    sortPr = context.sortProperty[i];
    if(i > 0){#>, <#}
  #>{
    property:'#{sortPr.property}',
    direction:'#{sortPr.direction}'
  },<#}#>
  ],
  <#- }#>
  proxy: {
    type: 'direct',
    directFn: Modeleditor.runSearch,
    <#if(!(context.queryResult || context.legacySearch)){ #>
    writer: {
      type: "jsonmn",
      writeAllFields: true
    },
    reader: {
      type: "jsonmn",
      root: "data"
    },
    <#}#>
    extraParams:{
      queryName: #{context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined}
    }
  }
});
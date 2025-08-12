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
Ext.define('Modeleditor.store.#{$namespace}.Selected.#{name}', {
  serverModel: '#{context.$normalizedName}',
  requires:['Modeleditor.model.#{$namespace}.#{name}'],
  extend: 'Ext.data.LoggedStore',
  model: 'Modeleditor.model.#{$namespace}.#{name}',
  staticStore:#{context.staticStore},
  autoLoad:false,
  autoSync:false,
  remoteFilter:true,
  remoteSort:true,
  pageSize: #{config.pageSizeEmbedded},
  proxy: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].proxy(),
  data:[],  <#
  if(context.sortProperty && context.sortProperty.length > 0){#>
  sorters: [<#
  for (let i = 0, len = context.sortProperty.length; i < len; i++) {
    let sortPr = context.sortProperty[i];
    if(i > 0){#>, <#}
  #>{
    property:'#{sortPr.property}',
    direction:'#{sortPr.direction}'
  }<#}#>
  ]
  <#- }#>
});
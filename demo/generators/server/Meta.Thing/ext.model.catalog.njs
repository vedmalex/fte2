<#@ noContent #>
Ext.define('Modeleditor.model.#{context.namespace}.Catalog.#{context.$name}', {
  extend: "Ext.data.ActiveModel",
  idgen: {
    type: 'mongoIdgen',
    model: '#{context.namespace}.#{context.$name}',
    location: 'db'
  },
  widget: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].widget,
  queryResult: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].queryResult,
  refreshMethod: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].refreshMethod,
  <#-  if(context.cal_mapping){#>
  statics: {
    calendarMapping : Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].statics?.calendarMapping,
  },
  <#- }#>
  serverModel:'#{context.$normalizedName}',
  relNames: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].relNames,
  groupedRels: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].groupedRels,
  fields: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].fields?.(),
  validations: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].validations?.(),
  associations: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].associations?.(),
  proxy:Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].proxy(),
  inheritance: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].inheritance,
  stateMachineHash: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].stateMachineHash,
  _fireSMEvent: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}']._fireSMEvent,
  ...Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].methods,
  }
);
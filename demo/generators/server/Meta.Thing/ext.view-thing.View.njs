<#@ noContent #>
<#
  const _ = require('lodash')

  const smartSort = context.smartSort
  const fieldsets = context.fieldset
  const inFieldset = context.inFieldset

#>Ext.define('Modeleditor.view.#{context.$namespace}.View.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: 'Modeleditor.view.base.baseForm',
  alias: 'widget.#{context.$widgetName}view',
  // iconCls: _r('iconCls', '', '#{context.$namespace}.#{context.$name}'),
  layout: 'column',
  border: false,
  widget: '#{context.$widgetName}',
<#- if(context.periodicalRel){#>
  periodicalRel:{
    from:'#{context.periodicalRel.from}',
    to:'#{context.periodicalRel.to}',
    fromKeyField:'#{context.periodicalRel.fromKeyField}',
    toKeyField:'#{context.periodicalRel.toKeyField}',
  },
<#- }#>

  embedKey: '#{context.$namespace}#{context.$name}',
  modelName: 'Modeleditor.model.#{context.$namespace}.#{context.$name}',
  defaults: {
    margin: '0 5 5 5',
    xtype: 'textfield',
    columnWidth: 1
  },
  initComponent: function() {
    DirectCacheLogger.userStories('View Form Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id });
    Ext.apply(this,{
      items: [
        {
          name: 'id',
          fieldLabel: _t('id','SYSTEM', 'labels'),
          hidden: true
        },
        {
          name: '_id',
          fieldLabel: _t('id','SYSTEM', 'labels'),
          hidden: true
        },
        <#

        function builItems(items) {
          const fiit = items.filter(i=>i.type != 'fieldset')
          const fsit = items.filter(i=>i.type == 'fieldset')
          for( let i = 0; i< fiit.length; i +=1){
            const item = fiit[i]
            switch(item.type){
              case 'property':
              const f = item.item
              const property = f.property
              if(f.generated){
                  #>
                  Grainjs.metadata['viewfields.#{context.$namespace}.#{context.$name}'][`#{property.propertyName}::#{f.displayName}`],
                <#- }
              break
              case 'fieldset':
              const fs = item.item
              if(fs.formItems?.length > 0){
              #>
              Grainjs.metadata['metafieldsets.#{context.$namespace}.#{context.$name}']['#{fs.displayName}']([
                <#
                builItems(fs.formItems)
              #>]),
              <#
              }
              break
            }
          }
          for( let i = 0; i< fsit.length; i +=1){
            const item = fsit[i]
            switch(item.type){
              case 'property':
              const f = item.item
              const property = f.property
              if(f.generated){
                  #>
                  Grainjs.metadata['viewfields.#{context.$namespace}.#{context.$name}'][`#{property.propertyName}::#{f.displayName}`],
                <#- }
              break
              case 'fieldset':
              const fs = item.item
              if(fs.formItems?.length > 0){
              #>
              Grainjs.metadata['metafieldsets.#{context.$namespace}.#{context.$name}']['#{fs.displayName}']([
                <#
                builItems(fs.formItems)
              #>]),
              <#
              }
              break
            }
          }
        }
        builItems(context.formItems)
        #>
      ],
      listeners: {
        recordloaded: function(form, record, operation) {
          DirectCacheLogger.userStories('View Form Record Loaded', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, recordId: record?.getId() });
        },
        beforerecordload: function(form, record, operation) {
          DirectCacheLogger.userStories('View Form Before Record Load', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, recordId: record?.getId() });
        },
        render: function(form) {
          DirectCacheLogger.userStories('View Form Render', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id });
        }
      }
    });
    this.callParent(arguments);
  }
});

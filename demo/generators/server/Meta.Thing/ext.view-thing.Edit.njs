<#@ noContent #>
Ext.define('Modeleditor.view.#{context.$namespace}.Edit.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: 'Modeleditor.view.base.baseForm',
  alias: 'widget.#{context.$widgetName}edit',
  layout: 'column',
  bodyPadding: 10,
  iconCls:  _r('iconCls', '', '#{context.$namespace}.#{context.$name}') <#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
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
    DirectCacheLogger.userStories('Edit Form Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id });
    Ext.apply(this,{
      title: this.title || this.toDisplay || _t("#{context.$name}",'#{context.$namespace}.#{context.$name}', 'titles','List'),
      items: [
        {
          name: 'id',
          fieldLabel: _t('id', 'SYSTEM', 'labels'),
          hidden: true
        },
        {
          name: '_id',
          fieldLabel: _t('id', 'SYSTEM', 'labels'),
          hidden: true
        },
        <#
        //generate properties which not in fieldsets
        function builItems(items) {

          for( let i = 0; i< items.length; i +=1){
            const item = items[i]
            switch(item.type){
              case 'property':
              const f = item.item
              const property = f.property
              if(f.generated){
                  #>
                  Grainjs.metadata['editfields.#{context.$namespace}.#{context.$name}'][`#{property.propertyName}::#{f.displayName}`](),
                <#- }
              break
              case 'method':
              const method = item.item.clientmethod
              #>
                Grainjs.metadata['metaclientmethods.#{context.$namespace}.#{context.$name}'].buttons['#{method.name}'](),
              <#
              break
              case 'fieldset':
              const fs = item.item
              if(fs.formItems?.length > 0){
              #>
              Grainjs.metadata['metafieldsets.#{context.$namespace}.#{context.$name}']['#{fs.displayName}']([<#
                builItems(fs.formItems)
              #>]),
              <#
              }
              break
            }
          }
        }

        builItems(context.formItems)

        if (context.periodicalRel) {#>,
        {
          xtype: 'periodicaleventbar',
          panelWidget: '#{context.$widgetName}edit',
          startProp: '#{context.startProp}',
          endProp: '#{context.endProp}',
        },<#}#>
      ],
      listeners: {
        recordloaded: function(form, record, operation) {
          DirectCacheLogger.userStories('Edit Form Record Loaded', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, recordId: record?.getId() });
        },
        beforerecordload: function(form, record, operation) {
          DirectCacheLogger.userStories('Edit Form Before Record Load', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, recordId: record?.getId() });
        },
        fieldchange: function(form, field, newValue, oldValue) {
          DirectCacheLogger.userStories('Edit Form Field Change', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, fieldName: field.name, newValue: newValue, oldValue: oldValue });
        }
      }
    });
    this.callParent(arguments);
  }
});

<#@ noContent #>

Ext.define('Modeleditor.view.#{context.$namespace}.Search.#{context.$name}', {
  serverModel: '#{context.$normalizedName}',
  // requires: [#{context.requires}],
  extend: 'Ext.form.Panel',
  property: { root:1 },
  alias: 'widget.#{context.$widgetName}search',
  layout: 'column',
  border: false,
  widget: '#{context.$widgetName}',
  // iconCls:  _r('iconCls', '', '#{context.$namespace}.#{context.$name}') <#if(context.iconCls){#>|| "#{context.iconCls}"<#}#> ,
  embedKey: '#{context.$namespace}#{context.$name}',
  modelName: 'Modeleditor.model.#{context.$namespace}.#{context.$name}',
  defaults: {
    margin: '0 5 5 5',
    xtype: 'textfield',
    columnWidth: 1
  },
  <#
    const localStateMachine = context.stateMachine;
    if(localStateMachine && localStateMachine.event && localStateMachine.event.length > 0){#>
  stateMachineHash: Grainjs.metadata['model.#{context.$namespace}.#{context.$name}'].stateMachineHash,
  <#}#>
  <#- if(context.queryResult || context.legacySearch){#>
  customSearch: true,
  <#}#>

  initComponent: function() {
    const me = this
    DirectCacheLogger.userStories('Search Form Init Component', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, customSearch: this.customSearch });
    let items = [
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
      //generate properties which not in fieldsets
      function builItems(items) {
        for( let i = 0; i< items.length; i +=1){
          const item = items[i]
          switch(item.type){
            case 'property':
            const f = item.item
            const property = f.property
            if(!f.hiddenForSearch){
                #>
                Grainjs.metadata['searchfields.#{context.$namespace}.#{context.$name}'][`#{property.propertyName}::#{f.displayName}`](me.customSearch),
              <#- }
            break
            case 'fieldset':
            const fs = item.item
            if(fs.formItems?.length > 0 && !fs.hiddenForSearch) {
            #>
            Grainjs.metadata['metafieldsets.#{context.$namespace}.#{context.$name}'][`#{fs.displayName}${me.customSearch ? '':'-search'}`]([<#
              builItems(fs.formItems)
            #>]),
            <#
            }
            break
          }
        }
      }

      builItems(context.formItems)#>
    ];
    if(!me.customSearch) {
      items.splice(1,0, {
        xtype:'fieldset',
        layout:         'column',
        collapsible:    true,
        collapsed:      true,
        title:         _t('Search params','SYSTEM', 'labels'),
        defaults: {
          margin: '0 5 5 5',
          columnWidth: 1,
          xtype: 'textfield',
        },
        items: [{
          name: 'ensure',
          fieldLabel: _t('Ensure it exists','SYSTEM', 'labels'),
          columnWidth: 0.5,
          xtype: 'checkbox',
          hidden: this.property.root,
        },{
          name: 'absent',
          fieldLabel: _t('Ensure it absent','SYSTEM', 'labels'),
          columnWidth: 0.5,
          xtype: 'checkbox',
          hidden: this.property.root,
        },
        {
          name: 'json',
          xtype: 'textareafield',
          extraSearchOption:true,
          optionName: "json",
          propertyName: 'root',
          rows: 3,
          grow: true,
          labelWidth: 0,
        }]
      })
    }
    Ext.apply(this,{
      items,
      listeners: {
        render: function(form) {
          DirectCacheLogger.userStories('Search Form Render', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, customSearch: this.customSearch });
        },
        fieldchange: function(form, field, newValue, oldValue) {
          DirectCacheLogger.userStories('Search Form Field Change', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id, fieldName: field.name, newValue: newValue, oldValue: oldValue });
        },
        reset: function(form) {
          DirectCacheLogger.userStories('Search Form Reset', { serverModel: '#{context.$namespace}.#{context.$name}', formId: this.id });
        }
      }
    });
    this.callParent(arguments);
  }
});

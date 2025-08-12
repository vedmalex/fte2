<#@ noContent #>
<#
  const _ = require('lodash')
  const fieldsets = context.fieldset
#>

Ext.define('Grainjs.metafieldsets.#{context.$namespace}.#{context.$name}', {
  override: 'Grainjs.metadata',
  statics:{
    'metafieldsets.#{context.$namespace}.#{context.$name}':{
      <#-  if(fieldsets) {
          for (let i = 0; i < fieldsets.length; i++) {
            let fs = fieldsets[i];
            if(fs.formItems?.length > 0){
            #>
            '#{fs.displayName}':  (items)=>{
              const res = {
                xtype:          'fieldset',
                <#if(fs.displayName !== '_'){#>
                title:          _t('#{fs.displayName}','#{context.$namespace}.#{context.$name}', 'fieldset'),
                <#} else {#>
                cls: 'fieldset-empty-title',
                <#}#>
                columnWidth:    #{fs.columnWidth},
                height:         #{fs.height},
                collapsible:    #{fs.collapsible},

                collapsed:      #{fs.collapsed},
                layout:         'column',
                defaults: {
                  margin: '0 5 5 5',
                  columnWidth: 1,
                  xtype: 'textfield'
                },
                items,
              }
            <#if(fs.extraOptions && fs.extraOptions!== '{}'){#>
            return {
                ...res,
                ...#{fs.extraOptions},
              }
            <#} else {#>
            return res
            <#}#>
            },
            '#{fs.displayName}-search':  (items)=>({
                xtype:          'fieldset',
                collapsible:    #{fs.collapsible},
                collapsed:      #{fs.collapsed},
                <#if(fs.displayName !== '_'){#>
                title:          _t('#{fs.displayName}','#{context.$namespace}.#{context.$name}', 'fieldset'),
                <#} else{#>
                cls: 'fieldset-empty-title',
                <#}#>
                items,
            }),
            <#
            }
          }
        }
        #>
    }
  }
})

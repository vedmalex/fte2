<#@ noContent #>
<#
  const _ = require('lodash')
  const arrayToHash = context.arrayToHash
  const getFormat = context.getFormat

  let properties = context.formview.filter(fv=> fv.generated)
#>

Ext.define('Grainjs.metaviewfields.#{context.$namespace}.#{context.$name}', {
  override: 'Grainjs.metadata',
  statics:{
    'viewfields.#{context.$namespace}.#{context.$name}': {
    <#
      for( let i = 0; i < properties.length; i +=1) {
        const f = properties[i]
          let property = f.property;
          // тут может быть много полей и все они удалятся
              #>
              [`#{property.propertyName}::#{f.displayName}`]:{
                name:           '#{property.propertyName}',
                <#if(f.displayName !== '_'){#>
                fieldLabel:     _t(#{JSON.stringify(f.displayName)},'#{context.$namespace}.#{context.$name}', 'labels','#{property.propertyName}'),
                cls:   "displayFld custom-x-field",
                <#} else {#>
                cls:   "emptyLabel custom-x-field",
                <#}#>
                hidden:         #{f.hidden},
                <#if(f.labelWidth){#>
                labelStyle:     'min-width:#{f.labelWidth}px;',
                <#}#>
                labelAlign:     #{JSON.stringify(f.labelAlign)},
                labelWidth:     #{f.labelWidth},
                columnWidth:    #{f.columnWidth},
                renderer:       #{context.getDisplayFieldRenderer(f)},
                dataType:       '#{property.type.toLowerCase()}',
                grow:           #{f.grow},
                format:         #{getFormat(f)},
                margin: "4px",

                <#if(f.fieldtype ==='checkbox'){#>
                xtype:         'checkbox',
                readOnly:       true,
                inputValue:         1,
                uncheckedValue:     0,
                <#} else {#>
                xtype:         'displayfield',
                <#}#>
                <#- if(f.fieldtype === "combobox"){#>
                comboOptions:   Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions['#{property.propertyName}'],
                <#if(f.comboForcePreload){#>
                renderStore: Grainjs.metadata['renderstore.#{context.$namespace}.#{context.$name}'][#{JSON.stringify(property.propertyName)}],
                <# } else {#>
                // renderStore: Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions[#{JSON.stringify(property.propertyName)}]?.store(),
                <# }#>
                <#- }#>
              },
            <#
      }
    #>
    }
  }
})

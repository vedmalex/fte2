<#@ noContent #>
<#-
  //Helpers for generation
  let properties = [...context.gridviewProps].sort((a,b)=>a.property.propertyName > b.property.propertyName? 1:-1 )
#>

Ext.define('Grainjs.renderstore.#{context.$namespace}.#{context.$name}', {
  override: 'Grainjs.metadata',
  statics:{
    'renderstore.#{context.$namespace}.#{context.$name}': {
        <#-
          // отфильтровать свойства по видимости на форме...
        for(let i=0; i<properties.length; i++){
          let property = properties[i].property;
          const props = context.formPropsHash[property.propertyName].filter(f=>f.generated && f.comboForcePreload)
          if(props.length === 0){#>
          #{JSON.stringify(property.propertyName)}: {},
          <#} else {
          for(let j = 0; j < props.length; j++){
            const f = props[j]
        #>
          #{JSON.stringify(property.propertyName)}:Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions['#{property.propertyName}']?.store?.(),
        <#- } } #>
        <#- }#>
    },
  },
})



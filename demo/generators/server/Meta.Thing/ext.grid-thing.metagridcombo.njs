<#@ noContent #>
<#-
  //Helpers for generation
  let properties = [...context.gridviewProps].sort((a,b)=>a.property.propertyName > b.property.propertyName? 1:-1 )

#>

Ext.define('Grainjs.metagridcombo.#{context.$namespace}.#{context.$name}', {
  override: 'Grainjs.metadata',
  statics:{
    'gridcombo.#{context.$namespace}.#{context.$name}': {
      comboOptions: {
        <#-
          // отфильтровать свойства по видимости на форме...
        for(let i=0; i<properties.length; i++){
          let property = properties[i].property;
          const props = context.formPropsHash[property.propertyName].filter(f=>f.generated)
          if(props.length === 0){#>
          #{JSON.stringify(property.propertyName)}: {},
          <#} else {
          for(let j = 0; j < props.length; j++){
            const f = props[j]
        #>
          #{JSON.stringify(property.propertyName)}: {
          <#- if(f.comboData && f.comboData!="" && f.comboData!="{}") {
              let cdata = JSON.parse(f.comboData);#>
            <#- if(cdata.store!=undefined && cdata.displayField!=undefined && cdata.valueField!=undefined) {#>
                <#- if(cdata.tpl){#>
                tpl: #{JSON.stringify(cdata.tpl)},
                <#- }#>
                store:
                <#- if(typeof(cdata.store)=="string"){#>
                  ()=>Ext.create('Modeleditor.store.#{cdata.store}', {
                  autoLoad: true,
                  remoteFilter: false,
                  remoteSort: false,
                  pageSize: -1
                }),
                <#- } else if(typeof(cdata.store)=="object"){#>
                  ()=>Ext.create("Ext.data.Store", {
                    #{JSON.stringify(cdata.store)}
                  }),
                <#- }#>
                displayField: '#{cdata.displayField}',
                valueField: '#{cdata.valueField}',
                queryMode: 'local',
                // queryParam: "filter::#{cdata.valueField}",
                listeners:{
                  focus: function(combo, event, eOpts ) {
                    let store = combo.getStore();
                    combo.queryFilter = false;
                    store.clearFilter(true);
                  },
                  afterrender: function (combo, opts) {
                    let store = combo.getStore();
                    store.clearFilter(true); // If true the filter is cleared silently;
                    if(store.isLoading()){
                      combo.setLoading(true);
                      store.on({
                        load: {
                          fn: function(st, records, success, opts){
                            if(success) {
                              this.setLoading(false);
                            }
                          },
                          scope: combo,
                          single: true
                        }
                      });
                    }else{
                      if (!store.loaded) {
                        combo.setLoading(true);
                        store.load(function(records, operation, success){
                          if(success){
                            store.loaded = true;
                            combo.setLoading(false);
                          }
                        });
                      };
                    }
                  },
                },
              <#- } else if(cdata.customStore!=undefined && cdata.customStore === true){#>
                store: ()=>Ext.create("Ext.data.Store", {
                  autoSync:
                  <#- if(cdata.autoSync){#>
                    #{cdata.autoSync},
                  <#- } else {#>
                    false,
                  <#- }#>
                  <#-  if(cdata.model){#>
                  model: "#{cdata.model}",
                  <#- } else {#>
                  fields:
                    <#- if(cdata.fields){#>
                      #{JSON.stringify(cdata.fields)},
                    <#- } else {#>
                    ['name', 'value'],
                    <#- }#>
                  <#- }#>
                  <#- if(cdata.sorters){#>
                  sorters: #{JSON.stringify(cdata.sorters)},
                  <#- }#>
                <#- if(cdata.apiRead){#>
                  autoLoad: <#if(cdata.autoLoad){#>#{cdata.autoLoad}<#}else{#>false<#}#>,
                  proxy: {
                    type:
                    <#- if(cdata.proxyType){#>
                      "#{cdata.proxyType}",
                    <#- }else{#>
                      "direct",
                    <#- }#>
                    api: {
                      read: #{cdata.apiRead}
                    },
                    <#- if(cdata.extraParams){#>
                    extraParams: #{JSON.stringify(cdata.extraParams)},
                    <#- }#>
                    <#- if(cdata.reader){#>
                    reader: #{JSON.stringify(cdata.reader)}<#}#>
                    <#- if(cdata.writer){#>,
                    writer: #{JSON.stringify(cdata.writer)}
                    <#- }#>
                  },
                <#- }else{#>,
                  data: (#{JSON.stringify(cdata.data)} || [])
                  <#-  const displayField = cdata.displayField ? cdata.displayField : 'name' #>
                  .map(item=>({
                    ...item,
                    ['#{displayField}']:
                      _t(item['#{displayField}'],
                      '#{context.$namespace}.#{context.$name}',
                      'combobox',
                      '#{property.propertyName}')
                    }))
                  <#- }#>
                }),
                displayField: <#if(cdata.displayField){#>"#{cdata.displayField}"<#}else{#>'name'<#}#>,
                valueField: <#if(cdata.valueField){#>"#{cdata.valueField}"<#}else{#>"value"<#}#>,
                queryMode: <#if(cdata.queryMode){#>"#{cdata.queryMode}"<#}else{#>"local"<#}#>,
              <#- } else {#>
                store:()=> Ext.create('Ext.data.Store', {
                  autoLoad: true,
                  fields: ['name', 'value'],
                  data: (#{JSON.stringify(cdata.data)} || []).map(item=>({...item, name: _t(item.name,'#{context.$namespace}.#{context.$name}', 'combobox', '#{property.propertyName}')}))
                }),
                displayField: 'name',
                valueField: 'value',
                queryMode: 'local',
                listeners: {
                  focus: function(combo, event, eOpts ){
                    let store = combo.getStore();
                    combo.queryFilter = false;
                    store.clearFilter(true);
                  },
                  afterrender: function (combo, opts) {
                    let store = combo.getStore();
                    store.clearFilter(true); // If true the filter is cleared silently;
                    if(store.isLoading()){
                      combo.setLoading(true);
                      store.on({
                        load: {
                          fn: function(st, records, success, opts){
                            if(success) {
                              this.setLoading(false);
                            }
                          },
                          scope: combo,
                          single: true
                        }
                      });
                    }else{
                      if (!store.loaded) {
                        combo.setLoading(true);
                        store.load(function(records, operation, success){
                          if(success){
                            store.loaded = true;
                            combo.setLoading(false);
                          }
                        });
                      };
                    }
                  },
                },
                <#
              }
            }#>
          },
        <#- } } #>
        <#- }#>
      },
    },
  },
})


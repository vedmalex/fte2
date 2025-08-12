<#@ noContent #>
<#
  const _ = require('lodash')
  const getFormat = context.getFormat
  const needClear = context.needClear

  let properties = context.formview.filter(fv=> fv.generated)
#>

Ext.define('Grainjs.metaeditfields.#{context.$namespace}.#{context.$name}', {
  override: 'Grainjs.metadata',
  statics:{
    'editfields.#{context.$namespace}.#{context.$name}': {
    <#
      for( let i = 0; i < properties.length; i +=1){
        const f = properties[i]
          let property = f.property;
          // тут может быть много полей и все они удалятся
              #>
            [`#{property.propertyName}::#{f.displayName}`]: ()=>{
              const res = {
                name:               '#{property.propertyName}',
                <#if(f.displayName !== '_'){#>
                <#if(f.fieldtype!== 'filecontainer'){#>cls:"custom-x-field",<#}#>
                fieldLabel:         _t(#{JSON.stringify(f.displayName)},'#{context.$namespace}.#{context.$name}','labels','#{property.propertyName}'),
                <#} else {#>
                cls:   "emptyLabel custom-x-field",
                <#}#>
                hidden:             #{f.hidden},
                readOnly:           #{f.readOnly},
                emptyText:          _t(#{JSON.stringify(f.emptyText)},'#{context.$namespace}.#{context.$name}', 'emptyTexts', '#{property.propertyName}'),
                labelAlign:         #{JSON.stringify(f.labelAlign)},
                <#if(f.labelWidth){#>
                labelStyle:     'min-width:#{f.labelWidth}px;',
                <#}#>
                labelWidth:         #{f.labelWidth},
                columnWidth:        #{f.columnWidth},
                enableKeyEvents:    #{f.enableKeyEvents},
                grow:               #{f.grow},
                format:             #{getFormat(f)},
                plugins:            <#if(needClear(f)){#>[`clearbutton`]<#}else{#>[]<#}#>,
              <#-  if (property.event) {#>
                listeners: {
                  change: function(el, newValue, oldValue){
                    let form = this.up('form');
                    let record = form.getRecord();<#property.event.forEach(function(evnt){#>
                    form.#{evnt.fnName}(newValue, record , '#{evnt.propertyName.toLowerCase()}')<#})#>
                  }
                },
              <#- }#>
              <#- if (f.fieldtype == 'textfield' && (property.required || f.required)){#>
                allowOnlyWhitespace: false,
              <#- } else if (f.fieldtype == 'checkbox'){#>
                  margin: "0 5 5",
                  inputValue:         1,
                  uncheckedValue:     0,
              <#- } else if (f.fieldtype == 'numberfield'){#>
                  step:#{f.step},
                  fieldStyle:"text-align: right;",
                  <#- if(property.enableMin){#>
                      minValue:#{property.min ? property.min : 0},
                  <#- }#>
                  <#- if(property.enableMax){#>
                      maxValue:#{property.max ? property.max : 0},
                  <#- }#>
                  <#- if(property.type.toLowerCase() == "integer"){#>
                      allowDecimals:false,
                  <#- }#>
                <#- } else
                if (f.fieldtype == 'combobox'){
                  if(f.comboData && f.comboData!="" && f.comboData!="{}") {
                    let cdata = JSON.parse(f.comboData);
                    if(cdata.store!=undefined && cdata.displayField!=undefined && cdata.valueField!=undefined) {#>
                      store: <#if(typeof(cdata.store)=="string"){#>Ext.create('Modeleditor.store.#{cdata.store}', {
                        remoteFilter: false,
                        remoteSort: false,
                        pageSize: -1
                      }),<#
                        } else
                        if(typeof(cdata.store)=="object"){#>Ext.create("Ext.data.Store", {
                          #{JSON.stringify(cdata.store)}
                        }),<#}#>
                      displayField: '#{cdata.displayField}',
                      valueField: '#{cdata.valueField}',
                      queryMode: 'local',
                      // queryParam: "filter::#{cdata.valueField}",
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
                        }
                      },
                      <#
                    } else
                    if(cdata.customStore!=undefined && cdata.customStore === true){#>
                      <#- if(cdata.tpl){#>
                        tpl: #{JSON.stringify(cdata.tpl)},
                      <#- }#>
                      store: Ext.create("Ext.data.Store", {
                        autoSync: <#if(cdata.autoSync){#>#{cdata.autoSync}<#}else{#>false<#}#>,<#
                        if(cdata.model){#>
                        model: "#{cdata.model}",<#}
                        else{#>
                        fields: <#if(cdata.fields){#>#{JSON.stringify(cdata.fields)}<#} else {#>['name', 'value']<#}
                        }; if(cdata.sorters){#>,
                        sorters: #{JSON.stringify(cdata.sorters)}<#}; if(cdata.apiRead){#>,
                        autoLoad: <#if(cdata.autoLoad){#>#{cdata.autoLoad}<#}else{#>false<#}#>,
                        proxy: {
                          type: <#- if(cdata.proxyType){#>
                                  "#{cdata.proxyType}",
                                <#- }else{#>
                                  "direct",
                                <#- }#>
                          api: {
                            read: #{cdata.apiRead}
                          }
                          <#- if(cdata.extraParams){#>,
                          extraParams: #{JSON.stringify(cdata.extraParams)}<#}; if(cdata.reader){#>,
                          reader: #{JSON.stringify(cdata.reader)}<#}; if(cdata.writer){#>,
                          writer: #{JSON.stringify(cdata.writer)}<#}#>
                        }<#}else{#>,
                        data: (#{JSON.stringify(cdata.data)} || []).map(item=>({...item, [<#if(cdata.displayField){#>"#{cdata.displayField}"<#}else{#>'name'<#}#>]: _t(item[<#if(cdata.displayField){#>"#{cdata.displayField}"<#}else{#>'name'<#}#>],'#{context.$namespace}.#{context.$name}', 'combobox', '#{property.propertyName}')}))
                        <#- }#>
                      }),
                      displayField: <#if(cdata.displayField){#>"#{cdata.displayField}"<#}else{#>'name'<#}#>,
                      valueField: <#if(cdata.valueField){#>"#{cdata.valueField}"<#}else{#>"value"<#}#>,
                      queryMode: <#if(cdata.queryMode){#>"#{cdata.queryMode}"<#}else{#>"local"<#}#>,<#
                    } else {#>
                      store: Ext.create('Ext.data.Store', {
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
                        }
                      },
                      <#
                    }
                  }#>
                  forceSelection: #{f.forceSelection},
                  editable: #{f.comboAutocomplete},
                  <#
                };
                if(f.validator){#>
                validator: function(value){
                  #{f.validator}
                },<#}#>
                dataType: '#{property.type.toLowerCase()}',
                xtype: '#{f.fieldtype}'
            }
            res.allowBlank = #{!(property.required || f.required || property.clientRequired)}
            <#- if(property.required || f.required || property.clientRequired){#>
            res.afterLabelTextTpl = '<span style="color:red;" data-qtip="Required">*</span>'
            <#- }#>
            <#if(f.extraOptions && f.extraOptions!== '{}'){#>
            return {
                ...res,
                ...#{f.extraOptions},
              }
            <#} else {#>
            return res
            <#}#>
            },
            <#- }
    #>
    },
  }
})

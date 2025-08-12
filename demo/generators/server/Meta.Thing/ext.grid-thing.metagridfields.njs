<#@ noContent #>
<#-
  //Helpers for generation
  const getFormat = context.getFormat

  let properties = [...context.gridviewProps].sort((a,b)=>a.property.propertyName > b.property.propertyName? 1:-1 )
#>
  Ext.define('Grainjs.metagridfields.#{context.$namespace}.#{context.$name}', {
    override: 'Grainjs.metadata',
    statics:{
      'gridfields.#{context.$namespace}.#{context.$name}': {
        fields: {
        <#-
          for(let i=0; i<properties.length; i++){
            let property = properties[i].property;
            let g = properties[i]
            const viewProps = context.formPropsHash[property.propertyName].filter(f=>f.generated)
            let f;
            if(viewProps.length > 0){
              f = viewProps[0]
            } else {
              f = {}
            }
          #>
          [`#{property.propertyName}::#{g.columnText}`]:()=> ({
            dataIndex:"#{property.propertyName}",
            text:      _t(#{JSON.stringify(g.columnText)},'#{context.$namespace}.#{context.$name}','labels','#{property.propertyName}'),
            flex:      #{g.flex},<#if (g.width && g.width>0){#>
            width:    #{g.width},<#}#>
            hidden:      #{g.hidden},
            filterable:  #{property.isVirtual ? false : g.filterable},
            <#if(g.filterable){#>
            filter:
            <# if (g.enforceFilter === 'none' || !g.enforceFilter){#>
            <#- if(!property.isVirtual){
              if(f.fieldtype === "combobox" && g.filterable){#>{
              type: 'combo',
              <#if(f.comboForcePreload){#>
              store: Grainjs.metadata['renderstore.#{context.$namespace}.#{context.$name}'][#{JSON.stringify(property.propertyName)}],
              <#} else {#>
              store: Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions[#{JSON.stringify(property.propertyName)}].store(),
              <#}#>
              displayField:  Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions[#{JSON.stringify(property.propertyName)}].displayField,
              valueField:  Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions[#{JSON.stringify(property.propertyName)}].valueField
            }
            <#- } else if(!(g.filter|| g.filterable) && property.relation){#>
              "key"
            <#- } else  if(g.filter|| g.filterable){#>
              #{(g.filter|| g.filterable)}
            <#- }
            } else {#>false<#}#>
            <#} else if(g.enforceFilter === 'key'){#>
            "key"
            <#- } else if(g.enforceFilter === 'filter'){#>
            true
            <#}#>
            ,
            <#}#>
            sortable:     #{g.sortable},
            hideable:     #{g.hideable},
            draggable:    #{g.draggable},
            resizeable:   #{g.resizeable},
            menuDisabled: #{g.menuDisabled},
            format:      #{getFormat(g)},
            xtype:      "#{g.columntype}"<#
            if(!g.columnRenderer && f.fieldtype === "combobox"){#>,
            <#if(f.comboForcePreload){#>
            renderStore: Grainjs.metadata['renderstore.#{context.$namespace}.#{context.$name}'][#{JSON.stringify(property.propertyName)}],
            <#} else {#>
            // renderStore: Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions[#{JSON.stringify(property.propertyName)}].store(),
            <#}#>
            renderer:  function(value, me){
              let res = value;
              let options = Grainjs.metadata['gridcombo.#{context.$namespace}.#{context.$name}'].comboOptions[#{JSON.stringify(property.propertyName)}];
              let store = me.column.renderStore ?? options.store();
              if(store?.loadState !== Ext.data.LoggedStore.STATE_LOADED && !me.column.renderStoreLoaded) {
                const grid = me.column.up('grid')
                const column = me.column
                column.renderStoreLoaded = true
                column.renderStore = store
                Promisify.event(store, 'load').then(_=> {
                  grid.view.refresh();
                })
              }
              let index = store?.findExact(options.valueField, value) ?? -1;
              if (index != -1) {
                let result = store.getAt(index).data;
                res = result[options.displayField];
              }
              return res;
            }<#} else
            if(!g.columnRenderer && g.columntype === "numbercolumn"){#>,
              renderer: function(value) {
                return Ext.String.format('<div style="text-align: right;">{0}</div>', Ext.util.Format.number(value, #{getFormat(g)}));
              }
            <#- } else
            if(g.columnRenderer){#>,
            renderer:  function(value){
              #{g.columnRenderer}
            }<#}

            if (context.periodicalRel && property.propertyName == context.titleProp) {#>,
              xtype: "gridcolumn",
              renderer: function(val, metaData, record){
                let styling = false;
                let txt = "";
                let color = "#E8E8E8";

                if (record.get("_isperiodical")) {
                  styling = true;
                  txt = "P";
                  color = "#F5DEB3";
                } else if (record.get("_isperiodicalroot")) {
                  styling = true;
                  txt = "R";
                  color = "#E8E8E8";
                }

                if (styling) {
                  return '<div>'+
                    '<div style="float:left";>' +
                      val +
                    '</div>'+
                    '<div style="padding:1px 4px;'+
                      ' margin:0 0 0 10px;'+
                      ' -moz-border-radius:3px;'+
                      ' -webkit-border-radius:3px;'+
                      ' border-radius:3px;'+
                      ' background-color: '+color+';'+
                      ' float:right;>'+
                      ' -moz-box-shadow: 0 0 2px #888;'+
                      ' -webkit-box-shadow: 0 0 2px#888;'+
                      ' box-shadow: 0 0 2px #888;'+
                    '">'+txt+
                    '</div>'+
                  '</div>'
                } else {
                  return val;
                }
              }
            <#- }#>
          <#if(g.extraOptions && g.extraOptions!== '{}'){#>,...#{g.extraOptions},<#}#>
          }),
              <#-

          }
        #>
      }
    }
  }
})




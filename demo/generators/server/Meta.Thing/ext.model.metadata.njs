  <#@ noContent #>
  <#
  const makeRelVariants = context.makeRelVariants
  const iterateRelGroups = context.iterateRelGroups
  const rels = makeRelVariants(context.relations ?? [])

  const getThingConfig = context.getThingConfig
  const config = getThingConfig(context)

  function prohibitArray(key, value){
    if(Array.isArray(value)){
      return undefined;
    } else {
      return value;
    }
  }

  let defaultQuery = context.defaultQuery ? context.defaultQuery.name: '';
  if(!defaultQuery) {
    defaultQuery= "ReadByQuery."+context.$fullName;
  }

  let refreshMethod = context.defaultRefresh ? context.defaultRefresh.name: '';
  if(!refreshMethod) {
    refreshMethod = "ReadByQuery."+context.$fullName;
  }

  const getRS = context.getRS

  const calendar_mapping = context.cal_mapping;
  function parseStringDeep(str) {
    if (typeof str === 'string') {
      try {
        const v = JSON.parse(str)
        if (typeof v === 'string') {
          return parseStringDeep(v)
        }
        return str
      } catch (err) {
        return str
      }
    }
  }
  function fixDefaultValue(value, type) {
    if (value !== undefined) {
      let result
      switch (type) {
        case 'string':
        case 'date':
          if (typeof value === 'string') {
            result = parseStringDeep(value)
          } else if (value) {
            result = JSON.stringify(value)
          }
          break
        case 'int':
        case 'integer':
        case 'float':
          if (typeof value === 'number') {
            result = value
          } else if (typeof value === 'string') {
            try {
              const val = parseFloat(value)
              if (typeof val === 'number') {
                result = val
              } else {
                result = value
              }
            } catch (err) {
              result = value
            }
          }
          break
        case 'boolean':
          if (typeof value === 'boolean') {
            result = value
          } else {
            try {
              const val = JSON.parse(value)
              if (typeof val === 'boolean') {
                result = val
              } else {
                result = value
              }
            } catch (err) {
              result = value
            }
          }
          break
        default:
          result = value
      }
      return JSON.stringify(result)
    }
    return JSON.stringify(value)
  }

  function capitalize (str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  #>

  Ext.define('Model.metamodel.#{context.$namespace}.#{context.$name}', {
    override: 'Grainjs.metadata',
    statics:{
    'model.#{context.$namespace}.#{context.$name}': {
    widget: "#{context.$widgetName}",
    queryResult: #{context.queryResult},
    refreshMethod: #{refreshMethod},
    <#- if(context.properties){#>
    fields:()=> ([<#let ignoredFields = {};
        for (let i = 0; i < context.$$$ClientProperties.length; i++) {
          let prop = context.$$$ClientProperties[i]
          if (prop['autoInc']){
            ignoredFields[prop.propertyName] = true;
          }#>
      {
        name: '#{prop.propertyName}'
        <#- if(prop.type){ #>,
          type:'#{prop.type}'
          <#- if (prop.type == "date") {#>,
          dateFormat: 'c'<#
            }
          }
          if(prop.defaultValue){
          #>,
        defaultValue:#{fixDefaultValue(prop.defaultValue, prop.type)}<#}#>
      },<#}#><#if (calendar_mapping) {#>
      /* Standard calendar property
        Using:
          AbstarctCalendar.prepareData();
          base.periodicalMethods;
          base.unAssignPanel;
          base.periodicalEventBar;
          app.gen.view.list...;
          app.get.store...;
      */
      {
        name:'_isassigned',
        defaultValue:false,
        type:'boolean'
      },
      {
        name:'_isperiodical',
        defaultValue:false,
        type:'boolean'
      },
      {
        name:'_isperiodicalroot',
        defaultValue:false,
        type:'boolean'
      },
      {
        name:'_isperiodicalbydate',
        defaultValue:true,
        type:'boolean'
      },
      {
        name:'_groupingid',
        type:'string'
      },
      {
        name: 'ignoredfields',
        type: 'string',
        defaultValue: '#{JSON.stringify(ignoredFields)}'
      },<#}#>

      /* Relations property */
      <#
        iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
        if(rel.single && ((rel.derived && rel.derivation && rel.derivation.mode == 'server') || (!rel.derived && !rel.oppositeEmbedded))){#>      {
        name: '#{rel.to}<#if(variant !== "*"){#>#{rel.relName.split('.').join('')}<#}#>',
        type:'string'
      },<#}})#>
      /* key field */
      {
        name: 'id',
        type:'string'
      },
      {
        name: '_id',
        type:'string'
      }
    ]),

    validations: ()=> ([<#
    for (let i = 0; i < context.properties.length; i++) { let prop = context.properties[i];
    if(prop.required){#>
      {type: 'presence',  field: '#{prop.propertyName}'},<#}}#>
      {type: 'presence',  field: 'id'}
    ]),
  <#- }-#>
  <#if (calendar_mapping) {#>
    statics: {
      calendarMapping: {
        <#- if(calendar_mapping.cal_displayInfo && !calendar_mapping.cal_displayInfo.disable){#>DisplayInfo:{
          name: '#{calendar_mapping.cal_displayInfo.name}',
          function: function(record, callback){
            #{calendar_mapping.cal_displayInfo.function}
          }
        },<#}#>

        <#- if(calendar_mapping.cal_toolTip && !calendar_mapping.cal_toolTip.disable){#>ToolTipInfo:{
          name: '#{calendar_mapping.cal_toolTip.name}',
          function: function(record, callback){
            #{calendar_mapping.cal_toolTip.function}
          }
        },<#}#>

        EventId: {
          name:'id',
          type:'string'
        },<#if (calendar_mapping.CalendarId){#>CalendarId: {
          name:'#{calendar_mapping.CalendarId}',
          type:'int'
        },<#}#><#if (calendar_mapping.Title){#>Title: {
          name:'#{calendar_mapping.Title}',
          type:'int'
        },<#}#><#if (calendar_mapping.StartDate){#>StartDate: {
          name:'#{calendar_mapping.StartDate}',
          type:'int'
        },<#}#><#if (calendar_mapping.EndDate){#>EndDate: {
          name:'#{calendar_mapping.EndDate}',
          type:'int'
        },<#}#><#if (calendar_mapping.RRule){#>RRule: {
          name:'#{calendar_mapping.RRule}',
          type:'int'
        },<#}#><#if (calendar_mapping.Location){#>Location: {
          name:'#{calendar_mapping.Location}',
          type:'int'
        },<#}#><#if (calendar_mapping.Notes){#>Notes: {
          name:'#{calendar_mapping.Notes}',
          type:'int'
        },<#}#><#if (calendar_mapping.Url){#>Url: {
          name:'#{calendar_mapping.Url}',
          type:'int'
        },<#}#><#if (calendar_mapping.IsAllDay){#>IsAllDay: {
          name:'#{calendar_mapping.IsAllDay}',
          type:'int'
        },<#}#><#if (calendar_mapping.Reminder){#>Reminder: {
          name:'#{calendar_mapping.Reminder}',
          type:'int'
        },<#}#><#if (calendar_mapping.IsHidden){#>IsHidden: {
          name:'#{calendar_mapping.IsHidden}',
          type:'int'
        },<#}#><#if (calendar_mapping.Duration){#>Duration: {
          name:'#{calendar_mapping.Duration}',
          type:'int'
        }<#}#>
      }
    },
  <#- }#>

<#- if(context.relations){ #>
  associations:()=>([
    <#
      iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
      let rs = getRS(rel);
      if(!rel.navigable) { return }
      let $pk = (rel.single) ? rel.toKeyField : rel.fromKeyField;
      let $fk = (rel.single) ? rel.to : rel.from;
      let $value = (rel.single) ? rel.to : rel.from;
      if(!rel.single && Array.isArray(global.RelationCache.thing[rel.ref.thingType]?.[rel.from])){
        $fk += rel.relName.split('.').join('')
      } else if(rel.single && Array.isArray(global.RelationCache.thing[rel.model.thingType]?.[rel.to])){
        $fk += rel.relName.split('.').join('')
      }
      let $oppositePk =  (rel.single) ? rel.fromKeyField : rel.toKeyField;
    #>
    {
      <# const rConfg = getThingConfig(rel.ref) #>
      queryResult: #{rel.ref.queryResult},
      storeConfig: { pageSize: #{rConfg.pageSizeEmbedded} },
      variant: #{JSON.stringify(variant)},
      relName: '#{rel.relName}',
      noScan: #{rs?.noScan ?? false},
      requireValidOwner: #{rs?.requireValidOwner ?? false},
  <#- let serverSide = (rel.derived && rel.derivation && rel.derivation.mode == 'server') ?'ServerDerived':'';
    if(!rel.derived || serverSide){#>
      name:"#{rel.to}<#if(variant !== "*"){#>#{rel.relName.split('.').join('')}<#}#>",
      type:"#{rel.single?'belongsTo':('manyhasmany' + serverSide)}",
      serverModel:"#{rel.ref.thingType}",
      model:"Modeleditor.model.#{rel.ref.thingType}",

      // primaryKey:'id',
      primaryKey:'#{$pk}',
      foreignKey:'#{$fk}',
      embedded: #{rel.embedded},
      oppositeEmbedded: #{rel.oppositeEmbedded}
    <#- if(rel.single){#>,
      getterName:"get#{$fk}",
      setterName:"set#{$fk}"
    <#- } else if(!rel.single){#>,
      <#- /* this need both for embedded and with custom keys association  only for multiple end, to store the key value*/#>
      /*opposite key to store in relation*/
      oppositePk: "#{$oppositePk}"
    <#- }#><#} else {#>

      name:"#{rel.to }<# if(variant !== "*"){#>#{rel.relName.split('.').join('')}<#}#>",
      type:"#{rel.single?'belongsTo':'manyhasmany'}Derived",
      serverModel:"#{rel.ref.thingType}",
      model:"Modeleditor.model.#{rel.ref.thingType}"<#if(rel.single){#>,
      getterName:"get#{$fk}",
      setterName:"set#{$fk}"<#}#>,
      <#- if(rel.derivation){#>
      derivation: function(callback){
        #{rel.derivation.DerivationCode}
      }<#}#>

    <#- }#>},
  <#- })#>
  ]),
  relNames: {
    <#
    iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
      let rs = getRS(rel);
      if(!rel.navigable) { return }
      let middle = (rel.single) ? (rs && rs.toReadOnly===true) ? "View" : "Edit" : "ListEmbedded";

      const from = (Array.isArray(global.RelationCache.thing[rel.ref.thingType]?.[rel.from])) ? rel.from + rel.relName.split('.').join('') : rel.from
      const to = (variant !== "*") ? rel.to + rel.relName.split('.').join('') : rel.to
    #>

    '#{rel.to}<#if(variant !== "*"){#>#{rel.relName.split('.').join('')}<#}#>':  {
        "variant"           : #{JSON.stringify(variant)},
        "serverModel"       : "#{rel.ref.thingType}",
        "relName"           : #{JSON.stringify(rel.namespace + '.' + rel.name + '-' + rel.to)},
        "name"              : #{JSON.stringify('Modeleditor.view.' + rel.$refNamespace + '.' + middle + '.' + rel.$refName)},
        "toXType"           : #{JSON.stringify([rel.$refNamespace, rel.$refName, middle].join("").toLowerCase())},
        "middle"            : #{JSON.stringify(middle)},
        "to"                : #{JSON.stringify(to)},
        "toSearchable"      : #{rs.toSearchable},
        "fromSearchable"      : #{rs.fromSearchable},
        "toAggregation"     : #{(rel.toAggregation) ? JSON.stringify(rel.toAggregation) : undefined},
        "fromAggregation"   : #{(rel.fromAggregation) ? JSON.stringify(rel.fromAggregation) : undefined},
        "toGroup"           : _t(#{(rs && rs.toGroup) ? JSON.stringify(rs.toGroup) : undefined},'#{context.$namespace}.#{context.$name}', 'toGroup'),
        "toDisable"         : #{(rs) ? JSON.stringify(rs.toDisable) : undefined},
        "fromDisable"       : #{(rs) ? JSON.stringify(rs.fromDisable) : undefined},
        "toReadOnly"        : #{(rs) ? JSON.stringify(rs.toReadOnly) : undefined},
        "toOrder"           : #{(rs) ? JSON.stringify(rs.toOrder) : undefined},
        "toPreLoad"         : #{(rs) ? new Function("wnd, component, store, callback", rs.toPreLoad) : undefined},
        "toToolbar"         : #{(rs) ? JSON.stringify(rs.toToolbar, prohibitArray) : undefined},
        "toHeight"          : #{(rs) ? rs.toHeight : undefined},
        "toDisplay"         : _t(#{(rs) ? JSON.stringify(rs.toDisplay) : JSON.stringify(rel.to)},'#{context.$namespace}.#{context.$name}', 'toDisplay', '#{rel.to}'),
        "toKeyField"        : #{JSON.stringify(rel.toKeyField)},
        "from"              : #{JSON.stringify(from)},
        "fromKeyField"      : #{JSON.stringify(rel.fromKeyField)},
        "single"            : #{JSON.stringify(rel.single)},
        "required"          : #{JSON.stringify(rel.toRequired || rs.toRequired)},
        "oppositeSingle"    : #{JSON.stringify(rel.oppositeSingle)},
        "noScan"            : #{rs?.noScan ?? false},
        "requireValidOwner": #{rs?.requireValidOwner ?? false},
      },
  <#- })#>
  },
  // old_proxu: () => new Ext.data.proxy.Direct({
  //   type: 'direct',
  //   directFn: "#{defaultQuery}",
  //   /*do we need to load all associations? single and multiple???  */
  //   writer:{
  //     type:'jsonmn',
  //     writeAllFields: true
  //   },
  //   reader:{
  //     type:'jsonmn',
  //     root:'data'
  //   }
  // }),
  // always create new
  proxy: () => new Ext.data.proxy.Direct({
    type: 'direct',
    directFn: '#{defaultQuery}',
    writer: {
      type: 'jsonmn',
      writeAllFields: true
    },
    reader: {
      type: 'jsonmn',
      root: 'data'
    }
  }),
<#- } -#>
<# if(context.collectionCount > 1){#>
    inheritance: {
      "successors": #{JSON.stringify(context.successors)},
      "extends": #{JSON.stringify(context.extends)},
      "extendsXType": #{ context.extends ? JSON.stringify(context.extends.replace(/\./g, "").toLowerCase()) : undefined},
      "allSuccessors":<# let chlds = context.allChilds;
      let len = chlds ? chlds.length : 0;
      if(len > 0){
        let res = [];
        for (let i = 0; i< len; i++){
          res.push({name:chlds[i]});
        }#>
        #{JSON.stringify(res)}
      <#- } else {#>null<#}#>
    },
  <#- }#>
  <#
    let localStateMachine = context.stateMachine;
    if(localStateMachine && localStateMachine.event && localStateMachine.event.length > 0){#>
      /*State Machine support*/
      _fireSMEvent: function(event, callback){
        Modeleditor.fireEvent({model:this.serverModel, id:this.getId(), event:event}, callback);
      },
      <#
        /*stateMachineHash preparing*/
        let stateMachineHash = {
          statuses: {},
          states: {}
        };
        let states = localStateMachine.state;
        for (let i = 0; i < states.length; i++) {
          let state    = states[i];
          let name     = state.name;
          let _d       = state.displayName.split(';').map(function(e){return e;});
          let displays = [];
          for (let j = 0; j < _d.length; j++) {
            displays[j] = _d[j].trim();
          };

          stateMachineHash["states"][name] = displays;
          for (let k = 0; k < displays.length; k++) {
            let display = displays[k];
            stateMachineHash["statuses"][display] = name;
          }
        };
      #>
    // нужно сделать перевод внутри JSON, для этого просто проходим по JSON, его структура известна и дальше просто выводим значения в текстовый файл
    /* stateMachineHash: Ext.create("DualSideHash", #{JSON.stringify(stateMachineHash)}), */
    stateMachineHash: Ext.create("DualSideHash", {
      thing: "#{context.$namespace}.#{context.$name}",
      statuses: {
      <#- for(const name of Object.keys(stateMachineHash["statuses"])){#>
        [_t("#{name}","StateMachines","#{context.$namespace}.#{context.$name}","state")]: "#{stateMachineHash["statuses"][name]}",
      <#}#>
      },
      states: {
      <#-
       for(const name of Object.keys(stateMachineHash["states"])){#>
        #{JSON.stringify(name)}: [
        <#-
        if(stateMachineHash["states"]?.[name] && Array.isArray(stateMachineHash["states"][name])){
        const statuses = stateMachineHash["states"]?.[name]
        for (const status of statuses){
        #>
        _t(#{JSON.stringify(status)},"StateMachines","#{context.$namespace}.#{context.$name}","state"),
        <#}
        } -#>
        ],
      <#}#>
      },
    }),

  <#- }#>
  groupedRels:()=> ({<# let counter = Object.keys(context.groupedRels).length;
    for(let group in context.groupedRels){
      if (Object.prototype.hasOwnProperty.call(context.groupedRels, group)) {
      let grRels = makeRelVariants(context.groupedRels[group]); #>
    [_t("#{group}","#{context.$namespace}.#{context.$name}",'toGroup')] : {
      <#
        iterateRelGroups(grRels, (variant, rel, relIndex, variantIndex)=>{
        let rs = getRS(rel);
      #>
      "#{rel.to}
        <#- if(variant!== "*"){#>
          #{rel.relName.split('.').join('')}
        <#-}#>":
        _t("#{rs.toDisplay}",'#{context.$namespace}.#{context.$name}', 'toDisplay', '#{rel.to}'),
      <#- })#>
    },
    <#- }
    }#>}),
  methods: {
  <#
    let initConstructors = context.clientMethods?.filter(function(m){ return m.type == 'constructor' && !m.disable}) ?? []
    if(initConstructors.length > 0){
      #>
      ensureDefaults: function(){
        /*constructor init*/
        <#- for (let i = initConstructors.length - 1; i >= 0; i--) {
          let clMethod = initConstructors[i]
          if(!clMethod.disable){
            #>/*metodName >>> #{clMethod.name}*/<#
            if(clMethod.comment){#>/* #{clMethod.comment} */<#}#>
            #{clMethod.body}
          <#
          }
        }#>
      },
<#
    };
#>
<#
  let methods = context.clientMethods?.filter(function(m){ return m.type == 'model' && !m.disable}) ?? []
  if(( localStateMachine && context.debugSM ) || ( methods.length > 0 )) { #>
    /* initListeners for subscriptions*/
    initListeners: function() {
      this.callParent();
        <#if(localStateMachine && context.debugSM ){
          const stateAttribute = localStateMachine.stateAttribute
        #>
      this.#{`es${capitalize(localStateMachine.stateAttribute)}`}.subscribe(function (e) {
        var wnd;
        var wnds = Ext.ComponentQuery.query("window");
        for (var i = wnds.length - 1; i >= 0; i--) {
          var w = wnds[i];
          if (w.zIndexManager && w.modeleditorController) {
            wnd = w;
            break;
          }
        }
          if (e.record) {
          const currentState = e.record.get("#{stateAttribute}")
          ret = Promisify.direct(StoredQuery, "getAvailableEvents", {
            thing: "#{context.$namespace}.#{context.$name}",
            state: currentState,
            page: 1,
            start: 0,
            limit: 25
          })
          .then(data => {
            const list = wnd.query('button[toggleGroup=state]')
            const states = data.events.reduce((ret, cur)=>{
              ret[cur.key] = _t(cur.value, "StateMachines", "#{context.$namespace}.#{context.$name}", "state")
              return ret
            },{})

            for(const btn of list){
              if(states[btn.name]){
                btn.enable()
              } else {
                btn.disable()
              }
            }
          })
          .catch(e => {
            console.error('initListeners #{`es${capitalize(localStateMachine.stateAttribute)}`} error', e)
          })
        }

      });
        <#}#>
    <#
    if(methods.length > 0) {
      let rxInit = methods.filter(function(m){ return !(m.initListeners =='' || !m.initListeners) && !m.disable})
      if(rxInit.length>0){#>
          <#- for (let i = rxInit.length - 1; i >= 0; i--) {#>
      /*method >> #{rxInit[i].name}*/
      #{rxInit[i].initListeners}
          <#- }#>
      <#-}
    }#>
    },
<#    if(methods.length > 0){
        for (let i = methods.length - 1; i >= 0; i--) {
          let clMethod = methods[i];
          if(!clMethod.disable){#>
            <#- if(i==methods.length-1){#>
              /*model methods*/
            <#- }
            if(clMethod.comment){#>/* #{clMethod.comment} */<#}#>
            #{clMethod.name}: function(<#if(clMethod.params){#>#{clMethod.params}<#}#>){
              #{clMethod.body}
            },<#
          }
        }
      }
#>
<#}#>
  }
  }
  }
  })

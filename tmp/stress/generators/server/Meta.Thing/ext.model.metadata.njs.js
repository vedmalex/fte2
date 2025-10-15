module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        const makeRelVariants = context.makeRelVariants;
        const iterateRelGroups = context.iterateRelGroups;
        const rels = makeRelVariants(context.relations ?? []);
        const getThingConfig = context.getThingConfig;
        const config = getThingConfig(context);
        function prohibitArray(key, value) {
            if (Array.isArray(value)) {
                return undefined;
            } else {
                return value;
            }
        }
        let defaultQuery = context.defaultQuery ? context.defaultQuery.name : '';
        if (!defaultQuery) {
            defaultQuery = "ReadByQuery." + context.$fullName;
        }
        let refreshMethod = context.defaultRefresh ? context.defaultRefresh.name : '';
        if (!refreshMethod) {
            refreshMethod = "ReadByQuery." + context.$fullName;
        }
        const getRS = context.getRS;
        const calendar_mapping = context.cal_mapping;
        function parseStringDeep(str) {
            if (typeof str === 'string') {
                try {
                    const v = JSON.parse(str);
                    if (typeof v === 'string') {
                        return parseStringDeep(v);
                    }
                    return str;
                } catch (err) {
                    return str;
                }
            }
        }
        function fixDefaultValue(value, type) {
            if (value !== undefined) {
                let result;
                switch(type){
                    case 'string':
                    case 'date':
                        if (typeof value === 'string') {
                            result = parseStringDeep(value);
                        } else if (value) {
                            result = JSON.stringify(value);
                        }
                        break;
                    case 'int':
                    case 'integer':
                    case 'float':
                        if (typeof value === 'number') {
                            result = value;
                        } else if (typeof value === 'string') {
                            try {
                                const val = parseFloat(value);
                                if (typeof val === 'number') {
                                    result = val;
                                } else {
                                    result = value;
                                }
                            } catch (err) {
                                result = value;
                            }
                        }
                        break;
                    case 'boolean':
                        if (typeof value === 'boolean') {
                            result = value;
                        } else {
                            try {
                                const val = JSON.parse(value);
                                if (typeof val === 'boolean') {
                                    result = val;
                                } else {
                                    result = value;
                                }
                            } catch (err) {
                                result = value;
                            }
                        }
                        break;
                    default:
                        result = value;
                }
                return JSON.stringify(result);
            }
            return JSON.stringify(value);
        }
        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        out.push("\n");
        out.push("\n");
        out.push("  Ext.define('Model.metamodel." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("    override: 'Grainjs.metadata',\n");
        out.push("    statics:{\n");
        out.push("    'model." + (context.$namespace) + "." + (context.$name) + "': {\n");
        out.push("    widget: \"" + (context.$widgetName) + "\",\n");
        out.push("    queryResult: " + (context.queryResult) + ",\n");
        out.push("    refreshMethod: " + (refreshMethod) + ",\n");
        out.push("    ");
        if (context.properties) {
            out.push("\n");
            out.push("    fields:()=> ([");
            let ignoredFields = {};
            for(let i = 0; i < context.$$$ClientProperties.length; i++){
                let prop = context.$$$ClientProperties[i];
                if (prop['autoInc']) {
                    ignoredFields[prop.propertyName] = true;
                }
                out.push("\n");
                out.push("      {\n");
                out.push("        name: '" + (prop.propertyName) + "'\n");
                out.push("        ");
                if (prop.type) {
                    out.push(",\n");
                    out.push("          type:'" + (prop.type) + "'\n");
                    out.push("          ");
                    if (prop.type == "date") {
                        out.push(",\n");
                        out.push("          dateFormat: 'c'");
                    }
                }
                if (prop.defaultValue) {
                    out.push(",\n");
                    out.push("        defaultValue:" + (fixDefaultValue(prop.defaultValue, prop.type)));
                }
                out.push("\n");
                out.push("      },");
            }
            if (calendar_mapping) {
                out.push("\n");
                out.push("      /* Standard calendar property\n");
                out.push("        Using:\n");
                out.push("          AbstarctCalendar.prepareData();\n");
                out.push("          base.periodicalMethods;\n");
                out.push("          base.unAssignPanel;\n");
                out.push("          base.periodicalEventBar;\n");
                out.push("          app.gen.view.list...;\n");
                out.push("          app.get.store...;\n");
                out.push("      */\n");
                out.push("      {\n");
                out.push("        name:'_isassigned',\n");
                out.push("        defaultValue:false,\n");
                out.push("        type:'boolean'\n");
                out.push("      },\n");
                out.push("      {\n");
                out.push("        name:'_isperiodical',\n");
                out.push("        defaultValue:false,\n");
                out.push("        type:'boolean'\n");
                out.push("      },\n");
                out.push("      {\n");
                out.push("        name:'_isperiodicalroot',\n");
                out.push("        defaultValue:false,\n");
                out.push("        type:'boolean'\n");
                out.push("      },\n");
                out.push("      {\n");
                out.push("        name:'_isperiodicalbydate',\n");
                out.push("        defaultValue:true,\n");
                out.push("        type:'boolean'\n");
                out.push("      },\n");
                out.push("      {\n");
                out.push("        name:'_groupingid',\n");
                out.push("        type:'string'\n");
                out.push("      },\n");
                out.push("      {\n");
                out.push("        name: 'ignoredfields',\n");
                out.push("        type: 'string',\n");
                out.push("        defaultValue: '" + (JSON.stringify(ignoredFields)) + "'\n");
                out.push("      },");
            }
            out.push("\n");
            out.push("\n");
            out.push("      /* Relations property */\n");
            out.push("      ");
            iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
                if (rel.single && ((rel.derived && rel.derivation && rel.derivation.mode == 'server') || (!rel.derived && !rel.oppositeEmbedded))) {
                    out.push("      {\n");
                    out.push("        name: '" + (rel.to));
                    if (variant !== "*") {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("',\n");
                    out.push("        type:'string'\n");
                    out.push("      },");
                }
            });
            out.push("\n");
            out.push("      /* key field */\n");
            out.push("      {\n");
            out.push("        name: 'id',\n");
            out.push("        type:'string'\n");
            out.push("      },\n");
            out.push("      {\n");
            out.push("        name: '_id',\n");
            out.push("        type:'string'\n");
            out.push("      }\n");
            out.push("    ]),\n");
            out.push("\n");
            out.push("    validations: ()=> ([");
            for(let i = 0; i < context.properties.length; i++){
                let prop = context.properties[i];
                if (prop.required) {
                    out.push("\n");
                    out.push("      {type: 'presence',  field: '" + (prop.propertyName) + "'},");
                }
            }
            out.push("\n");
            out.push("      {type: 'presence',  field: 'id'}\n");
            out.push("    ]),\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  ");
        if (calendar_mapping) {
            out.push("\n");
            out.push("    statics: {\n");
            out.push("      calendarMapping: {\n");
            out.push("        ");
            if (calendar_mapping.cal_displayInfo && !calendar_mapping.cal_displayInfo.disable) {
                out.push("DisplayInfo:{\n");
                out.push("          name: '" + (calendar_mapping.cal_displayInfo.name) + "',\n");
                out.push("          function: function(record, callback){\n");
                out.push("            " + (calendar_mapping.cal_displayInfo.function) + "\n");
                out.push("          }\n");
                out.push("        },");
            }
            out.push("\n");
            out.push("\n");
            out.push("        ");
            if (calendar_mapping.cal_toolTip && !calendar_mapping.cal_toolTip.disable) {
                out.push("ToolTipInfo:{\n");
                out.push("          name: '" + (calendar_mapping.cal_toolTip.name) + "',\n");
                out.push("          function: function(record, callback){\n");
                out.push("            " + (calendar_mapping.cal_toolTip.function) + "\n");
                out.push("          }\n");
                out.push("        },");
            }
            out.push("\n");
            out.push("\n");
            out.push("        EventId: {\n");
            out.push("          name:'id',\n");
            out.push("          type:'string'\n");
            out.push("        },");
            if (calendar_mapping.CalendarId) {
                out.push("CalendarId: {\n");
                out.push("          name:'" + (calendar_mapping.CalendarId) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.Title) {
                out.push("Title: {\n");
                out.push("          name:'" + (calendar_mapping.Title) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.StartDate) {
                out.push("StartDate: {\n");
                out.push("          name:'" + (calendar_mapping.StartDate) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.EndDate) {
                out.push("EndDate: {\n");
                out.push("          name:'" + (calendar_mapping.EndDate) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.RRule) {
                out.push("RRule: {\n");
                out.push("          name:'" + (calendar_mapping.RRule) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.Location) {
                out.push("Location: {\n");
                out.push("          name:'" + (calendar_mapping.Location) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.Notes) {
                out.push("Notes: {\n");
                out.push("          name:'" + (calendar_mapping.Notes) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.Url) {
                out.push("Url: {\n");
                out.push("          name:'" + (calendar_mapping.Url) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.IsAllDay) {
                out.push("IsAllDay: {\n");
                out.push("          name:'" + (calendar_mapping.IsAllDay) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.Reminder) {
                out.push("Reminder: {\n");
                out.push("          name:'" + (calendar_mapping.Reminder) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.IsHidden) {
                out.push("IsHidden: {\n");
                out.push("          name:'" + (calendar_mapping.IsHidden) + "',\n");
                out.push("          type:'int'\n");
                out.push("        },");
            }
            if (calendar_mapping.Duration) {
                out.push("Duration: {\n");
                out.push("          name:'" + (calendar_mapping.Duration) + "',\n");
                out.push("          type:'int'\n");
                out.push("        }");
            }
            out.push("\n");
            out.push("      }\n");
            out.push("    },\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("\n");
        if (context.relations) {
            out.push("\n");
            out.push("  associations:()=>([\n");
            out.push("    ");
            iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
                let rs = getRS(rel);
                if (!rel.navigable) {
                    return;
                }
                let $pk = (rel.single) ? rel.toKeyField : rel.fromKeyField;
                let $fk = (rel.single) ? rel.to : rel.from;
                let $value = (rel.single) ? rel.to : rel.from;
                if (!rel.single && Array.isArray(global.RelationCache.thing[rel.ref.thingType]?.[rel.from])) {
                    $fk += rel.relName.split('.').join('');
                } else if (rel.single && Array.isArray(global.RelationCache.thing[rel.model.thingType]?.[rel.to])) {
                    $fk += rel.relName.split('.').join('');
                }
                let $oppositePk = (rel.single) ? rel.fromKeyField : rel.toKeyField;
                out.push("\n");
                out.push("    {\n");
                out.push("      ");
                const rConfg = getThingConfig(rel.ref);
                out.push("\n");
                out.push("      queryResult: " + (rel.ref.queryResult) + ",\n");
                out.push("      storeConfig: { pageSize: " + (rConfg.pageSizeEmbedded) + " },\n");
                out.push("      variant: " + (JSON.stringify(variant)) + ",\n");
                out.push("      relName: '" + (rel.relName) + "',\n");
                out.push("      noScan: " + (rs?.noScan ?? false) + ",\n");
                out.push("      requireValidOwner: " + (rs?.requireValidOwner ?? false) + ",\n");
                out.push("  ");
                let serverSide = (rel.derived && rel.derivation && rel.derivation.mode == 'server') ? 'ServerDerived' : '';
                if (!rel.derived || serverSide) {
                    out.push("\n");
                    out.push("      name:\"" + (rel.to));
                    if (variant !== "*") {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("\",\n");
                    out.push("      type:\"" + (rel.single ? 'belongsTo' : ('manyhasmany' + serverSide)) + "\",\n");
                    out.push("      serverModel:\"" + (rel.ref.thingType) + "\",\n");
                    out.push("      model:\"Modeleditor.model." + (rel.ref.thingType) + "\",\n");
                    out.push("\n");
                    out.push("      // primaryKey:'id',\n");
                    out.push("      primaryKey:'" + ($pk) + "',\n");
                    out.push("      foreignKey:'" + ($fk) + "',\n");
                    out.push("      embedded: " + (rel.embedded) + ",\n");
                    out.push("      oppositeEmbedded: " + (rel.oppositeEmbedded) + "\n");
                    out.push("    ");
                    if (rel.single) {
                        out.push(",\n");
                        out.push("      getterName:\"get" + ($fk) + "\",\n");
                        out.push("      setterName:\"set" + ($fk) + "\"\n");
                        out.push("    ");
                    } else if (!rel.single) {
                        out.push(",\n");
                        out.push("      ");
                        out.push("\n");
                        out.push("      /*opposite key to store in relation*/\n");
                        out.push("      oppositePk: \"" + ($oppositePk) + "\"\n");
                        out.push("    ");
                    }
                } else {
                    out.push("\n");
                    out.push("\n");
                    out.push("      name:\"" + (rel.to));
                    if (variant !== "*") {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("\",\n");
                    out.push("      type:\"" + (rel.single ? 'belongsTo' : 'manyhasmany') + "Derived\",\n");
                    out.push("      serverModel:\"" + (rel.ref.thingType) + "\",\n");
                    out.push("      model:\"Modeleditor.model." + (rel.ref.thingType) + "\"");
                    if (rel.single) {
                        out.push(",\n");
                        out.push("      getterName:\"get" + ($fk) + "\",\n");
                        out.push("      setterName:\"set" + ($fk) + "\"");
                    }
                    out.push(",\n");
                    out.push("      ");
                    if (rel.derivation) {
                        out.push("\n");
                        out.push("      derivation: function(callback){\n");
                        out.push("        " + (rel.derivation.DerivationCode) + "\n");
                        out.push("      }");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("    ");
                }
                out.push("},\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("  ]),\n");
            out.push("  relNames: {\n");
            out.push("    ");
            iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
                let rs = getRS(rel);
                if (!rel.navigable) {
                    return;
                }
                let middle = (rel.single) ? (rs && rs.toReadOnly === true) ? "View" : "Edit" : "ListEmbedded";
                const from = (Array.isArray(global.RelationCache.thing[rel.ref.thingType]?.[rel.from])) ? rel.from + rel.relName.split('.').join('') : rel.from;
                const to = (variant !== "*") ? rel.to + rel.relName.split('.').join('') : rel.to;
                out.push("\n");
                out.push("\n");
                out.push("    '" + (rel.to));
                if (variant !== "*") {
                    out.push((rel.relName.split('.').join('')));
                }
                out.push("':  {\n");
                out.push("        \"variant\"           : " + (JSON.stringify(variant)) + ",\n");
                out.push("        \"serverModel\"       : \"" + (rel.ref.thingType) + "\",\n");
                out.push("        \"relName\"           : " + (JSON.stringify(rel.namespace + '.' + rel.name + '-' + rel.to)) + ",\n");
                out.push("        \"name\"              : " + (JSON.stringify('Modeleditor.view.' + rel.$refNamespace + '.' + middle + '.' + rel.$refName)) + ",\n");
                out.push("        \"toXType\"           : " + (JSON.stringify([
                    rel.$refNamespace,
                    rel.$refName,
                    middle
                ].join("").toLowerCase())) + ",\n");
                out.push("        \"middle\"            : " + (JSON.stringify(middle)) + ",\n");
                out.push("        \"to\"                : " + (JSON.stringify(to)) + ",\n");
                out.push("        \"toSearchable\"      : " + (rs.toSearchable) + ",\n");
                out.push("        \"fromSearchable\"      : " + (rs.fromSearchable) + ",\n");
                out.push("        \"toAggregation\"     : " + ((rel.toAggregation) ? JSON.stringify(rel.toAggregation) : undefined) + ",\n");
                out.push("        \"fromAggregation\"   : " + ((rel.fromAggregation) ? JSON.stringify(rel.fromAggregation) : undefined) + ",\n");
                out.push("        \"toGroup\"           : _t(" + ((rs && rs.toGroup) ? JSON.stringify(rs.toGroup) : undefined) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'toGroup'),\n");
                out.push("        \"toDisable\"         : " + ((rs) ? JSON.stringify(rs.toDisable) : undefined) + ",\n");
                out.push("        \"fromDisable\"       : " + ((rs) ? JSON.stringify(rs.fromDisable) : undefined) + ",\n");
                out.push("        \"toReadOnly\"        : " + ((rs) ? JSON.stringify(rs.toReadOnly) : undefined) + ",\n");
                out.push("        \"toOrder\"           : " + ((rs) ? JSON.stringify(rs.toOrder) : undefined) + ",\n");
                out.push("        \"toPreLoad\"         : " + ((rs) ? new Function("wnd, component, store, callback", rs.toPreLoad) : undefined) + ",\n");
                out.push("        \"toToolbar\"         : " + ((rs) ? JSON.stringify(rs.toToolbar, prohibitArray) : undefined) + ",\n");
                out.push("        \"toHeight\"          : " + ((rs) ? rs.toHeight : undefined) + ",\n");
                out.push("        \"toDisplay\"         : _t(" + ((rs) ? JSON.stringify(rs.toDisplay) : JSON.stringify(rel.to)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'toDisplay', '" + (rel.to) + "'),\n");
                out.push("        \"toKeyField\"        : " + (JSON.stringify(rel.toKeyField)) + ",\n");
                out.push("        \"from\"              : " + (JSON.stringify(from)) + ",\n");
                out.push("        \"fromKeyField\"      : " + (JSON.stringify(rel.fromKeyField)) + ",\n");
                out.push("        \"single\"            : " + (JSON.stringify(rel.single)) + ",\n");
                out.push("        \"required\"          : " + (JSON.stringify(rel.toRequired || rs.toRequired)) + ",\n");
                out.push("        \"oppositeSingle\"    : " + (JSON.stringify(rel.oppositeSingle)) + ",\n");
                out.push("        \"noScan\"            : " + (rs?.noScan ?? false) + ",\n");
                out.push("        \"requireValidOwner\": " + (rs?.requireValidOwner ?? false) + ",\n");
                out.push("      },\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("  },\n");
            out.push("  // old_proxu: () => new Ext.data.proxy.Direct({\n");
            out.push("  //   type: 'direct',\n");
            out.push("  //   directFn: \"" + (defaultQuery) + "\",\n");
            out.push("  //   /*do we need to load all associations? single and multiple???  */\n");
            out.push("  //   writer:{\n");
            out.push("  //     type:'jsonmn',\n");
            out.push("  //     writeAllFields: true\n");
            out.push("  //   },\n");
            out.push("  //   reader:{\n");
            out.push("  //     type:'jsonmn',\n");
            out.push("  //     root:'data'\n");
            out.push("  //   }\n");
            out.push("  // }),\n");
            out.push("  // always create new\n");
            out.push("  proxy: () => new Ext.data.proxy.Direct({\n");
            out.push("    type: 'direct',\n");
            out.push("    directFn: '" + (defaultQuery) + "',\n");
            out.push("    writer: {\n");
            out.push("      type: 'jsonmn',\n");
            out.push("      writeAllFields: true\n");
            out.push("    },\n");
            out.push("    reader: {\n");
            out.push("      type: 'jsonmn',\n");
            out.push("      root: 'data'\n");
            out.push("    }\n");
            out.push("  }),\n");
        }
        out.push("\n");
        if (context.collectionCount > 1) {
            out.push("\n");
            out.push("    inheritance: {\n");
            out.push("      \"successors\": " + (JSON.stringify(context.successors)) + ",\n");
            out.push("      \"extends\": " + (JSON.stringify(context.extends)) + ",\n");
            out.push("      \"extendsXType\": " + (context.extends ? JSON.stringify(context.extends.replace(/\./g, "").toLowerCase()) : undefined) + ",\n");
            out.push("      \"allSuccessors\":");
            let chlds = context.allChilds;
            let len = chlds ? chlds.length : 0;
            if (len > 0) {
                let res = [];
                for(let i = 0; i < len; i++){
                    res.push({
                        name: chlds[i]
                    });
                }
                out.push("\n");
                out.push("        " + (JSON.stringify(res)) + "\n");
                out.push("      ");
            } else {
                out.push("null");
            }
            out.push("\n");
            out.push("    },\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  ");
        let localStateMachine = context.stateMachine;
        if (localStateMachine && localStateMachine.event && localStateMachine.event.length > 0) {
            out.push("\n");
            out.push("      /*State Machine support*/\n");
            out.push("      _fireSMEvent: function(event, callback){\n");
            out.push("        Modeleditor.fireEvent({model:this.serverModel, id:this.getId(), event:event}, callback);\n");
            out.push("      },\n");
            out.push("      ");
            let stateMachineHash = {
                statuses: {},
                states: {}
            };
            let states = localStateMachine.state;
            for(let i = 0; i < states.length; i++){
                let state = states[i];
                let name = state.name;
                let _d = state.displayName.split(';').map(function(e) {
                    return e;
                });
                let displays = [];
                for(let j = 0; j < _d.length; j++){
                    displays[j] = _d[j].trim();
                }
                ;
                stateMachineHash["states"][name] = displays;
                for(let k = 0; k < displays.length; k++){
                    let display = displays[k];
                    stateMachineHash["statuses"][display] = name;
                }
            }
            ;
            out.push("\n");
            out.push("    // нужно сделать перевод внутри JSON, для этого просто проходим по JSON, его структура известна и дальше просто выводим значения в текстовый файл\n");
            out.push("    /* stateMachineHash: Ext.create(\"DualSideHash\", " + (JSON.stringify(stateMachineHash)) + "), */\n");
            out.push("    stateMachineHash: Ext.create(\"DualSideHash\", {\n");
            out.push("      thing: \"" + (context.$namespace) + "." + (context.$name) + "\",\n");
            out.push("      statuses: {\n");
            out.push("      ");
            for (const name of Object.keys(stateMachineHash["statuses"])){
                out.push("\n");
                out.push("        [_t(\"" + (name) + "\",\"StateMachines\",\"" + (context.$namespace) + "." + (context.$name) + "\",\"state\")]: \"" + (stateMachineHash["statuses"][name]) + "\",\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      },\n");
            out.push("      states: {\n");
            out.push("      ");
            for (const name of Object.keys(stateMachineHash["states"])){
                out.push("\n");
                out.push("        " + (JSON.stringify(name)) + ": [\n");
                out.push("        ");
                if (stateMachineHash["states"]?.[name] && Array.isArray(stateMachineHash["states"][name])) {
                    const statuses = stateMachineHash["states"]?.[name];
                    for (const status of statuses){
                        out.push("\n");
                        out.push("        _t(" + (JSON.stringify(status)) + ",\"StateMachines\",\"" + (context.$namespace) + "." + (context.$name) + "\",\"state\"),\n");
                        out.push("        ");
                    }
                }
                out.push("\n");
                out.push("        ],\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      },\n");
            out.push("    }),\n");
            out.push("\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  groupedRels:()=> ({");
        let counter = Object.keys(context.groupedRels).length;
        for(let group in context.groupedRels){
            if (Object.prototype.hasOwnProperty.call(context.groupedRels, group)) {
                let grRels = makeRelVariants(context.groupedRels[group]);
                out.push("\n");
                out.push("    [_t(\"" + (group) + "\",\"" + (context.$namespace) + "." + (context.$name) + "\",'toGroup')] : {\n");
                out.push("      ");
                iterateRelGroups(grRels, (variant, rel, relIndex, variantIndex)=>{
                    let rs = getRS(rel);
                    out.push("\n");
                    out.push("      \"" + (rel.to) + "\n");
                    out.push("        ");
                    if (variant !== "*") {
                        out.push("\n");
                        out.push("          " + (rel.relName.split('.').join('')) + "\n");
                        out.push("        ");
                    }
                    out.push("\":\n");
                    out.push("        _t(\"" + (rs.toDisplay) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'toDisplay', '" + (rel.to) + "'),\n");
                    out.push("      ");
                });
                out.push("\n");
                out.push("    },\n");
                out.push("    ");
            }
        }
        out.push("}),\n");
        out.push("  methods: {\n");
        out.push("  ");
        let initConstructors = context.clientMethods?.filter(function(m) {
            return m.type == 'constructor' && !m.disable;
        }) ?? [];
        if (initConstructors.length > 0) {
            out.push("\n");
            out.push("      ensureDefaults: function(){\n");
            out.push("        /*constructor init*/\n");
            out.push("        ");
            for(let i = initConstructors.length - 1; i >= 0; i--){
                let clMethod = initConstructors[i];
                if (!clMethod.disable) {
                    out.push("/*metodName >>> " + (clMethod.name) + "*/");
                    if (clMethod.comment) {
                        out.push("/* " + (clMethod.comment) + " */");
                    }
                    out.push("\n");
                    out.push("            " + (clMethod.body) + "\n");
                    out.push("          ");
                }
            }
            out.push("\n");
            out.push("      },\n");
        }
        ;
        out.push("\n");
        let methods = context.clientMethods?.filter(function(m) {
            return m.type == 'model' && !m.disable;
        }) ?? [];
        if ((localStateMachine && context.debugSM) || (methods.length > 0)) {
            out.push("\n");
            out.push("    /* initListeners for subscriptions*/\n");
            out.push("    initListeners: function() {\n");
            out.push("      this.callParent();\n");
            out.push("        ");
            if (localStateMachine && context.debugSM) {
                const stateAttribute = localStateMachine.stateAttribute;
                out.push("\n");
                out.push("      this." + (`es${capitalize(localStateMachine.stateAttribute)}`) + ".subscribe(function (e) {\n");
                out.push("        var wnd;\n");
                out.push("        var wnds = Ext.ComponentQuery.query(\"window\");\n");
                out.push("        for (var i = wnds.length - 1; i >= 0; i--) {\n");
                out.push("          var w = wnds[i];\n");
                out.push("          if (w.zIndexManager && w.modeleditorController) {\n");
                out.push("            wnd = w;\n");
                out.push("            break;\n");
                out.push("          }\n");
                out.push("        }\n");
                out.push("          if (e.record) {\n");
                out.push("          const currentState = e.record.get(\"" + (stateAttribute) + "\")\n");
                out.push("          ret = Promisify.direct(StoredQuery, \"getAvailableEvents\", {\n");
                out.push("            thing: \"" + (context.$namespace) + "." + (context.$name) + "\",\n");
                out.push("            state: currentState,\n");
                out.push("            page: 1,\n");
                out.push("            start: 0,\n");
                out.push("            limit: 25\n");
                out.push("          })\n");
                out.push("          .then(data => {\n");
                out.push("            const list = wnd.query('button[toggleGroup=state]')\n");
                out.push("            const states = data.events.reduce((ret, cur)=>{\n");
                out.push("              ret[cur.key] = _t(cur.value, \"StateMachines\", \"" + (context.$namespace) + "." + (context.$name) + "\", \"state\")\n");
                out.push("              return ret\n");
                out.push("            },{})\n");
                out.push("\n");
                out.push("            for(const btn of list){\n");
                out.push("              if(states[btn.name]){\n");
                out.push("                btn.enable()\n");
                out.push("              } else {\n");
                out.push("                btn.disable()\n");
                out.push("              }\n");
                out.push("            }\n");
                out.push("          })\n");
                out.push("          .catch(e => {\n");
                out.push("            console.error('initListeners " + (`es${capitalize(localStateMachine.stateAttribute)}`) + " error', e)\n");
                out.push("          })\n");
                out.push("        }\n");
                out.push("\n");
                out.push("      });\n");
                out.push("        ");
            }
            out.push("\n");
            out.push("    ");
            if (methods.length > 0) {
                let rxInit = methods.filter(function(m) {
                    return !(m.initListeners == '' || !m.initListeners) && !m.disable;
                });
                if (rxInit.length > 0) {
                    out.push("\n");
                    out.push("          ");
                    for(let i = rxInit.length - 1; i >= 0; i--){
                        out.push("\n");
                        out.push("      /*method >> " + (rxInit[i].name) + "*/\n");
                        out.push("      " + (rxInit[i].initListeners) + "\n");
                        out.push("          ");
                    }
                    out.push("\n");
                    out.push("      ");
                }
            }
            out.push("\n");
            out.push("    },\n");
            if (methods.length > 0) {
                for(let i = methods.length - 1; i >= 0; i--){
                    let clMethod = methods[i];
                    if (!clMethod.disable) {
                        out.push("\n");
                        out.push("            ");
                        if (i == methods.length - 1) {
                            out.push("\n");
                            out.push("              /*model methods*/\n");
                            out.push("            ");
                        }
                        if (clMethod.comment) {
                            out.push("/* " + (clMethod.comment) + " */");
                        }
                        out.push("\n");
                        out.push("            " + (clMethod.name) + ": function(");
                        if (clMethod.params) {
                            out.push((clMethod.params));
                        }
                        out.push("){\n");
                        out.push("              " + (clMethod.body) + "\n");
                        out.push("            },");
                    }
                }
            }
            out.push("\n");
        }
        out.push("\n");
        out.push("  }\n");
        out.push("  }\n");
        out.push("  }\n");
        out.push("  })");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.model.metadata.njs.js.map
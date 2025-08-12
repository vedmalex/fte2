<#@ noContent #>
let mongoose             = global.mongoose
let mongooseIncr         = require("@grainjs/mongoose-autoincr");
let mongooseCreated      = require("@grainjs/mongoose-created");
let mongooseLastModified = require("@grainjs/mongoose-last-modified");
let Schema               = mongoose.Schema;
let ObjectId             = Schema.ObjectId;
let Mixed                = Schema.Types.Mixed;
<#
  function decapitalize (str){
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  let dot           = context.thingType.indexOf(".");
  let schema        = ((dot>0)? context.thingType.slice(dot+1):context.thingType);
  let schemaName    = decapitalize(schema) +"Def";
  let resCollection = (context.topMostParent) ? context.topMostParent : context.namespace+'.'+schema;
#>

<#-
if(context.methods){
  context.methods.forEach(function(method){
  let funcName = method.name.replace(/ /g,"_");
#>
<#-  if(method.disable) {#>/*<#}#>
//#{method.comment}
function #{funcName} (#{method.params?method.params:""}){
#{method.body}
};
<#-  if(method.disable) {#>*/<#}#>
<#-})
}
if(context.statics){
  context.statics.forEach(function(method){
  let funcName = method.name.replace(/ /g,"_");
#>
//#{method.comment}
function #{funcName} (#{method.params?method.params:""}){
#{method.body}
};
<#
  })
}
#>

let $#{schemaName} = #{context.propertiesAsString};

<#-if (context.cal_mapping){ #>
// Calendar fields
$#{schemaName}["_isassigned"]         = Boolean;
$#{schemaName}["_isperiodical"]       = Boolean;
$#{schemaName}["_isperiodicalroot"]   = Boolean;
$#{schemaName}["_isperiodicalbydate"] = Boolean;
$#{schemaName}["_groupingid"]         = String;
$#{schemaName}["ignoredfields"]       = String;

<#-let typeHash = {StartDate:'Date', EndDate:'Date', IsAllDay:'Boolean'}
  for(let keyName in context.cal_mapping) {
    if (context.cal_mapping[keyName] === "") {
      let type = typeHash[keyName]#>
$#{schemaName}['#{keyName.toLowerCase()}'] = {
        type:
        <#-if (type) {#>
        #{type}
        <#-}else{#>
        String
        <#-}#>
        ,
        index: true
      };
      <#- }
  }
}#>

<#-
//checks whenever the state machine ready
let stateMachineReady = context.stateMachine && context.$$$Properties && context.stateMachine.state && context.stateMachine.state.length > 0

let localStateMachine = stateMachineReady ? context.stateMachine : undefined
if(localStateMachine){
#>
// State Machine section
let aasmjs = require("@grainjs/aasm-js");

<#-
    /*stateMachineHash preparing*/
    let stateMachineHash = {
      thing: context.thingType,
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

      stateMachineHash.states[name] = displays;
      for (let k = 0; k < displays.length; k++) {
        let display = displays[k];
        stateMachineHash.statuses[display] = name;
      }
    };
#>
// stateMachineHash
let stateMachineHash = function(config) {
    this.thing = config.thing;
    this.statuses = JSON.parse(JSON.stringify(config.statuses));
    this.states = JSON.parse(JSON.stringify(config.states));
    this._t = (status) => _t(status,'StateMachines', this.thing, 'state')
};

stateMachineHash.prototype.getProp = function(obj, ...props) {
  if (typeof obj == 'object') {
    props = props.filter(t => t)
    if (props.length > 0) {
      const current = props.shift()
      return props.length == 0
        ? obj[current]
        : this.getProp(obj[current], ...props)
    }
  }
}

stateMachineHash.prototype.revStatus = function(status){
    if(status) {
        const languages = globalThis.AVAILABLE_LANGUAGES.map(i=>i.code)
        for (let code of languages){
            const state = this.getProp(globalThis.translation, code,'StateMachines',this.thing, 'state')
            const rev = Object.keys(state).reduce((ret, cur)=>{
                ret[state[cur]] = cur
                return ret
            },{})

            if(rev[status]) {
                return rev[status]
            }
        }
    }
}

stateMachineHash.prototype.getStatus = function(state) {
    return this.states[state];
};

stateMachineHash.prototype.getState = function(_status) {
    const revStatus = this.revStatus(_status)
    return this.statuses[this._t(revStatus)];
};

if(!global["stateMachineHash"]) global["stateMachineHash"] = {};
global["stateMachineHash"][#{JSON.stringify(context.thingType)}] = new stateMachineHash(#{JSON.stringify(stateMachineHash)});

<#-
    let stateAttribute = context.$$$Properties[localStateMachine.stateAttribute]
    if(!stateAttribute){
      stateAttribute = {
          type:String,
          default:localStateMachine.initialState,
          index: true
        }
#>
// register state attribute
$#{schemaName}['state'] = {
  type:String,
  index:true
  <#-if(localStateMachine.initialState && localStateMachine.initialState!=''){#>,
  default:'#{localStateMachine.initialState}'
  <#-}#>
};

<#-
    } else {
#>
// setup initial State
$#{schemaName}['#{localStateMachine.stateAttribute}'].default = '#{localStateMachine.initialState}';
<#
    }
}
#>

<#-
let autoincFields = [];
for (let i = 0; i < context.properties?.length ?? 0; i++) {
  let prop = context.properties[i];
  if (prop.autoInc) {
    autoincFields.push({
      modelName: resCollection+"_"+prop.propertyName,
      attributeName: prop.propertyName,
      beginValue: prop.autoIncBegin || 0
    })
  }
};
#>

let #{schemaName} = new Schema($#{schemaName}, {collection:"#{context.collectionType}", autoIndex:false
<#- if (!context.strictSchema) {#>
, strict:#{!!context.strictSchema}
<#-}#>
});

<#-if(context.xss?.length > 0) {#>
function xssProf(_text){
//<img src='u'/> == 14 chars
  if(_text!== undefined && _text!== null && _text.length > 14 ){
  let text = _text.replace(/\<(\/?img\s?.*?\s*?\/?)>/igm, "&lt;$1&gt;");
  text = text.replace(/\<(\/?script\s?.*?\s*?\/?)>/igm, "&lt;$1&gt;");
  text = text.replace(/\<(\/?iframe\s?.*?\s*?\/?)>/igm, "&lt;$1&gt;");
  return text;
  } return _text;
}

#{schemaName}.pre('save', function(next){
let v;
<#-
for (let i = 0, len = context.xss.length; i < len; i++) {
 let xssField = context.xss[i]
#>
  v = this.get('#{xssField}');
  if (v && v.length > 14) this.set('#{xssField}',xssProf(v));
<#-}#>
  next();
});

#{schemaName}.post('init', function(doc){
let v;
<#-
for (let i = 0, len = context.xss?.length; i < len; i++) {
 let xssField = context.xss[i];
#>
  v = doc.get('#{xssField}');
  if (v && v.length > 14) doc.set('#{xssField}',xssProf(v));
<#-}#>
});

<#-}#>

<#-if(context.namespace){ #>

if(!global.SchemaCache) global.SchemaCache = {};
if(!global.SchemaCache.#{context.namespace}) global.SchemaCache.#{context.namespace} = {};

global.SchemaCache.#{context.thingType} = #{schemaName};

<#-}#>

<#-
if(context.methods){
#>
// method connections
<#
context.methods.filter(m=>(m.type != 'pre' && m.type != 'post')).forEach(function(method){
  let funcName = method.name.replace(/ /g,"_");
#>
<#-  if(method.disable) {#>/*<#}#>
#{schemaName}.methods.#{funcName} = #{funcName};
<#-  if(method.disable) {#>*/<#}#>

<#-});#>

// hooks
<#
  context.methods.filter(m=>(m.type == 'pre' || m.type == 'post')).forEach(function(method){
  let funcName = method.name.replace(/ /g,"_");
#>
<#-  if(method.disable) {#>/*<#}#>
#{schemaName}.#{method.type == 'pre'?'pre':'post'}('#{method.hook}', #{funcName});
<#-  if(method.disable) {#>*/<#}#>

<#-});
}
#>
<#-
if(context.statics){
  context.statics.forEach(function(method){
  let funcName = method.name.replace(/ /g,"_");
#>
#{schemaName}.statics.#{funcName} = #{funcName};

<#-
  })
}#>

<#- if(context.complexindex){#>
// compoundIndex
<#-
let len = context.complexindex.length;
  for (let i = 0; i< len; i++){
    let index = context.complexindex[i];
    let stIndex = {};
    let opts = {
      name:       (index.name === true)     ? true : undefined,
      unique:     (index.unique === true)     ? true : undefined,
      sparse:     (index.sparse === true)     ? true : undefined,
    }

    if((context.collectionCount > 1) && (context.extends)){
      stIndex.__tid = 1;
    }

    let propLen = index.properties?.length ?? 0;
    for (let j = 0; j< propLen; j++){
      let prop = index.properties[j];
      let direction = (prop.direction === "DESC") ? -1 : 1;
      stIndex[prop.property] = direction;
    }
#>
  #{schemaName}.index(#{JSON.stringify(stIndex)}, #{JSON.stringify(opts)});
<#-}
}
#>

<#-for (let i = 0; i < autoincFields.length; i++) {
  let aif = autoincFields[i];
#>
#{schemaName}.plugin(
  mongooseIncr.loadAutoIncr({beginValue: #{aif.beginValue}}, mongoose), {
  beginValue: #{aif.beginValue},
  modelName: "#{aif.modelName}",
  attributeName: "#{aif.attributeName}"
});
<#-};#>

#{schemaName}.plugin(mongooseCreated, { index: true });
#{schemaName}.plugin(mongooseLastModified, { index: true });

// derived property zone
<#-
if(context.derivedProperties){
#>
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
#{schemaName}.plugin(mongooseLeanVirtuals);
<#
  context.derivedProperties.sort().forEach(function(dprop){
#>

<#-
if(dprop.requireList)
  dprop.requireList.split(',').forEach(function(req){#>
require("#{req.trim()}");
<#-
})
#>

#{schemaName}
  .virtual("#{dprop.virtual_propName}")
<#- if(dprop.virtual_getMethod){#>
  .get(function(){
    #{dprop.virtual_getMethod}
  })
  <#-}#>
<#- if(dprop.virtual_setMethod){#>
  .set(function(value){
  #{dprop.virtual_setMethod}
  })
  <#-}#>
<#-
})
}#>
;

<#-
let derivedRels = context.relations.filter(function(r){
  return r.derived && r.derivation && r.derivation.mode == 'server'
})#>
<#-  if(derivedRels.length>0){
#>

// derived associations
<#-
  for(let i=0; i<derivedRels.length; i++){
        let r1 = derivedRels[i];
#>
    <#- if (r1 && r1.derivation) {#>
    #{schemaName}.method('#{r1.derivation.Name}', function(callback){
        #{r1.derivation.DerivationCode}
    });
    <#- }#>
  <#- }#>
<#- }#>

<#- if(localStateMachine){
#>

aasmjs.include(#{schemaName}, '#{schemaName}-SM')

#{schemaName}.statics.stateMachineName = () => '#{schemaName}-SM'

#{schemaName}.statics.aasmInitialState(function(){
    return '#{localStateMachine.initialState}'
});

#{schemaName}.methods.aasmWriteState = function(state){
  this.set("#{localStateMachine.stateAttribute}", state)
  this.save();
  return true
};

#{schemaName}.methods.aasmWriteStateWithoutPersistence = function(state){
  this.set("#{localStateMachine.stateAttribute}", state)
  return true
};

#{schemaName}.methods.aasmReadState = function(state){
  return this.get("#{localStateMachine.stateAttribute}")
};

#{schemaName}.methods.aasmEventFailed = function(newState, oldState){
  this.emit('eventFailed', {new:newState, old:oldState})
};

#{schemaName}.methods.aasmEventFired = function(newState, oldState, state){
  this.emit('eventFired', {new:newState, old:oldState})
};

#{schemaName}.methods.fireError = function(error){
  console.error('error', error)
  // if there is no error listeners then code will throw
  this.emit('error', error)
};

<#- }
#>

// ensure section

global.EnsureIndex.toBeIndexed.push({location: '#{context.locationType}', model:'#{context.thingType}'});

global.RegisterSchema.jobs.push(function(mongoose) {

  if(typeof(global.#{context.namespace})=='undefined') global.#{context.namespace} = {};

  let alreadyOverriden = !!global.#{context.thingType} && mongoose.model('#{context.thingType}')

  let $collection = global.#{context.thingType} = alreadyOverriden ? mongoose.model('#{context.thingType}') : mongoose.model('#{context.thingType}', global.SchemaCache.#{context.thingType});

<#-

  function take(index){
    return function(list){
      return list[index]
    }
  }

  function append(item){
    return function(list){
      return [item].concat(list)
    }
  }

  function splitToJSON(str, action){
    let res = (str && str!='') ? str.split(/[\s,]/).filter(function(item){return item && item!='' }):[]
    if(action && typeof(action) == 'function')
      res = action(res)
    return JSON.stringify(res)
  }

  if(localStateMachine){
// state machine def
// take specified element from array

#>

<#- localStateMachine.state?.forEach(function(st){
  let count =-1
#>
$collection.aasmState('#{st.name}', {

<#- if( st.displayName && st.displayName !=''){#>
  <#- if(++count > 0){-#> , <#-}#>
  display: #{JSON.stringify(st.displayName)}
<#-}#>

<#- if( st.beforeEnter && st.beforeEnter !=''){ #>
  <#- if(++count > 0){-#> , <#-}#>
  beforeEnter:#{splitToJSON(st.beforeEnter)}
<#-}#>

<#- if( st.enter && st.enter !=''){ #>
  <#- if(++count > 0){-#> , <#-}#>
  enter:#{splitToJSON(st.enter)}
<#-}#>

<#- if( st.afterEnter && st.afterEnter !=''){ #>
  <#-if(++count > 0){-#> , <#-}#>
  afterEnter:#{splitToJSON(st.afterEnter)}
<#-}#>

<#- if( st.beforeExit && st.beforeExit !=''){ #>
  <#-if(++count > 0){-#> , <#-}#>
  beforeExit:#{splitToJSON(st.beforeExit)}
<#-}#>

<#- if( st.exit && st.exit !=''){#>
  <#-if(++count > 0){-#> , <#-}#>
  exit:#{splitToJSON(st.exit)}
<#-}#>

<#- if( st.afterExit && st.afterExit !=''){#>
  <#-if(++count > 0){-#> , <#-}#>
  afterExit:#{splitToJSON(st.afterExit)}
<#-}#>

<#- if(++count > 0){-#> , <#-}#>
  onError:#{splitToJSON(st.onError,append('fireError'))}
<#-  #>

});
<#-})#>

<#- localStateMachine.event?.forEach(function(ev){
  let count = -1; #>

  $collection.aasmEvent("#{ev.eventName}",{

<#- if( ev.onAfter  && ev.onAfter !=''){#>
  <#- if(++count > 0){-#> , <#-}#>
    after:#{splitToJSON(ev.onAfter)}
  <#-}#>

<#- if( ev.onBefore && ev.onBefore !='') {#>
  <#- if(++count > 0){#>, <#}#>
    before:#{splitToJSON(ev.onBefore)}
  <#-}#>

<#- if( ev.onSuccess  && ev.onSuccess !='') {#>
  <#- if(++count > 0){#>, <#}#>
    success:#{splitToJSON(ev.onSuccess)}
  <#- }#>

<#- if(++count > 0){#>, <#}#>
  error:#{splitToJSON(ev.onError,append('fireError'))}
  },
  function(){
<#- if(ev.transition){
   ev.transition.sort(function(a,b){
    if (a.order < b.order) {
          return -1;
      } else if (a.order > b.order) {
          return 1;
      } else return 0;
  }).forEach(function(trans){#>
    this.transitions({
      from:#{splitToJSON(trans.from)},
      to:#{splitToJSON(trans.to, take(0))}

<#-  if( trans.guard && trans.guard !=''){#>,
      guard:#{splitToJSON(trans.guard)}
<#-}#>

<#-  if( trans.onTransition && trans.onTransition !='') {#>,
      onTransition:#{splitToJSON(trans.onTransition)}<#}
 #>, onError:#{splitToJSON(trans.onError,append('fireError'))}
    });
<#-   });
  }
#>
  });

<#-})#>
<#-}#>

// finders

<#- let inList = []; #>
<#- if((context.collectionCount > 1) && (context.extends)){

  if(context.allChilds && context.allChilds.length > 0){
    inList.push(...context.allChilds);
  }

  inList.push(context.thingType);
#>
// TODO придумать конструктор в котором будет инициализироваться это поле по умолчанию!!!
// ну короче что-то придумать чтобы сохранить значение
  // $collection.schema.paths["__tid"] =
  // $collection.schema.interpretAsType("__tid", {type:String, index:true, default:'#{context.thingType}'}, mongoose.model('#{context.thingType}').prototype.schema.options);

  $collection.baseFind = alreadyOverriden ? $collection.baseFind : $collection.find ;
    $collection.find = function (conditions, fields, options, callback) {
        if ('function' == typeof conditions) {
            callback = conditions;
            conditions = {};
            fields = null;
            options = null;
        } else if ('function' == typeof fields) {
            callback = fields;
            fields = null;
            options = null;
        } else if ('function' == typeof options) {
            callback = options;
            options = null;
        }

        if (!conditions)
            conditions = {};

<#- if(inList.length > 1) {#>
        conditions['__tid'] = {$in:#{JSON.stringify(inList)}};
<#- } else {#>
        conditions['__tid'] = "#{context.thingType}";
<#- }#>
        return this.baseFind(conditions, fields, options, callback);
    };
    //findOne
    $collection.baseFindOne = alreadyOverriden ? $collection.baseFindOne : $collection.findOne;
    $collection.findOne = function (conditions, fields, options, callback) {
        if ('function' == typeof conditions) {
            callback = conditions;
            conditions = {};
            fields = null;
            options = null;
        } else if ('function' == typeof fields) {
            callback = fields;
            fields = null;
            options = null;
        } else if ('function' == typeof options) {
            callback = options;
            options = null;
        }

        if (!conditions)
            conditions = {};
<#- if(inList.length > 1) { #>
        conditions['__tid'] = {$in:#{JSON.stringify(inList)}};
<#- } else { #>
        conditions['__tid'] = "#{context.thingType}";
<#- }#>
        return this.baseFindOne(conditions, fields, options, callback);
    };

    //findOne
    $collection.baseCount = alreadyOverriden ? $collection.baseCount : $collection.count;
    $collection.count = function (conditions, callback) {
        if ('function' == typeof conditions) {
            callback = conditions;
            conditions = {};
            fields = null;
            options = null;
        } else if ('function' == typeof fields) {
            callback = fields;
            fields = null;
            options = null;
        } else if ('function' == typeof options) {
            callback = options;
            options = null;
        }

        if (!conditions)
            conditions = {};
<#- if(inList.length > 1) {#>
        conditions['__tid'] = {$in:#{JSON.stringify(inList)}};
<#- } else {#>
        conditions['__tid'] = "#{context.thingType}";
<#- }#>
        return this.baseCount(conditions, callback);
    };
<#-}#>
});

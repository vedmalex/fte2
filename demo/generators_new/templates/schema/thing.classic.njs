<#@ noContent #>
var utils                = require('@grainjs/meta-codegen').utils;
var mongoose             = global.mongoose
var mongooseIncr         = require("@grainjs/mongoose-autoincr");
var mongooseCreated      = require("@grainjs/mongoose-created");
var mongooseLastModified = require("@grainjs/mongoose-last-modified");
var Schema               = mongoose.Schema;
var ObjectId             = Schema.ObjectId;
var Mixed                = Schema.Types.Mixed;

<#
  function isArray(obj){
    return obj.constructor == Array;
  }

  function decapitalize (str){
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  var dot           = context.thingType.indexOf(".");
  var schema        = ((dot>0)? context.thingType.slice(dot+1):context.thingType);
  var schemaName    = decapitalize(schema) +"Def";
  var resCollection = (context.topMostParent) ? context.topMostParent : context.namespace+'.'+schema;
-#>

<#-
if(context.methods){
  context.methods.forEach(function(method){
  var funcName = method.name.replace(/ /g,"_");
-#>
<# if(method.disable) {#>/*<#}#>
//#{method.comment}
function #{funcName} (#{method.params?method.params:""}){
#{method.body}
};
<# if(method.disable) {#>*/<#}#>
<#-})
}
if(context.statics){
  context.statics.forEach(function(method){
  var funcName = method.name.replace(/ /g,"_");
#>
//#{method.comment}
function #{funcName} (#{method.params?method.params:""}){
#{method.body}
};
<#
  })
}
-#>

var $#{schemaName} = #{context.propertiesAsString};

<#-if (context.cal_mapping){ #>
// Calendar fields
$#{schemaName}["_isassigned"]         = Boolean;
$#{schemaName}["_isperiodical"]       = Boolean;
$#{schemaName}["_isperiodicalroot"]   = Boolean;
$#{schemaName}["_isperiodicalbydate"] = Boolean;
$#{schemaName}["_groupingid"]         = String;
$#{schemaName}["ignoredfields"]       = String;

<#-var typeHash = {StartDate:'Date', EndDate:'Date', IsAllDay:'Boolean'}
  for(var keyName in context.cal_mapping) {
    if (context.cal_mapping[keyName] === "") {
      var type = typeHash[keyName]#>
$#{schemaName}['#{keyName.toLowerCase()}'] = {
        type:
        <#-if (type) {-#>
        #{type}
        <#-}else{-#>
        String
        <#-}-#>
        ,
        index: true
      };
      <#}
  }
}-#>

<#-
//checks whenever the state machine ready
var stateMachineReady = context.stateMachine && context.$$$Properties && context.stateMachine.state && context.stateMachine.state.length > 0

-#>

<#-
if(stateMachineReady && context.stateMachine){
  var localStateMachine = context.stateMachine;
#>
// State Machine section
var aasmjs = require("@grainjs/aasm-js");
<#}-#>

<#-
if(stateMachineReady && localStateMachine){
-#>

<#-
    /*stateMachineHash preparing*/
    var stateMachineHash = {
      statuses: {},
      states: {}
    };
    var states = localStateMachine.state;
    for (var i = 0; i < states.length; i++) {
      var state    = states[i];
      var name     = state.name;
      var _d       = state.displayName.split(';').map(function(e){return e;});
      var displays = [];
      for (var j = 0; j < _d.length; j++) {
        displays[j] = _d[j].trim();
      };

      stateMachineHash.states[name] = displays;
      for (var k = 0; k < displays.length; k++) {
        var display = displays[k];
        stateMachineHash.statuses[display] = name;
      }
    };
#>
// stateMachineHash
var stateMachineHash = function(config) {
    this.statuses = JSON.parse(JSON.stringify(config.statuses));
    this.states = JSON.parse(JSON.stringify(config.states));
};

stateMachineHash.prototype.getStatus = function(state) {
    return this.states[state];
};

stateMachineHash.prototype.getState = function(status) {
    return this.statuses[status];
};

if(!global["stateMachineHash"]) global["stateMachineHash"] = {};
global["stateMachineHash"][#{JSON.stringify(context.thingType)}] = new stateMachineHash(#{JSON.stringify(stateMachineHash)});

<#-
    var stateAttribute = context.$$$Properties[localStateMachine.stateAttribute]
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
-#>

<#-
var autoincFields = [];
for (var i = 0; i < context.properties?.length ?? 0; i++) {
  var prop = context.properties[i];
  if (prop.autoInc) {
    autoincFields.push({
      modelName: resCollection+"_"+prop.propertyName,
      attributeName: prop.propertyName,
      beginValue: prop.autoIncBegin || 0
    })
  }
};
#>

var #{schemaName} = new Schema($#{schemaName}, {collection:"#{context.collectionType}", autoIndex:false
<#- if (!context.strictSchema) {-#>
, strict:#{!!context.strictSchema}
<#-}-#>
});

<#-if(context.xss?.length > 0) {#>
function xssProf(_text){
//<img src='u'/> == 14 chars
  if(_text!== undefined && _text!== null && _text.length > 14 ){
  var text = _text.replace(/\<(\/?img\s?.*?\s*?\/?)>/igm, "&lt;$1&gt;");
  text = text.replace(/\<(\/?script\s?.*?\s*?\/?)>/igm, "&lt;$1&gt;");
  text = text.replace(/\<(\/?iframe\s?.*?\s*?\/?)>/igm, "&lt;$1&gt;");
  return text;
  } return _text;
}

#{schemaName}.pre('save', function(next){
var v;
<#-
for (var i = 0, len = context.xss.length; i < len; i++) {
 var xssField = context.xss[i]
#>
  v = this.get('#{xssField}');
  if (v && v.length > 14) this.set('#{xssField}',xssProf(v));
<#-}#>
  next();
});

#{schemaName}.post('init', function(doc){
var v;
<#-
for (var i = 0, len = context.xss?.length; i < len; i++) {
 var xssField = context.xss[i];
#>
  v = doc.get('#{xssField}');
  if (v && v.length > 14) doc.set('#{xssField}',xssProf(v));
<#-}#>
});

<#-}-#>

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
  var funcName = method.name.replace(/ /g,"_");
#>
<# if(method.disable) {#>/*<#}#>
#{schemaName}.methods.#{funcName} = #{funcName};
<# if(method.disable) {#>*/<#}#>

<#-});-#>

// hooks
<#
  context.methods.filter(m=>(m.type == 'pre' || m.type == 'post')).forEach(function(method){
  var funcName = method.name.replace(/ /g,"_");
#>
<# if(method.disable) {#>/*<#}#>
#{schemaName}.#{method.type == 'pre'?'pre':'post'}('#{method.hook}', #{funcName});
<# if(method.disable) {#>*/<#}#>

<#-});
}
-#>
<#-
if(context.statics){
  context.statics.forEach(function(method){
  var funcName = method.name.replace(/ /g,"_");
#>
#{schemaName}.statics.#{funcName} = #{funcName};

<#-
  })
}#>

<#if(context.complexindex){#>
// compoundIndex
<#-
var i, index;
var len = context.complexindex.length;
  for (i = 0; i< len; i++){
    index = context.complexindex[i];
    var j, prop, direction;
    var propLen = index.properties?.length ?? 0;
    var stIndex = {};
    var opts = {
      unique:     (index.unique === true)     ? true : undefined,
      sparse:     (index.sparse === true)     ? true : undefined,
      dropDups:   (index.dropDups === true)   ? true : undefined,
      background: (index.background === true) ? true : undefined
    }

    if((context.collectionCount > 1) && (context.extends)){
      stIndex.__tid = 1;
    }

    for (j = 0; j< propLen; j++){
      prop = index.properties[j];
      direction = (prop.direction === "DESC") ? -1 : 1;
      stIndex[prop.property] = direction;
    }
#>
  #{schemaName}.index(#{JSON.stringify(stIndex)}, #{JSON.stringify(opts)});
<#-}
}
#>

<#-for (var i = 0; i < autoincFields.length; i++) {
  var aif = autoincFields[i];
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
<#if(dprop.virtual_getMethod){#>
  .get(function(){
    #{dprop.virtual_getMethod}
  })
  <#-}#>
<#if(dprop.virtual_setMethod){#>
  .set(function(value){
  #{dprop.virtual_setMethod}
  })
  <#-}#>
<#-
})
}-#>
;

<#-
var derivedRels = context.relations.filter(function(r){
  return r.derived && r.derivation && r.derivation.mode == 'server'
})#><# if(derivedRels.length>0){
-#>

// derived associations
<#-
  for(var i=0; i<derivedRels.length; i++){
        var r1 = derivedRels[i];
#>
    <#if (r1 && r1.derivation) {#>
    #{schemaName}.method('#{r1.derivation.Name}', function(callback){
        #{r1.derivation.DerivationCode}
    });
    <#}#>
  <#}#>
<#}#>

<#- if(stateMachineReady && localStateMachine){
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
  console.log('error', error)
  // if there is no error listeners then code will throw
  this.emit('error', error)
};

<#}
-#>

// ensure section

global.EnsureIndex.jobs.push(
  (dbPool)=>
    function(err, data){
      var next = this.slot();
      var $collection = dbPool.get('#{context.locationType}').model('#{context.thingType}');
      if (!err) {
        if(!global.EnsureIndex.dropDone[$collection.collection.name]){
          $collection.collection.dropIndexes(global.EnsureIndex.go($collection, '#{context.thingType}', next));
        }
        else{
          global.EnsureIndex.go($collection,'#{context.thingType}', next)(null);
        }
      } else next(err);
    });

global.RegisterSchema.jobs.push(function(mongoose) {

  if(typeof(global.#{context.namespace})=='undefined') global.#{context.namespace} = {};

  var alreadyOverriden = !!global.#{context.thingType} && mongoose.model('#{context.thingType}')

  var $collection = global.#{context.thingType} = alreadyOverriden ? mongoose.model('#{context.thingType}') : mongoose.model('#{context.thingType}', global.SchemaCache.#{context.thingType});

<#- if(stateMachineReady && localStateMachine){
// state machine def
// take specified element from array
  function take(index){
    return function(list){
      return list[0]
    }
  }

  function append(item){
    return function(list){
      return [item].concat(list)
    }
  }

  function splitToJSON(str, action){
    var res = (str && str!='') ? str.split(/[\s,]/).filter(function(item){return item && item!='' }):[]
    if(action && typeof(action) == 'function')
      res = action(res)
    return JSON.stringify(res)
  }

#>

<#localStateMachine.state && localStateMachine.state.forEach(function(st){
  var count =-1
#>
$collection.aasmState('#{st.name}', {

<#if( st.displayName && st.displayName !=''){-#>
  <#- if(++count > 0){-#> , <#-}#>
  display: #{JSON.stringify(st.displayName)}
<#-}-#>

<#- if( st.beforeEnter && st.beforeEnter !=''){ -#>
  <#- if(++count > 0){-#> , <#-}#>
  beforeEnter:#{splitToJSON(st.beforeEnter)}
<#-}-#>

<#- if( st.enter && st.enter !=''){ -#>
  <#- if(++count > 0){-#> , <#-}#>
  enter:#{splitToJSON(st.enter)}
<#-}-#>

<#- if( st.afterEnter && st.afterEnter !=''){ -#>
  <#-if(++count > 0){-#> , <#-}#>
  afterEnter:#{splitToJSON(st.afterEnter)}
<#-}-#>

<#- if( st.beforeExit && st.beforeExit !=''){ -#>
  <#-if(++count > 0){-#> , <#-}#>
  beforeExit:#{splitToJSON(st.beforeExit)}
<#-}-#>

<#- if( st.exit && st.exit !=''){-#>
  <#-if(++count > 0){-#> , <#-}#>
  exit:#{splitToJSON(st.exit)}
<#-}-#>

<#- if( st.afterExit && st.afterExit !=''){-#>
  <#-if(++count > 0){-#> , <#-}#>
  afterExit:#{splitToJSON(st.afterExit)}
<#-}-#>

<#- if(++count > 0){-#> , <#-}#>
  onError:#{splitToJSON(st.onError,append('fireError'))}
<# #>

});
<#-})#>

<#localStateMachine.event && localStateMachine.event.forEach(function(ev){
  var count = -1; #>

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
  <#}#>

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

<#-})-#>
<#-}-#>

// finders

<#- var inList = []; #>
<#- if((context.collectionCount > 1) && (context.extends)){

  if(context.allChilds && context.allChilds.length > 0){
    inList.push.apply(inList,context.allChilds);
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

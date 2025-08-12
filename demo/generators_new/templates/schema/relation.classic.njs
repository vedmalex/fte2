<#@ noContent #>
var path = require('path');
var utils = require('@grainjs/meta-codegen').utils;
var mongoose = global.mongoose;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var StringRef = Schema.Types.String;
var Mixed = Schema.Types.Mixed;
var Step = require('@grainjs/step');
var fs = require('fs');

<#
var notGenerateClass = context.source.embedded || context.dest.embedded;
function decapitalize (str){
  return str.charAt(0).toLowerCase() + str.slice(1);
}
var dot = context.name.indexOf('.');
var schema = ((dot>0)? context.name.slice(dot+1):context.name);
var schemaName = decapitalize(schema) +'Def';
var resCollection = context.namespace+'.'+schema;
var dst = ('string' !== typeof(context.dest.thingType)) ? context.dest.thingType.thingType : context.dest.thingType ;
var src = ('string' !== typeof(context.source.thingType)) ? context.source.thingType.thingType : context.source.thingType ;
var sType = (context.source.keyField != undefined && context.source.keyField !== '_id') ? "StringRef" : "ObjectId";
var dType = (context.dest.keyField != undefined && context.dest.keyField !== '_id') ? "StringRef" : "ObjectId";

const relKind = `${context.source.cardinality}${context.dest.cardinality}`

var srcIndexKind = 'index'
var dstIndexKind = 'index'
switch(relKind){
  case '11': {
    srcIndexKind = 'unique'
    dstIndexKind = 'unique'
  } break;
  case '**':{
    srcIndexKind = 'index'
    dstIndexKind = 'index'
  } break;
  case '1*': {
    srcIndexKind = 'unique'
    dstIndexKind = 'index'
  } break;
  case '*1': {
    srcIndexKind = 'index'
    dstIndexKind = 'unique'
  } break;
}

-#>

<#- if(!notGenerateClass){-#>

var $#{schemaName} = {
 '#{context.source.name}':{type:#{sType}, required:true, #{srcIndexKind}:true, sparse:true, ref:'#{src}'},
 '#{context.dest.name}':{type:#{dType}, required:true, #{dstIndexKind}:true,sparse:true, ref:'#{dst}'}
};


var _#{schemaName} = new Schema($#{schemaName},{collection:'#{context.collectionType}', autoIndex:false});

if(!global.SchemaCache) global.SchemaCache = {};
if(!global.SchemaCache.#{context.namespace}) global.SchemaCache.#{context.namespace} = {};

global.SchemaCache.#{context.name} = _#{schemaName};

_#{schemaName}.index({
  '#{context.source.name}': 1,
  "#{context.dest.name}": 1
}, {
  unique: true, /*dropDups:true,*/ sparse:true
});

global.RegisterSchema.jobs.push(function(mongoose){
  if(typeof(#{context.namespace})=='undefined') #{context.namespace} = {};
  var alreadyOverriden = !!global.#{context.name} && mongoose.model('#{context.name}')

  #{resCollection} = alreadyOverriden ? mongoose.model('#{context.name}') : mongoose.model('#{context.name}', global.SchemaCache.#{context.name});
});

global.EnsureIndex.jobs.push(
  (dbPool)=>
    function(err, data){
      var next = this.slot();
      var $collection = dbPool.get('#{context.locationType}').model('#{context.name}');
      if (!err) {
        if(!global.EnsureIndex.dropDone[$collection.collection.name]){
          $collection.collection.dropIndexes(global.EnsureIndex.go($collection, '#{context.name}', next));
        }
        else{
          global.EnsureIndex.go($collection,'#{context.name}', next)(null);
        }
      } else next(err);
    });

<#-}#>
/*
var reqSuccess = false;
<#-
  var manySrc = context.source.cardinality != '1'
#>
reqSuccess = global.RESOLVESCHEMA('#{dst}', __dirname);
if(reqSuccess && global.SchemaCache.#{dst}){
  global.SchemaCache.#{dst}.virtual("#{context.source.name}", {
    ref:'#{src}',
    localField: '#{context.source.keyField ? context.source.keyField: '_id' }',
    foreignField: '#{context.dest.keyField ? context.dest.keyField : '_id'}',
    justOne: <#if(manySrc){#>false<#} else {#>true<#}#>
  });
}
<#- var sci, child;
var len = context.dest?.childs?.length ?? 0;
for (sci = 0; sci< len; sci++){
  child = context.dest.childs[sci];
#>
reqSuccess = global.RESOLVESCHEMA('#{child}', __dirname);
if(reqSuccess && global.SchemaCache.#{child}){
  global.SchemaCache.#{child}.virtual("#{context.source.name}", {
    ref:'#{src}',
    localField: '#{context.source.keyField ? context.source.keyField: '_id' }',
    foreignField: '#{context.dest.keyField ? context.dest.keyField : '_id'}',
    justOne: <#if(manySrc){#>false<#} else {#>true<#}#>
  });
}
<#-}-#>

<#-
  var manyDst = context.dest.cardinality != '1';
#>
reqSuccess = global.RESOLVESCHEMA('#{src}', __dirname);
if(reqSuccess && global.SchemaCache.#{src}){
  global.SchemaCache.#{src}.virtual("#{context.dest.name}", {
    ref:'#{dst}',
    foreignField: '#{context.source.keyField ? context.source.keyField: '_id' }',
    localField: '#{context.dest.keyField ? context.dest.keyField : '_id'}',
    justOne: <#if(manyDst){#>false<#} else {#>true<#}#>
  });
}
<#- var sci, child;
var len = context.dest?.childs?.length ?? 0;
for (sci = 0; sci< len; sci++){
  child = context.dest.childs[sci];
#>
reqSuccess = global.RESOLVESCHEMA('#{child}', __dirname);
if(reqSuccess && global.SchemaCache.#{child}){
  global.SchemaCache.#{child}.virtual("#{context.dest.name}", {
    ref:'#{dst}',
    foreignField: '#{context.source.keyField ? context.source.keyField : '_id'}',
    localField: '#{context.dest.keyField ? context.dest.keyField: '_id' }',
    justOne: <#if(manyDst){#>false<#} else {#>true<#}#>
  });
}
<#-}-#>
*/
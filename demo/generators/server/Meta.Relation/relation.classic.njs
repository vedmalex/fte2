<#@ noContent #>
let path = require('path');
let mongooseCreated      = require("@grainjs/mongoose-created");
let mongooseLastModified = require("@grainjs/mongoose-last-modified");
let mongoose = global.mongoose;
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let Mixed = Schema.Types.Mixed;
let fs = require('fs');

<#
function getType(name){
  switch(name.toLowerCase()){
    case 'int': return 'Number';
    case 'integer': return 'Number';
    case 'float': return 'Number';
    case 'string': return 'String';
    case 'date': return 'Date';
    case 'boolean': return 'Boolean';
    case 'objectid': return 'ObjectId';
    case 'id': return 'ObjectId';
    case 'stringref': return 'String';
    default:
      return 'Mixed'
  }
}

let notGenerateClass = context.source.embedded || context.dest.embedded || context.theThing;
function decapitalize (str){
  return str.charAt(0).toLowerCase() + str.slice(1);
}
let dot = context.name.indexOf('.');
let schema = ((dot>0)? context.name.slice(dot+1):context.name);
let schemaName = decapitalize(schema) +'Def';
let resCollection = context.namespace+'.'+schema;

const relKind = `${context.source.cardinality}${context.dest.cardinality}`

let { extractRelationEndForRel, getRelIndexConfig } = require(global.USEGLOBAL('/lib/metaDataLoader'))
const { parentSymbol } = require(global.USEGLOBAL('schemaExport/lib/common.js'))
let resolver = require(global.USEGLOBAL('./genpack/resolveLocationType.js'))

const indexConfig = getRelIndexConfig(context, true)

const getChildren = thingType => (global.ThingsAllChilds
  ? global.ThingsAllChilds[thingType]
    ? global.ThingsAllChilds[thingType]
    : false
  : false)

#>
/* #{relKind} */
<#- if(!notGenerateClass){

let sType = getType(global.ThingsProps[context.source.thingType.thingType][context.source.keyField].type);
let dType = getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type);

#>

let $#{schemaName} = {
  __tid: {type: String, default: '#{context.name}', index:true, sparse:true},
 '#{context.source.name}':{type:#{sType}, required:true, #{indexConfig.src}:true, sparse:true },
 '#{context.dest.name}':{type:#{dType}, required:true, #{indexConfig.dst}:true, sparse:true }
};

let _#{schemaName} = new Schema($#{schemaName},{collection:'#{context.collectionType}', autoIndex:false});

_#{schemaName}.plugin(mongooseCreated, { index: true });
_#{schemaName}.plugin(mongooseLastModified, { index: true });

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
  let alreadyOverriden = !!global.#{context.name} && mongoose.model('#{context.name}')

  #{resCollection} = alreadyOverriden ? mongoose.model('#{context.name}') : mongoose.model('#{context.name}', global.SchemaCache.#{context.name});
});

global.EnsureIndex.toBeIndexed.push({location: '#{context.locationType}', model:'#{context.name}'});

<#-}#>

<#-
let r1 = extractRelationEndForRel(context, true )
let r2 = extractRelationEndForRel(context, false )
if(!r1.ref[parentSymbol].global){
  r1 = { ...r1, ref:{...r1.ref, locationType: resolver.resolveThingLocation(r1.ref)}}
}
if(!r2.ref[parentSymbol].global){
  r2 = { ...r2, ref:{...r2.ref, locationType: resolver.resolveThingLocation(r2.ref)}}
}
const rels = [ r1, r2 ]
#>
const rels_config = `#{JSON.stringify(rels.map(rel=>({code:rel.relationType, model:rel.model.thingType, propName: rel.propName, embedded: rel.oppositeEmbedded, ref: rel.ref.thingType})), null, 2)}`

<#- if(notGenerateClass){#>
var reqSuccess = false;
<#- for (let i=0; i< rels.length ;i++){
let rel = rels[i];

const hasChildren = getChildren(rel.model.thingType)
const relDef = global.RelationCache.thing[rel.model.thingType][rel.propName]

const relIsArray = Array.isArray(relDef)-#>
<#
	var many = !rel.single
#>

<#if(rel.oppositeEmbedded){#>
	reqSuccess = RESOLVESCHEMA('#{rel.model.thingType}', __dirname);
	if(reqSuccess && global.SchemaCache.#{rel.model.thingType}){
		var sch = {
			type: #{rel.toKeyField === "id" ? 'ObjectId' : 'Mixed'},
      required: #{rel.required ? 'true' : 'false'},
      #{rel.index.dst}:true,
      sparse:true
		};
		global.SchemaCache.#{rel.model.thingType}.add({"#{rel.propName}":<#if(many){#>[<#}#>sch<#if(many){#>]<#}#>});
	}
<# var sci, child;
var len = hasChildren.length;
for (sci = 0; sci< len; sci++){
	child = hasChildren[sci];
#>
	reqSuccess = RESOLVESCHEMA('#{child}', __dirname);
	if(reqSuccess && global.SchemaCache.#{child}){
		var sch = {
			type: #{rel.toKeyField === "id" ? 'ObjectId' : 'Mixed'},
      required: #{rel.required ? 'true' : 'false'},
      #{rel.index.dst}:true,
      sparse:true
		};
		global.SchemaCache.#{child}.add({"#{rel.propName}":<#if(many){#>[<#}#>sch<#if(many){#>]<#}#>});
	}
<#}#>
<#}#>
<#}#>
<#}#>
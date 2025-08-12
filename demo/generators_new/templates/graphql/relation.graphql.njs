<#@ noContent #>
const { Type, Query, Schema, Enum, Interface} = require('@grainjs/gql-schema-builder')
const gql = require('graphql-tag')
const {registerSchema} = require(USEGLOBAL('graphql/registerSchema'))

const {
  build_relate_options,
  relate_count,
  relate,
  not_opposite_embedded_many_not_embedded_ids_olny,
  not_opposite_embedded_single_not_embedded_ids_olny,
} = require('@grainjs/loaders')

<#
var inspect = require('util').inspect;
var { extractRelationEndForRel } = require(USEGLOBAL('/lib/metaDataLoader'))
const { parentSymbol } = require(USEGLOBAL('schemaExport/lib/common.js'))
var resolver = require(USEGLOBAL('./genpack/resolveLocationType.js'))

function resolveThingName(thingType){
  let [namespace, name] = thingType.split('.');
  return { name, namespace }
}

function GQLName(thingType) {
  return thingType.replaceAll('.','')
}

var getType = function(name){
    switch(name.toLowerCase()){
      case 'int': return 'Int';
      case 'integer': return 'Int';
      case 'float': return 'Float';
      case 'string': return 'String';
      case 'date': return 'Date';
      case 'boolean': return 'Boolean';
      case 'objectid': return 'ID';
      case 'id': return 'ID';
      case 'stringref': return 'String';
      default:
        return name
    }
  }

var notGenerateClass = context.source.embedded || context.dest.embedded;
function decapitalize (str){
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const getChildren = thingType => (ThingsAllChilds
  ? ThingsAllChilds[thingType]
    ? ThingsAllChilds[thingType]
    : false
  : false)

const getEnumName = thingType => {
  if (getChildren(thingType)) {
    return `${thingType.replaceAll('.', '')}Childs`
  } else {
    return thingType.replaceAll('.', '')
  }
}
-#>

/**
    1. сущность для ассоциации
      1. проставляем для нее все необходимые полы
      3. сущность содержит такие же поля как и обычная
        properties
        Edges
      3. сущность может содержать дополнительные поля, которые могут хранить дополнительную информацию об ассоциации
    2. обвновляем сущность на стороне source
    3. обвновляем сущность на стороне dest
*/


const types = []

<# if(!notGenerateClass) {#>

const relSchama = new Type({
  schema:gql`
  type #{GQLName(context.name)} {
    #{context.source.name}: #{getType(global.ThingsProps[context.source.thingType.thingType][context.source.keyField].type)}
    #{context.dest.name}: #{getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)}
    childRel: #{GQLName(context.name)}Edges
  }
`})

types.push(relSchama)

const relSchameEdges = new Type({
  schema: gql`
  type #{GQLName(context.name)}Edges {
    #{context.source.name}: #{GQLName(context.source.thingType.thingType)}
    #{context.dest.name}: #{GQLName(context.dest.thingType.thingType)}
  }
`})

types.push(relSchameEdges)

<# } #>

<#-

let r1 = extractRelationEndForRel(context, false )
let r2 = extractRelationEndForRel(context, true )
if(!r1.ref[parentSymbol].global){
  r1 = { ...r1, ref:{...r1.ref, locationType: resolver.resolveThingLocation(r1.ref)}}
}
if(!r2.ref[parentSymbol].global){
  r2 = extractRelationEndForRel(context, true )
  r2 = { ...r2, ref:{...r2.ref, locationType: resolver.resolveThingLocation(r2.ref)}}
}
const rels = [ r1, r2 ]
#>
// relations
const relations = [
<# for (var i=0, aneLen = rels.length; i< aneLen ;i++){
var rel =rels[i];
const refHasChildren = getChildren(rel.ref.thingType)
const hasChildren = getChildren(rel.model.thingType)
const names = [rel.model.thingType]

if (hasChildren) {
  // проверяем что для конкретной сущности не определена данная связь
  names.push(...hasChildren.filter(t=> global.RelationCache.thing[t][rel.propName].relName == rel.relName))
}

for(var j = names.length - 1; j >=0; j-=1 ) {
  const currentThingType = names[j]

-#>
<# if(!rel.oppositeEmbedded){ #>
// !oppositeEmbedded
<# if(rel.single) {#>
// !oppositeEmbedded & single
<# if(rel.embedded) {#>
// !oppositeEmbedded & single & embedded
    new Type({
      schema: gql`
        type #{GQLName(currentThingType)}Edges {
          #{rel.propName.replaceAll('.','')}(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):#{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}: relate(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
    new Type({
      schema: gql`
        type #{GQLName(currentThingType)}Edges {
          #{rel.propName.replaceAll('.','')}Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>): Int
        }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}Count: relate_count(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
<#} else {#>
// !oppositeEmbedded & single & !embedded
    // props
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)} {
        #{rel.propName.replaceAll('.','')}: #{getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)}
      }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}: not_opposite_embedded_single_not_embedded_ids_olny(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
    // edges
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):#{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
      }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}: relate(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):Int
      }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}Count: relate_count(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
<#}#>
<#} else {#>
// !oppositeEmbedded & many
<#if(rel.embedded) {  #>
// !oppositeEmbedded & many & embedded
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON,  conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):[#{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>]
      }
      `,
      resolver:{
        #{rel.propName.replaceAll('.','')}: relate(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON,  conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):Int
      }
      `,
      resolver:{
        #{rel.propName.replaceAll('.','')}Count: relate_count(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
<# } else {#>
// !oppositeEmbedded & many & !embedded
    // props
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)} {
        #{rel.propName.replaceAll('.','')}:[#{getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)}]
      }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}: not_opposite_embedded_many_not_embedded_ids_olny(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),

    //edges
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):[#{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>]
      }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}: relate(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
        }
    }),
    new Type({
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):Int
      }
      `,
      resolver: {
        #{rel.propName.replaceAll('.','')}Count: relate_count(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
<#}#>
<#}#>
<# } else { #>
// oppositeEmbedded
// can be properties of thing
<#if(rel.single){ #>
<# var listing = inspect(context,{ depth:2 });#>
// oppositeEmbedded & single
    new Type({
      // исправить: поставить правильную ссылку на модель
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):#{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
      }
      `,
      resolver:{
        #{rel.propName.replaceAll('.','')}: relate(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
    new Type({
      // исправить: поставить правильную ссылку на модель
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):Int
      }
      `,
      resolver:{
        #{rel.propName.replaceAll('.','')}Count: relate_count(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
<#-} else {-#>
// oppositeEmbedded & many
    new Type({
      // исправить: поставить правильную ссылку на модель
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>):[#{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>]
      }
      `,
      resolver:{
        #{rel.propName.replaceAll('.','')}: relate(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
    new Type({
      // исправить: поставить правильную ссылку на модель
      schema: gql`
       type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON<#if(refHasChildren) {#>, kind:#{getEnumName(rel.ref.thingType)}<#}#>): Int
      }
      `,
      resolver:{
        #{rel.propName.replaceAll('.','')}Count: relate_count(build_relate_options('#{rel.model.thingType}', '#{rel.propName}'))
      }
    }),
<#-}#>
<#-}-#>
<#}#>
<#}#>
]

//
registerSchema('#{GQLName(context.name)}', new Schema({
  name: '#{GQLName(context.name)}',
  items: [ ...types,...relations,
  ],
  })
)

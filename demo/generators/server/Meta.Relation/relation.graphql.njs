<#@ noContent #>
const { Type, Query, Schema, Enum, Interface, Union} = require('@grainjs/gql-schema-builder')
const gql = require('graphql-tag')
const {registerSchema} = require(global.USEGLOBAL('graphql/registerSchema'))

const {
  build_relate_options,
  relate_count,
  relate,
  build_variation,
  variant_union_resolver,
} = require('@grainjs/loaders')

<#
let { extractRelationEndForRel } = require(global.USEGLOBAL('/lib/metaDataLoader'))
const { parentSymbol } = require(global.USEGLOBAL('schemaExport/lib/common.js'))
let resolver = require(global.USEGLOBAL('./genpack/resolveLocationType.js'))

function GQLName(thingType) {
  return thingType.replaceAll('.','')
}

let getType = function(name){
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

let notGenerateClass = context.source.embedded || context.dest.embedded;

const getChildren = thingType => (global.ThingsAllChilds
  ? global.ThingsAllChilds[thingType]
    ? global.ThingsAllChilds[thingType]
    : false
  : false)

const getEnumName = thingType => {
  if (getChildren(thingType)) {
    return `${thingType.replaceAll('.', '')}Childs`
  } else {
    return thingType.replaceAll('.', '')
  }
}
#>
<*
    1. сущность для ассоциации
      1. проставляем для нее все необходимые полы
      3. сущность содержит такие же поля как и обычная
        properties
        Edges
      3. сущность может содержать дополнительные поля, которые могут хранить дополнительную информацию об ассоциации
    2. обвновляем сущность на стороне source
    3. обвновляем сущность на стороне dest
*>
const types = []
<#- if(!notGenerateClass) {#>
const relSchama = new Type({
  schema:gql`
  type #{GQLName(context.name)} {
    _tid: String,
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
<#- } #>
<#-
let r1 = extractRelationEndForRel(context, true )
let r2 = extractRelationEndForRel(context, false )
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
<#- for (let i=0, aneLen = rels.length; i< aneLen ;i++){
let rel = rels[i];

const refHasChildren = getChildren(rel.ref.thingType)
const hasChildren = getChildren(rel.model.thingType)
const relDef = global.RelationCache.thing[rel.model.thingType][rel.propName]

const relIsArray = Array.isArray(relDef)-#>

<#- if(relIsArray){#>
/*
  enum #{GQLName(rel.model.thingType)}#{rel.propName}Enum {
    #{GQLName(rel.relName)}
  }
  union #{GQLName(rel.model.thingType)}#{rel.propName}Union =
    #{GQLName(rel.ref.thingType)}
    #{rel.model.thingType}
    #{rel.ref.thingType}
    #{rel.propName}
*/
  new Union({
    schema:gql`
    union #{GQLName(rel.model.thingType)}#{rel.propName}Union =
      #{GQLName(rel.ref.thingType)}
    `,
    resolver: variant_union_resolver
  }),
  new Enum({schema:gql`
    enum #{GQLName(rel.model.thingType)}#{rel.propName}Enum {
      #{GQLName(rel.relName)}
    }`,
    resolver:{
      #{GQLName(rel.relName)}:"#{rel.relName}"
    }
  }),
<#-}#>
<*
// 1 найти ассоциацию для сущности
// 2 понять что она включена в набор из более чем одной ассоциации
// создать или обновить enum в котором будет хранится название ассоциации или класса, на который нужна ссылка
// enum SharanContract_order = SharanPOL_Order | SharanOrder | SharanNOV_Order // проверить что он обновляется
// создать поле типа order(type:SharanContract_order)[SharanContract_order]
// придумать как смержить enums, может быть автоматически
*>
<#- const names = [rel.model.thingType]

if (hasChildren) {
  // проверяем что для конкретной сущности не определена данная связь
  names.push(
    ...hasChildren.filter(t => {
      const r = global.RelationCache.thing[t][rel.propName]
      if (Array.isArray(r)) {
        return r.some(el => el.relName == rel.relName)
      } else {
        return r.relName == rel.relName
      }
    }),
  )
}

for(let j = names.length - 1; j >=0; j-=1 ) {
  const currentThingType = names[j]#>
<#- if(!rel.oppositeEmbedded){ #>
// !oppositeEmbedded
<#- if(rel.single) {#>
// !oppositeEmbedded & single
<#- if(rel.embedded) {#>
// !oppositeEmbedded & single & embedded
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}(
          <#- if(relIsArray){#>
          variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
          <#-}#>
          onlyIds: Boolean,
          ensure: Boolean,
          absent: Boolean,
          options: JSON,
          conditions:JSON
          <#- if(refHasChildren) {#>,
          kind:#{getEnumName(rel.ref.thingType)}
          <#- }#>
        ):
        <#-  if(relIsArray){#>
        #{GQLName(rel.model.thingType)}#{rel.propName}Union
        <#- } else {#>
        #{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        <#- }#>
      }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}:
      <#- if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}',
        '#{rel.relName}',
      <#- }#>
        relate(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#- if(relIsArray){#>
      )
      <#- }#>
    }
  }),
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(
          <#- if(relIsArray){#>
          variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
          <#- }#>
          onlyIds: Boolean,
          ensure:Boolean,
          absent:Boolean,
          options: JSON,
          conditions:JSON
          <#- if(refHasChildren) {#>,
          kind:#{getEnumName(rel.ref.thingType)}
          <#- }#>
        ): Int
      }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}Count:
      <#- if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}Count',
        '#{rel.relName}',
      <#- }#>
        relate_count(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#- if(relIsArray){#>
      )
      <#- }#>
    }
  }),
<#- } else {#>
// !oppositeEmbedded & single & !embedded
  // edges
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}(
      <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
      <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):
        <#-  if(relIsArray){#>
        #{GQLName(rel.model.thingType)}#{rel.propName}Union
        <#- } else {#>
        #{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        <#- }#>
    }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}:
      <#- if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}',
        '#{rel.relName}',
      <#- } -#>
        relate(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#- if(relIsArray){#>
      )
      <#- }#>
    }
  }),
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}Count(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}<#}#>
      ):Int
    }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}Count:
      <#-  if(relIsArray){ -#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}Count',
        '#{rel.relName}',
      <#- }#>
        relate_count(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
<#- }#>
<#- } else {#>
// !oppositeEmbedded & many
<#- if(rel.embedded) {  #>
// !oppositeEmbedded & many & embedded
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):[
        <#- if(relIsArray){-#>
        #{GQLName(rel.model.thingType)}#{rel.propName}Union
        <#- } else { -#>
        #{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        <#- } -#>
      ]
    }
    `,
    resolver:{
      #{rel.propName.replaceAll('.','')}:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}',
        '#{rel.relName}',
      <#- }#>
        relate(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
        #{rel.propName.replaceAll('.','')}Count(
          <#-  if(relIsArray){#>
          variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
          <#- }#>
          onlyIds: Boolean,
          ensure:Boolean,
          absent:Boolean,
          options: JSON,
          conditions:JSON
          <#- if(refHasChildren) {#>,
          kind:#{getEnumName(rel.ref.thingType)}
          <#- }#>
        ):Int
      }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}Count:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}Count',
        '#{rel.relName}',
      <#- }#>
        relate_count(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#- if(relIsArray){#>
      )
      <#- }#>
    }
  }),
<#-  } else {#>
// !oppositeEmbedded & many & !embedded
  // edges
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):[
        <#-  if(relIsArray){#>
        #{GQLName(rel.model.thingType)}#{rel.propName}Union
        <#- } else {#>
        #{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        <#- }#>
      ]
    }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}',
        '#{rel.relName}',
      <#- }#>
        relate(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
      }
  }),
  new Type({
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}Count(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):Int
    }
    `,
    resolver: {
      #{rel.propName.replaceAll('.','')}Count:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}Count',
        '#{rel.relName}',
      <#- }#>
        relate_count(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
<#- }#>
<#- }#>
<#-  } else { #>
// oppositeEmbedded
// can be properties of thing
<#- if(rel.single){ #>
// oppositeEmbedded & single
  new Type({
    // исправить: поставить правильную ссылку на модель
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):
        <#-  if(relIsArray){#>
        #{GQLName(rel.model.thingType)}#{rel.propName}Union
        <#- } else {#>
        #{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        <#- }#>
    }
    `,
    resolver:{
      #{rel.propName.replaceAll('.','')}:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}',
        '#{rel.relName}',
      <#- }#>
        relate(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
  new Type({
    // исправить: поставить правильную ссылку на модель
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}Count(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):Int
    }
    `,
    resolver:{
      #{rel.propName.replaceAll('.','')}Count:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}Count',
        '#{rel.relName}',
      <#- }#>
        relate_count(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
<#-} else {#>
// oppositeEmbedded & many
  new Type({
    // исправить: поставить правильную ссылку на модель
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ):[
        <#-  if(relIsArray){#>
        #{GQLName(rel.model.thingType)}#{rel.propName}Union
        <#- } else {#>
        #{GQLName(rel.ref.thingType)}<#if(refHasChildren){#>Union<#}#>
        <#- }#>
        ]
    }
    `,
    resolver:{
      #{rel.propName.replaceAll('.','')}:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}',
        '#{rel.relName}',
      <#- }#>
        relate(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
  new Type({
    // исправить: поставить правильную ссылку на модель
    schema: gql`
      type #{GQLName(currentThingType)}Edges {
      #{rel.propName.replaceAll('.','')}Count(
        <#-  if(relIsArray){#>
        variation: #{GQLName(rel.model.thingType)}#{rel.propName}Enum!,
        <#- }#>
        onlyIds: Boolean,
        ensure:Boolean,
        absent:Boolean,
        options: JSON,
        conditions:JSON
        <#- if(refHasChildren) {#>,
        kind:#{getEnumName(rel.ref.thingType)}
        <#- }#>
      ): Int
    }
    `,
    resolver:{
      #{rel.propName.replaceAll('.','')}Count:
      <#-  if(relIsArray){#>
      build_variation(
        '#{rel.model.thingType}',
        '#{rel.propName}Count',
        '#{rel.relName}',
      <#- }#>
        relate_count(
          build_relate_options(
            '#{rel.model.thingType}',
            '#{rel.propName}',
            '#{rel.relName}'
          )
        )
      <#-  if(relIsArray){#>
      )
      <#- }#>
    }
  }),
<#- }#>
<#- }#>
<#- }#>
<#- }#>
]

//
registerSchema('#{GQLName(context.name)}',
  new Schema({
    name: '#{GQLName(context.name)}',
    items: [
      ...types,
      ...relations,
    ],
  })
)

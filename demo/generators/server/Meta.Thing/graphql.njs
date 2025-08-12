const { Type, Query, Schema, Enum, Union} = require('@grainjs/gql-schema-builder')
const gql = require('graphql-tag')
const {registerSchema} = require(global.USEGLOBAL('graphql/registerSchema'))
const { get } = require('lodash');

const {
  query_many,
  query_many_count,
  variant_union_resolver,
} = require('@grainjs/loaders')

const { toGlobalId } = require('@grainjs/id-generator')

// TODO: проверить как можно добавлять условия в запросы
// условия, такие же как на запросной части приложения

<#- block 'gqlprops' : -#>
<#@ noContent #>
<#-
  const hasChilds = context.hasChilds(context.thingType)

  let getType = (name)=>{
    let res = ''
    switch(name.toLowerCase()){
      case 'int': res = 'Int'; break;
      case 'integer': res = 'Int'; break;
      case 'float': res = 'Float'; break;
      case 'string': res = 'String'; break;
      case 'date': res = 'Date'; break;
      case 'boolean': res = 'Boolean'; break;
      case 'id': res = 'ID'; break;
    }
    return res
  }
 #>
      id: ID!
      _id: ID!
      _tid: String
<#-
  // properties
  for (let i=0, props = context.properties ,proplen = props?.length ?? 0; i < proplen; i++) {
    let pName = props[i].propertyName.replaceAll('.','');-#>
    <#-if(props[i].type === 'date') {#>
      #{pName}(format:String, zone: Float, json: Boolean): #{getType(props[i].type)}
    <#-} else {#>
    #{pName}: #{getType(props[i].type)}
    <#- }-#>
<#-}#>
  <#-if(context.hasRels > 0) {#>
    childRel:#{context.GQLName(context.thingType)}Edges
  <#}#>
<#- end -#>

<#-
  const hasChilds = context.hasChilds(context.thingType)

  let allRels = context.relations

  context.GQLName = function GQLName(thingType) {
  return thingType.replaceAll('.','')
}
  context.hasRels = allRels.length > 0

#>

<# if(hasChilds) {#>
const tUnion = new Union({
    schema:gql`
    # #{context.$namespace}#{context.$name} of the #{context.$namespace}
    union #{context.$namespace}#{context.$name}Union =
        #{context.$namespace}#{context.$name}
        <#-context.allChilds.forEach(item=>{#>
        | #{item.replaceAll('.','')}
        <#-})#>
    `,
    resolver: variant_union_resolver
})

const tEnum = new Enum({schema:gql`
      enum #{context.$namespace}#{context.$name}Childs {
        <#-context.allChilds.forEach(item=>{#>
        #{item.replaceAll('.','')}
        <#-})#>
      }
    `, resolver:{
        <#context.allChilds.forEach(item=>{#>
          #{item.replaceAll('.','')}: "#{item}",
        <#})#>
    }})
<#}#>

const main = new Type({
  schema:gql`
    # #{context.$namespace}#{context.$name} of the #{context.$namespace}
    type #{context.$namespace}#{context.$name} implements Node{
      #{content('gqlprops', context)}
    }`
  ,
  resolver: {
    id: root => root._id,
    _id: root => root._id,
    _tid: root => root.__tid,
    <#-if(allRels.length > 0) {#>
    childRel: (root, args, context, info) => {
      return root
    },
    <#-}-#>
<#-
  // properties
  for (let i=0, props = context.properties ,proplen = props?.length ?? 0; i < proplen; i++) {-#>
  <#- let pName = props[i].propertyName.replaceAll('.','');-#>
      <#-if(props[i].type === 'date') {#>
      #{pName}:(root, {format, zone, json}, context, info) => {
        let result = get(root,"#{props[i].propertyName}")
        if(format && zone){
          return result.format(format, zone);
        }
        if (format){
          return result.format(format, zone);
        }
        if(json){
          return result?.toJSON();
        }
        return result;
      },
      <#} else if(pName !== props[i].propertyName) {#>
      #{pName}:(root, args, context, info) => get(root,"#{props[i].propertyName}"),
      <#-}#>
    <#-}#>
  }
})


const query = [
  new Query({
    schema: gql`
      extend type Query {
        #{context.$namespace}#{context.$name}(
          onlyIds: Boolean,
          ensure: Boolean,
          absent: Boolean,
          options: JSON, conditions:JSON<#if(hasChilds) {#>, kind:#{context.getEnumName(context.thingType)}<#}#>): [#{context.$namespace}#{context.$name}<#if(hasChilds){#>Union<#}#>]
      }
    `,
    resolver: query_many({
        sourceLocation:'#{context.locationType}',
        sourceModel:'#{context.thingType}',
        hasChildren:<#if(hasChilds){#>true<#} else {#>false<#}#>,
        hasExtends:<#if(context.extends){#>true<#} else {#>false<#}#>,
        allChildren:[
          <#-context.allChilds?.forEach(item=>{#>
          "#{item}",
          <#-})#>
        ]
      },
    )
  }),

  new Query({
    schema: gql`
      extend type Query {
        #{context.$namespace}#{context.$name}Count(
          onlyIds: Boolean,
          ensure: Boolean,
          absent: Boolean,
          options: JSON, conditions:JSON<#if(hasChilds) {#>, kind:#{context.getEnumName(context.thingType)}<#}#>): Int
      }
    `,
    resolver: query_many_count({
        sourceLocation:'#{context.locationType}',
        sourceModel:'#{context.thingType}',
        hasChildren:<#if(hasChilds){#>true<#} else {#>false<#}#>,
        hasExtends:<#if(context.extends){#>true<#} else {#>false<#}#>,
        allChildren:[
          <#-context.allChilds?.forEach(item=>{#>
          "#{item}",
          <#-})#>
        ]
      },
    )
  }),
]
//
registerSchema('#{context.$namespace}#{context.$name}', new Schema({
  name: '#{context.$namespace}#{context.$name}',
  items: [main, ...query,
  <#if(hasChilds){#>
    tEnum,
    tUnion,
  <#}#>
  ],
  })
)

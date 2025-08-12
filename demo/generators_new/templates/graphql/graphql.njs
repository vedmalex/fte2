const { Type, Query, Schema, Enum, Union} = require('@grainjs/gql-schema-builder')
const gql = require('graphql-tag')
const {registerSchema} = require(USEGLOBAL('graphql/registerSchema'))
const { get } = require('lodash');

const {
  query_many,
  query_many_count,
} = require('@grainjs/loaders')

// TODO: проверить как можно добавлять условия в запросы
// условия, такие же как на запросной части приложения

<#- block 'gqlprops' : -#>
<#@ noContent #>
<#-
  const hasChilds = context.hasChilds(context.thingType)

  var getType = function(name){
    switch(name.toLowerCase()){
      case 'int': return 'Int';
      case 'integer': return 'Int';
      case 'float': return 'Float';
      case 'string': return 'String';
      case 'date': return 'Date';
      case 'boolean': return 'Boolean';
      case 'id': return 'ID';
    }
  }
  const hasID = context.properties.find(p=>p.propertyName.toLowerCase().trim() == 'id' )
  const has_ID = context.properties.find(p=>p.propertyName.toLowerCase().trim() == '_id' )
 -#>
<#- if(!hasID){-#>
      id: ID
<#  } -#>
<#- if(!has_ID){ -#>
      _id: ID
<#  } -#>
<#if(hasChilds || context.extends ){-#>
      _tid: String
<#-}-#>
<#-
  // properties
  for (var i=0, props = context.properties ,proplen = props?.length ?? 0; i < proplen; i++) {
    var pName = props[i].propertyName.replaceAll('.','');-#>
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
var inspect = require('util').inspect;
const hasChilds = context.hasChilds(context.thingType)

function resolveThingName(thingType){
  let [namespace, name] = thingType.split('.');
  return { name, namespace }
}

const GQLName = context.GQLName = function GQLName(thingType) {
  return thingType.replaceAll('.','')
}

  var allRels = [];
  allRels.push.apply(allRels,context.destRels);
  allRels.push.apply(allRels,context.sourceRels);
  var allNonEmbedded = allRels.filter(function(r){
    return !r.oppositeEmbedded;
  });
  context.hasRels = allRels.length > 0

#>

<# var listing = inspect(context,{ depth:4 });#>
/* # {listing}*/

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
    resolver: (root)=> {
      return root.__tid.replaceAll('.','')
    }
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
    type #{context.$namespace}#{context.$name} {
      #{content('gqlprops', context)}
    }`
  ,
  resolver: {
    <#
      const hasID = context.properties.find(p=>p.propertyName.toLowerCase().trim() == 'id' )
      if(!hasID) {#>
    id: root => root._id,
    <#}#>
    <#if(hasChilds || context.extends ){#>
      _tid: root => root.__tid,
    <#}-#>
    <#-if(allRels.length > 0) {#>
    childRel: (root, args, context, info) => {
      return root
    },
    <#-}-#>
<#-
  // properties
  for (var i=0, props = context.properties ,proplen = props?.length ?? 0; i < proplen; i++) {-#>
  <#- var pName = props[i].propertyName.replaceAll('.','');-#>
      <#-if(props[i].type === 'date') {#>
      #{pName}:(root, {format, zone, json}, context, info) => {
        var result = get(root,"#{props[i].propertyName}")
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
      <#} else {#>
        <#-if(pName !== props[i].propertyName) {#>
      #{pName}:(root, args, context, info) => get(root,"#{props[i].propertyName}"),
        <#-}-#>
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

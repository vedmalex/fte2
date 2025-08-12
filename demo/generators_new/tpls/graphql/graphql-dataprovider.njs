<#@ context "model" -#>
<#@ alias "graphql-dataprovider" -#>
<#@ chunks "graphql-provider.js" -#>

<# model.enums.forEach(item=>{#>
<#- chunkStart(`graphql/${item.name}/index.js`); #>
import gql from 'graphql-tag';
import { Enum } from '@grainjs/gql-schema-builder';
export default new Enum({
  schema:gql`
  enum #{item.name} {
    <# item.items.forEach(it =>{-#>
      #{it.name}
    <# })#>
  }
  `
})
<#- chunkEnd(); -#>
<# })#>

<#
model.entities.filter(e => !e.abstract)
.forEach(item=> {#>
<#- chunkStart(`graphql/${item.name}/index.js`); #>
import { Schema } from '@grainjs/gql-schema-builder';
<#- const required = [] -#>
import #{item.name} from './#{item.name}.js'
<#- required.push(`${item.name}`)-#>
<#- chunkEnd(); -#>
<#- chunkStart(`graphql/${item.name}/${item.name}.js`); #>
import gql from 'graphql-tag';
import { Type } from '@grainjs/gql-schema-builder';
export default new Type ({
  schema: gql`type #{item.name} {
      <#
      item.props
      .filter(p=> !(item.embedded && p.name == 'id'))
      .filter(p=>!p.ref)
      .forEach(prop=> {
      -#>
      #{prop.name}: #{prop.gqlType}#{prop.required ? '!':''}
      <#})#>
  }`,
     resolvers: {
    <#item.props
    .filter(p=>p.name != 'id')
    .filter(p=>!p.ref)
    .filter(f=>f.calculated).forEach(f=>{#>
      #{f.name}:(root, args, context, info)=> {
        // custom mutations implementation
        //  throw new Error("not implemented")
        // custom mutations implementation
      },
      <#})#>
     },
  })
<#- chunkEnd(); -#>

<#- const relations = [] -#>

import { Schema } from '@grainjs/gql-schema-builder';
  <#item.props
      .filter(p=>p.ref)
      .forEach(f=> {
      const { ref, embedded, stored, single } = f;
        if(item.embedded && f.name === 'id') return;
      -#>

<#- chunkStart(`graphql/${item.name}/relations/index.js`); #>
import #{f.name} from './#{f.name}.js'
<#- relations.push(`${f.name}`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/relations/${f.name}.js`); #>
import gql from 'graphql-tag';
import { Type } from '@grainjs/gql-schema-builder';
export default new Type ({
    schema: gql`extend type #{item.name} {
      <#-if(single && !embedded) {-#>
      #{f.name}Id: ID
      <#-} else if(!single && !embedded) {-#>
      #{f.name}Ids:[ID]
      <#-} else {-#>
      <#-}#>
      #{f.name}
      <#-if(!single && !embedded){#>(pagination: Pagination, filter: JSON)<#}#>:
      <#-if(!single){#>[<#}-#>
      #{f.gqlType}#{f.required ? '!':''}
      <#-if(!single){#>]<#}-#>
  }`,
  resolver: {
      <#
      if(!(f.calculated || f.readonly) && !embedded) {
        const rEntity = model.entities[model.typeMap[f.ref.entity].index];
        #>
        <#-if(f.single && f.stored){#>
        #{f.name}Id: (root)=>root.#{f.ref.backField},
        <#}-#>
        <#-if(f.ref.using){-#>
          <#-if(f.single) {-#>
          #{f.name}Id: async (root, _ , {dataProvider}) => {
            const linkTable = await dataProvider.getListNative('#{f.ref.using.entity}', {
              filter: { #{f.ref.using.field}: root.#{f.ref.backField} },
              pagination: {page:1, perPage: 1}
            });
            return linkTable.data.map(d => d.#{f.ref.usingField})[0];
          },
          <#-} else {-#>
        #{f.name}Ids: async (root,_, {dataProvider}) => {
            const linkTable = await dataProvider.getListNative('#{f.ref.using.entity}', {
              filter: { #{f.ref.using.field}: root.#{f.ref.backField} },
            });
            return linkTable.data.map(d => d.#{f.ref.usingField});
          },
          <#-}-#>
        <#-} else if(!f.stored){-#>
        <#-if(f.single) {-#>
         #{f.name}Id: async (root,_, {dataProvider}) => {
            const res = await dataProvider.getListNative('#{rEntity.name}',{filter:{#{f.ref.opposite}: root.#{f.name}}, pagination:{page:1, perPage:1}});
            return res.data.length > 0 ? res.data[0].id : null
          },
          <#-} else {-#>
        #{f.name}Ids: async (root,_, {dataProvider}) => {
            const filter = {#{f.ref.opposite}: root.#{f.ref.backField}}
            const res = await dataProvider.getListNative('#{rEntity.name}',{ filter});
            return res.data.map(item=>item.id)
          },
          <#-}-#>
        <#-}-#>
        #{f.name}: async (root, <#if(!f.single){#>{pagination, filter}<#} else {#>_<#}#>, {dataProvider})=> {
          <#if (f.ref.using) {#>
          <#if(f.single) {#>
          const linkTable = await dataProvider.getListNative('#{f.ref.using.entity}', {
            filter: { #{f.ref.using.field}: root.#{f.ref.backField} },
            pagination: {page:1, perPage: 1}
          });
          let ids = linkTable.data.map(d => d.#{f.ref.usingField}});
          const result = await dataProvider.getList('#{f.ref.entity}', {
            filter: { #{f.ref.field}: { in: ids } },
          });
          return result.data[0];
          <#} else {#>
          const linkTable = await dataProvider.getListNative('#{f.ref.using.entity}', {
            filter: { #{f.ref.using.field}: root.#{f.ref.backField} },
            pagination,
          });
          let ids = linkTable.data.map(d => d.#{f.ref.usingField});
          if (filter){
            filter.#{f.ref.field} = { in: ids }
          } else {
            filter = { #{f.ref.field}: { in: ids } }
          }
          const result = await dataProvider.getList('#{f.ref.entity}', {
            filter,
            pagination,
          });
          return result.data;
          <#}#>
          <# } else { #>
            <#if(f.single) {#>
            const res = await dataProvider.getListNative('#{rEntity.name}',{filter:{#{f.ref.opposite}: root.#{f.name}}, pagination:{page:1, perPage:1}});
            <#-} else {-#>
            if (filter){
              filter.#{f.ref.opposite} = root.#{f.ref.backField}
            } else {
              filter = {#{f.ref.opposite}: root.#{f.ref.backField}}
            }
            const res = await dataProvider.getListNative('#{rEntity.name}',{pagination, filter});
            <#-}-#>
            return res.data;
          <#}#>
      },
      <#}#>

      <#if(f.calculated){#>
      #{f.name}:(root, args, context, info)=> {
        // custom mutations implementation
        //  throw new Error("not implemented")
        // custom mutations implementation
      },
      <#}#>
    },
  })
<#- chunkEnd(); -#>
<#})#>

<#if(relations.length > 0) {#>
<#- chunkStart(`graphql/${item.name}/index.js`); #>
import relations from './relations'
<#- required.push(`relations`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/relations/index.js`); #>
import { Schema } from '@grainjs/gql-schema-builder';
export default new Schema({
  name:'#{item.name}.relations',
  items: [
<#-relations.forEach(item=>{-#>
  #{item},
<#-})-#>
  ]
})
<#- chunkEnd(); -#>
<#}#>


<#- chunkStart(`graphql/${item.name}/index.js`); #>
import inputs from './inputs'
<#- required.push(`inputs`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/inputs/index.js`); #>
<#- const inputs = [] -#>
import { Schema } from '@grainjs/gql-schema-builder';
import Create from './Create.js'
<#- inputs.push(`Create`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/inputs/Create.js`); #>
import gql from 'graphql-tag';
import { Input } from '@grainjs/gql-schema-builder';
export default new Input( gql`
  input #{item.name}Create {
    <#item.props
    .filter(p=> !p.calculated)
    .filter(p=>(item.embedded && p.name != 'id')||!item.embedded)
    .filter(p=>!(p.ref && !p.single && !p.embedded)).forEach(prop=>{
      const { ref, single, stored, embedded, verb } = prop;
      const isSingle = !ref || single
      -#>
    <#-if(single && stored){-#>
    #{prop.name}:ID
    <#-} else {-#>
    #{prop.name}: <#if(!isSingle){#>[<#}#>#{prop.isFile ? 'Upload' : prop.gqlType}<#if(ref && !prop.isFile){#>Create<#}#><#if(!isSingle){#>]<#}#>#{prop.required && prop.name!=='id' ? '!':''}
    <#-}#>
    <#})#>
  }
  `)
<#- chunkEnd(); -#>
<#- chunkStart(`graphql/${item.name}/inputs/index.js`); #>
import Update from './Update.js'
<#- inputs.push(`Update`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/inputs/Update.js`); #>
import gql from 'graphql-tag';
import { Input } from '@grainjs/gql-schema-builder';
export default new Input( gql`
  input #{item.name}Update {
    <#item.props
    .filter(p=> !p.calculated)
    .filter(p=>(item.embedded && p.name != 'id')||!item.embedded)
    .filter(p=>!(p.ref && !p.single && !p.embedded)).forEach(prop=>{
      const { ref, single, stored, embedded, verb } = prop;
      const isSingle = !ref || single
      -#>
    <#-if(single && stored){-#>
    #{prop.name}:ID
    <#-} else {-#>
    #{prop.name}: <#if(!isSingle){#>[<#}#>#{prop.isFile ? 'Upload' : prop.gqlType}<#if(ref && !prop.isFile){#>Update<#}#><#if(!isSingle){#>]<#}#>
    <#-}#>
    <#})#>
  }
   `)
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/inputs/index.js`); #>

export default new Schema({
  name:'#{item.name}.inputs',
  items:[
    <#-inputs.forEach(item=>{-#>
    #{item},
    <#-})-#>
  ]
})
<#- chunkEnd(); -#>

<#if(!item.embedded){#>

<#- chunkStart(`graphql/${item.name}/index.js`); #>
import operations from './operations'
<#- required.push(`operations`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
<#- const operations = [] -#>
import { Schema } from '@grainjs/gql-schema-builder';
import ListResult from './ListResult.js'
<#- operations.push(`ListResult`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/ListResult.js`); #>
import gql from 'graphql-tag';
import { Type } from '@grainjs/gql-schema-builder';
export default new Type( gql`
  type #{item.name}ListResult {
    data: [#{item.name}]
    total: Int
  }`)
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import SingleResult from './SingleResult.js'
<#- operations.push(`SingleResult`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/SingleResult.js`); #>
import gql from 'graphql-tag';
import { Type } from '@grainjs/gql-schema-builder';
export default new Type( gql`
  type #{item.name}SingleResult {
    data: #{item.name}
  }
  `)
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import getOne from './getOne.js'
<#- operations.push(`getOne`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/getOne.js`); #>
import gql from 'graphql-tag';
import { Query } from '@grainjs/gql-schema-builder';
export default new Query(
    {
      schema:gql`
      extend type Query {
        getOne#{item.name}(id: ID!): #{item.name}SingleResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_,{id}, {dataProvider}) => dataProvider.getOne('#{item.name}', {id}),
  <#- } else {-#>
  (_,{id}, {dataProvider}) => {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import getList from './getList.js'
<#- operations.push(`getList`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/getList.js`); #>
import gql from 'graphql-tag';
import { Query } from '@grainjs/gql-schema-builder';
export default new Query(
    {
      schema:gql`
      extend type Query {
        getList#{item.name}(pagination: Pagination, sort: Sort, filter: JSON): #{item.name}ListResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_, {pagination, sort, filter}, {dataProvider})=> dataProvider.getList('#{item.name}',{ pagination, sort, filter }),
  <#- } else {-#>
  (_, {pagination, sort, filter}, {dataProvider})=> {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import getListNative from './getListNative.js'
<#- operations.push(`getListNative`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/getListNative.js`); #>
import gql from 'graphql-tag';
import { Query } from '@grainjs/gql-schema-builder';
export default new Query(
    {
      schema:gql`
      extend type Query {
        getListNative#{item.name}(pagination: Pagination, sort: Sort, filter: JSON): #{item.name}ListResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_, {pagination, sort, filter}, {dataProvider})=> dataProvider.getListNative('#{item.name}',{ pagination, sort, filter }),
  <#- } else {-#>
   (_, {pagination, sort, filter}, {dataProvider})=> {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import getMany from './getMany.js'
<#- operations.push(`getMany`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/getMany.js`); #>
import gql from 'graphql-tag';
import { Query } from '@grainjs/gql-schema-builder';
export default new Query(
    {
      schema:gql`
      extend type Query {
        getMany#{item.name}(ids: [ID]!):#{item.name}ListResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_, { ids }, {dataProvider})=> dataProvider.getMany('#{item.name}',{ ids }),
  <#- } else {-#>
  (_, { ids }, {dataProvider})=> {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import getManyReference from './getManyReference.js'
<#- operations.push(`getManyReference`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/getManyReference.js`); #>
import gql from 'graphql-tag';
import { Query } from '@grainjs/gql-schema-builder';
export default new Query(
    {
      schema:gql`
      extend type Query {
        getManyReference#{item.name}(target: String, id: ID, pagination: Pagination, sort: Sort, filter: JSON): #{item.name}ListResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_, { target, id, pagination, sort, filter}, {dataProvider})=> dataProvider.getManyReference('#{item.name}',{ target, id, pagination, sort, filter }),
  <#- } else {-#>
  (_, { target, id, pagination, sort, filter}, {dataProvider})=> {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import create from './create.js'
<#- operations.push(`create`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/create.js`); #>
import gql from 'graphql-tag';
import { Mutation} from '@grainjs/gql-schema-builder';
export default new Mutation(
    {
      schema:gql`
      extend type Mutation {
        create#{item.name}(data: #{item.name}Create!): #{item.name}SingleResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_,{ data }, {dataProvider}) => dataProvider.create('#{item.name}', { data }),
  <#- } else {-#>
  (_,{ data }, {dataProvider}) => {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import update from './update.js'
<#- operations.push(`update`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/update.js`); #>
import gql from 'graphql-tag';
import {Mutation} from '@grainjs/gql-schema-builder';
export default new Mutation(
    {
      schema:gql`
      extend type Mutation {
        update#{item.name}(id: ID, data: #{item.name}Update!, previousData: #{item.name}Update!): #{item.name}SingleResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_,{id, data, previousData}, {dataProvider}) => dataProvider.update('#{item.name}', { id, data, previousData }),
  <#- } else {-#>
  (_,{id, data}, {dataProvider}) => {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import updateMany from './updateMany.js'
<#- operations.push(`updateMany`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/updateMany.js`); #>
import gql from 'graphql-tag';
import {Mutation} from '@grainjs/gql-schema-builder';
export default new Mutation(
    {
      schema:gql`
      extend type Mutation {
        updateMany#{item.name}(ids: ID!, data: #{item.name}Update!): IdsResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_,{ids, data }, {dataProvider}) => dataProvider.updateMany('#{item.name}', { ids, data }),
  <#- } else {-#>
  (_,{ids, data, previousData }, {dataProvider}) => {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import deleteMutation from './delete.js'
<#- operations.push(`deleteMutation`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/delete.js`); #>
import gql from 'graphql-tag';
import {Mutation} from '@grainjs/gql-schema-builder';
export default new Mutation(
    {
      schema:gql`
      extend type Mutation {
        delete#{item.name}(id: ID!, previousData: #{item.name}Update!): #{item.name}SingleResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_,{id, previousData }, {dataProvider}) => dataProvider.delete('#{item.name}', { id, previousData }),
  <#- } else {-#>
  (_,{id, previousData }, {dataProvider}) => {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
import deleteMany from './deleteMany.js'
<#- operations.push(`deleteMany`)-#>
<#- chunkEnd(); -#>

<#- chunkStart(`graphql/${item.name}/operations/deleteMany.js`); #>
import gql from 'graphql-tag';
import {Mutation} from '@grainjs/gql-schema-builder';
export default new Mutation(
    {
      schema:gql`
      extend type Mutation {
        deleteMany#{item.name}(ids: [ID!]! ): IdsResult
      }`,
      resolver: <#- if(!item.metadata?.entry?.calculated) {-#>
   (_,{ids}, {dataProvider}) => dataProvider.deleteMany('#{item.name}', { ids }),
  <#- } else {-#>
   (_,{ids}, {dataProvider}) => {
    // custom mutations implementation
    //  throw new Error("not implemented")
    // custom mutations implementation
    },
  <#- } -#>
  })
<#- chunkEnd(); -#>
<#- chunkStart(`graphql/${item.name}/operations/index.js`); #>
export default new Schema({
  name: '#{item.name}',
  items:[
    <#-operations.forEach(requiredItem=>{-#>
      #{requiredItem},
    <#-})-#>
  ],
})
<#- chunkEnd(); -#>
<#}#>

<#- chunkStart(`graphql/${item.name}/index.js`); #>
export default new Schema({
  name: '#{item.name}',
  items:[
    <#-required.forEach(requiredItem=>{-#>
      #{requiredItem},
    <#-})-#>
  ],
})
<#- chunkEnd(); -#>
<# })#>

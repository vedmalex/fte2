module.exports = {
chunks: "graphql-provider.js",
alias: ["graphql-dataprovider"],

script: function (model, _content, partial, slot, options){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = model
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    
    const _partial = partial
    partial = function(obj, template) {
      const result = _partial(obj, template)
      if(Array.isArray(result)){
        result.forEach(r => {
          chunkEnsure(r.name, r.content)
        })
        return ''
      } else {
        return result
      }
    }
    const main = 'graphql-provider.js'
    var current = main
    let outStack = [current]
    let result
    
    function chunkEnsure(name, content) {
      if (!result) {
        result = {}
      }
      if (!result.hasOwnProperty(name)) {
        result[name] = content ? content : []
      }
    }
    function chunkStart(name) {
      chunkEnsure(name)
      chunkEnd()
      current = name
      out = []
    }
    function chunkEnd() {
      result[current].push(...out)
      out = []
      current = outStack.pop() || main
    }
    chunkStart(main)
     model.enums.forEach(item=>{
     chunkStart(`graphql/${item.name}/index.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Enum } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Enum({\n");
    out.push("  schema:gql`\n");
    out.push("  enum " + (item.name) + " {\n");
    out.push("    ");
     item.items.forEach(it =>{
    out.push((it.name) + "\n");
    out.push("    ");
     })
    out.push("\n");
    out.push("  }\n");
    out.push("  `\n");
    out.push("})");
     chunkEnd();  })
    out.push("\n");
    out.push("\n");
    
    model.entities.filter(e => !e.abstract)
    .forEach(item=> {
     chunkStart(`graphql/${item.name}/index.js`); 
    out.push("\n");
    out.push("import { Schema } from '@grainjs/gql-schema-builder';");
     const required = [] 
    out.push("import " + (item.name) + " from './" + (item.name) + ".js'");
     required.push(`${item.name}`) chunkEnd();  chunkStart(`graphql/${item.name}/${item.name}.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Type } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Type ({\n");
    out.push("  schema: gql`type " + (item.name) + " {\n");
    out.push("      ");
    
          item.props
          .filter(p=> !(item.embedded && p.name == 'id'))
          .filter(p=>!p.ref)
          .forEach(prop=> {
          
    out.push((prop.name) + ": " + (prop.gqlType) + (prop.required ? '!':'') + "\n");
    out.push("      ");
    })
    out.push("\n");
    out.push("  }`,\n");
    out.push("     resolvers: {\n");
    out.push("    ");
    item.props
        .filter(p=>p.name != 'id')
        .filter(p=>!p.ref)
        .filter(f=>f.calculated).forEach(f=>{
    out.push("\n");
    out.push("      " + (f.name) + ":(root, args, context, info)=> {\n");
    out.push("        // custom mutations implementation\n");
    out.push("        //  throw new Error(\"not implemented\")\n");
    out.push("        // custom mutations implementation\n");
    out.push("      },\n");
    out.push("      ");
    })
    out.push("\n");
    out.push("     },\n");
    out.push("  })");
     chunkEnd();  const relations = [] 
    out.push("import { Schema } from '@grainjs/gql-schema-builder';" + "  ");
    item.props
          .filter(p=>p.ref)
          .forEach(f=> {
          const { ref, embedded, stored, single } = f;
            if(item.embedded && f.name === 'id') return;
           chunkStart(`graphql/${item.name}/relations/index.js`); 
    out.push("\n");
    out.push("import " + (f.name) + " from './" + (f.name) + ".js'");
     relations.push(`${f.name}`) chunkEnd();  chunkStart(`graphql/${item.name}/relations/${f.name}.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Type } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Type ({\n");
    out.push("    schema: gql`extend type " + (item.name) + " {");
    if(single && !embedded) {
    out.push((f.name) + "Id: ID");
    } else if(!single && !embedded) {
    out.push((f.name) + "Ids:[ID]");
    } else {}
    out.push("\n");
    out.push("      " + (f.name));
    if(!single && !embedded){
    out.push("(pagination: Pagination, filter: JSON)");
    }
    out.push(":");
    if(!single){
    out.push("[");
    }
    out.push((f.gqlType) + (f.required ? '!':''));
    if(!single){
    out.push("]");
    }
    out.push("}`," + "  resolver: {\n");
    out.push("      ");
    
          if(!(f.calculated || f.readonly) && !embedded) {
            const rEntity = model.entities[model.typeMap[f.ref.entity].index];
            
    if(f.single && f.stored){
    out.push("\n");
    out.push("        " + (f.name) + "Id: (root)=>root." + (f.ref.backField) + ",\n");
    out.push("        ");
    }if(f.ref.using){if(f.single) {
    out.push((f.name) + "Id: async (root, _ , {dataProvider}) => {\n");
    out.push("            const linkTable = await dataProvider.getListNative('" + (f.ref.using.entity) + "', {\n");
    out.push("              filter: { " + (f.ref.using.field) + ": root." + (f.ref.backField) + " },\n");
    out.push("              pagination: {page:1, perPage: 1}\n");
    out.push("            });\n");
    out.push("            return linkTable.data.map(d => d." + (f.ref.usingField) + ")[0];\n");
    out.push("          },");
    } else {
    out.push((f.name) + "Ids: async (root,_, {dataProvider}) => {\n");
    out.push("            const linkTable = await dataProvider.getListNative('" + (f.ref.using.entity) + "', {\n");
    out.push("              filter: { " + (f.ref.using.field) + ": root." + (f.ref.backField) + " },\n");
    out.push("            });\n");
    out.push("            return linkTable.data.map(d => d." + (f.ref.usingField) + ");\n");
    out.push("          },");
    }} else if(!f.stored){if(f.single) {
    out.push((f.name) + "Id: async (root,_, {dataProvider}) => {\n");
    out.push("            const res = await dataProvider.getListNative('" + (rEntity.name) + "',{filter:{" + (f.ref.opposite) + ": root." + (f.name) + "}, pagination:{page:1, perPage:1}});\n");
    out.push("            return res.data.length > 0 ? res.data[0].id : null\n");
    out.push("          },");
    } else {
    out.push((f.name) + "Ids: async (root,_, {dataProvider}) => {\n");
    out.push("            const filter = {" + (f.ref.opposite) + ": root." + (f.ref.backField) + "}\n");
    out.push("            const res = await dataProvider.getListNative('" + (rEntity.name) + "',{ filter});\n");
    out.push("            return res.data.map(item=>item.id)\n");
    out.push("          },");
    }}
    out.push((f.name) + ": async (root, ");
    if(!f.single){
    out.push("{pagination, filter}");
    } else {
    out.push("_");
    }
    out.push(", {dataProvider})=> {\n");
    out.push("          ");
    if (f.ref.using) {
    out.push("\n");
    out.push("          ");
    if(f.single) {
    out.push("\n");
    out.push("          const linkTable = await dataProvider.getListNative('" + (f.ref.using.entity) + "', {\n");
    out.push("            filter: { " + (f.ref.using.field) + ": root." + (f.ref.backField) + " },\n");
    out.push("            pagination: {page:1, perPage: 1}\n");
    out.push("          });\n");
    out.push("          let ids = linkTable.data.map(d => d." + (f.ref.usingField) + "});\n");
    out.push("          const result = await dataProvider.getList('" + (f.ref.entity) + "', {\n");
    out.push("            filter: { " + (f.ref.field) + ": { in: ids } },\n");
    out.push("          });\n");
    out.push("          return result.data[0];\n");
    out.push("          ");
    } else {
    out.push("\n");
    out.push("          const linkTable = await dataProvider.getListNative('" + (f.ref.using.entity) + "', {\n");
    out.push("            filter: { " + (f.ref.using.field) + ": root." + (f.ref.backField) + " },\n");
    out.push("            pagination,\n");
    out.push("          });\n");
    out.push("          let ids = linkTable.data.map(d => d." + (f.ref.usingField) + ");\n");
    out.push("          if (filter){\n");
    out.push("            filter." + (f.ref.field) + " = { in: ids }\n");
    out.push("          } else {\n");
    out.push("            filter = { " + (f.ref.field) + ": { in: ids } }\n");
    out.push("          }\n");
    out.push("          const result = await dataProvider.getList('" + (f.ref.entity) + "', {\n");
    out.push("            filter,\n");
    out.push("            pagination,\n");
    out.push("          });\n");
    out.push("          return result.data;\n");
    out.push("          ");
    }
    out.push("\n");
    out.push("          ");
     } else { 
    out.push("\n");
    out.push("            ");
    if(f.single) {
    out.push("\n");
    out.push("            const res = await dataProvider.getListNative('" + (rEntity.name) + "',{filter:{" + (f.ref.opposite) + ": root." + (f.name) + "}, pagination:{page:1, perPage:1}});");
    } else {
    out.push("if (filter){" + "              filter." + (f.ref.opposite) + " = root." + (f.ref.backField) + "\n");
    out.push("            } else {\n");
    out.push("              filter = {" + (f.ref.opposite) + ": root." + (f.ref.backField) + "}\n");
    out.push("            }\n");
    out.push("            const res = await dataProvider.getListNative('" + (rEntity.name) + "',{pagination, filter});");
    }
    out.push("return res.data;" + "          ");
    }
    out.push("\n");
    out.push("      },\n");
    out.push("      ");
    }
    out.push("\n");
    out.push("\n");
    out.push("      ");
    if(f.calculated){
    out.push("\n");
    out.push("      " + (f.name) + ":(root, args, context, info)=> {\n");
    out.push("        // custom mutations implementation\n");
    out.push("        //  throw new Error(\"not implemented\")\n");
    out.push("        // custom mutations implementation\n");
    out.push("      },\n");
    out.push("      ");
    }
    out.push("\n");
    out.push("    },\n");
    out.push("  })");
     chunkEnd(); })
    out.push("\n");
    out.push("\n");
    if(relations.length > 0) {
     chunkStart(`graphql/${item.name}/index.js`); 
    out.push("\n");
    out.push("import relations from './relations'");
     required.push(`relations`) chunkEnd();  chunkStart(`graphql/${item.name}/relations/index.js`); 
    out.push("\n");
    out.push("import { Schema } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Schema({\n");
    out.push("  name:'" + (item.name) + ".relations',\n");
    out.push("  items: [");
    relations.forEach(item=>{
    out.push((item) + ",");
    })
    out.push("]" + "})");
     chunkEnd(); }
     chunkStart(`graphql/${item.name}/index.js`); 
    out.push("\n");
    out.push("import inputs from './inputs'");
     required.push(`inputs`) chunkEnd();  chunkStart(`graphql/${item.name}/inputs/index.js`); 
     const inputs = [] 
    out.push("import { Schema } from '@grainjs/gql-schema-builder';" + "import Create from './Create.js'");
     inputs.push(`Create`) chunkEnd();  chunkStart(`graphql/${item.name}/inputs/Create.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Input } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Input( gql`\n");
    out.push("  input " + (item.name) + "Create {\n");
    out.push("    ");
    item.props
        .filter(p=> !p.calculated)
        .filter(p=>(item.embedded && p.name != 'id')||!item.embedded)
        .filter(p=>!(p.ref && !p.single && !p.embedded)).forEach(prop=>{
          const { ref, single, stored, embedded, verb } = prop;
          const isSingle = !ref || single
          if(single && stored){
    out.push((prop.name) + ":ID");
    } else {
    out.push((prop.name) + ": ");
    if(!isSingle){
    out.push("[");
    }
    out.push((prop.isFile ? 'Upload' : prop.gqlType));
    if(ref && !prop.isFile){
    out.push("Create");
    }
    if(!isSingle){
    out.push("]");
    }
    out.push((prop.required && prop.name!=='id' ? '!':''));
    }
    out.push("\n");
    out.push("    ");
    })
    out.push("\n");
    out.push("  }\n");
    out.push("  `)");
     chunkEnd();  chunkStart(`graphql/${item.name}/inputs/index.js`); 
    out.push("\n");
    out.push("import Update from './Update.js'");
     inputs.push(`Update`) chunkEnd();  chunkStart(`graphql/${item.name}/inputs/Update.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Input } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Input( gql`\n");
    out.push("  input " + (item.name) + "Update {\n");
    out.push("    ");
    item.props
        .filter(p=> !p.calculated)
        .filter(p=>(item.embedded && p.name != 'id')||!item.embedded)
        .filter(p=>!(p.ref && !p.single && !p.embedded)).forEach(prop=>{
          const { ref, single, stored, embedded, verb } = prop;
          const isSingle = !ref || single
          if(single && stored){
    out.push((prop.name) + ":ID");
    } else {
    out.push((prop.name) + ": ");
    if(!isSingle){
    out.push("[");
    }
    out.push((prop.isFile ? 'Upload' : prop.gqlType));
    if(ref && !prop.isFile){
    out.push("Update");
    }
    if(!isSingle){
    out.push("]");
    }
    }
    out.push("\n");
    out.push("    ");
    })
    out.push("\n");
    out.push("  }\n");
    out.push("   `)");
     chunkEnd();  chunkStart(`graphql/${item.name}/inputs/index.js`); 
    out.push("\n");
    out.push("\n");
    out.push("export default new Schema({\n");
    out.push("  name:'" + (item.name) + ".inputs',\n");
    out.push("  items:[");
    inputs.forEach(item=>{
    out.push((item) + ",");
    })
    out.push("]" + "})");
     chunkEnd(); if(!item.embedded){
     chunkStart(`graphql/${item.name}/index.js`); 
    out.push("\n");
    out.push("import operations from './operations'");
     required.push(`operations`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
     const operations = [] 
    out.push("import { Schema } from '@grainjs/gql-schema-builder';" + "import ListResult from './ListResult.js'");
     operations.push(`ListResult`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/ListResult.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Type } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Type( gql`\n");
    out.push("  type " + (item.name) + "ListResult {\n");
    out.push("    data: [" + (item.name) + "]\n");
    out.push("    total: Int\n");
    out.push("  }`)");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import SingleResult from './SingleResult.js'");
     operations.push(`SingleResult`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/SingleResult.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Type } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Type( gql`\n");
    out.push("  type " + (item.name) + "SingleResult {\n");
    out.push("    data: " + (item.name) + "\n");
    out.push("  }\n");
    out.push("  `)");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import getOne from './getOne.js'");
     operations.push(`getOne`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/getOne.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Query } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Query(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Query {\n");
    out.push("        getOne" + (item.name) + "(id: ID!): " + (item.name) + "SingleResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_,{id}, {dataProvider}) => dataProvider.getOne('" + (item.name) + "', {id}),");
     } else {
    out.push("(_,{id}, {dataProvider}) => {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import getList from './getList.js'");
     operations.push(`getList`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/getList.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Query } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Query(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Query {\n");
    out.push("        getList" + (item.name) + "(pagination: Pagination, sort: Sort, filter: JSON): " + (item.name) + "ListResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_, {pagination, sort, filter}, {dataProvider})=> dataProvider.getList('" + (item.name) + "',{ pagination, sort, filter }),");
     } else {
    out.push("(_, {pagination, sort, filter}, {dataProvider})=> {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import getListNative from './getListNative.js'");
     operations.push(`getListNative`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/getListNative.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Query } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Query(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Query {\n");
    out.push("        getListNative" + (item.name) + "(pagination: Pagination, sort: Sort, filter: JSON): " + (item.name) + "ListResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_, {pagination, sort, filter}, {dataProvider})=> dataProvider.getListNative('" + (item.name) + "',{ pagination, sort, filter }),");
     } else {
    out.push("(_, {pagination, sort, filter}, {dataProvider})=> {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import getMany from './getMany.js'");
     operations.push(`getMany`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/getMany.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Query } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Query(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Query {\n");
    out.push("        getMany" + (item.name) + "(ids: [ID]!):" + (item.name) + "ListResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_, { ids }, {dataProvider})=> dataProvider.getMany('" + (item.name) + "',{ ids }),");
     } else {
    out.push("(_, { ids }, {dataProvider})=> {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import getManyReference from './getManyReference.js'");
     operations.push(`getManyReference`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/getManyReference.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Query } from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Query(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Query {\n");
    out.push("        getManyReference" + (item.name) + "(target: String, id: ID, pagination: Pagination, sort: Sort, filter: JSON): " + (item.name) + "ListResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_, { target, id, pagination, sort, filter}, {dataProvider})=> dataProvider.getManyReference('" + (item.name) + "',{ target, id, pagination, sort, filter }),");
     } else {
    out.push("(_, { target, id, pagination, sort, filter}, {dataProvider})=> {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import create from './create.js'");
     operations.push(`create`)  chunkEnd();  chunkStart(`graphql/${item.name}/operations/create.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import { Mutation} from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Mutation(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Mutation {\n");
    out.push("        create" + (item.name) + "(data: " + (item.name) + "Create!): " + (item.name) + "SingleResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_,{ data }, {dataProvider}) => dataProvider.create('" + (item.name) + "', { data }),");
     } else {
    out.push("(_,{ data }, {dataProvider}) => {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import update from './update.js'");
     operations.push(`update`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/update.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import {Mutation} from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Mutation(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Mutation {\n");
    out.push("        update" + (item.name) + "(id: ID, data: " + (item.name) + "Update!, previousData: " + (item.name) + "Update!): " + (item.name) + "SingleResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_,{id, data, previousData}, {dataProvider}) => dataProvider.update('" + (item.name) + "', { id, data, previousData }),");
     } else {
    out.push("(_,{id, data}, {dataProvider}) => {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import updateMany from './updateMany.js'");
     operations.push(`updateMany`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/updateMany.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import {Mutation} from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Mutation(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Mutation {\n");
    out.push("        updateMany" + (item.name) + "(ids: ID!, data: " + (item.name) + "Update!): IdsResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_,{ids, data }, {dataProvider}) => dataProvider.updateMany('" + (item.name) + "', { ids, data }),");
     } else {
    out.push("(_,{ids, data, previousData }, {dataProvider}) => {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import deleteMutation from './delete.js'");
     operations.push(`deleteMutation`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/delete.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import {Mutation} from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Mutation(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Mutation {\n");
    out.push("        delete" + (item.name) + "(id: ID!, previousData: " + (item.name) + "Update!): " + (item.name) + "SingleResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_,{id, previousData }, {dataProvider}) => dataProvider.delete('" + (item.name) + "', { id, previousData }),");
     } else {
    out.push("(_,{id, previousData }, {dataProvider}) => {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("import deleteMany from './deleteMany.js'");
     operations.push(`deleteMany`) chunkEnd();  chunkStart(`graphql/${item.name}/operations/deleteMany.js`); 
    out.push("\n");
    out.push("import gql from 'graphql-tag';\n");
    out.push("import {Mutation} from '@grainjs/gql-schema-builder';\n");
    out.push("export default new Mutation(\n");
    out.push("    {\n");
    out.push("      schema:gql`\n");
    out.push("      extend type Mutation {\n");
    out.push("        deleteMany" + (item.name) + "(ids: [ID!]! ): IdsResult\n");
    out.push("      }`,\n");
    out.push("      resolver:");
     if(!item.metadata?.entry?.calculated) {
    out.push("(_,{ids}, {dataProvider}) => dataProvider.deleteMany('" + (item.name) + "', { ids }),");
     } else {
    out.push("(_,{ids}, {dataProvider}) => {" + "    // custom mutations implementation\n");
    out.push("    //  throw new Error(\"not implemented\")\n");
    out.push("    // custom mutations implementation\n");
    out.push("    },");
     } 
    out.push("})");
     chunkEnd();  chunkStart(`graphql/${item.name}/operations/index.js`); 
    out.push("\n");
    out.push("export default new Schema({\n");
    out.push("  name: '" + (item.name) + "',\n");
    out.push("  items:[");
    operations.forEach(requiredItem=>{
    out.push((requiredItem) + ",");
    })
    out.push("]," + "})");
     chunkEnd(); }
     chunkStart(`graphql/${item.name}/index.js`); 
    out.push("\n");
    out.push("export default new Schema({\n");
    out.push("  name: '" + (item.name) + "',\n");
    out.push("  items:[");
    required.forEach(requiredItem=>{
    out.push((requiredItem) + ",");
    })
    out.push("]," + "})");
     chunkEnd();  })
    
    //# sourceMappingURL=generators_new/tpls/graphql/graphql-dataprovider.njs.js.map
    
        chunkEnd()
        out = Object.keys(result)
          .filter(i => i !== 'graphql-provider.js')
          .map(curr => ({ name: curr, content: result[curr] }))
    if(out.some(t=>typeof t == 'object')){
      return out.map(chunk=(
          {...chunk,
            content:
            Array.isArray(chunk.content)
              ? chunk.content.join('')
              : chunk.content
          }
        )
      )
    } else {
      return out.join('')
    }
  },
  compile: function() {
    this.chunks = "graphql-provider.js"
    this.alias = ["graphql-dataprovider"]
  },
  dependency: {
  }
};
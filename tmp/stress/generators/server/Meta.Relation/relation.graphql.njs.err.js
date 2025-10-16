module.exports = {

script: function (context, _content, partial, slot, options){
    
    var out = []
    
    out.push("const { Type, Query, Schema, Enum, Interface, Union} = require('@grainjs/gql-schema-builder')\n");
    out.push("const gql = require('graphql-tag')\n");
    out.push("const {registerSchema} = require(global.USEGLOBAL('graphql/registerSchema'))\n");
    out.push("\n");
    out.push("const {\n");
    out.push("  build_relate_options,\n");
    out.push("  relate_count,\n");
    out.push("  relate,\n");
    out.push("  build_variation,\n");
    out.push("  variant_union_resolver,\n");
    out.push("} = require('@grainjs/loaders')\n");
    out.push("\n");
    
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
    
    out.push("\n");
    out.push("\n");
    out.push("const types = []");
     if(!notGenerateClass) {
    out.push("\n");
    out.push("const relSchama = new Type({\n");
    out.push("  schema:gql`\n");
    out.push("  type " + (GQLName(context.name)) + " {\n");
    out.push("    _tid: String,\n");
    out.push("    " + (context.source.name) + ": " + (getType(global.ThingsProps[context.source.thingType.thingType][context.source.keyField].type)) + "\n");
    out.push("    " + (context.dest.name) + ": " + (getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)) + "\n");
    out.push("    childRel: " + (GQLName(context.name)) + "Edges\n");
    out.push("  }\n");
    out.push("`})\n");
    out.push("types.push(relSchama)\n");
    out.push("\n");
    out.push("const relSchameEdges = new Type({\n");
    out.push("  schema: gql`\n");
    out.push("  type " + (GQLName(context.name)) + "Edges {\n");
    out.push("    " + (context.source.name) + ": " + (GQLName(context.source.thingType.thingType)) + "\n");
    out.push("    " + (context.dest.name) + ": " + (GQLName(context.dest.thingType.thingType)) + "\n");
    out.push("  }\n");
    out.push("`})\n");
    out.push("types.push(relSchameEdges)");
     } 
    
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
    
    out.push("\n");
    out.push("// relations\n");
    out.push("const relations = [");
     for (let i=0, aneLen = rels.length; i< aneLen ;i++){
    let rel = rels[i];
    
    const refHasChildren = getChildren(rel.ref.thingType)
    const hasChildren = getChildren(rel.model.thingType)
    const relDef = global.RelationCache.thing[rel.model.thingType][rel.propName]
    
    const relIsArray = Array.isArray(relDef) if(relIsArray){
    out.push("\n");
    out.push("/*\n");
    out.push("  enum " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum {\n");
    out.push("    " + (GQLName(rel.relName)) + "\n");
    out.push("  }\n");
    out.push("  union " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union =\n");
    out.push("    " + (GQLName(rel.ref.thingType)) + "\n");
    out.push("    " + (rel.model.thingType) + "\n");
    out.push("    " + (rel.ref.thingType) + "\n");
    out.push("    " + (rel.propName) + "\n");
    out.push("*/\n");
    out.push("  new Union({\n");
    out.push("    schema:gql`\n");
    out.push("    union " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union =\n");
    out.push("      " + (GQLName(rel.ref.thingType)) + "\n");
    out.push("    `,\n");
    out.push("    resolver: variant_union_resolver\n");
    out.push("  }),\n");
    out.push("  new Enum({schema:gql`\n");
    out.push("    enum " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum {\n");
    out.push("      " + (GQLName(rel.relName)) + "\n");
    out.push("    }`,\n");
    out.push("    resolver:{\n");
    out.push("      " + (GQLName(rel.relName)) + ":\"" + (rel.relName) + "\"\n");
    out.push("    }\n");
    out.push("  }),");
    }
     const names = [rel.model.thingType]
    
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
      const currentThingType = names[j]
     if(!rel.oppositeEmbedded){ 
    out.push("\n");
    out.push("// !oppositeEmbedded");
     if(rel.single) {
    out.push("\n");
    out.push("// !oppositeEmbedded & single");
     if(rel.embedded) {
    out.push("\n");
    out.push("// !oppositeEmbedded & single & embedded\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("        " + (rel.propName.replaceAll('.','')) + "(");
     if(relIsArray){
    out.push("\n");
    out.push("          variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
    }
    out.push("\n");
    out.push("          onlyIds: Boolean,\n");
    out.push("          ensure: Boolean,\n");
    out.push("          absent: Boolean,\n");
    out.push("          options: JSON,\n");
    out.push("          conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("          kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("        ):");
      if(relIsArray){
    out.push("\n");
    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union");
     } else {
    out.push("\n");
    out.push("        " + (GQLName(rel.ref.thingType)));
    if(refHasChildren){
    out.push("Union");
    }
     }
    out.push("\n");
    out.push("      }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + ":");
     if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
     if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("        " + (rel.propName.replaceAll('.','')) + "Count(");
     if(relIsArray){
    out.push("\n");
    out.push("          variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("          onlyIds: Boolean,\n");
    out.push("          ensure:Boolean,\n");
    out.push("          absent:Boolean,\n");
    out.push("          options: JSON,\n");
    out.push("          conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("          kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("        ): Int\n");
    out.push("      }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count:");
     if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "Count',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate_count(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
     if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),");
     } else {
    out.push("\n");
    out.push("// !oppositeEmbedded & single & !embedded\n");
    out.push("  // edges\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):");
      if(relIsArray){
    out.push("\n");
    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union");
     } else {
    out.push("\n");
    out.push("        " + (GQLName(rel.ref.thingType)));
    if(refHasChildren){
    out.push("Union");
    }
     }
    out.push("\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + ":");
     if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "',\n");
    out.push("        '" + (rel.relName) + "',");
     } 
    out.push("relate(" + "          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
     if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
    }
    out.push("\n");
    out.push("      ):Int\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count:");
      if(relIsArray){ 
    out.push("build_variation(" + "        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "Count',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate_count(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),");
     }
     } else {
    out.push("\n");
    out.push("// !oppositeEmbedded & many");
     if(rel.embedded) {  
    out.push("\n");
    out.push("// !oppositeEmbedded & many & embedded\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):[");
     if(relIsArray){
    out.push((GQLName(rel.model.thingType)) + (rel.propName) + "Union");
     } else { 
    out.push((GQLName(rel.ref.thingType)));
    if(refHasChildren){
    out.push("Union");
    }
     } 
    out.push("]" + "    }\n");
    out.push("    `,\n");
    out.push("    resolver:{\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + ":");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("        " + (rel.propName.replaceAll('.','')) + "Count(");
      if(relIsArray){
    out.push("\n");
    out.push("          variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("          onlyIds: Boolean,\n");
    out.push("          ensure:Boolean,\n");
    out.push("          absent:Boolean,\n");
    out.push("          options: JSON,\n");
    out.push("          conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("          kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("        ):Int\n");
    out.push("      }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count:");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "Count',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate_count(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
     if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),");
      } else {
    out.push("\n");
    out.push("// !oppositeEmbedded & many & !embedded\n");
    out.push("  // edges\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):[");
      if(relIsArray){
    out.push("\n");
    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union");
     } else {
    out.push("\n");
    out.push("        " + (GQLName(rel.ref.thingType)));
    if(refHasChildren){
    out.push("Union");
    }
     }
    out.push("\n");
    out.push("      ]\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + ":");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("      }\n");
    out.push("  }),\n");
    out.push("  new Type({\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):Int\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver: {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count:");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "Count',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate_count(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),");
     }
     }
      } else { 
    out.push("\n");
    out.push("// oppositeEmbedded\n");
    out.push("// can be properties of thing");
     if(rel.single){ 
    out.push("\n");
    out.push("// oppositeEmbedded & single\n");
    out.push("  new Type({\n");
    out.push("    // исправить: поставить правильную ссылку на модель\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):");
      if(relIsArray){
    out.push("\n");
    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union");
     } else {
    out.push("\n");
    out.push("        " + (GQLName(rel.ref.thingType)));
    if(refHasChildren){
    out.push("Union");
    }
     }
    out.push("\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver:{\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + ":");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),\n");
    out.push("  new Type({\n");
    out.push("    // исправить: поставить правильную ссылку на модель\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):Int\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver:{\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count:");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "Count',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate_count(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),");
    } else {
    out.push("\n");
    out.push("// oppositeEmbedded & many\n");
    out.push("  new Type({\n");
    out.push("    // исправить: поставить правильную ссылку на модель\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ):[");
      if(relIsArray){
    out.push("\n");
    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union");
     } else {
    out.push("\n");
    out.push("        " + (GQLName(rel.ref.thingType)));
    if(refHasChildren){
    out.push("Union");
    }
     }
    out.push("\n");
    out.push("        ]\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver:{\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + ":");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),\n");
    out.push("  new Type({\n");
    out.push("    // исправить: поставить правильную ссылку на модель\n");
    out.push("    schema: gql`\n");
    out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count(");
      if(relIsArray){
    out.push("\n");
    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,");
     }
    out.push("\n");
    out.push("        onlyIds: Boolean,\n");
    out.push("        ensure:Boolean,\n");
    out.push("        absent:Boolean,\n");
    out.push("        options: JSON,\n");
    out.push("        conditions:JSON");
     if(refHasChildren) {
    out.push(",\n");
    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
     }
    out.push("\n");
    out.push("      ): Int\n");
    out.push("    }\n");
    out.push("    `,\n");
    out.push("    resolver:{\n");
    out.push("      " + (rel.propName.replaceAll('.','')) + "Count:");
      if(relIsArray){
    out.push("\n");
    out.push("      build_variation(\n");
    out.push("        '" + (rel.model.thingType) + "',\n");
    out.push("        '" + (rel.propName) + "Count',\n");
    out.push("        '" + (rel.relName) + "',");
     }
    out.push("\n");
    out.push("        relate_count(\n");
    out.push("          build_relate_options(\n");
    out.push("            '" + (rel.model.thingType) + "',\n");
    out.push("            '" + (rel.propName) + "',\n");
    out.push("            '" + (rel.relName) + "'\n");
    out.push("          )\n");
    out.push("        )");
      if(relIsArray){
    out.push("\n");
    out.push("      )");
     }
    out.push("\n");
    out.push("    }\n");
    out.push("  }),");
     }
     }
     }
     }
    out.push("\n");
    out.push("]\n");
    out.push("\n");
    out.push("//\n");
    out.push("registerSchema('" + (GQLName(context.name)) + "',\n");
    out.push("  new Schema({\n");
    out.push("    name: '" + (GQLName(context.name)) + "',\n");
    out.push("    items: [\n");
    out.push("      ...types,\n");
    out.push("      ...relations,\n");
    out.push("    ],\n");
    out.push("  })\n");
    out.push(")");
    //# sourceMappingURL=generators/server/Meta.Relation/relation.graphql.njs.js.map
    
      return out.join('')
  },
  compile: function() {
  },
  dependency: {
  }
};
module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("const { Type, Query, Schema, Enum, Interface} = require('@grainjs/gql-schema-builder')\n");
        out.push("const gql = require('graphql-tag')\n");
        out.push("const {registerSchema} = require(USEGLOBAL('graphql/registerSchema'))\n");
        out.push("\n");
        out.push("const {\n");
        out.push("  build_relate_options,\n");
        out.push("  relate_count,\n");
        out.push("  relate,\n");
        out.push("  not_opposite_embedded_many_not_embedded_ids_olny,\n");
        out.push("  not_opposite_embedded_single_not_embedded_ids_olny,\n");
        out.push("} = require('@grainjs/loaders')\n");
        out.push("\n");
        var inspect = require('util').inspect;
        var { extractRelationEndForRel } = require(USEGLOBAL('/lib/metaDataLoader'));
        const { parentSymbol } = require(USEGLOBAL('schemaExport/lib/common.js'));
        var resolver = require(USEGLOBAL('./genpack/resolveLocationType.js'));
        function resolveThingName(thingType) {
            let [namespace, name] = thingType.split('.');
            return {
                name,
                namespace
            };
        }
        function GQLName(thingType) {
            return thingType.replaceAll('.', '');
        }
        var getType = function(name) {
            switch(name.toLowerCase()){
                case 'int':
                    return 'Int';
                case 'integer':
                    return 'Int';
                case 'float':
                    return 'Float';
                case 'string':
                    return 'String';
                case 'date':
                    return 'Date';
                case 'boolean':
                    return 'Boolean';
                case 'objectid':
                    return 'ID';
                case 'id':
                    return 'ID';
                case 'stringref':
                    return 'String';
                default:
                    return name;
            }
        };
        var notGenerateClass = context.source.embedded || context.dest.embedded;
        function decapitalize(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        }
        const getChildren = (thingType)=>(ThingsAllChilds ? ThingsAllChilds[thingType] ? ThingsAllChilds[thingType] : false : false);
        const getEnumName = (thingType)=>{
            if (getChildren(thingType)) {
                return `${thingType.replaceAll('.', '')}Childs`;
            } else {
                return thingType.replaceAll('.', '');
            }
        };
        out.push("\n");
        out.push("\n");
        out.push("/**\n");
        out.push("    1. сущность для ассоциации\n");
        out.push("      1. проставляем для нее все необходимые полы\n");
        out.push("      3. сущность содержит такие же поля как и обычная\n");
        out.push("        properties\n");
        out.push("        Edges\n");
        out.push("      3. сущность может содержать дополнительные поля, которые могут хранить дополнительную информацию об ассоциации\n");
        out.push("    2. обвновляем сущность на стороне source\n");
        out.push("    3. обвновляем сущность на стороне dest\n");
        out.push("*/\n");
        out.push("\n");
        out.push("\n");
        out.push("const types = []\n");
        out.push("\n");
        if (!notGenerateClass) {
            out.push("\n");
            out.push("\n");
            out.push("const relSchama = new Type({\n");
            out.push("  schema:gql`\n");
            out.push("  type " + (GQLName(context.name)) + " {\n");
            out.push("    " + (context.source.name) + ": " + (getType(global.ThingsProps[context.source.thingType.thingType][context.source.keyField].type)) + "\n");
            out.push("    " + (context.dest.name) + ": " + (getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)) + "\n");
            out.push("    childRel: " + (GQLName(context.name)) + "Edges\n");
            out.push("  }\n");
            out.push("`})\n");
            out.push("\n");
            out.push("types.push(relSchama)\n");
            out.push("\n");
            out.push("const relSchameEdges = new Type({\n");
            out.push("  schema: gql`\n");
            out.push("  type " + (GQLName(context.name)) + "Edges {\n");
            out.push("    " + (context.source.name) + ": " + (GQLName(context.source.thingType.thingType)) + "\n");
            out.push("    " + (context.dest.name) + ": " + (GQLName(context.dest.thingType.thingType)) + "\n");
            out.push("  }\n");
            out.push("`})\n");
            out.push("\n");
            out.push("types.push(relSchameEdges)\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        let r1 = extractRelationEndForRel(context, false);
        let r2 = extractRelationEndForRel(context, true);
        if (!r1.ref[parentSymbol].global) {
            r1 = {
                ...r1,
                ref: {
                    ...r1.ref,
                    locationType: resolver.resolveThingLocation(r1.ref)
                }
            };
        }
        if (!r2.ref[parentSymbol].global) {
            r2 = extractRelationEndForRel(context, true);
            r2 = {
                ...r2,
                ref: {
                    ...r2.ref,
                    locationType: resolver.resolveThingLocation(r2.ref)
                }
            };
        }
        const rels = [
            r1,
            r2
        ];
        out.push("\n");
        out.push("// relations\n");
        out.push("const relations = [\n");
        for(var i = 0, aneLen = rels.length; i < aneLen; i++){
            var rel = rels[i];
            const refHasChildren = getChildren(rel.ref.thingType);
            const hasChildren = getChildren(rel.model.thingType);
            const names = [
                rel.model.thingType
            ];
            if (hasChildren) {
                names.push(...hasChildren.filter((t)=>global.RelationCache.thing[t][rel.propName].relName == rel.relName));
            }
            for(var j = names.length - 1; j >= 0; j -= 1){
                const currentThingType = names[j];
                out.push("\n");
                if (!rel.oppositeEmbedded) {
                    out.push("\n");
                    out.push("// !oppositeEmbedded\n");
                    if (rel.single) {
                        out.push("\n");
                        out.push("// !oppositeEmbedded & single\n");
                        if (rel.embedded) {
                            out.push("\n");
                            out.push("// !oppositeEmbedded & single & embedded\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("        type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("          " + (rel.propName.replaceAll('.', '')) + "(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):" + (GQLName(rel.ref.thingType)));
                            if (refHasChildren) {
                                out.push("Union");
                            }
                            out.push("\n");
                            out.push("        }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": relate(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("        type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("          " + (rel.propName.replaceAll('.', '')) + "Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("): Int\n");
                            out.push("        }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count: relate_count(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                        } else {
                            out.push("\n");
                            out.push("// !oppositeEmbedded & single & !embedded\n");
                            out.push("    // props\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + " {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": " + (getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)) + "\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": not_opposite_embedded_single_not_embedded_ids_olny(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                            out.push("    // edges\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):" + (GQLName(rel.ref.thingType)));
                            if (refHasChildren) {
                                out.push("Union");
                            }
                            out.push("\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": relate(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):Int\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count: relate_count(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                        }
                        out.push("\n");
                    } else {
                        out.push("\n");
                        out.push("// !oppositeEmbedded & many\n");
                        if (rel.embedded) {
                            out.push("\n");
                            out.push("// !oppositeEmbedded & many & embedded\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON,  conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):[" + (GQLName(rel.ref.thingType)));
                            if (refHasChildren) {
                                out.push("Union");
                            }
                            out.push("]\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver:{\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": relate(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON,  conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):Int\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver:{\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count: relate_count(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                        } else {
                            out.push("\n");
                            out.push("// !oppositeEmbedded & many & !embedded\n");
                            out.push("    // props\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + " {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ":[" + (getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)) + "]\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": not_opposite_embedded_many_not_embedded_ids_olny(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                            out.push("\n");
                            out.push("    //edges\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):[" + (GQLName(rel.ref.thingType)));
                            if (refHasChildren) {
                                out.push("Union");
                            }
                            out.push("]\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + ": relate(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("        }\n");
                            out.push("    }),\n");
                            out.push("    new Type({\n");
                            out.push("      schema: gql`\n");
                            out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                            if (refHasChildren) {
                                out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                            }
                            out.push("):Int\n");
                            out.push("      }\n");
                            out.push("      `,\n");
                            out.push("      resolver: {\n");
                            out.push("        " + (rel.propName.replaceAll('.', '')) + "Count: relate_count(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                            out.push("      }\n");
                            out.push("    }),\n");
                        }
                        out.push("\n");
                    }
                    out.push("\n");
                } else {
                    out.push("\n");
                    out.push("// oppositeEmbedded\n");
                    out.push("// can be properties of thing\n");
                    if (rel.single) {
                        out.push("\n");
                        var listing = inspect(context, {
                            depth: 2
                        });
                        out.push("\n");
                        out.push("// oppositeEmbedded & single\n");
                        out.push("    new Type({\n");
                        out.push("      // исправить: поставить правильную ссылку на модель\n");
                        out.push("      schema: gql`\n");
                        out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + "(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                        if (refHasChildren) {
                            out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                        }
                        out.push("):" + (GQLName(rel.ref.thingType)));
                        if (refHasChildren) {
                            out.push("Union");
                        }
                        out.push("\n");
                        out.push("      }\n");
                        out.push("      `,\n");
                        out.push("      resolver:{\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + ": relate(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                        out.push("      }\n");
                        out.push("    }),\n");
                        out.push("    new Type({\n");
                        out.push("      // исправить: поставить правильную ссылку на модель\n");
                        out.push("      schema: gql`\n");
                        out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                        if (refHasChildren) {
                            out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                        }
                        out.push("):Int\n");
                        out.push("      }\n");
                        out.push("      `,\n");
                        out.push("      resolver:{\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + "Count: relate_count(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                        out.push("      }\n");
                        out.push("    }),\n");
                    } else {
                        out.push("\n");
                        out.push("// oppositeEmbedded & many\n");
                        out.push("    new Type({\n");
                        out.push("      // исправить: поставить правильную ссылку на модель\n");
                        out.push("      schema: gql`\n");
                        out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + "(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                        if (refHasChildren) {
                            out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                        }
                        out.push("):[" + (GQLName(rel.ref.thingType)));
                        if (refHasChildren) {
                            out.push("Union");
                        }
                        out.push("]\n");
                        out.push("      }\n");
                        out.push("      `,\n");
                        out.push("      resolver:{\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + ": relate(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                        out.push("      }\n");
                        out.push("    }),\n");
                        out.push("    new Type({\n");
                        out.push("      // исправить: поставить правильную ссылку на модель\n");
                        out.push("      schema: gql`\n");
                        out.push("       type " + (GQLName(currentThingType)) + "Edges {\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON");
                        if (refHasChildren) {
                            out.push(", kind:" + (getEnumName(rel.ref.thingType)));
                        }
                        out.push("): Int\n");
                        out.push("      }\n");
                        out.push("      `,\n");
                        out.push("      resolver:{\n");
                        out.push("        " + (rel.propName.replaceAll('.', '')) + "Count: relate_count(build_relate_options('" + (rel.model.thingType) + "', '" + (rel.propName) + "'))\n");
                        out.push("      }\n");
                        out.push("    }),\n");
                    }
                    out.push("\n");
                }
                out.push("\n");
            }
            out.push("\n");
        }
        out.push("\n");
        out.push("]\n");
        out.push("\n");
        out.push("//\n");
        out.push("registerSchema('" + (GQLName(context.name)) + "', new Schema({\n");
        out.push("  name: '" + (GQLName(context.name)) + "',\n");
        out.push("  items: [ ...types,...relations,\n");
        out.push("  ],\n");
        out.push("  })\n");
        out.push(")");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators_new/templates/graphql/relation.graphql.njs.js.map
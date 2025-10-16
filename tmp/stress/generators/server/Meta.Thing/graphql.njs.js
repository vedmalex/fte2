module.exports = {
    script: function(context, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("const { Type, Query, Schema, Enum, Union} = require('@grainjs/gql-schema-builder')\n");
        out.push("const gql = require('graphql-tag')\n");
        out.push("const {registerSchema} = require(global.USEGLOBAL('graphql/registerSchema'))\n");
        out.push("const { get } = require('lodash');\n");
        out.push("\n");
        out.push("const {\n");
        out.push("  query_many,\n");
        out.push("  query_many_count,\n");
        out.push("  variant_union_resolver,\n");
        out.push("} = require('@grainjs/loaders')\n");
        out.push("\n");
        out.push("const { toGlobalId } = require('@grainjs/id-generator')\n");
        out.push("\n");
        out.push("// TODO: проверить как можно добавлять условия в запросы\n");
        out.push("// условия, такие же как на запросной части приложения");
        const hasChilds = context.hasChilds(context.thingType);
        let allRels = context.relations;
        context.GQLName = function GQLName(thingType) {
            return thingType.replaceAll('.', '');
        };
        context.hasRels = allRels.length > 0;
        out.push("\n");
        out.push("\n");
        if (hasChilds) {
            out.push("\n");
            out.push("const tUnion = new Union({\n");
            out.push("    schema:gql`\n");
            out.push("    # " + (context.$namespace) + (context.$name) + " of the " + (context.$namespace) + "\n");
            out.push("    union " + (context.$namespace) + (context.$name) + "Union =\n");
            out.push("        " + (context.$namespace) + (context.$name));
            context.allChilds.forEach((item)=>{
                out.push("\n");
                out.push("        | " + (item.replaceAll('.', '')));
            });
            out.push("\n");
            out.push("    `,\n");
            out.push("    resolver: variant_union_resolver\n");
            out.push("})\n");
            out.push("\n");
            out.push("const tEnum = new Enum({schema:gql`\n");
            out.push("      enum " + (context.$namespace) + (context.$name) + "Childs {");
            context.allChilds.forEach((item)=>{
                out.push("\n");
                out.push("        " + (item.replaceAll('.', '')));
            });
            out.push("\n");
            out.push("      }\n");
            out.push("    `, resolver:{\n");
            out.push("        ");
            context.allChilds.forEach((item)=>{
                out.push("\n");
                out.push("          " + (item.replaceAll('.', '')) + ": \"" + (item) + "\",\n");
                out.push("        ");
            });
            out.push("\n");
            out.push("    }})\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("const main = new Type({\n");
        out.push("  schema:gql`\n");
        out.push("    # " + (context.$namespace) + (context.$name) + " of the " + (context.$namespace) + "\n");
        out.push("    type " + (context.$namespace) + (context.$name) + " implements Node{\n");
        out.push("      " + (content('gqlprops', context)) + "\n");
        out.push("    }`\n");
        out.push("  ,\n");
        out.push("  resolver: {\n");
        out.push("    id: root => root._id,\n");
        out.push("    _id: root => root._id,\n");
        out.push("    _tid: root => root.__tid,");
        if (allRels.length > 0) {
            out.push("\n");
            out.push("    childRel: (root, args, context, info) => {\n");
            out.push("      return root\n");
            out.push("    },");
        }
        for(let i = 0, props = context.properties, proplen = props?.length ?? 0; i < proplen; i++){
            let pName = props[i].propertyName.replaceAll('.', '');
            if (props[i].type === 'date') {
                out.push("\n");
                out.push("      " + (pName) + ":(root, {format, zone, json}, context, info) => {\n");
                out.push("        let result = get(root,\"" + (props[i].propertyName) + "\")\n");
                out.push("        if(format && zone){\n");
                out.push("          return result.format(format, zone);\n");
                out.push("        }\n");
                out.push("        if (format){\n");
                out.push("          return result.format(format, zone);\n");
                out.push("        }\n");
                out.push("        if(json){\n");
                out.push("          return result?.toJSON();\n");
                out.push("        }\n");
                out.push("        return result;\n");
                out.push("      },\n");
                out.push("      ");
            } else if (pName !== props[i].propertyName) {
                out.push("\n");
                out.push("      " + (pName) + ":(root, args, context, info) => get(root,\"" + (props[i].propertyName) + "\"),");
            }
        }
        out.push("\n");
        out.push("  }\n");
        out.push("})\n");
        out.push("\n");
        out.push("\n");
        out.push("const query = [\n");
        out.push("  new Query({\n");
        out.push("    schema: gql`\n");
        out.push("      extend type Query {\n");
        out.push("        " + (context.$namespace) + (context.$name) + "(\n");
        out.push("          onlyIds: Boolean,\n");
        out.push("          ensure: Boolean,\n");
        out.push("          absent: Boolean,\n");
        out.push("          options: JSON, conditions:JSON");
        if (hasChilds) {
            out.push(", kind:" + (context.getEnumName(context.thingType)));
        }
        out.push("): [" + (context.$namespace) + (context.$name));
        if (hasChilds) {
            out.push("Union");
        }
        out.push("]\n");
        out.push("      }\n");
        out.push("    `,\n");
        out.push("    resolver: query_many({\n");
        out.push("        sourceLocation:'" + (context.locationType) + "',\n");
        out.push("        sourceModel:'" + (context.thingType) + "',\n");
        out.push("        hasChildren:");
        if (hasChilds) {
            out.push("true");
        } else {
            out.push("false");
        }
        out.push(",\n");
        out.push("        hasExtends:");
        if (context.extends) {
            out.push("true");
        } else {
            out.push("false");
        }
        out.push(",\n");
        out.push("        allChildren:[");
        context.allChilds?.forEach((item)=>{
            out.push("\n");
            out.push("          \"" + (item) + "\",");
        });
        out.push("\n");
        out.push("        ]\n");
        out.push("      },\n");
        out.push("    )\n");
        out.push("  }),\n");
        out.push("\n");
        out.push("  new Query({\n");
        out.push("    schema: gql`\n");
        out.push("      extend type Query {\n");
        out.push("        " + (context.$namespace) + (context.$name) + "Count(\n");
        out.push("          onlyIds: Boolean,\n");
        out.push("          ensure: Boolean,\n");
        out.push("          absent: Boolean,\n");
        out.push("          options: JSON, conditions:JSON");
        if (hasChilds) {
            out.push(", kind:" + (context.getEnumName(context.thingType)));
        }
        out.push("): Int\n");
        out.push("      }\n");
        out.push("    `,\n");
        out.push("    resolver: query_many_count({\n");
        out.push("        sourceLocation:'" + (context.locationType) + "',\n");
        out.push("        sourceModel:'" + (context.thingType) + "',\n");
        out.push("        hasChildren:");
        if (hasChilds) {
            out.push("true");
        } else {
            out.push("false");
        }
        out.push(",\n");
        out.push("        hasExtends:");
        if (context.extends) {
            out.push("true");
        } else {
            out.push("false");
        }
        out.push(",\n");
        out.push("        allChildren:[");
        context.allChilds?.forEach((item)=>{
            out.push("\n");
            out.push("          \"" + (item) + "\",");
        });
        out.push("\n");
        out.push("        ]\n");
        out.push("      },\n");
        out.push("    )\n");
        out.push("  }),\n");
        out.push("]\n");
        out.push("//\n");
        out.push("registerSchema('" + (context.$namespace) + (context.$name) + "', new Schema({\n");
        out.push("  name: '" + (context.$namespace) + (context.$name) + "',\n");
        out.push("  items: [main, ...query,\n");
        out.push("  ");
        if (hasChilds) {
            out.push("\n");
            out.push("    tEnum,\n");
            out.push("    tUnion,\n");
            out.push("  ");
        }
        out.push("\n");
        out.push("  ],\n");
        out.push("  })\n");
        out.push(")");
        return out.join('');
    },
    blocks: {
        "gqlprops": function(context, _content, partial, slot, options) {
            var out = [];
            const hasChilds = context.hasChilds(context.thingType);
            let getType = (name)=>{
                let res = '';
                switch(name.toLowerCase()){
                    case 'int':
                        res = 'Int';
                        break;
                    case 'integer':
                        res = 'Int';
                        break;
                    case 'float':
                        res = 'Float';
                        break;
                    case 'string':
                        res = 'String';
                        break;
                    case 'date':
                        res = 'Date';
                        break;
                    case 'boolean':
                        res = 'Boolean';
                        break;
                    case 'id':
                        res = 'ID';
                        break;
                }
                return res;
            };
            out.push("\n");
            out.push("      id: ID!\n");
            out.push("      _id: ID!\n");
            out.push("      _tid: String");
            for(let i = 0, props = context.properties, proplen = props?.length ?? 0; i < proplen; i++){
                let pName = props[i].propertyName.replaceAll('.', '');
                if (props[i].type === 'date') {
                    out.push("\n");
                    out.push("      " + (pName) + "(format:String, zone: Float, json: Boolean): " + (getType(props[i].type)));
                } else {
                    out.push("\n");
                    out.push("    " + (pName) + ": " + (getType(props[i].type)));
                }
            }
            if (context.hasRels > 0) {
                out.push("\n");
                out.push("    childRel:" + (context.GQLName(context.thingType)) + "Edges\n");
                out.push("  ");
            }
            return out.join('');
        }
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/graphql.njs.js.map
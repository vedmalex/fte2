module.exports = {
    script: function(context, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = context;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("const { Type, Query, Schema, Enum, Union} = require('@grainjs/gql-schema-builder')\n");
        out.push("const gql = require('graphql-tag')\n");
        out.push("const {registerSchema} = require(USEGLOBAL('graphql/registerSchema'))\n");
        out.push("const { get } = require('lodash');\n");
        out.push("\n");
        out.push("const {\n");
        out.push("  query_many,\n");
        out.push("  query_many_count,\n");
        out.push("} = require('@grainjs/loaders')\n");
        out.push("\n");
        out.push("// TODO: проверить как можно добавлять условия в запросы\n");
        out.push("// условия, такие же как на запросной части приложения\n");
        out.push("\n");
        out.push("\n");
        out.push("\n");
        var inspect = require('util').inspect;
        const hasChilds = context.hasChilds(context.thingType);
        function resolveThingName(thingType) {
            let [namespace, name] = thingType.split('.');
            return {
                name,
                namespace
            };
        }
        const GQLName = context.GQLName = function GQLName(thingType) {
            return thingType.replaceAll('.', '');
        };
        var allRels = [];
        allRels.push.apply(allRels, context.destRels);
        allRels.push.apply(allRels, context.sourceRels);
        var allNonEmbedded = allRels.filter(function(r) {
            return !r.oppositeEmbedded;
        });
        context.hasRels = allRels.length > 0;
        out.push("\n");
        out.push("\n");
        var listing = inspect(context, {
            depth: 4
        });
        out.push("\n");
        out.push("/* # {listing}*/\n");
        out.push("\n");
        if (hasChilds) {
            out.push("\n");
            out.push("const tUnion = new Union({\n");
            out.push("    schema:gql`\n");
            out.push("    # " + (context.$namespace) + (context.$name) + " of the " + (context.$namespace) + "\n");
            out.push("    union " + (context.$namespace) + (context.$name) + "Union =\n");
            out.push("        " + (context.$namespace) + (context.$name) + "\n");
            out.push("        ");
            context.allChilds.forEach((item)=>{
                out.push("\n");
                out.push("        | " + (item.replaceAll('.', '')) + "\n");
                out.push("        ");
            });
            out.push("\n");
            out.push("    `,\n");
            out.push("    resolver: (root)=> {\n");
            out.push("      return root.__tid.replaceAll('.','')\n");
            out.push("    }\n");
            out.push("})\n");
            out.push("\n");
            out.push("const tEnum = new Enum({schema:gql`\n");
            out.push("      enum " + (context.$namespace) + (context.$name) + "Childs {\n");
            out.push("        ");
            context.allChilds.forEach((item)=>{
                out.push("\n");
                out.push("        " + (item.replaceAll('.', '')) + "\n");
                out.push("        ");
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
        out.push("const main = new Type({\n");
        out.push("  schema:gql`\n");
        out.push("    # " + (context.$namespace) + (context.$name) + " of the " + (context.$namespace) + "\n");
        out.push("    type " + (context.$namespace) + (context.$name) + " {\n");
        out.push("      " + (content('gqlprops', context)) + "\n");
        out.push("    }`\n");
        out.push("  ,\n");
        out.push("  resolver: {\n");
        out.push("    ");
        const hasID = context.properties.find((p)=>p.propertyName.toLowerCase().trim() == 'id');
        if (!hasID) {
            out.push("\n");
            out.push("    id: root => root._id,\n");
            out.push("    ");
        }
        out.push("\n");
        out.push("    ");
        if (hasChilds || context.extends) {
            out.push("\n");
            out.push("      _tid: root => root.__tid,\n");
            out.push("    ");
        }
        out.push("\n");
        out.push("    ");
        if (allRels.length > 0) {
            out.push("\n");
            out.push("    childRel: (root, args, context, info) => {\n");
            out.push("      return root\n");
            out.push("    },\n");
            out.push("    ");
        }
        out.push("\n");
        for(var i = 0, props = context.properties, proplen = props?.length ?? 0; i < proplen; i++){
            out.push("\n");
            out.push("  ");
            var pName = props[i].propertyName.replaceAll('.', '');
            out.push("\n");
            out.push("      ");
            if (props[i].type === 'date') {
                out.push("\n");
                out.push("      " + (pName) + ":(root, {format, zone, json}, context, info) => {\n");
                out.push("        var result = get(root,\"" + (props[i].propertyName) + "\")\n");
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
            } else {
                out.push("\n");
                out.push("        ");
                if (pName !== props[i].propertyName) {
                    out.push("\n");
                    out.push("      " + (pName) + ":(root, args, context, info) => get(root,\"" + (props[i].propertyName) + "\"),\n");
                    out.push("        ");
                }
                out.push("\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("    ");
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
        out.push("        allChildren:[\n");
        out.push("          ");
        context.allChilds?.forEach((item)=>{
            out.push("\n");
            out.push("          \"" + (item) + "\",\n");
            out.push("          ");
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
        out.push("        allChildren:[\n");
        out.push("          ");
        context.allChilds?.forEach((item)=>{
            out.push("\n");
            out.push("          \"" + (item) + "\",\n");
            out.push("          ");
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
            out.push("\n");
            out.push("\n");
            const hasChilds = context.hasChilds(context.thingType);
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
                    case 'id':
                        return 'ID';
                }
            };
            const hasID = context.properties.find((p)=>p.propertyName.toLowerCase().trim() == 'id');
            const has_ID = context.properties.find((p)=>p.propertyName.toLowerCase().trim() == '_id');
            out.push("\n");
            if (!hasID) {
                out.push("\n");
                out.push("      id: ID\n");
            }
            out.push("\n");
            if (!has_ID) {
                out.push("\n");
                out.push("      _id: ID\n");
            }
            out.push("\n");
            if (hasChilds || context.extends) {
                out.push("\n");
                out.push("      _tid: String\n");
            }
            out.push("\n");
            for(var i = 0, props = context.properties, proplen = props?.length ?? 0; i < proplen; i++){
                var pName = props[i].propertyName.replaceAll('.', '');
                out.push("\n");
                out.push("    ");
                if (props[i].type === 'date') {
                    out.push("\n");
                    out.push("      " + (pName) + "(format:String, zone: Float, json: Boolean): " + (getType(props[i].type)) + "\n");
                    out.push("    ");
                } else {
                    out.push("\n");
                    out.push("    " + (pName) + ": " + (getType(props[i].type)) + "\n");
                    out.push("    ");
                }
                out.push("\n");
            }
            out.push("\n");
            out.push("  ");
            if (context.hasRels > 0) {
                out.push("\n");
                out.push("    childRel:" + (context.GQLName(context.thingType)) + "Edges\n");
                out.push("  ");
            }
            out.push("");
            return out.join('');
        }
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators_new/templates/graphql/graphql.njs.js.map
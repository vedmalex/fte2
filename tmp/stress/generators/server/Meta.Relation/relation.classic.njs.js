module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        out.push("let path = require('path');\n");
        out.push("let mongooseCreated      = require(\"@grainjs/mongoose-created\");\n");
        out.push("let mongooseLastModified = require(\"@grainjs/mongoose-last-modified\");\n");
        out.push("let mongoose = global.mongoose;\n");
        out.push("let Schema = mongoose.Schema;\n");
        out.push("let ObjectId = Schema.ObjectId;\n");
        out.push("let Mixed = Schema.Types.Mixed;\n");
        out.push("let fs = require('fs');\n");
        out.push("\n");
        function getType(name) {
            switch(name.toLowerCase()){
                case 'int':
                    return 'Number';
                case 'integer':
                    return 'Number';
                case 'float':
                    return 'Number';
                case 'string':
                    return 'String';
                case 'date':
                    return 'Date';
                case 'boolean':
                    return 'Boolean';
                case 'objectid':
                    return 'ObjectId';
                case 'id':
                    return 'ObjectId';
                case 'stringref':
                    return 'String';
                default:
                    return 'Mixed';
            }
        }
        let notGenerateClass = context.source.embedded || context.dest.embedded || context.theThing;
        function decapitalize(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        }
        let dot = context.name.indexOf('.');
        let schema = ((dot > 0) ? context.name.slice(dot + 1) : context.name);
        let schemaName = decapitalize(schema) + 'Def';
        let resCollection = context.namespace + '.' + schema;
        const relKind = `${context.source.cardinality}${context.dest.cardinality}`;
        let { extractRelationEndForRel, getRelIndexConfig } = require(global.USEGLOBAL('/lib/metaDataLoader'));
        const { parentSymbol } = require(global.USEGLOBAL('schemaExport/lib/common.js'));
        let resolver = require(global.USEGLOBAL('./genpack/resolveLocationType.js'));
        const indexConfig = getRelIndexConfig(context, true);
        const getChildren = (thingType)=>(global.ThingsAllChilds ? global.ThingsAllChilds[thingType] ? global.ThingsAllChilds[thingType] : false : false);
        out.push("\n");
        out.push("/* " + (relKind) + " */\n");
        if (!notGenerateClass) {
            let sType = getType(global.ThingsProps[context.source.thingType.thingType][context.source.keyField].type);
            let dType = getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type);
            out.push("\n");
            out.push("\n");
            out.push("let $" + (schemaName) + " = {\n");
            out.push("  __tid: {type: String, default: '" + (context.name) + "', index:true, sparse:true},\n");
            out.push(" '" + (context.source.name) + "':{type:" + (sType) + ", required:true, " + (indexConfig.src) + ":true, sparse:true },\n");
            out.push(" '" + (context.dest.name) + "':{type:" + (dType) + ", required:true, " + (indexConfig.dst) + ":true, sparse:true }\n");
            out.push("};\n");
            out.push("\n");
            out.push("let _" + (schemaName) + " = new Schema($" + (schemaName) + ",{collection:'" + (context.collectionType) + "', autoIndex:false});\n");
            out.push("\n");
            out.push("_" + (schemaName) + ".plugin(mongooseCreated, { index: true });\n");
            out.push("_" + (schemaName) + ".plugin(mongooseLastModified, { index: true });\n");
            out.push("\n");
            out.push("if(!global.SchemaCache) global.SchemaCache = {};\n");
            out.push("if(!global.SchemaCache." + (context.namespace) + ") global.SchemaCache." + (context.namespace) + " = {};\n");
            out.push("\n");
            out.push("global.SchemaCache." + (context.name) + " = _" + (schemaName) + ";\n");
            out.push("\n");
            out.push("_" + (schemaName) + ".index({\n");
            out.push("  '" + (context.source.name) + "': 1,\n");
            out.push("  \"" + (context.dest.name) + "\": 1\n");
            out.push("}, {\n");
            out.push("  unique: true, /*dropDups:true,*/ sparse:true\n");
            out.push("});\n");
            out.push("\n");
            out.push("\n");
            out.push("global.RegisterSchema.jobs.push(function(mongoose){\n");
            out.push("  if(typeof(" + (context.namespace) + ")=='undefined') " + (context.namespace) + " = {};\n");
            out.push("  let alreadyOverriden = !!global." + (context.name) + " && mongoose.model('" + (context.name) + "')\n");
            out.push("\n");
            out.push("  " + (resCollection) + " = alreadyOverriden ? mongoose.model('" + (context.name) + "') : mongoose.model('" + (context.name) + "', global.SchemaCache." + (context.name) + ");\n");
            out.push("});\n");
            out.push("\n");
            out.push("global.EnsureIndex.toBeIndexed.push({location: '" + (context.locationType) + "', model:'" + (context.name) + "'});\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        let r1 = extractRelationEndForRel(context, true);
        let r2 = extractRelationEndForRel(context, false);
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
        out.push("const rels_config = `" + (JSON.stringify(rels.map((rel)=>({
                code: rel.relationType,
                model: rel.model.thingType,
                propName: rel.propName,
                embedded: rel.oppositeEmbedded,
                ref: rel.ref.thingType
            })), null, 2)) + "`\n");
        out.push("\n");
        if (notGenerateClass) {
            out.push("\n");
            out.push("var reqSuccess = false;\n");
            for(let i = 0; i < rels.length; i++){
                let rel = rels[i];
                const hasChildren = getChildren(rel.model.thingType);
                const relDef = global.RelationCache.thing[rel.model.thingType][rel.propName];
                const relIsArray = Array.isArray(relDef);
                out.push("\n");
                var many = !rel.single;
                out.push("\n");
                out.push("\n");
                if (rel.oppositeEmbedded) {
                    out.push("\n");
                    out.push("\treqSuccess = RESOLVESCHEMA('" + (rel.model.thingType) + "', __dirname);\n");
                    out.push("\tif(reqSuccess && global.SchemaCache." + (rel.model.thingType) + "){\n");
                    out.push("\t\tvar sch = {\n");
                    out.push("\t\t\ttype: " + (rel.toKeyField === "id" ? 'ObjectId' : 'Mixed') + ",\n");
                    out.push("      required: " + (rel.required ? 'true' : 'false') + ",\n");
                    out.push("      " + (rel.index.dst) + ":true,\n");
                    out.push("      sparse:true\n");
                    out.push("\t\t};\n");
                    out.push("\t\tglobal.SchemaCache." + (rel.model.thingType) + ".add({\"" + (rel.propName) + "\":");
                    if (many) {
                        out.push("[");
                    }
                    out.push("sch");
                    if (many) {
                        out.push("]");
                    }
                    out.push("});\n");
                    out.push("\t}\n");
                    var sci, child;
                    var len = hasChildren.length;
                    for(sci = 0; sci < len; sci++){
                        child = hasChildren[sci];
                        out.push("\n");
                        out.push("\treqSuccess = RESOLVESCHEMA('" + (child) + "', __dirname);\n");
                        out.push("\tif(reqSuccess && global.SchemaCache." + (child) + "){\n");
                        out.push("\t\tvar sch = {\n");
                        out.push("\t\t\ttype: " + (rel.toKeyField === "id" ? 'ObjectId' : 'Mixed') + ",\n");
                        out.push("      required: " + (rel.required ? 'true' : 'false') + ",\n");
                        out.push("      " + (rel.index.dst) + ":true,\n");
                        out.push("      sparse:true\n");
                        out.push("\t\t};\n");
                        out.push("\t\tglobal.SchemaCache." + (child) + ".add({\"" + (rel.propName) + "\":");
                        if (many) {
                            out.push("[");
                        }
                        out.push("sch");
                        if (many) {
                            out.push("]");
                        }
                        out.push("});\n");
                        out.push("\t}\n");
                    }
                    out.push("\n");
                }
                out.push("\n");
            }
            out.push("\n");
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Relation/relation.classic.njs.js.map
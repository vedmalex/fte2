module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("var path = require('path');\n");
        out.push("var utils = require('@grainjs/meta-codegen').utils;\n");
        out.push("var mongoose = global.mongoose;\n");
        out.push("var Schema = mongoose.Schema;\n");
        out.push("var ObjectId = Schema.ObjectId;\n");
        out.push("var StringRef = Schema.Types.String;\n");
        out.push("var Mixed = Schema.Types.Mixed;\n");
        out.push("var Step = require('@grainjs/step');\n");
        out.push("var fs = require('fs');\n");
        out.push("\n");
        var notGenerateClass = context.source.embedded || context.dest.embedded;
        function decapitalize(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        }
        var dot = context.name.indexOf('.');
        var schema = ((dot > 0) ? context.name.slice(dot + 1) : context.name);
        var schemaName = decapitalize(schema) + 'Def';
        var resCollection = context.namespace + '.' + schema;
        var dst = ('string' !== typeof (context.dest.thingType)) ? context.dest.thingType.thingType : context.dest.thingType;
        var src = ('string' !== typeof (context.source.thingType)) ? context.source.thingType.thingType : context.source.thingType;
        var sType = (context.source.keyField != undefined && context.source.keyField !== '_id') ? "StringRef" : "ObjectId";
        var dType = (context.dest.keyField != undefined && context.dest.keyField !== '_id') ? "StringRef" : "ObjectId";
        const relKind = `${context.source.cardinality}${context.dest.cardinality}`;
        var srcIndexKind = 'index';
        var dstIndexKind = 'index';
        switch(relKind){
            case '11':
                {
                    srcIndexKind = 'unique';
                    dstIndexKind = 'unique';
                }
                break;
            case '**':
                {
                    srcIndexKind = 'index';
                    dstIndexKind = 'index';
                }
                break;
            case '1*':
                {
                    srcIndexKind = 'unique';
                    dstIndexKind = 'index';
                }
                break;
            case '*1':
                {
                    srcIndexKind = 'index';
                    dstIndexKind = 'unique';
                }
                break;
        }
        out.push("\n");
        out.push("\n");
        if (!notGenerateClass) {
            out.push("\n");
            out.push("\n");
            out.push("var $" + (schemaName) + " = {\n");
            out.push(" '" + (context.source.name) + "':{type:" + (sType) + ", required:true, " + (srcIndexKind) + ":true, sparse:true, ref:'" + (src) + "'},\n");
            out.push(" '" + (context.dest.name) + "':{type:" + (dType) + ", required:true, " + (dstIndexKind) + ":true,sparse:true, ref:'" + (dst) + "'}\n");
            out.push("};\n");
            out.push("\n");
            out.push("\n");
            out.push("var _" + (schemaName) + " = new Schema($" + (schemaName) + ",{collection:'" + (context.collectionType) + "', autoIndex:false});\n");
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
            out.push("global.RegisterSchema.jobs.push(function(mongoose){\n");
            out.push("  if(typeof(" + (context.namespace) + ")=='undefined') " + (context.namespace) + " = {};\n");
            out.push("  var alreadyOverriden = !!global." + (context.name) + " && mongoose.model('" + (context.name) + "')\n");
            out.push("\n");
            out.push("  " + (resCollection) + " = alreadyOverriden ? mongoose.model('" + (context.name) + "') : mongoose.model('" + (context.name) + "', global.SchemaCache." + (context.name) + ");\n");
            out.push("});\n");
            out.push("\n");
            out.push("global.EnsureIndex.jobs.push(\n");
            out.push("  (dbPool)=>\n");
            out.push("    function(err, data){\n");
            out.push("      var next = this.slot();\n");
            out.push("      var $collection = dbPool.get('" + (context.locationType) + "').model('" + (context.name) + "');\n");
            out.push("      if (!err) {\n");
            out.push("        if(!global.EnsureIndex.dropDone[$collection.collection.name]){\n");
            out.push("          $collection.collection.dropIndexes(global.EnsureIndex.go($collection, '" + (context.name) + "', next));\n");
            out.push("        }\n");
            out.push("        else{\n");
            out.push("          global.EnsureIndex.go($collection,'" + (context.name) + "', next)(null);\n");
            out.push("        }\n");
            out.push("      } else next(err);\n");
            out.push("    });\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("/*\n");
        out.push("var reqSuccess = false;\n");
        var manySrc = context.source.cardinality != '1';
        out.push("\n");
        out.push("reqSuccess = global.RESOLVESCHEMA('" + (dst) + "', __dirname);\n");
        out.push("if(reqSuccess && global.SchemaCache." + (dst) + "){\n");
        out.push("  global.SchemaCache." + (dst) + ".virtual(\"" + (context.source.name) + "\", {\n");
        out.push("    ref:'" + (src) + "',\n");
        out.push("    localField: '" + (context.source.keyField ? context.source.keyField : '_id') + "',\n");
        out.push("    foreignField: '" + (context.dest.keyField ? context.dest.keyField : '_id') + "',\n");
        out.push("    justOne: ");
        if (manySrc) {
            out.push("false");
        } else {
            out.push("true");
        }
        out.push("\n");
        out.push("  });\n");
        out.push("}\n");
        var sci, child;
        var len = context.dest?.childs?.length ?? 0;
        for(sci = 0; sci < len; sci++){
            child = context.dest.childs[sci];
            out.push("\n");
            out.push("reqSuccess = global.RESOLVESCHEMA('" + (child) + "', __dirname);\n");
            out.push("if(reqSuccess && global.SchemaCache." + (child) + "){\n");
            out.push("  global.SchemaCache." + (child) + ".virtual(\"" + (context.source.name) + "\", {\n");
            out.push("    ref:'" + (src) + "',\n");
            out.push("    localField: '" + (context.source.keyField ? context.source.keyField : '_id') + "',\n");
            out.push("    foreignField: '" + (context.dest.keyField ? context.dest.keyField : '_id') + "',\n");
            out.push("    justOne: ");
            if (manySrc) {
                out.push("false");
            } else {
                out.push("true");
            }
            out.push("\n");
            out.push("  });\n");
            out.push("}\n");
        }
        out.push("\n");
        out.push("\n");
        var manyDst = context.dest.cardinality != '1';
        out.push("\n");
        out.push("reqSuccess = global.RESOLVESCHEMA('" + (src) + "', __dirname);\n");
        out.push("if(reqSuccess && global.SchemaCache." + (src) + "){\n");
        out.push("  global.SchemaCache." + (src) + ".virtual(\"" + (context.dest.name) + "\", {\n");
        out.push("    ref:'" + (dst) + "',\n");
        out.push("    foreignField: '" + (context.source.keyField ? context.source.keyField : '_id') + "',\n");
        out.push("    localField: '" + (context.dest.keyField ? context.dest.keyField : '_id') + "',\n");
        out.push("    justOne: ");
        if (manyDst) {
            out.push("false");
        } else {
            out.push("true");
        }
        out.push("\n");
        out.push("  });\n");
        out.push("}\n");
        var sci, child;
        var len = context.dest?.childs?.length ?? 0;
        for(sci = 0; sci < len; sci++){
            child = context.dest.childs[sci];
            out.push("\n");
            out.push("reqSuccess = global.RESOLVESCHEMA('" + (child) + "', __dirname);\n");
            out.push("if(reqSuccess && global.SchemaCache." + (child) + "){\n");
            out.push("  global.SchemaCache." + (child) + ".virtual(\"" + (context.dest.name) + "\", {\n");
            out.push("    ref:'" + (dst) + "',\n");
            out.push("    foreignField: '" + (context.source.keyField ? context.source.keyField : '_id') + "',\n");
            out.push("    localField: '" + (context.dest.keyField ? context.dest.keyField : '_id') + "',\n");
            out.push("    justOne: ");
            if (manyDst) {
                out.push("false");
            } else {
                out.push("true");
            }
            out.push("\n");
            out.push("  });\n");
            out.push("}\n");
        }
        out.push("\n");
        out.push("*/");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators_new/templates/schema/relation.classic.njs.js.map
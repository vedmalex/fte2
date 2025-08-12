module.exports = {
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push(
      "var path = require('path');\n" +
        "var utils = require('@grainjs/meta-codegen').utils;\n" +
        'var mongoose = global.mongoose;\n' +
        'var Schema = mongoose.Schema;\n' +
        'var ObjectId = Schema.ObjectId;\n' +
        'var StringRef = Schema.Types.String;\n' +
        'var Mixed = Schema.Types.Mixed;\n' +
        "var Step = require('@grainjs/step');\n" +
        "var fs = require('fs');\n" +
        '\n' +
        '\n',
    )
    var notGenerateClass = context.source.embedded || context.dest.embedded
    function decapitalize(str) {
      return str.charAt(0).toLowerCase() + str.slice(1)
    }
    var dot = context.name.indexOf('.')
    var schema = dot > 0 ? context.name.slice(dot + 1) : context.name
    var schemaName = decapitalize(schema) + 'Def'
    var resCollection = context.namespace + '.' + schema
    var dst =
      'string' !== typeof context.dest.thingType
        ? context.dest.thingType.thingType
        : context.dest.thingType
    var src =
      'string' !== typeof context.source.thingType
        ? context.source.thingType.thingType
        : context.source.thingType
    var sType =
      context.source.keyField != undefined && context.source.keyField !== '_id'
        ? 'StringRef'
        : 'ObjectId'
    var dType =
      context.dest.keyField != undefined && context.dest.keyField !== '_id'
        ? 'StringRef'
        : 'ObjectId'
    const relKind = `${context.source.cardinality}${context.dest.cardinality}`
    var srcIndexKind = 'index'
    var dstIndexKind = 'index'
    switch (relKind) {
      case '11':
        {
          srcIndexKind = 'unique'
          dstIndexKind = 'unique'
        }
        break
      case '**':
        {
          srcIndexKind = 'index'
          dstIndexKind = 'index'
        }
        break
      case '1*':
        {
          srcIndexKind = 'index'
          dstIndexKind = 'unique'
        }
        break
      case '*1':
        {
          srcIndexKind = 'unique'
          dstIndexKind = 'index'
        }
        break
    }
    if (!notGenerateClass) {
      out.push(
        'var $' +
          schemaName +
          ' = {\n' +
          " '" +
          context.source.name +
          "':{type:" +
          sType +
          ', required:true, ' +
          srcIndexKind +
          ":true, sparse:true, ref:'" +
          src +
          "'},\n" +
          " '" +
          context.dest.name +
          "':{type:" +
          dType +
          ', required:true, ' +
          dstIndexKind +
          ":true,sparse:true, ref:'" +
          dst +
          "'}\n" +
          '};\n' +
          '\n' +
          '\n' +
          'var _' +
          schemaName +
          ' = new Schema($' +
          schemaName +
          ",{collection:'" +
          context.collectionType +
          "', autoIndex:false});\n" +
          '\n' +
          'if(!global.SchemaCache) global.SchemaCache = {};\n' +
          'if(!global.SchemaCache.' +
          context.namespace +
          ') global.SchemaCache.' +
          context.namespace +
          ' = {};\n' +
          '\n' +
          'global.SchemaCache.' +
          context.name +
          ' = _' +
          schemaName +
          ';',
      )
      if (!context.complextIndexFields) {
        out.push(
          '_' +
            schemaName +
            '.index({\n' +
            "  '" +
            context.source.name +
            "': 1,\n" +
            '  "' +
            context.dest.name +
            '": 1\n' +
            '}, {\n' +
            '  unique: true, /*dropDups:true,*/ sparse:true\n' +
            '});',
        )
      } else {
        out.push(
          '_' +
            schemaName +
            '.index(' +
            JSON.stringify(context.complextIndexFields) +
            '\n' +
            ' ,{\n' +
            '  unique: true, /*dropDups:true,*/ sparse:true\n' +
            '});',
        )
      }
      out.push(
        '\n' +
          '\n' +
          'global.RegisterSchema.jobs.push(function(mongoose){\n' +
          '  if(typeof(' +
          context.namespace +
          ")=='undefined') " +
          context.namespace +
          ' = {};\n' +
          '  var alreadyOverriden = !!global.' +
          context.name +
          " && mongoose.model('" +
          context.name +
          "')\n" +
          '\n' +
          '  ' +
          resCollection +
          " = alreadyOverriden ? mongoose.model('" +
          context.name +
          "') : mongoose.model('" +
          context.name +
          "', global.SchemaCache." +
          context.name +
          ');\n' +
          '});\n' +
          '\n' +
          'global.EnsureIndex.jobs.push(\n' +
          '  (dbPool)=>\n' +
          '    function(err, data){\n' +
          '      var next = this.slot();\n' +
          "      var $collection = dbPool.get('" +
          context.locationType +
          "').model('" +
          context.name +
          "');\n" +
          '      if (!err) {\n' +
          '        if(!global.EnsureIndex.dropDone[$collection.collection.name]){\n' +
          "          $collection.collection.dropIndexes(global.EnsureIndex.go($collection, '" +
          context.name +
          "', next));\n" +
          '        }\n' +
          '        else{\n' +
          "          global.EnsureIndex.go($collection,'" +
          context.name +
          "', next)(null);\n" +
          '        }\n' +
          '      } else next(err);\n' +
          '    });',
      )
    }
    out.push('\n' + '/*\n' + 'var reqSuccess = false;\n')
    var manySrc = context.source.cardinality != '1'
    out.push(
      '\n' +
        "reqSuccess = global.RESOLVESCHEMA('" +
        dst +
        "', __dirname);\n" +
        'if(reqSuccess && global.SchemaCache.' +
        dst +
        '){\n' +
        '  global.SchemaCache.' +
        dst +
        '.virtual("' +
        context.source.name +
        '", {\n' +
        "    ref:'" +
        src +
        "',\n" +
        "    localField: '" +
        (context.source.keyField ? context.source.keyField : '_id') +
        "',\n" +
        "    foreignField: '" +
        (context.dest.keyField ? context.dest.keyField : '_id') +
        "',\n" +
        '    justOne: ',
    )
    if (manySrc) {
      out.push('false')
    } else {
      out.push('true')
    }
    out.push('\n' + '  });\n' + '}')
    var sci, child
    var len = context.dest?.childs?.length ?? 0
    for (sci = 0; sci < len; sci++) {
      child = context.dest.childs[sci]
      out.push(
        '\n' +
          "reqSuccess = global.RESOLVESCHEMA('" +
          child +
          "', __dirname);\n" +
          'if(reqSuccess && global.SchemaCache.' +
          child +
          '){\n' +
          '  global.SchemaCache.' +
          child +
          '.virtual("' +
          context.source.name +
          '", {\n' +
          "    ref:'" +
          src +
          "',\n" +
          "    localField: '" +
          (context.source.keyField ? context.source.keyField : '_id') +
          "',\n" +
          "    foreignField: '" +
          (context.dest.keyField ? context.dest.keyField : '_id') +
          "',\n" +
          '    justOne: ',
      )
      if (manySrc) {
        out.push('false')
      } else {
        out.push('true')
      }
      out.push('\n' + '  });\n' + '}')
    }
    var manyDst = context.dest.cardinality != '1'
    out.push(
      '\n' +
        "reqSuccess = global.RESOLVESCHEMA('" +
        src +
        "', __dirname);\n" +
        'if(reqSuccess && global.SchemaCache.' +
        src +
        '){\n' +
        '  global.SchemaCache.' +
        src +
        '.virtual("' +
        context.dest.name +
        '", {\n' +
        "    ref:'" +
        dst +
        "',\n" +
        "    foreignField: '" +
        (context.source.keyField ? context.source.keyField : '_id') +
        "',\n" +
        "    localField: '" +
        (context.dest.keyField ? context.dest.keyField : '_id') +
        "',\n" +
        '    justOne: ',
    )
    if (manyDst) {
      out.push('false')
    } else {
      out.push('true')
    }
    out.push('\n' + '  });\n' + '}')
    var sci, child
    var len = context.dest?.childs?.length ?? 0
    for (sci = 0; sci < len; sci++) {
      child = context.dest.childs[sci]
      out.push(
        '\n' +
          "reqSuccess = global.RESOLVESCHEMA('" +
          child +
          "', __dirname);\n" +
          'if(reqSuccess && global.SchemaCache.' +
          child +
          '){\n' +
          '  global.SchemaCache.' +
          child +
          '.virtual("' +
          context.dest.name +
          '", {\n' +
          "    ref:'" +
          dst +
          "',\n" +
          "    foreignField: '" +
          (context.source.keyField ? context.source.keyField : '_id') +
          "',\n" +
          "    localField: '" +
          (context.dest.keyField ? context.dest.keyField : '_id') +
          "',\n" +
          '    justOne: ',
      )
      if (manyDst) {
        out.push('false')
      } else {
        out.push('true')
      }
      out.push('\n' + '  });\n' + '}')
    }
    out.push('*/' + '')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

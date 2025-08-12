module.exports = {
  script: function (context, _content, partial, slot, options) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null) ctx = context
      return _content(blockName, ctx, content, partial, slot)
    }
    var out = []
    out.push(
      "const { Type, Query, Schema, Enum, Union} = require('@grainjs/gql-schema-builder')\n" +
        "const gql = require('graphql-tag')\n" +
        "const {registerSchema} = require(USEGLOBAL('graphql/registerSchema'))\n" +
        "const { get } = require('lodash');\n" +
        '\n' +
        'const {\n' +
        '  query_many,\n' +
        '  query_many_count,\n' +
        "} = require('@grainjs/loaders')\n" +
        '\n' +
        '// TODO: проверить как можно добавлять условия в запросы\n' +
        '// условия, такие же как на запросной части приложения\n',
    )
    var inspect = require('util').inspect
    const hasChilds = context.hasChilds(context.thingType)
    function resolveThingName(thingType) {
      let [namespace, name] = thingType.split('.')
      return { name, namespace }
    }
    const GQLName = (context.GQLName = function GQLName(thingType) {
      return thingType.replaceAll('.', '')
    })
    var allRels = []
    allRels.push.apply(allRels, context.destRels)
    allRels.push.apply(allRels, context.sourceRels)
    var allNonEmbedded = allRels.filter(function (r) {
      return !r.oppositeEmbedded
    })
    context.hasRels = allRels.length > 0
    out.push('\n' + '\n' + '')
    var listing = inspect(context, { depth: 4 })
    out.push('\n' + '/* # {listing}*/\n' + '\n' + '')
    if (hasChilds) {
      out.push(
        '\n' +
          'const tUnion = new Union({\n' +
          '    schema:gql`\n' +
          '    # ' +
          context.$namespace +
          '' +
          context.$name +
          ' of the ' +
          context.$namespace +
          '\n' +
          '    union ' +
          context.$namespace +
          '' +
          context.$name +
          'Union =\n' +
          '        ' +
          context.$namespace +
          '' +
          context.$name,
      )
      context.allChilds.forEach((item) => {
        out.push('\n' + '        | ' + item.replaceAll('.', ''))
      })
      out.push(
        '\n' +
          '    `,\n' +
          '    resolver: (root)=> {\n' +
          "      return root.__tid.replaceAll('.','')\n" +
          '    }\n' +
          '})\n' +
          '\n' +
          'const tEnum = new Enum({schema:gql`\n' +
          '      enum ' +
          context.$namespace +
          '' +
          context.$name +
          'Childs {',
      )
      context.allChilds.forEach((item) => {
        out.push('\n' + '        ' + item.replaceAll('.', ''))
      })
      out.push('\n' + '      }\n' + '    `, resolver:{\n' + '        ')
      context.allChilds.forEach((item) => {
        out.push(
          '\n' +
            '          ' +
            item.replaceAll('.', '') +
            ': "' +
            item +
            '",\n' +
            '        ',
        )
      })
      out.push('\n' + '    }})\n' + '')
    }
    out.push(
      '\n' +
        'const main = new Type({\n' +
        '  schema:gql`\n' +
        '    # ' +
        context.$namespace +
        '' +
        context.$name +
        ' of the ' +
        context.$namespace +
        '\n' +
        '    type ' +
        context.$namespace +
        '' +
        context.$name +
        ' {\n' +
        '      ' +
        content('gqlprops', context) +
        '\n' +
        '    }`\n' +
        '  ,\n' +
        '  resolver: {\n' +
        '    \n',
    )
    const hasID = context.properties.find(
      (p) => p.propertyName.toLowerCase().trim() == 'id',
    )
    if (!hasID) {
      out.push('\n' + '    id: root => root._id,\n' + '    ')
    }
    out.push('\n' + '    ')
    if (hasChilds || context.extends) {
      out.push('\n' + '      _tid: root => root.__tid,\n' + '    ')
    }
    if (allRels.length > 0) {
      out.push(
        '\n' +
          '    childRel: (root, args, context, info) => {\n' +
          '      return root\n' +
          '    },',
      )
    }
    // properties
    for (
      var i = 0, props = context.properties, proplen = props?.length ?? 0;
      i < proplen;
      i++
    ) {
      var pName = props[i].propertyName.replaceAll('.', '')
      if (props[i].type === 'date') {
        out.push(
          '\n' +
            '      ' +
            pName +
            ':(root, {format, zone, json}, context, info) => {\n' +
            '        var result = get(root,"' +
            props[i].propertyName +
            '")\n' +
            '        if(format && zone){\n' +
            '          return result.format(format, zone);\n' +
            '        }\n' +
            '        if (format){\n' +
            '          return result.format(format, zone);\n' +
            '        }\n' +
            '        if(json){\n' +
            '          return result?.toJSON();\n' +
            '        }\n' +
            '        return result;\n' +
            '      },\n' +
            '      ',
        )
      } else {
        if (pName !== props[i].propertyName) {
          out.push(
            '\n' +
              '      ' +
              pName +
              ':(root, args, context, info) => get(root,"' +
              props[i].propertyName +
              '"),',
          )
        }
      }
    }
    out.push(
      '\n' +
        '  }\n' +
        '})\n' +
        '\n' +
        '\n' +
        'const query = [\n' +
        '  new Query({\n' +
        '    schema: gql`\n' +
        '      extend type Query {\n' +
        '        ' +
        context.$namespace +
        '' +
        context.$name +
        '(\n' +
        '          onlyIds: Boolean,\n' +
        '          ensure: Boolean,\n' +
        '          absent: Boolean,\n' +
        '          options: JSON, conditions:JSON',
    )
    if (hasChilds) {
      out.push(', kind:' + context.getEnumName(context.thingType) + '')
    }
    out.push('): [' + context.$namespace + '' + context.$name + '')
    if (hasChilds) {
      out.push('Union')
    }
    out.push(
      ']\n' +
        '      }\n' +
        '    `,\n' +
        '    resolver: query_many({\n' +
        "        sourceLocation:'" +
        context.locationType +
        "',\n" +
        "        sourceModel:'" +
        context.thingType +
        "',\n" +
        '        hasChildren:',
    )
    if (hasChilds) {
      out.push('true')
    } else {
      out.push('false')
    }
    out.push(',\n' + '        hasExtends:')
    if (context.extends) {
      out.push('true')
    } else {
      out.push('false')
    }
    out.push(',\n' + '        allChildren:[')
    context.allChilds?.forEach((item) => {
      out.push('\n' + '          "' + item + '",')
    })
    out.push(
      '\n' +
        '        ]\n' +
        '      },\n' +
        '    )\n' +
        '  }),\n' +
        '\n' +
        '  new Query({\n' +
        '    schema: gql`\n' +
        '      extend type Query {\n' +
        '        ' +
        context.$namespace +
        '' +
        context.$name +
        'Count(\n' +
        '          onlyIds: Boolean,\n' +
        '          ensure: Boolean,\n' +
        '          absent: Boolean,\n' +
        '          options: JSON, conditions:JSON',
    )
    if (hasChilds) {
      out.push(', kind:' + context.getEnumName(context.thingType) + '')
    }
    out.push(
      '): Int\n' +
        '      }\n' +
        '    `,\n' +
        '    resolver: query_many_count({\n' +
        "        sourceLocation:'" +
        context.locationType +
        "',\n" +
        "        sourceModel:'" +
        context.thingType +
        "',\n" +
        '        hasChildren:',
    )
    if (hasChilds) {
      out.push('true')
    } else {
      out.push('false')
    }
    out.push(',\n' + '        hasExtends:')
    if (context.extends) {
      out.push('true')
    } else {
      out.push('false')
    }
    out.push(',\n' + '        allChildren:[')
    context.allChilds?.forEach((item) => {
      out.push('\n' + '          "' + item + '",')
    })
    out.push(
      '\n' +
        '        ]\n' +
        '      },\n' +
        '    )\n' +
        '  }),\n' +
        ']\n' +
        '//\n' +
        "registerSchema('" +
        context.$namespace +
        '' +
        context.$name +
        "', new Schema({\n" +
        "  name: '" +
        context.$namespace +
        '' +
        context.$name +
        "',\n" +
        '  items: [main, ...query,\n' +
        '  ',
    )
    if (hasChilds) {
      out.push('\n' + '    tEnum,\n' + '    tUnion,\n' + '  ')
    }
    out.push('\n' + '  ],\n' + '  })\n' + ')\n' + '' + '')
    return out.join('')
  },
  blocks: {
    gqlprops: function (context, _content, partial, slot, options) {
      var out = []
      const hasChilds = context.hasChilds(context.thingType)
      var getType = function (name) {
        switch (name.toLowerCase()) {
          case 'int':
            return 'Int'
          case 'integer':
            return 'Int'
          case 'float':
            return 'Float'
          case 'string':
            return 'String'
          case 'date':
            return 'Date'
          case 'boolean':
            return 'Boolean'
          case 'id':
            return 'ID'
        }
      }
      const hasID = context.properties.find(
        (p) => p.propertyName.toLowerCase().trim() == 'id',
      )
      const has_ID = context.properties.find(
        (p) => p.propertyName.toLowerCase().trim() == '_id',
      )
      if (!hasID) {
        out.push('id: ID\n' + '')
      }
      if (!has_ID) {
        out.push('_id: ID\n' + '')
      }
      if (hasChilds || context.extends) {
        out.push('_tid: String')
      }
      // properties
      for (
        var i = 0, props = context.properties, proplen = props?.length ?? 0;
        i < proplen;
        i++
      ) {
        var pName = props[i].propertyName.replaceAll('.', '')
        if (props[i].type === 'date') {
          out.push(
            '\n' +
              '      ' +
              pName +
              '(format:String, zone: Float, json: Boolean): ' +
              getType(props[i].type),
          )
        } else {
          out.push('\n' + '    ' + pName + ': ' + getType(props[i].type))
        }
      }
      if (context.hasRels > 0) {
        out.push(
          '\n' +
            '    childRel:' +
            context.GQLName(context.thingType) +
            'Edges\n' +
            '  ',
        )
      }
      return out.join('')
    },
  },
  compile: function () {},
  dependency: {},
}

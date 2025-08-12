module.exports = {
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push(
      "const { Type, Query, Schema, Enum, Interface} = require('@grainjs/gql-schema-builder')\n" +
        "const gql = require('graphql-tag')\n" +
        "const {registerSchema} = require(USEGLOBAL('graphql/registerSchema'))\n" +
        '\n' +
        'const {\n' +
        '  build_relate_options,\n' +
        '  relate_count,\n' +
        '  relate,\n' +
        '  not_opposite_embedded_many_not_embedded_ids_olny,\n' +
        '  not_opposite_embedded_single_not_embedded_ids_olny,\n' +
        "} = require('@grainjs/loaders')\n" +
        '\n' +
        '\n',
    )
    var inspect = require('util').inspect
    var { extractRelationEndForRel } = require(USEGLOBAL('/lib/metaDataLoader'))
    const { parentSymbol } = require(USEGLOBAL('schemaExport/lib/common.js'))
    var resolver = require(USEGLOBAL('./genpack/resolveLocationType.js'))
    function resolveThingName(thingType) {
      let [namespace, name] = thingType.split('.')
      return { name, namespace }
    }
    function GQLName(thingType) {
      return thingType.replaceAll('.', '')
    }
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
        case 'objectid':
          return 'ID'
        case 'id':
          return 'ID'
        case 'stringref':
          return 'String'
        default:
          return name
      }
    }
    var notGenerateClass = context.source.embedded || context.dest.embedded
    function decapitalize(str) {
      return str.charAt(0).toLowerCase() + str.slice(1)
    }
    const getChildren = (thingType) =>
      ThingsAllChilds
        ? ThingsAllChilds[thingType]
          ? ThingsAllChilds[thingType]
          : false
        : false
    const getEnumName = (thingType) => {
      if (getChildren(thingType)) {
        return `${thingType.replaceAll('.', '')}Childs`
      } else {
        return thingType.replaceAll('.', '')
      }
    }
    out.push(
      '/**\n' +
        '    1. сущность для ассоциации\n' +
        '      1. проставляем для нее все необходимые полы\n' +
        '      3. сущность содержит такие же поля как и обычная\n' +
        '        properties\n' +
        '        Edges\n' +
        '      3. сущность может содержать дополнительные поля, которые могут хранить дополнительную информацию об ассоциации\n' +
        '    2. обвновляем сущность на стороне source\n' +
        '    3. обвновляем сущность на стороне dest\n' +
        '*/\n' +
        '\n' +
        '\n' +
        'const types = []\n' +
        '\n' +
        '',
    )
    if (!notGenerateClass) {
      out.push(
        '\n' +
          '\n' +
          'const relSchama = new Type({\n' +
          '  schema:gql`\n' +
          '  type ' +
          GQLName(context.name) +
          ' {\n' +
          '    ' +
          context.source.name +
          ': ' +
          getType(
            global.ThingsProps[context.source.thingType.thingType][
              context.source.keyField
            ].type,
          ) +
          '\n' +
          '    ' +
          context.dest.name +
          ': ' +
          getType(
            global.ThingsProps[context.dest.thingType.thingType][
              context.dest.keyField
            ].type,
          ) +
          '\n' +
          '    childRel: ' +
          GQLName(context.name) +
          'Edges\n' +
          '  }\n' +
          '`})\n' +
          '\n' +
          'types.push(relSchama)\n' +
          '\n' +
          'const relSchameEdges = new Type({\n' +
          '  schema: gql`\n' +
          '  type ' +
          GQLName(context.name) +
          'Edges {\n' +
          '    ' +
          context.source.name +
          ': ' +
          GQLName(context.source.thingType.thingType) +
          '\n' +
          '    ' +
          context.dest.name +
          ': ' +
          GQLName(context.dest.thingType.thingType) +
          '\n' +
          '  }\n' +
          '`})\n' +
          '\n' +
          'types.push(relSchameEdges)\n' +
          '\n' +
          '',
      )
    }
    let r1 = extractRelationEndForRel(context, false)
    let r2 = extractRelationEndForRel(context, true)
    if (!r1.ref[parentSymbol].global) {
      r1 = {
        ...r1,
        ref: { ...r1.ref, locationType: resolver.resolveThingLocation(r1.ref) },
      }
    }
    if (!r2.ref[parentSymbol].global) {
      r2 = extractRelationEndForRel(context, true)
      r2 = {
        ...r2,
        ref: { ...r2.ref, locationType: resolver.resolveThingLocation(r2.ref) },
      }
    }
    const rels = [r1, r2]
    out.push('\n' + '// relations\n' + 'const relations = [\n' + '')
    for (var i = 0, aneLen = rels.length; i < aneLen; i++) {
      var rel = rels[i]
      const refHasChildren = getChildren(rel.ref.thingType)
      const hasChildren = getChildren(rel.model.thingType)
      const names = [rel.model.thingType]
      if (hasChildren) {
        // проверяем что для конкретной сущности не определена данная связь
        names.push(
          ...hasChildren.filter(
            (t) =>
              global.RelationCache.thing[t][rel.propName].relName ==
              rel.relName,
          ),
        )
      }
      for (var j = names.length - 1; j >= 0; j -= 1) {
        const currentThingType = names[j]
        if (!rel.oppositeEmbedded) {
          out.push('\n' + '// !oppositeEmbedded\n' + '')
          if (rel.single) {
            out.push('\n' + '// !oppositeEmbedded & single\n' + '')
            if (rel.embedded) {
              out.push(
                '\n' +
                  '// !oppositeEmbedded & single & embedded\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '        type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '          ' +
                  rel.propName.replaceAll('.', '') +
                  '(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push('):' + GQLName(rel.ref.thingType) + '')
              if (refHasChildren) {
                out.push('Union')
              }
              out.push(
                '\n' +
                  '        }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ": relate(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '        type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '          ' +
                  rel.propName.replaceAll('.', '') +
                  'Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push(
                '): Int\n' +
                  '        }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  "Count: relate_count(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '',
              )
            } else {
              out.push(
                '\n' +
                  '// !oppositeEmbedded & single & !embedded\n' +
                  '    // props\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  ' {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ': ' +
                  getType(
                    global.ThingsProps[context.dest.thingType.thingType][
                      context.dest.keyField
                    ].type,
                  ) +
                  '\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ": not_opposite_embedded_single_not_embedded_ids_olny(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '    // edges\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  '(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push('):' + GQLName(rel.ref.thingType) + '')
              if (refHasChildren) {
                out.push('Union')
              }
              out.push(
                '\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ": relate(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  'Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push(
                '):Int\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  "Count: relate_count(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '',
              )
            }
            out.push('\n' + '')
          } else {
            out.push('\n' + '// !oppositeEmbedded & many\n' + '')
            if (rel.embedded) {
              out.push(
                '\n' +
                  '// !oppositeEmbedded & many & embedded\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  '(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON,  conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push('):[' + GQLName(rel.ref.thingType) + '')
              if (refHasChildren) {
                out.push('Union')
              }
              out.push(
                ']\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver:{\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ": relate(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  'Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON,  conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push(
                '):Int\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver:{\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  "Count: relate_count(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '',
              )
            } else {
              out.push(
                '\n' +
                  '// !oppositeEmbedded & many & !embedded\n' +
                  '    // props\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  ' {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ':[' +
                  getType(
                    global.ThingsProps[context.dest.thingType.thingType][
                      context.dest.keyField
                    ].type,
                  ) +
                  ']\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ": not_opposite_embedded_many_not_embedded_ids_olny(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '\n' +
                  '    //edges\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  '(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push('):[' + GQLName(rel.ref.thingType) + '')
              if (refHasChildren) {
                out.push('Union')
              }
              out.push(
                ']\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  ": relate(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '        }\n' +
                  '    }),\n' +
                  '    new Type({\n' +
                  '      schema: gql`\n' +
                  '       type ' +
                  GQLName(currentThingType) +
                  'Edges {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  'Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
              )
              if (refHasChildren) {
                out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
              }
              out.push(
                '):Int\n' +
                  '      }\n' +
                  '      `,\n' +
                  '      resolver: {\n' +
                  '        ' +
                  rel.propName.replaceAll('.', '') +
                  "Count: relate_count(build_relate_options('" +
                  rel.model.thingType +
                  "', '" +
                  rel.propName +
                  "'))\n" +
                  '      }\n' +
                  '    }),\n' +
                  '',
              )
            }
            out.push('\n' + '')
          }
          out.push('\n' + '')
        } else {
          out.push(
            '\n' +
              '// oppositeEmbedded\n' +
              '// can be properties of thing\n' +
              '',
          )
          if (rel.single) {
            out.push('\n' + '')
            var listing = inspect(context, { depth: 2 })
            out.push(
              '\n' +
                '// oppositeEmbedded & single\n' +
                '    new Type({\n' +
                '      // исправить: поставить правильную ссылку на модель\n' +
                '      schema: gql`\n' +
                '       type ' +
                GQLName(currentThingType) +
                'Edges {\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                '(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
            )
            if (refHasChildren) {
              out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
            }
            out.push('):' + GQLName(rel.ref.thingType) + '')
            if (refHasChildren) {
              out.push('Union')
            }
            out.push(
              '\n' +
                '      }\n' +
                '      `,\n' +
                '      resolver:{\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                ": relate(build_relate_options('" +
                rel.model.thingType +
                "', '" +
                rel.propName +
                "'))\n" +
                '      }\n' +
                '    }),\n' +
                '    new Type({\n' +
                '      // исправить: поставить правильную ссылку на модель\n' +
                '      schema: gql`\n' +
                '       type ' +
                GQLName(currentThingType) +
                'Edges {\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                'Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
            )
            if (refHasChildren) {
              out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
            }
            out.push(
              '):Int\n' +
                '      }\n' +
                '      `,\n' +
                '      resolver:{\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                "Count: relate_count(build_relate_options('" +
                rel.model.thingType +
                "', '" +
                rel.propName +
                "'))\n" +
                '      }\n' +
                '    }),',
            )
          } else {
            out.push(
              '// oppositeEmbedded & many\n' +
                '    new Type({\n' +
                '      // исправить: поставить правильную ссылку на модель\n' +
                '      schema: gql`\n' +
                '       type ' +
                GQLName(currentThingType) +
                'Edges {\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                '(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
            )
            if (refHasChildren) {
              out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
            }
            out.push('):[' + GQLName(rel.ref.thingType) + '')
            if (refHasChildren) {
              out.push('Union')
            }
            out.push(
              ']\n' +
                '      }\n' +
                '      `,\n' +
                '      resolver:{\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                ": relate(build_relate_options('" +
                rel.model.thingType +
                "', '" +
                rel.propName +
                "'))\n" +
                '      }\n' +
                '    }),\n' +
                '    new Type({\n' +
                '      // исправить: поставить правильную ссылку на модель\n' +
                '      schema: gql`\n' +
                '       type ' +
                GQLName(currentThingType) +
                'Edges {\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                'Count(onlyIds: Boolean, ensure:Boolean, absent:Boolean, options: JSON, conditions:JSON',
            )
            if (refHasChildren) {
              out.push(', kind:' + getEnumName(rel.ref.thingType) + '')
            }
            out.push(
              '): Int\n' +
                '      }\n' +
                '      `,\n' +
                '      resolver:{\n' +
                '        ' +
                rel.propName.replaceAll('.', '') +
                "Count: relate_count(build_relate_options('" +
                rel.model.thingType +
                "', '" +
                rel.propName +
                "'))\n" +
                '      }\n' +
                '    }),',
            )
          }
        }
      }
      out.push('\n' + '')
    }
    out.push(
      '\n' +
        ']\n' +
        '\n' +
        '//\n' +
        "registerSchema('" +
        GQLName(context.name) +
        "', new Schema({\n" +
        "  name: '" +
        GQLName(context.name) +
        "',\n" +
        '  items: [ ...types,...relations,\n' +
        '  ],\n' +
        '  })\n' +
        ')\n' +
        '' +
        '',
    )
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

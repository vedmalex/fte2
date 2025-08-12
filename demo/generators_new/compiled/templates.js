function _arrayLikeToArray(arr, len) {
  if (null == len || len > arr.length) len = arr.length
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]
  return arr2
}
function _defineProperty(obj, key, value) {
  if (key in obj)
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  else obj[key] = value
  return obj
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {}
    var ownKeys = Object.keys(source)
    if ('function' == typeof Object.getOwnPropertySymbols)
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable
        }),
      )
    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key])
    })
  }
  return target
}
function _objectSpreadProps(target, source) {
  source = null != source ? source : {}
  if (Object.getOwnPropertyDescriptors)
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
  else
    (function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object)
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object)
        keys.push.apply(keys, symbols)
      }
      return keys
    })(Object(source)).forEach(function (key) {
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(source, key),
      )
    })
  return target
}
function _toConsumableArray(arr) {
  return (
    (function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr)
    })(arr) ||
    (function _iterableToArray(iter) {
      if (
        ('undefined' != typeof Symbol && null != iter[Symbol.iterator]) ||
        null != iter['@@iterator']
      )
        return Array.from(iter)
    })(arr) ||
    _unsupportedIterableToArray(arr) ||
    (function _nonIterableSpread() {
      throw new TypeError(
        'Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
      )
    })()
  )
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return
  if ('string' == typeof o) return _arrayLikeToArray(o, minLen)
  var n = Object.prototype.toString.call(o).slice(8, -1)
  if ('Object' === n && o.constructor) n = o.constructor.name
  return 'Map' === n || 'Set' === n
    ? Array.from(n)
    : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
      ? _arrayLikeToArray(o, minLen)
      : void 0
}
var Factory = require('fte.js/lib/standalone.fte.js').Factory
var _obj
var templates =
  ((_obj = {}),
  _defineProperty(_obj, 'graphql/graphql-api.njs', {
    chunks: 'api.js',
    alias: ['graphql-api'],
    script: function script(context, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = 'api.js'
      var current = main
      var outStack = [current]
      var result
      chunkStart(main)
      var model = context.model,
        nextApp = context.nextApp
      chunkStart(''.concat(model.name, '.js'))
      out.push(
        "\nimport { ApolloServer, gql, AuthenticationError } from 'apollo-server-micro'\n\nimport GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'\n\nimport admin from 'firebase-admin'\nimport firebase from 'firebase/app'\nimport 'firebase/auth'\nimport fetch from 'isomorphic-unfetch'\n\nimport { merge } from 'lodash'\nimport firebaseServiceAccount from '../../configure/account.json'\nimport firebaseClientAccount from '../../configure/client.json'\nimport {\n  AclDirective,\n  FirebaseAdmin,\n} from 'ra-gen-ui-lib/dist/server/firebase-admin'\nimport gqlLodash from 'ra-gen-ui-lib/dist/server/lodash'\nimport { LodashSchema } from '@grainjs/gql-lodash'\nimport DataProvider from 'ra-gen-ui-lib/dist/server/dataProviderFirebaseAdmin'\nimport trackedResources from './../../components/students/ui/resources'\n\nimport { Schema } from '@grainjs/gql-schema-builder'\n\n",
      )
      var gqlItems = _toConsumableArray(
        model.enums.map(function (i) {
          return i.name
        }),
      ).concat(
        _toConsumableArray(
          model.entities
            .filter(function (i) {
              return !i.abstract
            })
            .map(function (i) {
              return i.name
            }),
        ),
      )
      return (
        out.push('\n\n'),
        gqlItems.forEach(function (i) {
          out.push(
            'import ' +
              i +
              " from '" +
              (nextApp ? '../../' : './') +
              'graphql/' +
              i +
              "';\n",
          )
        }),
        out.push(
          '\n\nif (!admin.apps.length) {\n  admin.initializeApp({\n    credential: admin.credential.cert(firebaseServiceAccount),\n  })\n}\n\nif (firebase.apps.length === 0) {\n  firebase.initializeApp(firebaseClientAccount)\n  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)\n}\n\nexport const dataProvider = new DataProvider({\n  trackedResources,\n})\n\nconst model = new Schema({\n  schema:gql`\n  scalar JSON\n  scalar JSONObject\n  scalar ID\n  scalar Date\n\n input Pagination {\n    page: Int\n    perPage: Int\n  }\n\n  enum SortOrder {\n    ASC\n    DESC\n  }\n\n  input Sort {\n    field: String!\n    order: SortOrder!\n  }\n\n  type IdsResult {\n    data: [ID]\n  }\n`,\n  items:[\n  ',
        ),
        gqlItems.forEach(function (i) {
          out.push(i + ',')
        }),
        out.push(
          "FirebaseAdmin,\n    LodashSchema,\n  ]\n})\n\nmodel.build();\n\nconst resolvers = merge({\n  JSON: GraphQLJSON,\n  JSONObject: GraphQLJSONObject,\n},\n  model.resolvers,\n);\n\nfunction checkPermissions(permissions, context) {\n  if (permissions.length > 0) {\n    if (permissions.indexOf('AUTHENTICATED') > -1) {\n      return !!context.user\n    } else if (context.user?.customClaims) {\n      return permissions.some(\n        (p) => context.user?.customClaims[p.toLowerCase()],\n      )\n    } else {\n      return false\n    }\n  } else {\n    return true\n  }\n}\n\nconst apolloServer = new ApolloServer({\n  typeDefs: model.schema,\n  resolvers,\n  schemaDirectives: {\n    acl: AclDirective,\n  },\n  plugins: [gqlLodash({ name: 'aggregations' })],\n  context: async ({ req }) => {\n    const auth = req.headers.authorization\n    const token = auth ? auth.match(/Bearer (.*)/)[1] : false\n    let user\n    if (token) {\n      try {\n        user = await admin\n          .auth()\n          .verifyIdToken(token)\n          .then((user) => admin.auth().getUser(user.uid))\n      } catch (e) {\n        throw new AuthenticationError(e.message)\n      }\n    }\n    return {\n      user,\n      dataProvider,\n      resolvers,\n      admin,\n      firebase,\n      fetch,\n      client: firebaseClientAccount,\n      checkPermissions,\n    }\n  },\n})\n\nexport const config = {\n  api: {\n    bodyParser: false\n  }\n};\n\nexport default apolloServer.createHandler({ path: `/api/" +
            model.name +
            '` });\n//https://medium.com/@tomanagle/create-a-server-side-rendering-graphql-client-with-next-js-and-apollo-client-acd397f70c64\n',
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return 'api.js' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['graphql-api']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'graphql/graphql-dataprovider.njs', {
    chunks: 'graphql-provider.js',
    alias: ['graphql-dataprovider'],
    script: function script(model, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = model
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = 'graphql-provider.js'
      var current = main
      var outStack = [current]
      var result
      return (
        chunkStart(main),
        model.enums.forEach(function (item) {
          chunkStart('graphql/'.concat(item.name, '/index.js'))
          out.push(
            "\nimport gql from 'graphql-tag';\nimport { Enum } from '@grainjs/gql-schema-builder';\nexport default new Enum({\n  schema:gql`\n  enum " +
              item.name +
              ' {\n    ',
          )
          item.items.forEach(function (it) {
            out.push(it.name + '\n    ')
          })
          out.push('\n  }\n  `\n})')
          chunkEnd()
        }),
        out.push('\n\n\n'),
        model.entities
          .filter(function (e) {
            return !e.abstract
          })
          .forEach(function (item) {
            chunkStart('graphql/'.concat(item.name, '/index.js'))
            out.push("\nimport { Schema } from '@grainjs/gql-schema-builder';")
            var required = []
            out.push('import ' + item.name + " from './" + item.name + ".js'")
            required.push(''.concat(item.name))
            chunkEnd()
            chunkStart(
              'graphql/'.concat(item.name, '/').concat(item.name, '.js'),
            )
            out.push(
              "\nimport gql from 'graphql-tag';\nimport { Type } from '@grainjs/gql-schema-builder';\nexport default new Type ({\n  schema: gql`type " +
                item.name +
                ' {\n      \n',
            )
            item.props
              .filter(function (p) {
                return !(item.embedded && 'id' == p.name)
              })
              .filter(function (p) {
                return !p.ref
              })
              .forEach(function (prop) {
                out.push(
                  prop.name +
                    ': ' +
                    prop.gqlType +
                    (prop.required ? '!' : '') +
                    '\n      ',
                )
              })
            out.push('\n  }`,\n     resolvers: {\n    ')
            item.props
              .filter(function (p) {
                return 'id' != p.name
              })
              .filter(function (p) {
                return !p.ref
              })
              .filter(function (f) {
                return f.calculated
              })
              .forEach(function (f) {
                out.push(
                  '\n      ' +
                    f.name +
                    ':(root, args, context, info)=> {\n        // custom mutations implementation\n        //  throw new Error("not implemented")\n        // custom mutations implementation\n      },\n      ',
                )
              })
            out.push('\n     },\n  })')
            chunkEnd()
            var relations = []
            out.push(
              "import { Schema } from '@grainjs/gql-schema-builder';\n  ",
            )
            item.props
              .filter(function (p) {
                return p.ref
              })
              .forEach(function (f) {
                f.ref
                var embedded = f.embedded,
                  single = (f.stored, f.single)
                if (item.embedded && 'id' === f.name) return
                chunkStart('graphql/'.concat(item.name, '/relations/index.js'))
                out.push('\nimport ' + f.name + " from './" + f.name + ".js'")
                relations.push(''.concat(f.name))
                chunkEnd()
                chunkStart(
                  'graphql/'
                    .concat(item.name, '/relations/')
                    .concat(f.name, '.js'),
                )
                out.push(
                  "\nimport gql from 'graphql-tag';\nimport { Type } from '@grainjs/gql-schema-builder';\nexport default new Type ({\n    schema: gql`extend type " +
                    item.name +
                    ' {',
                )
                if (single && !embedded) out.push(f.name + 'Id: ID')
                else if (!single && !embedded) out.push(f.name + 'Ids:[ID]')
                out.push('\n      ' + f.name)
                if (!single && !embedded)
                  out.push('(pagination: Pagination, filter: JSON)')
                out.push(':')
                if (!single) out.push('[')
                out.push(f.gqlType + '' + (f.required ? '!' : ''))
                if (!single) out.push(']')
                out.push('}`,\n  resolver: {\n      \n')
                if (!(f.calculated || f.readonly) && !embedded) {
                  var rEntity =
                    model.entities[model.typeMap[f.ref.entity].index]
                  if (f.single && f.stored)
                    out.push(
                      '\n        ' +
                        f.name +
                        'Id: (root)=>root.' +
                        f.ref.backField +
                        ',\n        ',
                    )
                  if (f.ref.using) {
                    if (f.single)
                      out.push(
                        f.name +
                          "Id: async (root, _ , {dataProvider}) => {\n            const linkTable = await dataProvider.getListNative('" +
                          f.ref.using.entity +
                          "', {\n              filter: { " +
                          f.ref.using.field +
                          ': root.' +
                          f.ref.backField +
                          ' },\n              pagination: {page:1, perPage: 1}\n            });\n            return linkTable.data.map(d => d.' +
                          f.ref.usingField +
                          ')[0];\n          },',
                      )
                    else
                      out.push(
                        f.name +
                          "Ids: async (root,_, {dataProvider}) => {\n            const linkTable = await dataProvider.getListNative('" +
                          f.ref.using.entity +
                          "', {\n              filter: { " +
                          f.ref.using.field +
                          ': root.' +
                          f.ref.backField +
                          ' },\n            });\n            return linkTable.data.map(d => d.' +
                          f.ref.usingField +
                          ');\n          },',
                      )
                  } else if (!f.stored) {
                    if (f.single)
                      out.push(
                        f.name +
                          "Id: async (root,_, {dataProvider}) => {\n            const res = await dataProvider.getListNative('" +
                          rEntity.name +
                          "',{filter:{" +
                          f.ref.opposite +
                          ': root.' +
                          f.name +
                          '}, pagination:{page:1, perPage:1}});\n            return res.data.length > 0 ? res.data[0].id : null\n          },',
                      )
                    else
                      out.push(
                        f.name +
                          'Ids: async (root,_, {dataProvider}) => {\n            const filter = {' +
                          f.ref.opposite +
                          ': root.' +
                          f.ref.backField +
                          "}\n            const res = await dataProvider.getListNative('" +
                          rEntity.name +
                          "',{ filter});\n            return res.data.map(item=>item.id)\n          },",
                      )
                  }
                  out.push(f.name + ': async (root, ')
                  if (f.single) out.push('_')
                  else out.push('{pagination, filter}')
                  out.push(', {dataProvider})=> {\n          ')
                  if (f.ref.using) {
                    out.push('\n          ')
                    if (f.single)
                      out.push(
                        "\n          const linkTable = await dataProvider.getListNative('" +
                          f.ref.using.entity +
                          "', {\n            filter: { " +
                          f.ref.using.field +
                          ': root.' +
                          f.ref.backField +
                          ' },\n            pagination: {page:1, perPage: 1}\n          });\n          let ids = linkTable.data.map(d => d.' +
                          f.ref.usingField +
                          "});\n          const result = await dataProvider.getList('" +
                          f.ref.entity +
                          "', {\n            filter: { " +
                          f.ref.field +
                          ': { in: ids } },\n          });\n          return result.data[0];\n          ',
                      )
                    else
                      out.push(
                        "\n          const linkTable = await dataProvider.getListNative('" +
                          f.ref.using.entity +
                          "', {\n            filter: { " +
                          f.ref.using.field +
                          ': root.' +
                          f.ref.backField +
                          ' },\n            pagination,\n          });\n          let ids = linkTable.data.map(d => d.' +
                          f.ref.usingField +
                          ');\n          if (filter){\n            filter.' +
                          f.ref.field +
                          ' = { in: ids }\n          } else {\n            filter = { ' +
                          f.ref.field +
                          ": { in: ids } }\n          }\n          const result = await dataProvider.getList('" +
                          f.ref.entity +
                          "', {\n            filter,\n            pagination,\n          });\n          return result.data;\n          ",
                      )
                    out.push('\n          ')
                  } else {
                    out.push('\n            ')
                    if (f.single)
                      out.push(
                        "\n            const res = await dataProvider.getListNative('" +
                          rEntity.name +
                          "',{filter:{" +
                          f.ref.opposite +
                          ': root.' +
                          f.name +
                          '}, pagination:{page:1, perPage:1}});',
                      )
                    else
                      out.push(
                        'if (filter){\n              filter.' +
                          f.ref.opposite +
                          ' = root.' +
                          f.ref.backField +
                          '\n            } else {\n              filter = {' +
                          f.ref.opposite +
                          ': root.' +
                          f.ref.backField +
                          "}\n            }\n            const res = await dataProvider.getListNative('" +
                          rEntity.name +
                          "',{pagination, filter});",
                      )
                    out.push('return res.data;\n          ')
                  }
                  out.push('\n      },\n      ')
                }
                out.push('\n\n      ')
                if (f.calculated)
                  out.push(
                    '\n      ' +
                      f.name +
                      ':(root, args, context, info)=> {\n        // custom mutations implementation\n        //  throw new Error("not implemented")\n        // custom mutations implementation\n      },\n      ',
                  )
                out.push('\n    },\n  })')
                chunkEnd()
              })
            out.push('\n\n')
            if (relations.length > 0) {
              chunkStart('graphql/'.concat(item.name, '/index.js'))
              out.push("\nimport relations from './relations'")
              required.push('relations')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/relations/index.js'))
              out.push(
                "\nimport { Schema } from '@grainjs/gql-schema-builder';\nexport default new Schema({\n  name:'" +
                  item.name +
                  ".relations',\n  items: [",
              )
              relations.forEach(function (item) {
                out.push(item + ',')
              })
              out.push(']\n})')
              chunkEnd()
            }
            chunkStart('graphql/'.concat(item.name, '/index.js'))
            out.push("\nimport inputs from './inputs'")
            required.push('inputs')
            chunkEnd()
            chunkStart('graphql/'.concat(item.name, '/inputs/index.js'))
            var inputs = []
            out.push(
              "import { Schema } from '@grainjs/gql-schema-builder';\nimport Create from './Create.js'",
            )
            inputs.push('Create')
            chunkEnd()
            chunkStart('graphql/'.concat(item.name, '/inputs/Create.js'))
            out.push(
              "\nimport gql from 'graphql-tag';\nimport { Input } from '@grainjs/gql-schema-builder';\nexport default new Input( gql`\n  input " +
                item.name +
                'Create {\n    ',
            )
            item.props
              .filter(function (p) {
                return !p.calculated
              })
              .filter(function (p) {
                return (item.embedded && 'id' != p.name) || !item.embedded
              })
              .filter(function (p) {
                return !(p.ref && !p.single && !p.embedded)
              })
              .forEach(function (prop) {
                var ref = prop.ref,
                  single = prop.single,
                  stored = prop.stored
                prop.embedded, prop.verb
                var isSingle = !ref || single
                if (single && stored) out.push(prop.name + ':ID')
                else {
                  out.push(prop.name + ': ')
                  if (!isSingle) out.push('[')
                  out.push('' + (prop.isFile ? 'Upload' : prop.gqlType))
                  if (ref && !prop.isFile) out.push('Create')
                  out.push('')
                  if (!isSingle) out.push(']')
                  out.push(prop.required && 'id' !== prop.name ? '!' : '')
                }
                out.push('\n    ')
              })
            out.push('\n  }\n  `)')
            chunkEnd()
            chunkStart('graphql/'.concat(item.name, '/inputs/index.js'))
            out.push("\nimport Update from './Update.js'")
            inputs.push('Update')
            chunkEnd()
            chunkStart('graphql/'.concat(item.name, '/inputs/Update.js'))
            out.push(
              "\nimport gql from 'graphql-tag';\nimport { Input } from '@grainjs/gql-schema-builder';\nexport default new Input( gql`\n  input " +
                item.name +
                'Update {\n    ',
            )
            item.props
              .filter(function (p) {
                return !p.calculated
              })
              .filter(function (p) {
                return (item.embedded && 'id' != p.name) || !item.embedded
              })
              .filter(function (p) {
                return !(p.ref && !p.single && !p.embedded)
              })
              .forEach(function (prop) {
                var ref = prop.ref,
                  single = prop.single,
                  stored = prop.stored
                prop.embedded, prop.verb
                var isSingle = !ref || single
                if (single && stored) out.push(prop.name + ':ID')
                else {
                  out.push(prop.name + ': ')
                  if (!isSingle) out.push('[')
                  out.push('' + (prop.isFile ? 'Upload' : prop.gqlType))
                  if (ref && !prop.isFile) out.push('Update')
                  out.push('')
                  if (!isSingle) out.push(']')
                }
                out.push('\n    ')
              })
            out.push('\n  }\n   `)')
            chunkEnd()
            chunkStart('graphql/'.concat(item.name, '/inputs/index.js'))
            out.push(
              "\n\nexport default new Schema({\n  name:'" +
                item.name +
                ".inputs',\n  items:[",
            )
            inputs.forEach(function (item) {
              out.push(item + ',')
            })
            out.push(']\n})')
            chunkEnd()
            if (!item.embedded) {
              var ref,
                ref1,
                ref2,
                ref3,
                ref4,
                ref5,
                ref6,
                ref7,
                ref8,
                ref9,
                ref10,
                ref11,
                ref12,
                ref13,
                ref14,
                ref15,
                ref16,
                ref17,
                ref18,
                ref19
              chunkStart('graphql/'.concat(item.name, '/index.js'))
              out.push("\nimport operations from './operations'")
              required.push('operations')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              var operations = []
              out.push(
                "import { Schema } from '@grainjs/gql-schema-builder';\nimport ListResult from './ListResult.js'",
              )
              operations.push('ListResult')
              chunkEnd()
              chunkStart(
                'graphql/'.concat(item.name, '/operations/ListResult.js'),
              )
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Type } from '@grainjs/gql-schema-builder';\nexport default new Type( gql`\n  type " +
                  item.name +
                  'ListResult {\n    data: [' +
                  item.name +
                  ']\n    total: Int\n  }`)',
              )
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport SingleResult from './SingleResult.js'")
              operations.push('SingleResult')
              chunkEnd()
              chunkStart(
                'graphql/'.concat(item.name, '/operations/SingleResult.js'),
              )
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Type } from '@grainjs/gql-schema-builder';\nexport default new Type( gql`\n  type " +
                  item.name +
                  'SingleResult {\n    data: ' +
                  item.name +
                  '\n  }\n  `)',
              )
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport getOne from './getOne.js'")
              operations.push('getOne')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/getOne.js'))
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Query } from '@grainjs/gql-schema-builder';\nexport default new Query(\n    {\n      schema:gql`\n      extend type Query {\n        getOne" +
                  item.name +
                  '(id: ID!): ' +
                  item.name +
                  'SingleResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref = item.metadata) || void 0 === ref
                  ? void 0
                  : null === (ref1 = ref.entry) || void 0 === ref1
                    ? void 0
                    : ref1.calculated
              )
                out.push(
                  '(_,{id}, {dataProvider}) => {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_,{id}, {dataProvider}) => dataProvider.getOne('" +
                    item.name +
                    "', {id}),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport getList from './getList.js'")
              operations.push('getList')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/getList.js'))
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Query } from '@grainjs/gql-schema-builder';\nexport default new Query(\n    {\n      schema:gql`\n      extend type Query {\n        getList" +
                  item.name +
                  '(pagination: Pagination, sort: Sort, filter: JSON): ' +
                  item.name +
                  'ListResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref2 = item.metadata) || void 0 === ref2
                  ? void 0
                  : null === (ref3 = ref2.entry) || void 0 === ref3
                    ? void 0
                    : ref3.calculated
              )
                out.push(
                  '(_, {pagination, sort, filter}, {dataProvider})=> {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_, {pagination, sort, filter}, {dataProvider})=> dataProvider.getList('" +
                    item.name +
                    "',{ pagination, sort, filter }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport getListNative from './getListNative.js'")
              operations.push('getListNative')
              chunkEnd()
              chunkStart(
                'graphql/'.concat(item.name, '/operations/getListNative.js'),
              )
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Query } from '@grainjs/gql-schema-builder';\nexport default new Query(\n    {\n      schema:gql`\n      extend type Query {\n        getListNative" +
                  item.name +
                  '(pagination: Pagination, sort: Sort, filter: JSON): ' +
                  item.name +
                  'ListResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref4 = item.metadata) || void 0 === ref4
                  ? void 0
                  : null === (ref5 = ref4.entry) || void 0 === ref5
                    ? void 0
                    : ref5.calculated
              )
                out.push(
                  '(_, {pagination, sort, filter}, {dataProvider})=> {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_, {pagination, sort, filter}, {dataProvider})=> dataProvider.getListNative('" +
                    item.name +
                    "',{ pagination, sort, filter }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport getMany from './getMany.js'")
              operations.push('getMany')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/getMany.js'))
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Query } from '@grainjs/gql-schema-builder';\nexport default new Query(\n    {\n      schema:gql`\n      extend type Query {\n        getMany" +
                  item.name +
                  '(ids: [ID]!):' +
                  item.name +
                  'ListResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref6 = item.metadata) || void 0 === ref6
                  ? void 0
                  : null === (ref7 = ref6.entry) || void 0 === ref7
                    ? void 0
                    : ref7.calculated
              )
                out.push(
                  '(_, { ids }, {dataProvider})=> {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_, { ids }, {dataProvider})=> dataProvider.getMany('" +
                    item.name +
                    "',{ ids }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport getManyReference from './getManyReference.js'")
              operations.push('getManyReference')
              chunkEnd()
              chunkStart(
                'graphql/'.concat(item.name, '/operations/getManyReference.js'),
              )
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Query } from '@grainjs/gql-schema-builder';\nexport default new Query(\n    {\n      schema:gql`\n      extend type Query {\n        getManyReference" +
                  item.name +
                  '(target: String, id: ID, pagination: Pagination, sort: Sort, filter: JSON): ' +
                  item.name +
                  'ListResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref8 = item.metadata) || void 0 === ref8
                  ? void 0
                  : null === (ref9 = ref8.entry) || void 0 === ref9
                    ? void 0
                    : ref9.calculated
              )
                out.push(
                  '(_, { target, id, pagination, sort, filter}, {dataProvider})=> {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_, { target, id, pagination, sort, filter}, {dataProvider})=> dataProvider.getManyReference('" +
                    item.name +
                    "',{ target, id, pagination, sort, filter }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport create from './create.js'")
              operations.push('create')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/create.js'))
              out.push(
                "\nimport gql from 'graphql-tag';\nimport { Mutation} from '@grainjs/gql-schema-builder';\nexport default new Mutation(\n    {\n      schema:gql`\n      extend type Mutation {\n        create" +
                  item.name +
                  '(data: ' +
                  item.name +
                  'Create!): ' +
                  item.name +
                  'SingleResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref10 = item.metadata) || void 0 === ref10
                  ? void 0
                  : null === (ref11 = ref10.entry) || void 0 === ref11
                    ? void 0
                    : ref11.calculated
              )
                out.push(
                  '(_,{ data }, {dataProvider}) => {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_,{ data }, {dataProvider}) => dataProvider.create('" +
                    item.name +
                    "', { data }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport update from './update.js'")
              operations.push('update')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/update.js'))
              out.push(
                "\nimport gql from 'graphql-tag';\nimport {Mutation} from '@grainjs/gql-schema-builder';\nexport default new Mutation(\n    {\n      schema:gql`\n      extend type Mutation {\n        update" +
                  item.name +
                  '(id: ID, data: ' +
                  item.name +
                  'Update!, previousData: ' +
                  item.name +
                  'Update!): ' +
                  item.name +
                  'SingleResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref12 = item.metadata) || void 0 === ref12
                  ? void 0
                  : null === (ref13 = ref12.entry) || void 0 === ref13
                    ? void 0
                    : ref13.calculated
              )
                out.push(
                  '(_,{id, data}, {dataProvider}) => {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_,{id, data, previousData}, {dataProvider}) => dataProvider.update('" +
                    item.name +
                    "', { id, data, previousData }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport updateMany from './updateMany.js'")
              operations.push('updateMany')
              chunkEnd()
              chunkStart(
                'graphql/'.concat(item.name, '/operations/updateMany.js'),
              )
              out.push(
                "\nimport gql from 'graphql-tag';\nimport {Mutation} from '@grainjs/gql-schema-builder';\nexport default new Mutation(\n    {\n      schema:gql`\n      extend type Mutation {\n        updateMany" +
                  item.name +
                  '(ids: ID!, data: ' +
                  item.name +
                  'Update!): IdsResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref14 = item.metadata) || void 0 === ref14
                  ? void 0
                  : null === (ref15 = ref14.entry) || void 0 === ref15
                    ? void 0
                    : ref15.calculated
              )
                out.push(
                  '(_,{ids, data, previousData }, {dataProvider}) => {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_,{ids, data }, {dataProvider}) => dataProvider.updateMany('" +
                    item.name +
                    "', { ids, data }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport deleteMutation from './delete.js'")
              operations.push('deleteMutation')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/delete.js'))
              out.push(
                "\nimport gql from 'graphql-tag';\nimport {Mutation} from '@grainjs/gql-schema-builder';\nexport default new Mutation(\n    {\n      schema:gql`\n      extend type Mutation {\n        delete" +
                  item.name +
                  '(id: ID!, previousData: ' +
                  item.name +
                  'Update!): ' +
                  item.name +
                  'SingleResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref16 = item.metadata) || void 0 === ref16
                  ? void 0
                  : null === (ref17 = ref16.entry) || void 0 === ref17
                    ? void 0
                    : ref17.calculated
              )
                out.push(
                  '(_,{id, previousData }, {dataProvider}) => {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_,{id, previousData }, {dataProvider}) => dataProvider.delete('" +
                    item.name +
                    "', { id, previousData }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push("\nimport deleteMany from './deleteMany.js'")
              operations.push('deleteMany')
              chunkEnd()
              chunkStart(
                'graphql/'.concat(item.name, '/operations/deleteMany.js'),
              )
              out.push(
                "\nimport gql from 'graphql-tag';\nimport {Mutation} from '@grainjs/gql-schema-builder';\nexport default new Mutation(\n    {\n      schema:gql`\n      extend type Mutation {\n        deleteMany" +
                  item.name +
                  '(ids: [ID!]! ): IdsResult\n      }`,\n      resolver:',
              )
              if (
                null === (ref18 = item.metadata) || void 0 === ref18
                  ? void 0
                  : null === (ref19 = ref18.entry) || void 0 === ref19
                    ? void 0
                    : ref19.calculated
              )
                out.push(
                  '(_,{ids}, {dataProvider}) => {\n    // custom mutations implementation\n    //  throw new Error("not implemented")\n    // custom mutations implementation\n    },',
                )
              else
                out.push(
                  "(_,{ids}, {dataProvider}) => dataProvider.deleteMany('" +
                    item.name +
                    "', { ids }),",
                )
              out.push('})')
              chunkEnd()
              chunkStart('graphql/'.concat(item.name, '/operations/index.js'))
              out.push(
                "\nexport default new Schema({\n  name: '" +
                  item.name +
                  "',\n  items:[",
              )
              operations.forEach(function (requiredItem) {
                out.push(requiredItem + ',')
              })
              out.push('],\n})')
              chunkEnd()
            }
            chunkStart('graphql/'.concat(item.name, '/index.js'))
            out.push(
              "\nexport default new Schema({\n  name: '" +
                item.name +
                "',\n  items:[",
            )
            required.forEach(function (requiredItem) {
              out.push(requiredItem + ',')
            })
            out.push('],\n})')
            chunkEnd()
          }),
        out.push('\n'),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return 'graphql-provider.js' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['graphql-dataprovider']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'next-js/ui-data-adapters.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-data-adapters'],
    script: function script(model, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = model
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      return (
        chunkStart(main),
        chunkStart('fragments.js'),
        out.push("\nimport gql from 'graphql-tag';\n\nexport default {\n"),
        model.entities
          .filter(function (e) {
            return !e.abstract
          })
          .forEach(function (item) {
            out.push(
              '\n  ' +
                item.name +
                ':{\n    query: (fragments) => gql`\n      fragment Query' +
                item.name +
                ' on ' +
                item.name +
                ' {\n      \n',
            )
            item.props.forEach(function (prop) {
              var ref = prop.ref,
                embedded = prop.embedded,
                single = (prop.stored, prop.single)
              if (item.embedded && 'id' === prop.name) return
              if (ref && single && !embedded)
                out.push(prop.name + ': ' + prop.name + 'Id')
              else if (!ref || single || embedded) {
                out.push(prop.name + ' ')
                if (ref) out.push(' { ...Query' + prop.gqlType + ' } ')
              } else out.push(prop.name + ': ' + prop.name + 'Ids')
              out.push('\n      ')
            })
            out.push('\n      }\n      ')
            item.props
              .filter(function (f) {
                return f.ref && f.embedded
              })
              .forEach(function (prop) {
                prop.ref
                out.push(
                  '${fragments.' +
                    prop.ref.entity +
                    '.query(fragments)}\n      ',
                )
              })
            out.push('\n    `\n  },\n')
          }),
        out.push('\n}'),
        chunkStart('data-provider.js'),
        out.push(
          "\n\nimport clientProvider from 'ra-gen-ui-lib/dist/client/remoteProvider';\nimport fragments from './fragments';\nimport resources from './ui/resources';\nimport ApolloClient from 'apollo-boost';\n\nconst client = new ApolloClient({\n  uri: '/api/" +
            model.name +
            "',\n  request: operation => {\n    const token = localStorage.getItem('token');\n    operation.setContext({\n      headers: {\n        authorization: token ? `Bearer ${token}` : '',\n      },\n    });\n  },\n});\n\nexport default clientProvider(client, fragments, resources);",
        ),
        chunkStart('auth-provider.js'),
        out.push(
          "\nimport ApolloClient from 'apollo-boost';\n\nconst client = new ApolloClient({\n  uri: '/api/admin',\n  request: operation => {\n    const token = localStorage.getItem('token');\n    operation.setContext({\n      headers: {\n        authorization: token ? `Bearer ${token}` : '',\n      },\n    });\n  },\n});\n\nimport authProvider from 'ra-gen-ui-lib/dist/client/authProviderRemote';\nexport default authProvider(client);",
        ),
        chunkStart('auth-provider-fb.js'),
        out.push(
          "\n\nimport firebase from 'firebase/app';\nimport 'firebase/auth';\n\nimport client from '../../configure/client.json'\n\nif (firebase.apps.length === 0) {\n  firebase.initializeApp(client);\n  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);\n}\n\nimport authProvider from 'ra-gen-ui-lib/dist/client/authProviderClient';\nexport default authProvider(firebase.auth.Auth.Persistence.LOCAL);",
        ),
        chunkStart('data-provider-fb-auth.js'),
        out.push(
          "\nimport clientProvider from 'ra-gen-ui-lib/dist/client/remoteProvider';\nimport { firebaseLoaded } from 'ra-gen-ui-lib/dist/client/authProviderClient';\nimport fragments from './fragments';\nimport resources from './ui/resources';\nimport ApolloClient from 'apollo-boost';\nimport firebase from 'firebase/app';\nimport 'firebase/auth';\n\nimport clientKey from '../../configure/client.json'\n\nif (firebase.apps.length === 0) {\n  firebase.initializeApp(clientKey);\n  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);\n}\n\nconst client = new ApolloClient({\n  uri: '/api/" +
            model.name +
            "',\n  request: async operation => {\n    await firebaseLoaded();\n    if (firebase.auth().currentUser) {\n      const token = await firebase.auth().currentUser.getIdToken()\n      operation.setContext({\n        headers: {\n          authorization: token ? `Bearer ${token}` : '',\n        },\n      })\n    } else {\n      throw new Error('unauthenticated')\n    }\n  },\n});\n\nexport default clientProvider(client, fragments, resources);\n",
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-data-adapters']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'next-js/ui-next-js-root.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-next-js-root'],
    script: function script(model, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = model
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      return (
        chunkStart(main),
        chunkStart('../../pages/'.concat(model.name, '.js')),
        out.push(
          "\nimport dynamic from 'next/dynamic';\n\nconst Admin = dynamic(() => import('../components/" +
            model.name +
            "'), { ssr: false });\n\nexport default () => <Admin />;",
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-next-js-root']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'next-js/ui-next-js.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-next-js'],
    script: function script(model, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = model
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      return (
        chunkStart(main),
        out.push(
          partial(model, 'ui-data-adapters') +
            '\n' +
            partial(model, 'ui-next-js-root') +
            '\n' +
            partial(model, 'ui-root'),
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-next-js']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'next-js/ui-root.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-root'],
    script: function script(model, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = model
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      return (
        chunkStart(main),
        chunkStart('index.js'),
        out.push(
          "import React from 'react';\nimport Admin from './ui/admin';\nimport dataProvider from './data-provider-fb-auth';\nimport authProvider from './auth-provider-fb';\n\nexport default ({ title }) => (\n  <Admin\n    locale=\"russian\"\n    authProvider={authProvider}\n    dataProvider={dataProvider}\n    title={title}\n  />\n);\n",
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-root']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/actions/actions.njs', {
    alias: ['actions'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      return (
        out.push(
          "import React, {Component} from \"react\";\nimport PropTypes from 'prop-types';\nimport { connect } from 'react-redux';\nimport { Button } from 'react-admin';\n\n\n",
        ),
        entity1.actions.forEach(function (action) {
          out.push(
            '\n// ' +
              action.name +
              '\n// ' +
              action.actionType +
              '\n// ' +
              action.actionName +
              '\n\nexport const ' +
              action.actionName +
              " = '" +
              action.actionName +
              "';\nexport const " +
              action.actionCreatorName +
              ' = (data) => ({\n  type: ' +
              action.actionName +
              ",\n  payload: { data, resource: '" +
              entity1.name +
              "' },\n  // dataProvider hack\n  meta: { fetch: 'EXECUTE', resource: '" +
              action.actionCreatorName +
              "' },\n});\n\n/**\n*  // define this method in dataProvider to use this\n*  async function " +
              action.actionCreatorName +
              '(data, resource){\n*    \n*  }\n*/\n\nclass ' +
              action.fullName +
              'Action  extends Component {\n  handleClick = () => {\n    const { ' +
              action.actionCreatorName +
              ', record } = this.props;\n    ' +
              action.actionCreatorName +
              '(record);\n  }\n  render(){\n    return(<Button onClick={this.handleClick} label="resources.' +
              entity1.name +
              '.actions.' +
              action.name +
              '"/>);\n  }\n}\n\n' +
              action.fullName +
              'Action.propTypes = {\n  ' +
              action.actionCreatorName +
              ': PropTypes.func.isRequired,\n  record: PropTypes.object,\n};\n\nexport const ' +
              action.fullName +
              'Button = connect(null, {\n  ' +
              action.actionCreatorName +
              ',\n})(' +
              action.fullName +
              'Action);\n\n',
          )
        }),
        out.push(''),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['actions']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/edit/entity.njs', {
    alias: ['display-edit-entity'],
    script: function script(context, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var source = context.source,
        entity1 = context.entity,
        sectionLabel = context.sectionLabel,
        readonly = context.readonly,
        customizable = context.customizable
      return (
        out.push('\n'),
        entity1.props.forEach(function (f, index) {
          var ctx = {
            entity: entity1,
            f: f,
            source: source,
            sectionLabel: sectionLabel,
            readonly: readonly,
            customizable: customizable,
          }
          out.push('\n')
          if (customizable)
            out.push(
              "\n{ !excludedField.hasOwnProperty('" +
                source +
                f.name +
                "') && \n",
            )
          out.push('\n')
          if (!f.ref || f.isFile) {
            if (f.isFile) {
              if (f.isImage) ctx.f.type = 'Image'
              else ctx.f.type = 'File'
            }
            out.push('\n    ' + partial(ctx, 'display-edit-field') + '\n')
          } else {
            var ref, ref1
            var embedded =
              null == entity1
                ? void 0
                : null === (ref = entity1.UI) || void 0 === ref
                  ? void 0
                  : null === (ref1 = ref.embedded) || void 0 === ref1
                    ? void 0
                    : ref1.hasOwnProperty(f.name)
            if ((f.calculated || f.readonly) && !readonly) ctx.readonly = true
            out.push('\n  ')
            if (f.single) {
              out.push('\n    ')
              if (embedded)
                out.push(
                  '\n      ' +
                    partial(ctx, 'display-edit-rel-single-embed') +
                    '\n    ',
                )
              else {
                out.push('\n      ')
                if (f.ref.stored)
                  out.push(
                    '\n        ' +
                      partial(
                        ctx,
                        'display-edit-rel-single-not-embed-w-preview',
                      ) +
                      '\n      ',
                  )
                else
                  out.push(
                    '\n        ' +
                      partial(ctx, 'display-edit-rel-single-not-embed') +
                      '\n      ',
                  )
                out.push('\n    ')
              }
              out.push('\n  ')
            } else {
              out.push('\n    ')
              if (embedded)
                out.push(
                  '\n      ' +
                    partial(ctx, 'display-edit-rel-multiple-embed') +
                    '\n    ',
                )
              else {
                out.push('\n      ')
                if (
                  'BelongsToMany' !== f.verb ||
                  ('BelongsToMany' === f.verb && f.ref.using)
                )
                  out.push(
                    '\n        ' +
                      partial(ctx, 'display-edit-show-rel-multiple-not-embed') +
                      '\n        ',
                  )
                else
                  out.push(
                    '\n        ' +
                      partial(ctx, 'display-edit-rel-multiple-not-embed') +
                      '\n      ',
                  )
                out.push('\n    ')
              }
              out.push('\n  ')
            }
            out.push('\n')
          }
          out.push('\n')
          if (customizable) out.push('\n}\n')
          out.push('\n')
        }),
        out.push(''),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['display-edit-entity']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/edit/field.njs', {
    alias: ['display-edit-field'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        readonly = ctx.readonly
      var type = ''.concat(
        f.calculated || f.readonly || readonly ? 'Readonly' + f.type : f.type,
      )
      out.push('<uix.primitive.' + type + '.Input')
      if (f.defaultValue) out.push('\n  defaultValue={' + f.defaultValue + '}')
      out.push(
        '\n  label="resources.' +
          (f.inheritedFrom || entity1.name) +
          '.fields.' +
          f.name +
          '"\n',
      )
      if (f.hint)
        out.push(
          'helperText="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.helpers.' +
            f.name +
            '"\n',
        )
      else out.push('helperText={false}\n')
      out.push('\n  source={`' + source + f.name + '`}\n  ')
      if (f.required) out.push('validate={uix.required()}')
      else out.push('allowEmpty')
      return out.push('\n/>'), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-edit-field']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/edit/rel-multiple-embed.njs', {
    alias: ['display-edit-rel-multiple-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        readonly = (ctx.sectionLabel, ctx.readonly)
      out.push(
        '<uix.ArrayInput\n  label="resources.' +
          (f.inheritedFrom || entity1.name) +
          '.fields.' +
          f.name +
          '"\n  source={`' +
          source +
          f.ref.backField +
          '`}\n  allowEmpty\n>\n  <uix.SimpleFormIterator>\n  ',
      )
      var e = entity1.model.entities.find(function (e) {
        return e.name === f.ref.entity
      })
      var context = {
        entity: _objectSpreadProps(_objectSpread({}, e), {
          props: readonly
            ? e.lists.all.map(function (f) {
                return _objectSpreadProps(_objectSpread({}, f), {
                  readonly: readonly,
                })
              })
            : e.lists.all,
        }),
        sectionLabel: true,
        source: '',
      }
      return (
        out.push(
          '\n    ' +
            partial(context, 'display-edit-entity') +
            '\n  </uix.SimpleFormIterator>\n</uix.ArrayInput>',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['display-edit-rel-multiple-embed']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/edit/rel-multiple-not-embed.njs', {
    alias: ['display-edit-rel-multiple-not-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        sectionLabel = ctx.sectionLabel
      ctx.readonly
      out.push(
        "<uix.FormDataConsumer>\n  {({ formData, ...rest }) => (\n    <div style={{display:'flex'}}>\n      ",
      )
      if (sectionLabel)
        out.push(
          '\n      <uix.HeaderLabel text="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '" />\n      ',
        )
      out.push(
        '\n      <uix.ReferenceArrayInput\n        {...rest}\n        label="resources.' +
          (f.inheritedFrom || entity1.name) +
          '.fields.' +
          f.name +
          '"\n        source={`' +
          source +
          f.ref.backField +
          '`}\n        ',
      )
      out.push(
        '\n        filter={' +
          (f.ref.editFilter ? f.ref.editFilter : '{}') +
          '}\n        reference="' +
          entity1.model.entityPathMapper[f.ref.entity] +
          '"\n        ',
      )
      if (f.required) out.push('validate={uix.required()}')
      else out.push('allowEmpty')
      out.push('\n      >\n    ')
      if (f.ref.autocomplete)
        out.push(
          '<uix.AutocompleteArrayInput optionText={uix.' +
            f.ref.entity +
            '.inputText } />\n    ',
        )
      else
        out.push(
          '<uix.SelectArrayInput optionText={<uix.' +
            f.ref.entity +
            '.SelectTitle />} />\n    ',
        )
      return (
        out.push(
          '</uix.ReferenceArrayInput>\n      <uix.' +
            f.ref.entity +
            ".Add {...rest} target={'" +
            f.ref.opposite +
            '\'} label="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.actions.' +
            f.name +
            '" />\n    </div>\n  )}\n</uix.FormDataConsumer>',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['display-edit-rel-multiple-not-embed']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/edit/rel-single-embed.njs', {
    alias: ['display-edit-rel-single-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        sectionLabel = ctx.sectionLabel,
        readonly = ctx.readonly,
        grid = ctx.grid,
        customizable = ctx.customizable
      var e = entity1.model.entities.find(function (e) {
        return e.name === f.ref.entity
      })
      var context = {
        entity: _objectSpreadProps(_objectSpread({}, e), {
          props: e.lists.all,
        }),
        source: source
          ? ''.concat(source).concat(f.ref.backField, '.')
          : ''.concat(f.ref.backField, '.'),
        sectionLabel: !grid && sectionLabel,
        readonly: readonly,
        customizable: customizable,
      }
      out.push('\n')
      if (customizable) out.push('\n<>\n')
      out.push('\n')
      if (sectionLabel)
        out.push(
          '\n<uix.HeaderLabel text="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '" />\n',
        )
      out.push('\n' + partial(context, 'display-edit-entity') + '\n')
      if (customizable) out.push('\n</>\n')
      return out.push(''), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-edit-rel-single-embed']
    },
    dependency: {},
  }),
  _defineProperty(
    _obj,
    'UI/forms/display/edit/rel-single-not-embed-w-preview.njs',
    {
      alias: ['display-edit-rel-single-not-embed-w-preview'],
      script: function script(ctx, _content, partial, slot, options) {
        options.escapeIt
        function content(blockName, ctx) {
          return _content(blockName, ctx, content, partial, slot)
        }
        var out = []
        var entity1 = ctx.entity,
          f = ctx.f,
          source = ctx.source,
          sectionLabel = ctx.sectionLabel,
          readonly = ctx.readonly
        out.push(
          '<uix.InputWithPreview\n  label="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '"\n  source={`' +
            source +
            f.ref.backField +
            '`}\n  reference="' +
            entity1.model.entityPathMapper[f.ref.entity] +
            '"\n  entity="' +
            f.ref.entity +
            '"\n  perPage={10000}\n',
        )
        if (f.hint)
          out.push(
            'helperText="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.helpers.' +
              f.name +
              '"\n',
          )
        else out.push('helperText={false}\n')
        out.push('\n')
        out.push(
          '\n  filter={' +
            (f.ref.editFilter ? f.ref.editFilter : '{}') +
            '}\n  Select={',
        )
        if (f.ref.autocomplete) out.push('uix.AutocompleteInput\n  ')
        else out.push('uix.SelectInput')
        out.push('}')
        if (f.required) out.push('validate={uix.required()}')
        else out.push('\n  allowEmpty')
        out.push('\n  optionText={')
        if (f.ref.autocomplete)
          out.push('uix.' + f.ref.entity + '.inputText\n  ')
        else out.push('<uix.' + f.ref.entity + '.SelectTitle />')
        out.push(
          '}\n  >\n    <uix.SimpleForm resource="' +
            entity1.model.entityPathMapper[entity1.name] +
            '">\n  ',
        )
        var e = entity1.model.entities.find(function (e) {
          return e.name === f.ref.entity
        })
        var context = {
          entity: _objectSpreadProps(_objectSpread({}, e), {
            props: e.lists.quickCreate,
          }),
          source: '',
          sectionLabel: sectionLabel,
          readonly: readonly,
        }
        return (
          out.push(
            '\n    ' +
              partial(context, 'display-edit-entity') +
              '\n    </uix.SimpleForm>\n  </uix.InputWithPreview>',
          ),
          out.join('')
        )
      },
      compile: function compile() {
        this.alias = ['display-edit-rel-single-not-embed-w-preview']
      },
      dependency: {},
    },
  ),
  _defineProperty(_obj, 'UI/forms/display/edit/rel-single-not-embed.njs', {
    alias: ['display-edit-rel-single-not-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source
      ctx.sectionLabel, ctx.readonly
      out.push(
        '<uix.ReferenceInput\n  label="resources.' +
          (f.inheritedFrom || entity1.name) +
          '.fields.' +
          f.name +
          '"\n  source={`' +
          source +
          f.ref.backField +
          '`}\n',
      )
      if (f.hint)
        out.push(
          'helperText="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.helpers.' +
            f.name +
            '"\n',
        )
      else out.push('helperText={false}\n')
      out.push('\n')
      out.push(
        '\n  filter={' +
          (f.ref.editFilter ? f.ref.editFilter : '{}') +
          '}\n  reference="' +
          entity1.model.entityPathMapper[f.ref.entity] +
          '"',
      )
      if (f.required) out.push('validate={uix.required()}')
      else out.push('\n  allowEmpty')
      out.push('\n>\n  ')
      if (f.ref.autocomplete)
        out.push(
          '<uix.AutocompleteInput optionText={uix.' +
            f.ref.entity +
            '.inputText} />\n  ',
        )
      else
        out.push(
          '<uix.SelectInput optionText={<uix.' +
            f.ref.entity +
            '.SelectTitle />} />\n  ',
        )
      return out.push('</uix.ReferenceInput>'), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-edit-rel-single-not-embed']
    },
    dependency: {},
  }),
  _defineProperty(
    _obj,
    'UI/forms/display/edit/show-rel-multiple-not-embed.njs',
    {
      alias: ['display-edit-show-rel-multiple-not-embed'],
      script: function script(ctx, _content, partial, slot, options) {
        options.escapeIt
        function content(blockName, ctx) {
          return _content(blockName, ctx, content, partial, slot)
        }
        var out = []
        var entity1 = ctx.entity,
          f = ctx.f,
          sectionLabel = (ctx.source, ctx.sectionLabel)
        ctx.readonly
        out.push(
          '<uix.FormDataConsumer>\n  {({ formData, ...rest }) => (\n  <uix.Fragment>\n    ',
        )
        if (sectionLabel)
          out.push(
            '\n    <uix.HeaderLabel text="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '" />\n    ',
          )
        out.push('\n\n    ')
        if (f.ref.using)
          out.push(
            '\n    <uix.ReferenceArrayField\n      {...rest}\n      label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '"\n      reference="' +
              entity1.model.entityPathMapper[f.ref.entity] +
              '"\n      source="' +
              f.name +
              '"\n    >\n      <uix.' +
              f.ref.entity +
              ".Grid fields={'!" +
              f.ref.opposite +
              "'}/>\n    </uix.ReferenceArrayField>\n    ",
          )
        else {
          out.push(
            '\n    <uix.ReferenceManyField\n      {...rest}\n      label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '"\n      reference="' +
              entity1.model.entityPathMapper[f.ref.entity] +
              '"\n      ',
          )
          var empty = '{}'
          out.push(
            '\n      filter={' +
              (f.ref.showFilter ? f.ref.showFilter : empty) +
              '}\n      target="' +
              f.ref.opposite +
              '"\n    >\n      <uix.' +
              (f.ref.using ? f.ref.using.entity : f.ref.entity) +
              ".Grid fields={'!" +
              f.ref.opposite +
              "'}/>\n    </uix.ReferenceManyField>\n    ",
          )
        }
        return (
          out.push(
            '\n    <uix.' +
              (f.ref.using ? f.ref.using.entity : f.ref.entity) +
              ".Add {...rest} target={'" +
              (f.ref.using ? f.ref.using.field : f.ref.opposite) +
              '\'} label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.actions.' +
              f.name +
              '"/>\n  </uix.Fragment>\n  )}\n</uix.FormDataConsumer>',
          ),
          out.join('')
        )
      },
      compile: function compile() {
        this.alias = ['display-edit-show-rel-multiple-not-embed']
      },
      dependency: {},
    },
  ),
  _defineProperty(_obj, 'UI/forms/display/filter.njs', {
    alias: ['display-filter-entity'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        label = ctx.label
      out.push('\n')
      if (f) {
        if (f.ref) {
          if (f.embedded) {
            var eEntity = entity1.model.entities.find(function (e) {
              return e.name === f.ref.entity
            })
            var _$ctx = {
              entity: _objectSpreadProps(_objectSpread({}, eEntity), {
                props: eEntity.lists.all,
              }),
              source: source
                ? ''.concat(source).concat(f.name, '.')
                : ''.concat(f.name, '.'),
              label: 'resources.'
                .concat(f.inheritedFrom || entity1.name, '.fields.')
                .concat(f.name),
            }
            out.push('\n  ' + partial(_$ctx, 'display-filter-entity') + '\n')
          } else if (!f.emdedeb && 'BelongsTo' === f.verb) {
            out.push('\n  <uix.NullableBooleanInput\n    label={`')
            if (label)
              out.push(
                "${'" + label + "'.split(' ').map(translate).join(' ')} ",
              )
            out.push(
              '${translate("uix.filter.exists",{ name: translate(\'resources.' +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '\')})}`}\n    source="' +
                source +
                f.name +
                '-exists" />\n\n    <uix.ReferenceInput\n      className={classes.formControl}\n      label={`',
            )
            if (label)
              out.push(
                "${'" + label + "'.split(' ').map(translate).join(' ')} ",
              )
            out.push(
              "${translate('uix.filter.eq', {\n        name: translate('resources." +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '\'),\n      })}`}\n      source="' +
                source +
                f.name +
                '-eq"\n      reference="' +
                entity1.model.entityPathMapper[f.ref.entity] +
                '"\n      perPage={10000}\n      allowEmpty\n    >\n    ',
            )
            if (f.ref.autocomplete)
              out.push(
                '<uix.AutocompleteInput optionText={uix.' +
                  f.ref.entity +
                  '.inputText} />\n    ',
              )
            else
              out.push(
                '<uix.SelectInput optionText={<uix.' +
                  f.ref.entity +
                  '.SelectTitle />} />\n    ',
              )
            out.push(
              '</uix.ReferenceInput>\n\n    <uix.ReferenceInput\n    className={classes.formControl}\n      label={`',
            )
            if (label)
              out.push(
                "${'" + label + "'.split(' ').map(translate).join(' ')} ",
              )
            out.push(
              "${translate('uix.filter.ne', {\n        name: translate('resources." +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '\'),\n      })}`}\n      source="' +
                source +
                f.name +
                '-ne"\n      reference="' +
                entity1.model.entityPathMapper[f.ref.entity] +
                '"\n      perPage={10000}\n      allowEmpty\n    >\n    ',
            )
            if (f.ref.autocomplete)
              out.push(
                '<uix.AutocompleteInput optionText={uix.' +
                  f.ref.entity +
                  '.inputText} />\n    ',
              )
            else
              out.push(
                '<uix.SelectInput optionText={<uix.' +
                  f.ref.entity +
                  '.SelectTitle />} />\n    ',
              )
            out.push(
              '</uix.ReferenceInput>\n\n    <uix.ReferenceInput\n      className={classes.formControl}\n      label={`',
            )
            if (label)
              out.push(
                "${'" + label + "'.split(' ').map(translate).join(' ')} ",
              )
            out.push(
              "${translate('uix.filter.in', {\n        name: translate('resources." +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '\'),\n      })}`}\n      source="' +
                source +
                f.name +
                '-in"\n      reference="' +
                entity1.model.entityPathMapper[f.ref.entity] +
                '"\n      perPage={10000}\n      allowEmpty\n    >\n    ',
            )
            if (f.ref.autocomplete)
              out.push(
                '<uix.AutocompleteArrayInput optionText={uix.' +
                  f.ref.entity +
                  '.inputText } />\n    ',
              )
            else
              out.push(
                '<uix.SelectArrayInput optionText={<uix.' +
                  f.ref.entity +
                  '.SelectTitle />} />\n    ',
              )
            out.push(
              '</uix.ReferenceInput>\n    <uix.ReferenceInput\n    className={classes.formControl}\n      label={`',
            )
            if (label)
              out.push(
                "${'" + label + "'.split(' ').map(translate).join(' ')} ",
              )
            out.push(
              "${translate('uix.filter.nin', {\n        name: translate('resources." +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '\'),\n      })}`}\n      source="' +
                source +
                f.name +
                '-nin"\n      reference="' +
                entity1.model.entityPathMapper[f.ref.entity] +
                '"\n      perPage={10000}\n      allowEmpty\n    >\n    ',
            )
            if (f.ref.autocomplete)
              out.push(
                '<uix.AutocompleteArrayInput optionText={uix.' +
                  f.ref.entity +
                  '.inputText } />\n    ',
              )
            else
              out.push(
                '<uix.SelectArrayInput optionText={<uix.' +
                  f.ref.entity +
                  '.SelectTitle />} />\n    ',
              )
            out.push('</uix.ReferenceInput>\n')
          }
        } else {
          out.push('\n')
          if (!f.calculated && 'id' !== f.name) {
            out.push('\n\n')
            switch (f.filterType) {
              case 'Number':
                out.push('\n    <uix.NumberInput\n      label={`')
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.eq", { name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-eq`}\n      allowEmpty\n    />\n    <uix.NumberInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.lte",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-lte`}\n      allowEmpty\n    />\n    <uix.NumberInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.gte", { name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-gte`}\n      allowEmpty\n    />\n    <uix.NumberInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.lt", { name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-lt`}\n      allowEmpty\n    />\n    <uix.NumberInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.gt",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-gt`}\n      allowEmpty\n    />\n\n',
                )
                break
              case 'Text':
                out.push('\n    <uix.' + f.filterType + 'Input\n      label={`')
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.imatch",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-imatch`}\n      allowEmpty\n    />\n\n',
                )
                break
              case 'ID':
                out.push('\n    <uix.TextInput\n      label={`')
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.eq",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-eq`}\n      allowEmpty\n    />\n\n',
                )
                break
              case 'Date':
                out.push('\n    <uix.DateInput\n      label={`')
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.lte",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-lte`}\n      allowEmpty\n    />\n    <uix.DateInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.gte",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-gte`}\n      allowEmpty\n    />\n\n',
                )
                break
              case 'Boolean':
                out.push('\n    <uix.BooleanInput\n      label={`')
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.eq",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-eq`}\n      allowEmpty\n    />\n    <uix.NullableBooleanInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  '${translate("uix.filter.exists",{ name: translate(\'resources.' +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "')})}`}\n      source={`" +
                    source +
                    f.name +
                    '-exists`}\n      allowEmpty\n    />\n\n',
                )
                break
              case 'Enum':
                out.push('\n      <uix.SelectInput\n      label={`')
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  "${translate('uix.filter.eq', {\n        name: translate('resources." +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "'),\n      })}`}\n      choices={uix.primitive." +
                    f.type +
                    '.choices}\n      source={`' +
                    source +
                    f.name +
                    '-eq`}\n      allowEmpty\n    />\n    <uix.SelectInput\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  "${translate('uix.filter.ne', {\n        name: translate('resources." +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "'),\n      })}`}\n      choices={uix.primitive." +
                    f.type +
                    '.choices}\n      source={`' +
                    source +
                    f.name +
                    '-ne`}\n      allowEmpty\n    />\n    <uix.SelectArrayInput\n    className={classes.formControl}\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  "${translate('uix.filter.in', {\n        name: translate('resources." +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "'),\n      })}`}\n      options={{ fullWidth: true }}\n      choices={uix.primitive." +
                    f.type +
                    '.choices}\n      source={`' +
                    source +
                    f.name +
                    '-in`}\n      allowEmpty\n    />\n    <uix.SelectArrayInput\n    className={classes.formControl}\n      label={`',
                )
                if (label)
                  out.push(
                    "${'" + label + "'.split(' ').map(translate).join(' ')} ",
                  )
                out.push(
                  "${translate('uix.filter.nin', {\n        name: translate('resources." +
                    (f.inheritedFrom || entity1.name) +
                    '.fields.' +
                    f.name +
                    "'),\n      })}`}\n      options={{ fullWidth: true }}\n      choices={uix.primitive." +
                    f.type +
                    '.choices}\n      source={`' +
                    source +
                    f.name +
                    '-nin`}\n      allowEmpty\n    />\n',
                )
            }
            out.push('\n')
          }
          out.push('\n')
        }
      } else {
        entity1.props.forEach(function (f) {
          var _ctx = _objectSpreadProps(_objectSpread({}, ctx), {
            f: f,
          })
          out.push('\n' + partial(_ctx, 'display-filter-entity') + '\n')
        })
        out.push('\n')
      }
      return out.push(''), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-filter-entity']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/show/entity.njs', {
    alias: ['display-show-entity'],
    script: function script(context, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = context
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var source = context.source,
        entity1 = context.entity,
        grid = context.grid,
        embedded = context.embedded,
        sectionLabel = context.sectionLabel,
        customizable = context.customizable
      return (
        out.push('\n'),
        entity1.props.forEach(function (f, index) {
          var ref, ref1
          var ctx = {
            entity: entity1,
            f: f,
            source: source,
            grid: grid,
            embedded: embedded,
            sectionLabel: sectionLabel,
            customizable: customizable,
          }
          var useForEmbeding =
            f.single &&
            (null == entity1
              ? void 0
              : null === (ref = entity1.UI) || void 0 === ref
                ? void 0
                : null === (ref1 = ref.embedded) || void 0 === ref1
                  ? void 0
                  : ref1.hasOwnProperty(f.name))
          out.push('\n')
          if (customizable && !useForEmbeding)
            out.push(
              "\n{ !excludedField.hasOwnProperty('" +
                source +
                f.name +
                "') && \n\n",
            )
          out.push('\n')
          if (!f.ref || f.isFile) {
            if (f.isFile) {
              if (f.isImage) ctx.f.type = 'Image'
              else ctx.f.type = 'File'
            }
            out.push('\n    ' + partial(ctx, 'display-show-field') + '\n')
          } else {
            var ref2, ref3
            var embedded1 =
              null == entity1
                ? void 0
                : null === (ref2 = entity1.UI) || void 0 === ref2
                  ? void 0
                  : null === (ref3 = ref2.embedded) || void 0 === ref3
                    ? void 0
                    : ref3.hasOwnProperty(f.name)
            out.push('\n  ')
            if (f.single) {
              out.push('\n    ')
              if (embedded1)
                out.push(
                  '\n  \n      ' +
                    partial(ctx, 'display-show-rel-single-embed') +
                    '\n    ',
                )
              else {
                out.push('\n      ')
                f.ref.stored,
                  out.push(
                    '\n        ' +
                      partial(ctx, 'display-show-rel-single-not-embed') +
                      '\n      ',
                  )
                out.push('\n    ')
              }
              out.push('\n  ')
            } else {
              out.push('\n    ')
              if (embedded1)
                out.push(
                  '\n      ' +
                    partial(ctx, 'display-show-rel-multiple-embed') +
                    '\n      ',
                )
              else {
                out.push('\n      ')
                if (
                  'BelongsToMany' !== f.verb ||
                  ('BelongsToMany' === f.verb && f.ref.using)
                )
                  out.push(
                    '\n        ' +
                      partial(ctx, 'display-show-rel-multiple-not-embed') +
                      '\n        ',
                  )
                else
                  out.push(
                    '\n        ' +
                      partial(
                        ctx,
                        'display-show-rel-multiple-not-embed-stored',
                      ) +
                      '\n      ',
                  )
                out.push('\n    ')
              }
              out.push('\n  ')
            }
            out.push('\n')
          }
          out.push('\n')
          if (customizable && !useForEmbeding) out.push('\n}\n')
          out.push('\n')
        }),
        out.push(''),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['display-show-entity']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/show/field.njs', {
    alias: ['display-show-field'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        grid = ctx.grid,
        embedded = ctx.embedded
      out.push(
        '<uix.primitive.' +
          f.type +
          '.Field \n  label="resources.' +
          (f.inheritedFrom || entity1.name) +
          '.fields.' +
          f.name +
          '" \n  source={`' +
          source +
          f.name,
      )
      if (f.isFile) out.push('.src')
      out.push('`}\n  ')
      if (grid && embedded) out.push('sortable={false}')
      out.push('\n')
      if (f.isFile) out.push('title={`' + source + f.name + '.name`}')
      return out.push('\n/>'), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-show-field']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/show/rel-multiple-embed.njs', {
    alias: ['display-show-rel-multiple-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        sectionLabel = (ctx.embedded, ctx.sectionLabel),
        grid = ctx.grid,
        customizable = ctx.customizable
      if (sectionLabel && customizable) out.push('\n<>\n')
      out.push('\n')
      if (sectionLabel)
        out.push(
          '\n<uix.HeaderLabel text="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '" />\n',
        )
      out.push('\n<uix.ArrayField\n')
      if (sectionLabel) out.push('\n  addLabel={false}\n')
      else
        out.push(
          '\n  label="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '"\n',
        )
      out.push('\n  source={`' + source + f.ref.backField + '`}\n  >\n')
      var e = entity1.model.entities.find(function (e) {
        return e.name === f.ref.entity
      })
      var context = {
        entity: _objectSpreadProps(_objectSpread({}, e), {
          props: e.lists.all.filter(function (fl) {
            return fl.name !== f.name
          }),
        }),
        source: '',
        grid: true,
        embedded: f.embedded,
        sectionLabel: !grid && sectionLabel,
      }
      out.push('\n  <uix.Datagrid {...props} ')
      if (!e.embedded) out.push('rowClick="edit"')
      out.push(' >\n    ' + partial(context, 'display-show-entity') + '\n    ')
      e.actions.forEach(function (action) {
        out.push(
          '\n        <uix.' + e.name + '.' + action.fullName + ' />\n    ',
        )
      })
      out.push('\n')
      if (!(e.embedded || e.abstract))
        out.push(
          '\n    <uix.ShowButton label="" />\n    <uix.CloneButton label="" />\n',
        )
      out.push('\n  </uix.Datagrid>\n</uix.ArrayField>\n')
      if (sectionLabel && customizable) out.push('\n</>\n')
      return out.push(''), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-show-rel-multiple-embed']
    },
    dependency: {},
  }),
  _defineProperty(
    _obj,
    'UI/forms/display/show/rel-multiple-not-embed-stored.njs',
    {
      alias: ['display-show-rel-multiple-not-embed-stored'],
      script: function script(ctx, _content, partial, slot, options) {
        options.escapeIt
        function content(blockName, ctx) {
          return _content(blockName, ctx, content, partial, slot)
        }
        var out = []
        var entity1 = ctx.entity,
          f = ctx.f,
          source = ctx.source,
          sectionLabel = ctx.sectionLabel,
          customizable = ctx.customizable
        if (sectionLabel && customizable) out.push('\n<>\n')
        out.push('\n')
        if (sectionLabel)
          out.push(
            '\n<uix.HeaderLabel text="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '" />\n',
          )
        out.push('\n<uix.ReferenceArrayField\n')
        if (sectionLabel) out.push('\n  addLabel={false}\n')
        else
          out.push(
            '\n  label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '"\n',
          )
        out.push(
          '\n  reference="' +
            entity1.model.entityPathMapper[
              'BelongsToMany' === f.verb && f.ref.using
                ? f.ref.using.entity
                : f.ref.entity
            ] +
            '"\n',
        )
        out.push(
          '\n  filter={' +
            (f.ref.showFilter ? f.ref.showFilter : '{}') +
            '}\n  source={`' +
            source +
            f.ref.backField +
            '`}\n>\n  <uix.' +
            ('BelongsToMany' === f.verb && f.ref.using
              ? f.ref.using.entity
              : f.ref.entity) +
            ".Grid fields={'!" +
            f.name +
            "'}/>\n</uix.ReferenceArrayField>\n",
        )
        if (sectionLabel && customizable) out.push('\n</>\n')
        return out.push(''), out.join('')
      },
      compile: function compile() {
        this.alias = ['display-show-rel-multiple-not-embed-stored']
      },
      dependency: {},
    },
  ),
  _defineProperty(_obj, 'UI/forms/display/show/rel-multiple-not-embed.njs', {
    alias: ['display-show-rel-multiple-not-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        sectionLabel = (ctx.source, ctx.sectionLabel),
        customizable = ctx.customizable
      if (sectionLabel && customizable) out.push('\n<>\n')
      out.push('\n')
      if (sectionLabel)
        out.push(
          '\n<uix.HeaderLabel text="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '" />\n',
        )
      out.push('\n')
      if (f.ref.using) {
        out.push('\n<uix.ReferenceArrayField\n  ')
        if (sectionLabel) out.push('\n    addLabel={false}\n  ')
        else
          out.push(
            '\n    label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '"\n  ',
          )
        out.push(
          '\n  reference="' +
            entity1.model.entityPathMapper[f.ref.entity] +
            '"\n  source="' +
            f.name +
            '"\n>\n  <uix.' +
            f.ref.entity +
            '.Grid/>\n</uix.ReferenceArrayField>\n',
        )
      } else {
        out.push('\n<uix.ReferenceManyField\n  ')
        if (sectionLabel) out.push('\n    addLabel={false}\n  ')
        else
          out.push(
            '\n    label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '"\n  ',
          )
        out.push(
          '\n  reference="' +
            entity1.model.entityPathMapper[f.ref.entity] +
            '"\n',
        )
        var empty = '{}'
        out.push(
          '\n  filter={' +
            (f.ref.showFilter ? f.ref.showFilter : empty) +
            '}\n  target="' +
            f.ref.opposite +
            '"\n>\n  <uix.' +
            (f.ref.using ? f.ref.using.entity : f.ref.entity) +
            ".Grid fields={'!" +
            f.ref.opposite +
            "'}/>\n</uix.ReferenceManyField>\n",
        )
      }
      out.push('\n')
      if (sectionLabel && customizable) out.push('\n</>\n')
      return out.push(''), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-show-rel-multiple-not-embed']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/show/rel-single-embed.njs', {
    alias: ['display-show-rel-single-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        grid = ctx.grid,
        embedded = ctx.embedded,
        sectionLabel = ctx.sectionLabel,
        customizable = ctx.customizable
      var e = entity1.model.entities.find(function (e) {
        return e.name === f.ref.entity
      })
      var context = {
        entity: _objectSpreadProps(_objectSpread({}, e), {
          props: e.lists.all.filter(function (fl) {
            return fl.name !== f.name
          }),
        }),
        source: source
          ? ''.concat(source).concat(f.name, '.')
          : ''.concat(f.name, '.'),
        grid: grid,
        embedded: embedded,
        sectionLabel: !grid && sectionLabel,
        customizable: customizable,
      }
      out.push('\n')
      if (sectionLabel)
        out.push(
          '\n<uix.HeaderLabel text="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '" />\n',
        )
      return (
        out.push('\n' + partial(context, 'display-show-entity') + '\n\n'),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['display-show-rel-single-embed']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/display/show/rel-single-not-embed.njs', {
    alias: ['display-show-rel-single-not-embed'],
    script: function script(ctx, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var entity1 = ctx.entity,
        f = ctx.f,
        source = ctx.source,
        sectionLabel = ctx.sectionLabel,
        customizable = ctx.customizable
      if (sectionLabel && customizable) out.push('\n<>\n')
      out.push('\n')
      if (sectionLabel)
        out.push(
          '\n<uix.HeaderLabel text="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '" />\n',
        )
      out.push('\n<uix.ReferenceField\n\n')
      if (sectionLabel) out.push('\n  addLabel={false}\n')
      else
        out.push(
          '\n  label="resources.' +
            (f.inheritedFrom || entity1.name) +
            '.fields.' +
            f.name +
            '"\n',
        )
      out.push('\n  source={`' + source + f.ref.backField + '`}\n')
      out.push(
        '\n  filter={' +
          (f.ref.showFilter ? f.ref.showFilter : '{}') +
          '}\n  reference="' +
          entity1.model.entityPathMapper[f.ref.entity] +
          '"\n  link="show"\n>\n  <uix.' +
          f.ref.entity +
          '.SelectTitle />\n</uix.ReferenceField>\n',
      )
      if (sectionLabel && customizable) out.push('\n</>\n')
      return out.push(''), out.join('')
    },
    compile: function compile() {
      this.alias = ['display-show-rel-single-not-embed']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/filter.njs', {
    alias: ['forms-filter'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push(
        "import React, { useContext } from \"react\";\nimport { withStyles } from '@material-ui/core/styles';\nimport styles from './styles';\n\nimport { UIXContext } from '../contexts';\nimport { useTranslate } from 'react-admin';\n\nconst FilterPanel = ({ classes, ...props }) => {\n  const uix = useContext(UIXContext);\n  const translate = useTranslate();\n  return (\n  <uix.Filter {...props} >",
      )
      if (entity1.UI.quickSearch)
        out.push(
          '\n    <uix.TextInput label="uix.filter.search" source="q" allowEmpty alwaysOn />\n',
        )
      return (
        out.push('\n\n '),
        entity1.lists.all.forEach(function (f, index) {
          out.push(
            '\n  ' +
              partial(
                {
                  entity: entity1,
                  f: f,
                  source: '',
                  label: '',
                },
                'display-filter-entity',
              ) +
              '\n',
          )
        }),
        out.push(
          '\n  </uix.Filter>\n  );\n}\n\nexport default withStyles(styles)(FilterPanel);',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-filter']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/form-fragment.njs', {
    alias: ['forms-form-fragments'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      entity1.props
        .filter(function (f) {
          return f.ref
        })
        .filter(function (r) {
          return !r.single && !r.ref.embedded
        })
      out.push(
        "\n\nimport React, { useContext } from 'react';\nimport PropTypes from 'prop-types';\nimport { useLocation } from 'react-router';\nimport { Link } from 'react-router-dom';\nimport AddIcon from '@material-ui/icons/Add';\nimport { UIXContext } from '../contexts';\nimport useListParams from 'ra-core/lib/controller/useListParams';\n\n",
      )
      if (entity1.actions.length > 0)
        out.push(
          "\nimport { connect } from 'react-redux';\nimport ExecuteActionIcon from '@material-ui/icons/Settings';\n",
        )
      return (
        out.push(
          '\n\n// action definitions\n' +
            content('actions') +
            '\n\n// rel buttons\n' +
            content('add-buttons'),
        ),
        out.join('')
      )
    },
    blocks: {
      actions: function (context, _content, partial, slot, options) {
        options.escapeIt
        function content(blockName, ctx) {
          if (null == ctx) ctx = context
          return _content(blockName, ctx, content, partial, slot)
        }
        var out = []
        return (
          entity.actions.forEach(function (action) {
            out.push(
              '\nexport const ' +
                action.actionName +
                " = '" +
                action.actionName +
                "';\nexport const " +
                action.actionCreatorName +
                ' = (data) => ({\n  type: ' +
                action.actionName +
                ",\n  payload: { data, resource: '" +
                entity.model.entityPathMapper[entity.name] +
                "' },\n  // dataProvider hack\n  meta: { fetch: 'EXECUTE', resource: '" +
                action.actionCreatorName +
                "' },\n});\n\n/**\n  // define this method in dataProvider to use this\n  async function " +
                action.actionCreatorName +
                '(data, resource){\n\n  }\n*/\n\nconst ' +
                action.fullName +
                'Action  = ({ ' +
                action.actionCreatorName +
                ', record, selectedIds, children }) => {\n  const uix = useContext(UIXContext);\n  return (\n  <uix.Button onClick={() =>\n    ' +
                action.actionCreatorName +
                '({record, selectedIds})\n  }\n  label="resources.' +
                entity.name +
                '.actions.' +
                action.name +
                '"\n  >\n    {children ? children : (<ExecuteActionIcon/>)}\n  </uix.Button>);}\n\n\n' +
                action.fullName +
                'Action.propTypes = {\n  ' +
                action.actionCreatorName +
                ': PropTypes.func.isRequired,\n  record: PropTypes.object,\n};\n\n\nexport const ' +
                action.fullName +
                'Button = connect(null, {\n  ' +
                action.actionCreatorName +
                ',\n})(' +
                action.fullName +
                'Action);\n',
            )
          }),
          out.push('\n\nexport const actions = {\n'),
          entity.actions.forEach(function (action) {
            out.push(
              '\n  ' +
                action.name +
                ":{\n    type:'" +
                action.actionType +
                "',\n    creator: " +
                action.actionCreatorName +
                ',\n    action: ' +
                action.actionName +
                ',\n    button: ' +
                action.fullName +
                'Button,\n  },\n',
            )
          }),
          out.push('\n}'),
          out.join('')
        )
      },
      'add-buttons': function (entity1, _content, partial, slot, options) {
        options.escapeIt
        function content(blockName, ctx) {
          if (null == ctx) ctx = entity1
          return _content(blockName, ctx, content, partial, slot)
        }
        var out = []
        return (
          out.push(
            'const Add' +
              entity1.name +
              ' = ({ record, target, label, children }) => {\n  const location = useLocation()\n  const uix = useContext(UIXContext);\n  const to = {\n    pathname: `/' +
              entity1.model.entityPathMapper[entity1.name] +
              '/create`,\n  };\n\n  to.state = { pathname: location.pathname };\n  const newRecord = target && record && record.id ? { [target]: record.id } : undefined;\n  if (newRecord) {\n    to.state.record = newRecord;\n  }\n  return (\n    <uix.Button\n      component={Link}\n      to={to}\n      label={label}>\n      {children || <AddIcon/>}\n    </uix.Button>\n  );\n};\n\nAdd' +
              entity1.name +
              '.propTypes = {\n  record: PropTypes.object,\n  target: PropTypes.string.isRequired,\n  label: PropTypes.string.isRequired,\n}\n\nconst Create' +
              entity1.name +
              "Button = ({ resource, label, children }) => {\n  const location = useLocation()\n  const uix = useContext(UIXContext);\n  const [{ filterValues }] = useListParams({ resource, location });\n  const record = filterValues\n    ? Object.keys(filterValues).reduce((rec, fld) => {\n        if (fld.match(/-eq/)) {\n          rec[fld.split('-')[0]] = filterValues[fld];\n        }\n        return rec;\n      }, {})\n    : undefined;\n  const to = {\n    pathname: `/" +
              entity1.model.entityPathMapper[entity1.name] +
              '/create`,\n  };\n  to.state = { pathname: location.pathname };\n  if (record) {\n    to.state.record = record;\n  }\n  return (\n    <uix.Button component={Link} to={to} label={label}>\n      {children || <AddIcon />}\n    </uix.Button>\n  );\n};\n\nCreate' +
              entity1.name +
              'Button.propTypes = {\n  label: PropTypes.string.isRequired,\n};\n\nexport const buttons = {\n  Add: Add' +
              entity1.name +
              ',\n  CreateButton: Create' +
              entity1.name +
              'Button,\n  ',
          ),
          entity1.actions.forEach(function (action) {
            out.push(
              '\n  ' + action.fullName + ': ' + action.fullName + 'Button,',
            )
          }),
          out.push('\n}'),
          out.join('')
        )
      },
    },
    compile: function compile() {
      this.alias = ['forms-form-fragments']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/form.njs', {
    alias: ['forms-form'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      entity1.props
        .filter(function (f) {
          return f.ref
        })
        .filter(function (r) {
          return !r.single && !r.ref.embedded
        })
      out.push('\n')
      var btRels = entity1.props
        .filter(function (f) {
          return f.ref
        })
        .filter(function (r) {
          return 'BelongsTo' === r.verb
        })
      out.push(
        '\n\nimport React, { useContext } from "react";\nimport { UIXContext } from \'../contexts\';\nconst CreateFormToolbar = (props) => {\n    const uix = useContext(UIXContext);\n    return (\n      <uix.Toolbar {...props}>\n        <uix.SaveButton/>\n        <uix.SaveButton\n          label="uix.actions.create_and_add"\n          redirect={false}\n          submitOnEnter={false}\n          variant="text"\n        />\n      </uix.Toolbar>\n    );\n  }\n\nconst EditSimple' +
          entity1.name +
          'Actions = ({ basePath, data }) => {\n  const uix = useContext(UIXContext);\n    return (\n    <uix.TopToolbar>\n  ',
      )
      entity1.actions.forEach(function (action) {
        out.push(
          '\n      <uix.' +
            entity1.name +
            '.' +
            action.fullName +
            ' record={data}/>\n  ',
        )
      })
      out.push(
        '\n      <uix.ShowButton record={data} basePath={basePath} />\n    </uix.TopToolbar>\n  );\n}\n\nconst EditTabbed' +
          entity1.name +
          'Actions = ({ basePath, data }) => {\n  const uix = useContext(UIXContext);\n  return (\n    <uix.TopToolbar>\n  ',
      )
      entity1.actions.forEach(function (action) {
        out.push(
          '\n      <uix.' +
            entity1.name +
            '.' +
            action.fullName +
            ' record={data} />\n  ',
        )
      })
      out.push(
        '\n      <uix.ShowButton record={data} basePath={basePath} />\n    </uix.TopToolbar>\n  );\n}\n\nconst ShowSimple' +
          entity1.name +
          'Actions = ({ basePath, data }) => {\n  const uix = useContext(UIXContext);\n  return (\n    <uix.TopToolbar>\n  ',
      )
      entity1.actions.forEach(function (action) {
        out.push(
          '\n      <uix.' +
            entity1.name +
            '.' +
            action.fullName +
            ' record={data}/>\n  ',
        )
      })
      out.push(
        '\n      <uix.EditButton record={data} basePath={basePath} />\n    </uix.TopToolbar>\n  );\n}\n\nconst ShowTabbed' +
          entity1.name +
          'Actions = ({ basePath, data }) => {\n  const uix = useContext(UIXContext);\n  return (\n  <uix.TopToolbar>\n',
      )
      entity1.actions.forEach(function (action) {
        out.push(
          '\n    <uix.' +
            entity1.name +
            '.' +
            action.fullName +
            ' record={data}/>\n',
        )
      })
      out.push(
        '\n    <uix.EditButton record={data} basePath={basePath} />\n  </uix.TopToolbar>\n);}\n\nexport const SimpleForm = (props)=>{\n  const uix = useContext(UIXContext);\n  return (\n    <uix.SimpleForm {...props}>\n      <uix.HeaderLabel text="resources.' +
          entity1.name +
          '.summary" />\n      ' +
          partial(
            {
              entity: _objectSpreadProps(_objectSpread({}, entity1), {
                props: entity1.lists.all,
              }),
              source: '',
              sectionLabel: true,
              grid: false,
            },
            'display-edit-entity',
          ) +
          '\n    </uix.SimpleForm>\n  )\n}\n\nexport const CreateFormSimple = (props) => {\n  const uix = useContext(UIXContext);\n  ' +
          content('init-record', btRels) +
          '\n  return (\n  <uix.Create {...props} >\n    <uix.' +
          entity1.name +
          '.SimpleForm toolbar={<CreateFormToolbar />}\n    ',
      )
      if (btRels.length > 0) out.push(' redirect={redirect} ')
      out.push(
        '\n    />\n  </uix.Create >\n  );\n};\n\nexport const EditFormSimple = (props) => {\n  const uix = useContext(UIXContext);\n  return (\n  <uix.Edit title={<uix.' +
          entity1.name +
          '.Title />} {...props} actions={<EditSimple' +
          entity1.name +
          'Actions />} >\n    <uix.' +
          entity1.name +
          '.SimpleForm/>\n  </uix.Edit >\n  );\n};\n\nexport const TabbedForm = (props) =>{\n  const uix = useContext(UIXContext);\n  return (\n    <uix.TabbedForm {...props}>\n      <uix.FormTab label="resources.' +
          entity1.name +
          '.summary">\n      ' +
          partial(
            {
              entity: _objectSpreadProps(_objectSpread({}, entity1), {
                props: entity1.lists.summary,
              }),
              source: '',
              sectionLabel: false,
              grid: false,
            },
            'display-edit-entity',
          ) +
          '\n      </uix.FormTab>',
      )
      entity1.props
        .filter(function (f) {
          return f.ref
        })
        .filter(function (f) {
          return (
            (entity1.UI.edit[f.name] ||
              entity1.UI.list[f.name] ||
              entity1.UI.show[f.name]) &&
            false !== entity1.UI.edit[f.name]
          )
        })
        .forEach(function (f) {
          var ref, ref1
          var embedded =
            null == entity1
              ? void 0
              : null === (ref = entity1.UI) || void 0 === ref
                ? void 0
                : null === (ref1 = ref.embedded) || void 0 === ref1
                  ? void 0
                  : ref1.hasOwnProperty(f.name)
          if (f.single && !embedded) return
          out.push(
            '\n      <uix.FormTab label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '" path="' +
              f.name +
              '">\n        ' +
              partial(
                {
                  entity: _objectSpreadProps(_objectSpread({}, entity1), {
                    props: entity1.props.filter(function (fl) {
                      return fl.name === f.name
                    }),
                  }),
                  source: '',
                  sectionLabel: false,
                  grid: false,
                },
                'display-edit-entity',
              ) +
              '\n      </uix.FormTab>',
          )
        })
      out.push(
        '\n    </uix.TabbedForm>\n  )\n}\n\n// tabbed forms\nexport const CreateFormTabbed = (props) => {\n  const uix = useContext(UIXContext);\n ' +
          content('init-record', btRels) +
          '\n  return (\n  <uix.Create {...props} >\n    <uix.' +
          entity1.name +
          '.TabbedForm toolbar={<CreateFormToolbar />}\n     ',
      )
      if (btRels.length > 0) out.push(' redirect={redirect} ')
      return (
        out.push(
          '/>\n  </uix.Create >\n  );\n};\n\nexport const EditFormTabbed = (props) => {\n  const uix = useContext(UIXContext);\n  return (\n  <uix.Edit title={<uix.' +
            entity1.name +
            '.Title />} {...props} actions={<EditTabbed' +
            entity1.name +
            'Actions />}>\n    <uix.' +
            entity1.name +
            '.TabbedForm />\n  </uix.Edit >\n  );\n};\n\nexport const ShowSimpleView = (props) => {\n  const uix = useContext(UIXContext);\n  return (\n    <uix.Show title={<uix.' +
            entity1.name +
            '.Title />} {...props} actions={<ShowSimple' +
            entity1.name +
            'Actions />}>\n      <uix.SimpleShowLayout>\n      <uix.HeaderLabel text="resources.' +
            entity1.name +
            '.summary" />\n      ' +
            partial(
              {
                entity: _objectSpreadProps(_objectSpread({}, entity1), {
                  props: entity1.lists.all,
                }),
                source: '',
                sectionLabel: true,
                grid: false,
              },
              'display-show-entity',
            ) +
            '\n      </uix.SimpleShowLayout>\n    </uix.Show>\n  );\n};\n\nexport const ShowTabbedView = (props) => {\n  const uix = useContext(UIXContext);\n\n  return (\n    <uix.Show title={<uix.' +
            entity1.name +
            '.Title />} {...props} actions={<ShowTabbed' +
            entity1.name +
            'Actions />}>\n      <uix.TabbedShowLayout>\n        <uix.Tab label="resources.' +
            entity1.name +
            '.summary">\n          ' +
            partial(
              {
                entity: _objectSpreadProps(_objectSpread({}, entity1), {
                  props: entity1.lists.summary,
                }),
                source: '',
                sectionLabel: false,
                grid: false,
              },
              'display-show-entity',
            ) +
            '\n        </uix.Tab>',
        ),
        entity1.props
          .filter(function (f) {
            return f.ref
          })
          .filter(function (f) {
            return (
              (entity1.UI.edit[f.name] ||
                entity1.UI.list[f.name] ||
                entity1.UI.show[f.name]) &&
              false !== entity1.UI.edit[f.name]
            )
          })
          .forEach(function (f) {
            var ref, ref1
            var embedded =
              null == entity1
                ? void 0
                : null === (ref = entity1.UI) || void 0 === ref
                  ? void 0
                  : null === (ref1 = ref.embedded) || void 0 === ref1
                    ? void 0
                    : ref1.hasOwnProperty(f.name)
            if (f.single && !embedded) return
            out.push(
              '\n        <uix.Tab label="resources.' +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '" path="' +
                f.name +
                '">\n          ' +
                partial(
                  {
                    entity: _objectSpreadProps(_objectSpread({}, entity1), {
                      props: entity1.props.filter(function (fl) {
                        return fl.name === f.name
                      }),
                    }),
                    source: '',
                    emdedded: true,
                    sectionLabel: false,
                    grid: false,
                  },
                  'display-show-entity',
                ) +
                '\n        </uix.Tab>',
            )
          }),
        out.push(
          '\n      </uix.TabbedShowLayout>\n    </uix.Show>\n  );\n};\n',
        ),
        out.join('')
      )
    },
    blocks: {
      'init-record': function (btRels, _content, partial, slot, options) {
        options.escapeIt
        function content(blockName, ctx) {
          if (null == ctx) ctx = btRels
          return _content(blockName, ctx, content, partial, slot)
        }
        var out = []
        if (btRels.length > 0)
          out.push(
            "\n  let redirect = 'edit';\n  if(props.location && props.location.state && props.location.state.pathname){\n    redirect =  props.location.state.pathname;\n  }\n",
          )
        return out.join('')
      },
    },
    compile: function compile() {
      this.alias = ['forms-form']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/grid-card.njs', {
    alias: ['grid-card'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push(
        "import React, { useContext } from 'react'\nimport Card from '@material-ui/core/Card';\nimport CardActions from '@material-ui/core/CardActions';\nimport CardContent from '@material-ui/core/CardContent';\nimport CardHeader from '@material-ui/core/CardHeader';\nimport { useTranslate } from 'react-admin';\n\nimport { UIXContext } from '../contexts';\nimport { prepareExcludeList } from '../';\n\nconst cardStyle = {\n  margin: '0.5rem',\n  display: 'inline-block',\n  verticalAlign: 'top',\n};\n\nconst Label = ({ label }) => {\n  const translate = useTranslate();\n  return (\n  <label>{translate(label)}:&nbsp;</label>\n);}\n\nconst CardView = ({ ids, data, basePath, fields }) => {\n  const uix = useContext(UIXContext);\n\n  const excludedField = prepareExcludeList(fields)\n  return (\n  <div style={{ margin: '1em' }}>\n    { ids.length > 0 ? (\n      ids.map(id => (\n        <Card key={id} style={cardStyle}>\n          <CardHeader title={<uix." +
          entity1.name +
          '.SelectTitle record={data[id]} />} />\n          <CardContent>\n            <div>',
      )
      entity1.props
        .filter(function (f) {
          return !f.ref && 'id' !== f.name
        })
        .filter(function (f) {
          return entity1.UI.list[f.name]
        })
        .forEach(function (f) {
          out.push(
            "\n              {!excludedField.hasOwnProperty('" +
              f.name +
              '\') && <div>\n                <Label label="resources.' +
              (f.inheritedFrom || entity1.name) +
              '.fields.' +
              f.name +
              '" />\n                <uix.primitive.' +
              f.type +
              '.Field record={data[id]} source="' +
              f.name +
              '" />\n              </div>}\n',
          )
        })
      entity1.props
        .filter(function (f) {
          return f.ref
        })
        .filter(function (f) {
          return entity1.UI.list[f.name]
        })
        .forEach(function (f) {
          if (f.single && !f.ref.embedded) {
            out.push(
              "{!excludedField.hasOwnProperty('" +
                f.name +
                '\') && <div>\n                <Label label="resources.' +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '" />\n                <uix.ReferenceField basePath="/' +
                entity1.model.entityPathMapper[f.ref.entity] +
                '" record={data[id]} label="resources.' +
                (f.inheritedFrom || entity1.name) +
                '.fields.' +
                f.name +
                '" sortable={false} source="' +
                f.name +
                '" reference="' +
                entity1.model.entityPathMapper[f.ref.entity] +
                '"',
            )
            if (!f.required) out.push(' allowEmpty ')
            out.push(
              '>\n                  <uix.' +
                f.ref.entity +
                '.SelectTitle />\n                </uix.ReferenceField>\n              </div>}\n',
            )
          }
        })
      out.push(
        "\n            </div>\n          </CardContent>\n          <CardActions style={{ textAlign: 'right' }}>\n          ",
      )
      entity1.actions.forEach(function (action) {
        out.push(
          '\n              <uix.' +
            entity1.name +
            '.' +
            action.fullName +
            ' record={data}/>\n          ',
        )
      })
      out.push('\n')
      if (!(entity1.embedded || entity1.abstract))
        out.push(
          '\n            <uix.EditButton\n              resource="' +
            entity1.model.entityPathMapper[entity1.name] +
            '"\n              basePath="/' +
            entity1.model.entityPathMapper[entity1.name] +
            '"\n              record={data[id]}\n            />\n            <uix.ShowButton\n              resource="' +
            entity1.model.entityPathMapper[entity1.name] +
            '"\n              basePath="/' +
            entity1.model.entityPathMapper[entity1.name] +
            '"\n              record={data[id]}\n            />\n            <uix.CloneButton\n              resource="' +
            entity1.model.entityPathMapper[entity1.name] +
            '"            \n              basePath="/' +
            entity1.model.entityPathMapper[entity1.name] +
            '"\n              record={data[id]}\n            />\n            <uix.DeleteButton\n              resource="' +
            entity1.model.entityPathMapper[entity1.name] +
            '"            \n              basePath="/' +
            entity1.model.entityPathMapper[entity1.name] +
            '"\n              record={data[id]}\n            />\n',
        )
      return (
        out.push(
          "\n          </CardActions>\n        </Card>\n      ))\n    ) : (\n      <div style={{ height: '10vh' }} />\n    )}\n  </div>\n);\n}\n\nCardView.defaultProps = {\n  data: {},\n  ids: [],\n};\n\nexport default CardView;",
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['grid-card']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/grid-list.njs', {
    alias: ['forms-grid-list'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      return (
        out.push(
          "import React, { useContext } from 'react';\nimport { UIXContext } from '../contexts';\n\nconst SmallList = (props) => {\n   const uix = useContext(UIXContext);\n  return (\n  <uix.SimpleList {...props} primaryText={record =>",
        ),
        entity1.UI.listName.forEach(function (ln) {
          out.push('record.' + ln + ' ||')
        }),
        out.push('record.id } />\n);}\n\nexport default SmallList;\n'),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-grid-list']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/grid-view.njs', {
    alias: ['forms-grid-view'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push(
        "import React, { useContext } from \"react\";\nimport { UIXContext } from '../contexts';\nimport { prepareExcludeList } from '../';\n// import { useTranslate } from 'react-admin';\n\nconst Grid = ({ fields, ...props }) => {\n  const uix = useContext(UIXContext);\n  const excludedField = prepareExcludeList(fields)\n  // const translate = useTranslate();\n  return (\n  <uix.Datagrid {...props} ",
      )
      if (!entity1.embedded) out.push('rowClick="edit"')
      out.push(' >\n   ')
      var list = entity1.embedded || entity1.abstract ? 'all' : 'list'
      var ctx = {
        entity: _objectSpreadProps(_objectSpread({}, entity1), {
          props: entity1.lists[list],
          sectionLabel: false,
          grid: true,
        }),
        source: '',
        customizable: true,
      }
      out.push('\n\n      ' + partial(ctx, 'display-show-entity') + '\n\n')
      entity1.actions.forEach(function (action) {
        out.push('\n    <uix.' + entity1.name + '.' + action.fullName + ' />\n')
      })
      out.push('\n\n')
      if (!(entity1.embedded || entity1.abstract))
        out.push(
          '\n    <uix.ShowButton label="" />\n    <uix.CloneButton label="" />\n',
        )
      return (
        out.push('\n  </uix.Datagrid>\n);}\n\nexport default Grid;'),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-grid-view']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/grid.njs', {
    alias: ['forms-grid'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      return (
        out.push(
          "import React, { useContext } from \"react\";\nimport { UIXContext } from '../contexts';\nimport useMediaQuery from '@material-ui/core/useMediaQuery';\n\nconst Grid = ({fields, ...props}) =>  {\n  const { filterValues } = props;\n  const filteredFields = filterValues\n    ? Object.keys(filterValues).reduce((list, fld) => {\n        if (fld.match(/-eq/)) {\n          list.push(`!${fld.split('-')[0]}`);\n        }\n        return list;\n      }, [])\n    : undefined;\n  const uix = useContext(UIXContext);\n  const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));\n  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n  // const Result = isXSmall\n  //   ? uix." +
            entity1.name +
            '.ListView \n  //   : isSmall \n  //   ? uix.' +
            entity1.name +
            '.CardView \n  //   : uix.' +
            entity1.name +
            '.GridView\n\n  const Result = uix.' +
            entity1.name +
            '.GridView\n\n  return (\n    <Result\n      {...props}\n      fields={fields ? fields.concat(filteredFields) : filteredFields}\n    />\n  );\n}\n\nexport default Grid;',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-grid']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/i18n.njs', {
    alias: ['forms-i18n'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var rels = entity1.props
        .filter(function (f) {
          return f.ref
        })
        .filter(function (r) {
          return !r.single && !r.ref.embedded
        })
      out.push(
        '\n\nexport default {\n  resources: {\n    ' +
          entity1.name +
          ": {\n      summary: '" +
          (entity1.UI.generalTab || 'Общая информация') +
          "',\n      name: '" +
          entity1.title +
          ' |||| ' +
          (entity1.titlePlural || entity1.plural) +
          "',\n      fields: {\n\n",
      )
      entity1.props.forEach(function (f) {
        if (f.ref || f.inheritedFrom) {
          if (f.ref && !f.inheritedFrom)
            out.push(f.name + ": '" + f.label + "',\n")
        } else out.push(f.name + ": '" + f.label + "',\n")
      })
      out.push('},\n')
      var hintList = entity1.props.filter(function (f) {
        return f.hint
      })
      if (hintList.length > 0) {
        out.push('helpers:{\n')
        entity1.props
          .filter(function (f) {
            return f.hint
          })
          .forEach(function (f) {
            if (f.ref || f.inheritedFrom) {
              if (f.ref && !f.inheritedFrom)
                out.push(f.name + ": '" + f.hint + "',\n")
            } else out.push(f.name + ": '" + f.hint + "',\n")
          })
        out.push('},\n')
      }
      if (entity1.actions.length > 0 || rels.length > 0) {
        out.push('actions:{\n')
        entity1.actions.forEach(function (action) {
          out.push('\n        ' + action.name + ": '" + action.title + "',")
        })
        out.push('\n')
        rels.forEach(function (rel) {
          var ref, ref1, ref2
          out.push(
            '\n  ' +
              rel.name +
              ": '" +
              ((null == rel
                ? void 0
                : null === (ref = rel.metadata) || void 0 === ref
                  ? void 0
                  : null === (ref1 = ref.UI) || void 0 === ref1
                    ? void 0
                    : null === (ref2 = ref1.actions) || void 0 === ref2
                      ? void 0
                      : ref2.add) || rel.label) +
              "',",
          )
        })
        out.push('\n      },\n')
      }
      return out.push('}\n  },\n}'), out.join('')
    },
    compile: function compile() {
      this.alias = ['forms-i18n']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/index.njs', {
    alias: ['forms-index'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      return (
        out.push(
          "import React, { useContext } from 'react';\nimport useMediaQuery from '@material-ui/core/useMediaQuery';\nimport Title  from './title';\nimport SelectTitle, { inputText }  from './selectTitle';\nimport Filter  from './filter';\nimport { buttons, actions }  from './fragments';\nimport {\n  CreateFormSimple,\n  EditFormSimple,\n  CreateFormTabbed,\n  EditFormTabbed,\n  ShowSimpleView,\n  ShowTabbedView,\n  TabbedForm,\n  SimpleForm,\n}  from './form';\nimport List  from './list';\nimport Grid  from './grid';\nimport CardView  from './cardView';\nimport GridView  from './gridView';\nimport ListView  from './listView';\nimport Preview  from './preview';\nimport { UIXContext } from '../contexts';\n\nconst Show = (props) => {\n  const uix = useContext(UIXContext);\n  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n  const Result = isSmall ? uix." +
            entity1.name +
            '.ShowSimpleView : uix.' +
            entity1.name +
            ".ShowTabbedView\n  return (\n    <Result {...props} />\n  );\n}\n\nconst Edit = (props) => {\n  const uix = useContext(UIXContext);\n  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n  const Result = isSmall ? uix." +
            entity1.name +
            '.EditFormSimple : uix.' +
            entity1.name +
            ".EditFormTabbed\n  return (\n    <Result {...props} />\n  );\n}\n\nconst Create = (props) => {\n  const uix = useContext(UIXContext);\n  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));\n  const Result = isSmall ? uix." +
            entity1.name +
            '.CreateFormSimple : uix.' +
            entity1.name +
            ".CreateFormTabbed\n  return (\n    <Result {...props} />\n);}\n\nexport default {\n  name: '" +
            entity1.name +
            "',\n  Title,\n  SelectTitle,\n  inputText,\n  Filter,\n  List,\n  Create,\n  Edit,\n  Show,\n  TabbedForm,\n  SimpleForm,\n  CreateFormSimple,\n  CreateFormTabbed,\n  EditFormSimple,\n  EditFormTabbed,\n  ShowSimpleView,\n  ShowTabbedView,\n  Preview,\n  Grid,\n  CardView,\n  GridView,\n  ListView,\n  ...buttons,\n  ...actions,\n};",
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-index']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/list.njs', {
    alias: ['forms-list'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var listActions = entity1.actions.filter(function (a) {
        return 'listAction' === a.actionType
      })
      entity1.actions.filter(function (a) {
        return 'itemAction' === a.actionType
      })
      out.push(
        "import React, { useContext, cloneElement } from \"react\";\nimport { UIXContext } from '../contexts';\nimport {\n  useTranslate,\n  TopToolbar,\n  ExportButton,\n  sanitizeListRestProps\n} from 'react-admin';\n\n",
      )
      if (listActions.length > 0) {
        out.push(
          '\n\nconst ' +
            entity1.name +
            'ActionButtons = (props) => {\n  const uix = useContext(UIXContext);\n  const translate = useTranslate();\n\n  return (\n  <React.Fragment>\n',
        )
        listActions.forEach(function (action) {
          out.push(
            '\n    <uix.' +
              entity1.name +
              '.' +
              action.fullName +
              ' {...props} />\n',
          )
        })
        out.push(
          '\n    {/* Add the default bulk delete action */}\n    <uix.BulkDeleteButton {...props} />\n  </React.Fragment>\n);}\n\n',
        )
      }
      out.push(
        '\n\nconst ListView = (props) => {\n  const uix = useContext(UIXContext);\n  const translate = useTranslate();\n  return (\n  <uix.List {...props}\n  filters={<uix.' +
          entity1.name +
          '.Filter />}\n  actions={<ListActions permissions={props.permissions} />}\n  title={translate("resources.' +
          entity1.name +
          '.name", { smart_count:2 })}\n',
      )
      if (listActions.length > 0)
        out.push(
          '\n  bulkActionButtons={<' + entity1.name + 'ActionButtons />}\n',
        )
      return (
        out.push(
          '\n  >\n    <uix.' +
            entity1.name +
            ".Grid />\n  </uix.List>\n);}\n\nexport default ListView;\n\nconst ListActions = ({\n  currentSort,\n  className,\n  resource,\n  filters,\n  displayedFilters,\n  exporter, // you can hide ExportButton if exporter = (null || false)\n  filterValues,\n  permanentFilter,\n  hasCreate, // you can hide CreateButton if hasCreate = false\n  basePath,\n  selectedIds,\n  onUnselectItems,\n  showFilter,\n  maxResults,\n  total,\n  permissions,\n  ...rest\n}) => {\n  const uix = useContext(UIXContext);\n  return (\n    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>\n      {filters &&\n        cloneElement(filters, {\n          resource,\n          showFilter,\n          displayedFilters,\n          filterValues,\n          context: 'button',\n        })}\n      <uix." +
            entity1.name +
            '.CreateButton\n        {...rest}\n        label="ra.action.create"\n        resource={resource}\n      />\n      <ExportButton\n        disabled={total === 0}\n        resource={resource}\n        sort={currentSort}\n        filter={{ ...filterValues, ...permanentFilter }}\n        exporter={exporter}\n        maxResults={maxResults}\n      />\n    </TopToolbar>\n  );\n};\n\nListActions.defaultProps = {\n  selectedIds: [],\n  onUnselectItems: () => null,\n};\n',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-list']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/preview.njs', {
    alias: ['forms-preview'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      out.push(
        "import React, { useContext } from 'react';\nimport { connect } from 'react-redux';\nimport { withStyles } from '@material-ui/core/styles';\nimport { UIXContext } from '../contexts';\n\nconst styles = theme => ({\n  field: {\n    // These styles will ensure our drawer don't fully cover our\n    // application when teaser or title are very long\n    '& span': {\n      display: 'inline-block',\n      maxWidth: '30rem',\n    },\n  },\n});\n\nconst " +
          entity1.name +
          'PreviewView = ({ classes, ...props }) => {\n  const uix = useContext(UIXContext);\n  return (\n    <uix.SimpleShowLayout {...props}>\n    ',
      )
      var ctx = {
        entity: _objectSpreadProps(_objectSpread({}, entity1), {
          props: entity1.lists.preview,
        }),
        source: '',
      }
      return (
        out.push(
          '\n      ' +
            partial(ctx, 'display-show-entity') +
            '\n    </uix.SimpleShowLayout>\n  );\n};\n\nconst mapStateToProps = (state, props) => ({\n  // Get the record by its id from the react-admin state.\n  record: state.admin.resources.' +
            entity1.name +
            '\n    ? state.admin.resources.' +
            entity1.name +
            '.data[props.id]\n    : null,\n  version: state.admin.ui.viewVersion,\n});\n\nconst ' +
            entity1.name +
            'Preview = connect(\n  mapStateToProps,\n  {},\n)(withStyles(styles)(' +
            entity1.name +
            'PreviewView));\n\nexport default ' +
            entity1.name +
            'Preview;',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-preview']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/select-title.njs', {
    alias: ['forms-select-title'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      return (
        out.push(
          'import React from "react";\n\nexport const inputText = record => record ? (',
        ),
        entity1.UI.listName.forEach(function (ln) {
          out.push('record.' + ln + ' ||')
        }),
        out.push(
          "record.id ):'';\n\nconst Title = ({ record }) => (\n  <span>{record ? (",
        ),
        entity1.UI.listName.forEach(function (ln) {
          out.push('record.' + ln + ' ||')
        }),
        out.push("record.id ):''}</span>\n);\n\nexport default Title;"),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-select-title']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/forms/title.njs', {
    alias: ['forms-title'],
    script: function script(entity1, _content, partial, slot, options) {
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      return (
        out.push(
          "import React, { useContext } from \"react\";\nimport { UIXContext } from '../contexts';\nimport { useTranslate } from 'react-admin';\n\nconst Title = ({ record }) => {\n  const uix = useContext(UIXContext);\n  const translate = useTranslate();\n\n  return (\n  <span>\n    {translate('resources." +
            entity1.name +
            '.name\', {smart_count : 1})} "<uix.' +
            entity1.name +
            '.SelectTitle record={record}/>"\n  </span>\n);}\n\nexport default Title;',
        ),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['forms-title']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/ui-enums.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-enums'],
    script: function script(_enum, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = _enum
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      return (
        chunkStart(main),
        chunkStart(''.concat(_enum.name, '/index.js')),
        out.push(
          "import React, { useContext } from 'react';\nimport { UIXContext } from '../contexts';\n\nexport const translation = {\n  enums: {\n    " +
            _enum.name +
            ': {\n',
        ),
        _enum.items.forEach(function (item) {
          var ref, ref1
          out.push(
            item.name +
              ": '" +
              ((null === (ref = item.metadata) || void 0 === ref
                ? void 0
                : null === (ref1 = ref.UI) || void 0 === ref1
                  ? void 0
                  : ref1.title) || item.name) +
              "',\n",
          )
        }),
        out.push('\n    },\n  },\n};\n\nconst choices = [\n'),
        _enum.items.forEach(function (item) {
          out.push(
            "{ id: '" +
              item.name +
              "', name: 'enums." +
              _enum.name +
              '.' +
              item.name +
              "' },\n",
          )
        }),
        out.push(
          '\n];\nconst Input = (props) => {\n  const uix = useContext(UIXContext);\n  return (\n    <uix.SelectInput\n      {...props}\n      choices={choices}\n    />\n  );\n}\n\n\n\nconst Field = (props) => {\n  const uix = useContext(UIXContext);\n  return (<uix.SelectField {...props} choices={choices}/>)\n  }\n\nexport default {\n  Input,\n  Field,\n  choices,\n};\n',
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-enums']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/ui-forms.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-forms'],
    script: function script(entity1, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = entity1
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      chunkStart(main)
      if (!entity1.embedded) {
        chunkStart(''.concat(entity1.name, '/index.js'))
        out.push(partial(entity1, 'forms-index'))
        chunkStart(''.concat(entity1.name, '/title.js'))
        out.push(partial(entity1, 'forms-title'))
        chunkStart(''.concat(entity1.name, '/selectTitle.js'))
        out.push(partial(entity1, 'forms-select-title'))
        chunkStart(''.concat(entity1.name, '/list.js'))
        out.push(partial(entity1, 'forms-list'))
        chunkStart(''.concat(entity1.name, '/grid.js'))
        out.push(partial(entity1, 'forms-grid'))
        chunkStart(''.concat(entity1.name, '/filter.js'))
        out.push(partial(entity1, 'forms-filter'))
        chunkStart(''.concat(entity1.name, '/form.js'))
        out.push(partial(entity1, 'forms-form'))
        chunkStart(''.concat(entity1.name, '/preview.js'))
        out.push(partial(entity1, 'forms-preview'))
        chunkStart(''.concat(entity1.name, '/fragments.js'))
        out.push(partial(entity1, 'forms-form-fragments'))
        chunkStart(''.concat(entity1.name, '/cardView.js'))
        out.push(partial(entity1, 'grid-card'))
        chunkStart(''.concat(entity1.name, '/listView.js'))
        out.push(partial(entity1, 'forms-grid-list'))
        chunkStart(''.concat(entity1.name, '/gridView.js'))
        out.push(partial(entity1, 'forms-grid-view'))
        chunkStart(''.concat(entity1.name, '/styles.js'))
        out.push(
          'const styles = theme => ({\n  formControl: {\n    // margin: theme.spacing(1),\n    minWidth: 120,\n  },\n});\n\nexport default styles;\n',
        )
      }
      return (
        chunkStart('i18n/'.concat(entity1.name, '.js')),
        out.push(partial(entity1, 'forms-i18n') + ''),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-forms']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/ui-index.njs', {
    chunks: '$$$main$$$',
    alias: ['ui-index'],
    script: function script(pack, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      var ref, ref1, ref2, ref3
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = pack
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      chunkStart(main)
      chunkStart('./resources.js')
      out.push('const embedded = {\n')
      var _iteratorNormalCompletion = true,
        _didIteratorError = false,
        _iteratorError = void 0
      try {
        for (
          var _iterator = pack.entities
              .filter(function (e) {
                return e.embedded
              })
              [Symbol.iterator](),
            _step;
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = true
        ) {
          var entity1 = _step.value
          out.push(entity1.name + ': {\n    uploadFields:[')
          entity1.uploadFields.forEach(function (f) {
            out.push('\n      "' + f + '",')
          })
          out.push('\n    ]\n  },\n')
        }
      } catch (err) {
        _didIteratorError = true
        _iteratorError = err
      } finally {
        try {
          if (!_iteratorNormalCompletion && null != _iterator.return)
            _iterator.return()
        } finally {
          if (_didIteratorError) throw _iteratorError
        }
      }
      out.push('}\n\nexport default [\n')
      var _iteratorNormalCompletion1 = true,
        _didIteratorError1 = false,
        _iteratorError1 = void 0
      try {
        var _loop = function () {
          var entity1 = _step1.value
          out.push(
            '{\n    name: "' +
              entity1.name +
              '",\n    resource: "' +
              entity1.resourceName +
              '",\n    path: "' +
              entity1.collectionName +
              '",\n    ',
          )
          if (entity1.filter) out.push('filter: ' + entity1.filter + ',\n    ')
          out.push('isPublic: true,\n    saveFilter: {\n    ')
          entity1.props
            .filter(function (p) {
              return (entity1.embedded && 'id' != p.name) || !entity1.embedded
            })
            .filter(function (p) {
              return !(p.ref && !p.single && !p.embedded) && !p.calculated
            })
            .forEach(function (prop) {
              prop.ref, prop.single
              prop.stored, prop.embedded, prop.verb
              out.push("'" + prop.name + "':'" + prop.field + "',\n    ")
            })
          out.push('\n    },\n    readFilter: {\n    ')
          entity1.props
            .filter(function (p) {
              return (entity1.embedded && 'id' != p.name) || !entity1.embedded
            })
            .filter(function (p) {
              return !(p.ref && !p.single && !p.embedded) && !p.calculated
            })
            .forEach(function (prop) {
              prop.ref, prop.single
              prop.stored, prop.embedded, prop.verb
              out.push("'" + prop.field + "':'" + prop.name + "',\n    ")
            })
          out.push('\n    },\n    uploadFields:[\n      ')
          entity1.uploadFields.forEach(function (f) {
            out.push('\n      "' + f + '",')
          })
          out.push('\n      ')
          entity1.maps.forEach(function (f) {
            out.push(
              '\n        ...embedded.' +
                f.type +
                '.uploadFields.map(f=>`' +
                f.name +
                '.${f}`),',
            )
          })
          out.push('\n      ')
          entity1.collections.forEach(function (f) {
            out.push(
              '\n        ...embedded.' +
                f.type +
                '.uploadFields.map(f=>`' +
                f.name +
                '.${f}`),',
            )
          })
          out.push('\n    ],\n    collections:[\n      ')
          entity1.collections.forEach(function (f) {
            out.push(
              '\n      {\n        field:"' +
                f.name +
                '",\n        path:"' +
                f.storage +
                '",\n        type:"' +
                f.type +
                '",\n        isPublic: true,\n        ...embedded.' +
                f.type +
                ',\n      },',
            )
          })
          out.push('\n    ],\n    maps:[\n      ')
          entity1.maps.forEach(function (f) {
            out.push(
              '\n      {\n        field:"' +
                f.name +
                '",\n        path:"' +
                f.storage +
                '",\n        type:"' +
                f.type +
                '",\n        ...embedded.' +
                f.type +
                ',\n      },',
            )
          })
          out.push('\n    ]\n  },\n')
        }
        for (
          var _iterator1 = pack.entities
              .filter(function (e) {
                return !e.embedded
              })
              [Symbol.iterator](),
            _step1;
          !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done);
          _iteratorNormalCompletion1 = true
        )
          _loop()
      } catch (err) {
        _didIteratorError1 = true
        _iteratorError1 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion1 && null != _iterator1.return)
            _iterator1.return()
        } finally {
          if (_didIteratorError1) throw _iteratorError1
        }
      }
      out.push(']')
      chunkStart('./index.js')
      out.push("import {Fragment} from 'react';\n")
      var _iteratorNormalCompletion2 = true,
        _didIteratorError2 = false,
        _iteratorError2 = void 0
      try {
        for (
          var _iterator2 = pack.entities
              .filter(function (e) {
                return !e.embedded
              })
              [Symbol.iterator](),
            _step2;
          !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
          _iteratorNormalCompletion2 = true
        ) {
          var entity2 = _step2.value
          out.push(
            'import ' + entity2.name + "UIX from './" + entity2.name + "';\n",
          )
        }
      } catch (err) {
        _didIteratorError2 = true
        _iteratorError2 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && null != _iterator2.return)
            _iterator2.return()
        } finally {
          if (_didIteratorError2) throw _iteratorError2
        }
      }
      var _iteratorNormalCompletion3 = true,
        _didIteratorError3 = false,
        _iteratorError3 = void 0
      try {
        for (
          var _iterator3 = pack.enums[Symbol.iterator](), _step3;
          !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
          _iteratorNormalCompletion3 = true
        ) {
          var en_ = _step3.value
          out.push('import ' + en_.name + " from './" + en_.name + "';\n")
        }
      } catch (err) {
        _didIteratorError3 = true
        _iteratorError3 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && null != _iterator3.return)
            _iterator3.return()
        } finally {
          if (_didIteratorError3) throw _iteratorError3
        }
      }
      out.push(
        "\nimport React from 'react';\nimport Admin from './admin';\nimport Typography from '@material-ui/core/Typography';\nimport InputWithPreview from './InputWithPreview';\nimport QuickCreateButton from './quickCreate';\n// import TimeInput from '../../modules/TimeInput';\n// import TimeField from '../../modules/TimeField';\n// import FixedTimeInput from '../../modules/FixedTimeInput';\n// import FixedTimeField from '../../modules/FixedTimeField';\n\nimport {\n  //primitives\n  //input\n  DateInput,\n  DateTimeInput,\n  TextInput,\n  BooleanInput,\n  ImageInput,\n  FileInput,\n  NumberInput,\n  PasswordInput,\n  //field\n  TextField,\n  DateField,\n  BooleanField,\n  NullableBooleanInput,\n  ImageField,\n  FileField,\n  NumberField,\n  RichTextField,\n  UrlField,\n  ChipField,\n  EmailField,\n  //complex\n  //input\n  // array\n  ArrayInput,\n  SimpleFormIterator,\n  FormDataConsumer,\n  // select from list\n  AutocompleteInput,\n  AutocompleteArrayInput,\n  CheckboxGroupInput,\n  RadioButtonGroupInput,\n  //\n  //reference\n  ReferenceArrayInput,\n  SelectArrayInput,\n  ReferenceInput,\n  SelectInput,\n  //field\n  ArrayField,\n  ReferenceManyField,\n  FunctionField,\n  SelectField,\n  ReferenceField,\n  ReferenceArrayField,\n  SimpleList,\n  // ref items\n  SingleFieldList,\n  Datagrid,\n  //layout single item\n  Show,\n  SimpleShowLayout,\n  TabbedShowLayout,\n  Tab,\n  Create,\n  Edit,\n  SimpleForm,\n  TabbedForm,\n  FormTab,\n  // layout list items\n  List,\n  // universal\n  //layput controls\n  Toolbar,\n  Filter,\n  Pagination,\n  TopToolbar,\n  // buttons\n  Button,\n  ShowButton,\n  EditButton,\n  DeleteButton,\n  CloneButton,\n  BulkDeleteButton,\n  SaveButton,\n  // functions\n  required,\n  //\n  useTranslate,\n} from 'react-admin';\nimport RichTextInputBase from 'ra-input-rich-text';\n\nconst HeaderLabel = ({text, ...props })=> {\n  const translate = useTranslate();\n  return (<Typography variant=\"h6\" gutterBottom {...props}>{translate(text)}</Typography>);\n}\n\nconst DisabledInput = (props) => (<TextInput disabled {...props}/>);\nconst LongTextInput = (props) => (<TextInput multiline {...props}/>);\nconst FileInputField = props => (\n  <FileInput {...props}>\n    <FileField source=\"src\" title=\"name\" />\n  </FileInput>\n);\n\nconst ImageInputField = props => (\n  <ImageInput {...props}>\n    <ImageField source=\"src\" title=\"title\" />\n  </ImageInput>\n);\nconst PasswordField = (props) => (<TextField  {...props} inputProps={{ autocomplete: 'new-password' }}/>);\nconst Readonly = field => ({ Input: DisabledInput, Field: field });\n\nconst ReadonlyReachTextInput = ({ label, ...props }) => {\n  const translate = useTranslate();\n  if (label) {\n    label = translate(label);\n  }\n  return <RichTextInputBase label={label} {...props} disabled />;\n};\n\nconst RichTextInput = ({ label, ...props }) => {\n  const translate = useTranslate();\n  if (label) {\n    label = translate(label);\n  }\n  return <RichTextInputBase label={label} {...props} />;\n};\n\nconst primitive = {\n  Text: { Input: TextInput, Field: TextField },\n  LongText: { Input: LongTextInput, Field: TextField },\n  Number: { Input: NumberInput, Field: NumberField },\n  Date: { Input: DateInput, Field: DateField },\n  DateTime: { Input: DateTimeInput, Field: DateField },\n  // Time: { Input: TimeInput, Field: TimeField },\n  // FixedTime: { Input: FixedTimeInput, Field: FixedTimeField },\n  Boolean: { Input: BooleanInput, Field: BooleanField },\n  ID: { Input: DisabledInput, Field: TextField },\n  URLFile: { Input: TextInput, Field: FileField },\n  URLImage: { Input: TextInput, Field: ImageField },\n  File: { Input: FileInputField, Field: FileField },\n  Image: { Input: ImageInputField, Field: ImageField },\n  RichText: { Input: RichTextInput, Field: RichTextField },\n  ReadonlyRichText: { Input: ReadonlyReachTextInput, Field: RichTextField },\n  URL: { Input: TextInput, Field: UrlField },\n  Password: { Input: PasswordInput, Field: TextField },\n  Email: { Input: TextInput, Field: EmailField },\n  NullableBoolean: { Input: NullableBooleanInput, Field: BooleanField },\n};\n\nconst readonly = Object.keys(primitive).reduce((result, cur) => {\n  if(!/Readonly/i.test(cur) && !primitive[`Readonly${cur}`]){\n    result[`Readonly${cur}`] = Readonly(primitive[cur]);\n  }\n  return result;\n}, {});\n\nexport const components = {\n  HeaderLabel,\n  InputWithPreview,\n  QuickCreateButton,\n  primitive: {\n  ...primitive,\n  ...readonly,\n",
      )
      var _iteratorNormalCompletion4 = true,
        _didIteratorError4 = false,
        _iteratorError4 = void 0
      try {
        for (
          var _iterator4 = pack.enums[Symbol.iterator](), _step4;
          !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);
          _iteratorNormalCompletion4 = true
        ) {
          var en_1 = _step4.value
          out.push(en_1.name + ',\n')
        }
      } catch (err) {
        _didIteratorError4 = true
        _iteratorError4 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && null != _iterator4.return)
            _iterator4.return()
        } finally {
          if (_didIteratorError4) throw _iteratorError4
        }
      }
      out.push(
        '\n  },\n  //primitives\n  //input\n  DateInput,\n  // TimeInput,\n  // FixedTimeInput,\n  TextInput,\n  BooleanInput,\n  DisabledInput,\n  ImageInput,\n  FileInput,\n  LongTextInput,\n  NumberInput,\n  RichTextInput,\n  //field\n  TextField,\n  // TimeField,\n  // FixedTimeField,\n  DateField,\n  BooleanField,\n  NullableBooleanInput,\n  ImageField,\n  FileField,\n  NumberField,\n  RichTextField,\n  UrlField,\n  ChipField,\n  EmailField,\n  //complex\n  //input\n  // array\n  ArrayInput,\n  SimpleFormIterator,\n  FormDataConsumer,\n  // select from list\n  AutocompleteInput,\n  AutocompleteArrayInput,\n  CheckboxGroupInput,\n  RadioButtonGroupInput,\n  //\n  //reference\n  ReferenceArrayInput,\n  SelectArrayInput,\n  ReferenceInput,\n  SelectInput,\n  //field\n  ArrayField,\n  ReferenceManyField,\n  FunctionField,\n  SelectField,\n  ReferenceField,\n  ReferenceArrayField,\n  SimpleList,\n  // ref items\n  SingleFieldList,\n  Datagrid,\n  //layout single item\n  Show,\n  SimpleShowLayout,\n  TabbedShowLayout,\n  Tab,\n  Create,\n  Edit,\n  SimpleForm,\n  TabbedForm,\n  FormTab,\n  // layout list items\n  List,\n  // universal\n  //layput controls\n  Toolbar,\n  Filter,\n  Pagination,\n  TopToolbar,\n  // buttons\n  Button,\n  ShowButton,\n  EditButton,\n  DeleteButton,\n  CloneButton,\n  BulkDeleteButton,\n  SaveButton,\n  //tree\n  // Tree,\n  // NodeView,\n  // NodeActions,\n  // functions\n  required,\n};\n\nexport { Admin };\n\nexport const uix = {\n  Fragment,\n  ...components,\n\n',
      )
      var _iteratorNormalCompletion5 = true,
        _didIteratorError5 = false,
        _iteratorError5 = void 0
      try {
        for (
          var _iterator5 = pack.entities
              .filter(function (e) {
                return !e.embedded
              })
              [Symbol.iterator](),
            _step5;
          !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done);
          _iteratorNormalCompletion5 = true
        ) {
          var entity3 = _step5.value
          out.push('"' + entity3.name + '": ' + entity3.name + 'UIX,\n')
        }
      } catch (err) {
        _didIteratorError5 = true
        _iteratorError5 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && null != _iterator5.return)
            _iterator5.return()
        } finally {
          if (_didIteratorError5) throw _iteratorError5
        }
      }
      out.push(
        "};\n\nexport const prepareExcludeList = (name, excludeList) => {\n  let result;\n  if (Array.isArray(name)) {\n    result = name.map(prepareExcludeList).reduce(\n      (res, curr) => ({\n        ...res,\n        ...curr,\n      }),\n      {},\n    );\n  } else if (typeof name === 'string' && name.startsWith('!')) {\n    result = { [name.slice(1)]: true };\n  } else {\n    result = {};\n  }\n  if(excludeList){\n    result = {\n      ...excludeList,\n      ...result,\n    }\n  }\n  return result;\n};",
      )
      chunkStart('./i18n/index.js')
      out.push("import {merge} from 'lodash';\n\n")
      var _iteratorNormalCompletion6 = true,
        _didIteratorError6 = false,
        _iteratorError6 = void 0
      try {
        for (
          var _iterator6 = pack.entities[Symbol.iterator](), _step6;
          !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done);
          _iteratorNormalCompletion6 = true
        ) {
          var entity4 = _step6.value
          out.push(
            'import ' +
              entity4.name +
              "Translate from './" +
              entity4.name +
              "';\n",
          )
        }
      } catch (err) {
        _didIteratorError6 = true
        _iteratorError6 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && null != _iterator6.return)
            _iterator6.return()
        } finally {
          if (_didIteratorError6) throw _iteratorError6
        }
      }
      var _iteratorNormalCompletion7 = true,
        _didIteratorError7 = false,
        _iteratorError7 = void 0
      try {
        for (
          var _iterator7 = pack.enums[Symbol.iterator](), _step7;
          !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done);
          _iteratorNormalCompletion7 = true
        ) {
          var en_2 = _step7.value
          out.push(
            'import { translation as ' +
              en_2.name +
              " } from '../" +
              en_2.name +
              "';\n",
          )
        }
      } catch (err) {
        _didIteratorError7 = true
        _iteratorError7 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && null != _iterator7.return)
            _iterator7.return()
        } finally {
          if (_didIteratorError7) throw _iteratorError7
        }
      }
      out.push('\n\n')
      var messages =
        (null === (ref = pack.metadata) || void 0 === ref
          ? void 0
          : null === (ref1 = ref.UI) || void 0 === ref1
            ? void 0
            : ref1.messages) || {}
      out.push(
        '\nconst messages = {\n  uix: {\n    "filter": {\n      "search": "' +
          (messages.search || 'Search') +
          '",\n      "exists": "%{name} ' +
          (messages.exists || 'exists') +
          '",\n      "eq": "%{name} =",\n      "ne": "%{name} !=",\n      "lte": "%{name} <=",\n      "gte": "%{name} >=",\n      "lt": "%{name} <",\n      "gt": "%{name} >",\n      "imatch": "%{name}",\n      "in": "%{name} ' +
          (messages.in || 'in') +
          '",\n      "nin": "%{name} ' +
          (messages.nin || 'not in') +
          '",\n    },\n    actions:{\n      "create_and_add": "' +
          (messages.create_and_add || 'Create more...') +
          '",\n      "preview": "' +
          (messages.preview || 'Quick View') +
          '",\n    },\n  }\n}\n\nexport default\n  merge(\n    messages,\n',
      )
      var _iteratorNormalCompletion8 = true,
        _didIteratorError8 = false,
        _iteratorError8 = void 0
      try {
        for (
          var _iterator8 = pack.entities[Symbol.iterator](), _step8;
          !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done);
          _iteratorNormalCompletion8 = true
        ) {
          var entity5 = _step8.value
          out.push(entity5.name + 'Translate,\n')
        }
      } catch (err) {
        _didIteratorError8 = true
        _iteratorError8 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && null != _iterator8.return)
            _iterator8.return()
        } finally {
          if (_didIteratorError8) throw _iteratorError8
        }
      }
      var _iteratorNormalCompletion9 = true,
        _didIteratorError9 = false,
        _iteratorError9 = void 0
      try {
        for (
          var _iterator9 = pack.enums[Symbol.iterator](), _step9;
          !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done);
          _iteratorNormalCompletion9 = true
        ) {
          var en_3 = _step9.value
          out.push(en_3.name + ',\n')
        }
      } catch (err) {
        _didIteratorError9 = true
        _iteratorError9 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && null != _iterator9.return)
            _iterator9.return()
        } finally {
          if (_didIteratorError9) throw _iteratorError9
        }
      }
      out.push('\n  )')
      chunkStart('./resource-menu-items.js')
      out.push(
        "import React from 'react';\nimport ListIcon from '@material-ui/icons/view-list';\nimport { translate } from 'react-admin';\n\nexport default {\n",
      )
      var _iteratorNormalCompletion10 = true,
        _didIteratorError10 = false,
        _iteratorError10 = void 0
      try {
        for (
          var _iterator10 = pack.entities
              .filter(function (e) {
                return !e.embedded && !e.abstract
              })
              [Symbol.iterator](),
            _step10;
          !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done);
          _iteratorNormalCompletion10 = true
        ) {
          var entity6 = _step10.value
          out.push(
            '"' +
              entity6.name +
              '": { icon: <ListIcon />, visible: true, name: translate(\'resources.' +
              entity6.name +
              ".name', { smart_count:2 }) },\n",
          )
        }
      } catch (err) {
        _didIteratorError10 = true
        _iteratorError10 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && null != _iterator10.return)
            _iterator10.return()
        } finally {
          if (_didIteratorError10) throw _iteratorError10
        }
      }
      out.push('};')
      chunkStart('./admin.js')
      var language =
        (null === (ref2 = pack.metadata) || void 0 === ref2
          ? void 0
          : null === (ref3 = ref2.UI) || void 0 === ref3
            ? void 0
            : ref3.locale) || 'english'
      out.push(
        "\nimport React from 'react';\nimport { Admin, Resource } from 'react-admin';\nimport " +
          language +
          "Messages from 'ra-language-" +
          language +
          "';\nimport translation from './i18n';\nimport { merge } from 'lodash';\nimport { uix as getUIX } from './';\nimport { UIXContext } from './contexts';\nimport polyglotI18nProvider from 'ra-i18n-polyglot';\n\nconst messages = {\n  " +
          language +
          ': {\n    ...merge({}, ' +
          language +
          "Messages, translation),\n  },\n};\n\nconst i18nProviderGenerated = polyglotI18nProvider(locale => messages[locale], '" +
          language +
          "');\n\nexport default ({ title, dataProvider, authProvider, customSagas, i18nProvider, uix, history,}) => (\n  <UIXContext.Provider  value={uix || getUIX}>\n    <Admin\n      history={history}\n      i18nProvider={i18nProvider || i18nProviderGenerated}\n      title={title}\n      dataProvider={dataProvider}\n      authProvider={authProvider}\n      customSagas={customSagas}\n    >\n    ",
      )
      var _iteratorNormalCompletion11 = true,
        _didIteratorError11 = false,
        _iteratorError11 = void 0
      try {
        for (
          var _iterator11 = pack.entities
              .filter(function (e) {
                return !(e.embedded || e.abstract)
              })
              [Symbol.iterator](),
            _step11;
          !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done);
          _iteratorNormalCompletion11 = true
        ) {
          var entity7 = _step11.value
          out.push(
            '<Resource\n          key={"' +
              entity7.name +
              '"}\n          show={(uix || getUIX).' +
              entity7.name +
              '.Show}\n          name={"' +
              entity7.resourceName +
              '"}\n          edit={(uix || getUIX).' +
              entity7.name +
              '.Edit}\n          create={(uix || getUIX).' +
              entity7.name +
              '.Create}\n          list={(uix || getUIX).' +
              entity7.name +
              '.List}\n          options={{ label: `resources.${(uix || getUIX).' +
              entity7.name +
              '.name}.name` }}\n        />\n    ',
          )
        }
      } catch (err) {
        _didIteratorError11 = true
        _iteratorError11 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && null != _iterator11.return)
            _iterator11.return()
        } finally {
          if (_didIteratorError11) throw _iteratorError11
        }
      }
      return (
        out.push('</Admin>\n  </UIXContext.Provider>\n);'),
        chunkStart('./InputWithPreview.js'),
        out.push(
          "import React, { useContext, useState, Fragment } from 'react';\nimport Drawer from '@material-ui/core/Drawer';\n\nimport { Field } from 'react-final-form';\nimport IconImageEye from '@material-ui/icons/RemoveRedEye';\nimport CloseIcon from '@material-ui/icons/Close';\nimport { Button } from 'react-admin';\nimport { ReferenceInput } from 'react-admin';\nimport QuickCreateButton from './quickCreate';\nimport { UIXContext } from './contexts';\n\nimport { makeStyles } from '@material-ui/core/styles';\n\nconst useStyles = makeStyles({\n  root: {\n    display: 'flex',\n  }\n});\n\nconst PreviewButton = ({ id, resource, basePath, showForm: ShowForm }) => {\n  const [show, setView] = useState(false);\n  return (\n    <Fragment>\n      <Button onClick={() => setView(true)} label=\"ra.action.show\">\n        <IconImageEye />\n      </Button>\n      <Drawer anchor=\"right\" open={show} onClose={() => setView(false)}>\n        <div>\n          <Button label=\"ra.action.cancel\" onClick={() => setView(false)}>\n            <CloseIcon />\n          </Button>\n        </div>\n        <ShowForm id={id} basePath={basePath} resource={resource} />\n      </Drawer>\n    </Fragment>\n  );\n};\n\nconst InputWithPreview = ({ optionText, preview, from, Select, children, ...props }) => {\n  const uix = useContext(UIXContext);\n  const classes = useStyles();\n  return (\n    <div className={classes.root}>\n      <ReferenceInput {...props} >\n        <Select optionText={optionText} />\n      </ReferenceInput>\n      <Field\n        name={props.source}\n        component={({ input }) =>\n          ((props.source === 'id' && !input.value) ||\n            props.source !== 'id') && (\n            <QuickCreateButton\n              resource={props.reference}\n              source={props.source}\n              from={from}\n            >\n              {children}\n            </QuickCreateButton>\n          )\n        }\n      />\n      <Field\n        name={props.source}\n        component={({ input }) =>\n          input.value && (\n            <PreviewButton\n              id={input.value}\n              basePath={`/${props.reference}`}\n              resource={props.reference}\n              showForm={uix[props.entity].Preview}\n            />\n          )\n        }\n      />\n      <Field\n        name={props.source}\n        component={({ input }) =>\n          input.value && (\n            <uix.EditButton\n              record={{ id: input.value }}\n              basePath={`/${props.reference}`}\n              resource={props.reference}\n            />\n          )\n        }\n      />\n    </div>\n  );\n};\n\nexport default InputWithPreview;",
        ),
        chunkStart('./quickCreate.js'),
        out.push(
          "import React, { useState, useContext, Fragment } from 'react';\nimport { UIXContext } from './contexts';\nimport {\n  Button,\n  useTranslate,\n  SaveButton,\n  useCreate,\n  useNotify,\n} from 'react-admin';\nimport IconContentAdd from '@material-ui/icons/Add';\nimport IconCancel from '@material-ui/icons/Cancel';\nimport Dialog from '@material-ui/core/Dialog';\nimport DialogTitle from '@material-ui/core/DialogTitle';\nimport DialogActions from '@material-ui/core/DialogActions';\nimport DialogContent from '@material-ui/core/DialogContent';\nimport { createForm } from 'final-form';\nimport { useForm } from 'react-final-form';\n\nexport default ({ resource, source, children, ...props }) => {\n  const notify = useNotify();\n  const currentForm = useForm();\n  const [create, { loading: saving }] = useCreate(resource);\n  const [, setError] = useState(false);\n  const [showDialog, setShowDialog] = useState(false);\n  const translate = useTranslate();\n  const formLabel = `${translate('ra.action.create')} ${translate(\n    `resources.${resource}.name`,\n    {\n      smart_count: 1,\n    },\n  )}`;\n\n  const form = createForm({\n    onSubmit: (values, _, callback) => {\n      create(\n        { payload: { data: values } },\n        {\n          onSuccess: ({ data }) => {\n            notify('DONE');\n            currentForm.change(source, data.id);\n            setShowDialog(false);\n            callback();\n          },\n          onFailure: error => {\n            setError(error);\n            notify(`error while creating ${error.message}`);\n            callback(error);\n          },\n        },\n      );\n    },\n  });\n\n  return (\n    <Fragment>\n      <Button onClick={() => setShowDialog(true)} label=\"ra.action.create\">\n        <IconContentAdd />\n      </Button>\n      <Dialog\n        fullWidth\n        open={showDialog}\n        onClose={() => setShowDialog(false)}\n        aria-label={formLabel}\n      >\n        <DialogTitle>{formLabel}</DialogTitle>\n        <DialogContent>{React.cloneElement(children, {\n          form,\n          save:(...args) => {\n            console.log(args);\n          },\n          toolbar:null,\n          record:{}\n        })}</DialogContent>\n        <DialogActions>\n          <SaveButton\n            saving={saving}\n            handleSubmitWithRedirect={() => {\n              form.submit();\n            }}\n          />\n          <Button label=\"ra.action.cancel\" onClick={() => setShowDialog(false)}>\n            <IconCancel />\n          </Button>\n        </DialogActions>\n      </Dialog>\n    </Fragment>\n  );\n};",
        ),
        chunkStart('./contexts.js'),
        out.push(
          "import React from 'react';\n\nexport const UIXContext = React.createContext({});\n",
        ),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui-index']
    },
    dependency: {},
  }),
  _defineProperty(_obj, 'UI/ui.njs', {
    chunks: '$$$main$$$',
    alias: ['ui'],
    script: function script(model, _content, partial, slot, options) {
      var chunkEnsure = function (name, content) {
        if (!result) result = {}
        if (!result.hasOwnProperty(name)) result[name] = content || []
      }
      var chunkStart = function (name) {
        chunkEnsure(name)
        chunkEnd()
        current = name
        out = []
      }
      var chunkEnd = function () {
        result[current].push(out)
        out = []
        current = outStack.pop() || main
      }
      options.escapeIt
      function content(blockName, ctx) {
        if (null == ctx) ctx = model
        return _content(blockName, ctx, content, partial, slot)
      }
      var out = []
      var _partial = partial
      partial = function partial(obj, template) {
        var result = _partial(obj, template)
        return Array.isArray(result)
          ? (result.forEach(function (r) {
              chunkEnsure(r.name, r.content)
            }),
            '')
          : result
      }
      var main = '$$$main$$$'
      var current = main
      var outStack = [current]
      var result
      chunkStart(main)
      out.push(partial(model, 'ui-index') + '\n')
      var _iteratorNormalCompletion = true,
        _didIteratorError = false,
        _iteratorError = void 0
      try {
        for (
          var _iterator = model.entities[Symbol.iterator](), _step;
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = true
        ) {
          var entity1 = _step.value
          out.push('\n  ' + partial(entity1, 'ui-forms') + '\n')
        }
      } catch (err) {
        _didIteratorError = true
        _iteratorError = err
      } finally {
        try {
          if (!_iteratorNormalCompletion && null != _iterator.return)
            _iterator.return()
        } finally {
          if (_didIteratorError) throw _iteratorError
        }
      }
      out.push('\n')
      var _iteratorNormalCompletion1 = true,
        _didIteratorError1 = false,
        _iteratorError1 = void 0
      try {
        for (
          var _iterator1 = model.enums[Symbol.iterator](), _step1;
          !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done);
          _iteratorNormalCompletion1 = true
        ) {
          var enumDef = _step1.value
          out.push('\n  ' + partial(enumDef, 'ui-enums') + '\n')
        }
      } catch (err) {
        _didIteratorError1 = true
        _iteratorError1 = err
      } finally {
        try {
          if (!_iteratorNormalCompletion1 && null != _iterator1.return)
            _iterator1.return()
        } finally {
          if (_didIteratorError1) throw _iteratorError1
        }
      }
      return (
        out.push(''),
        chunkEnd(),
        (out = Object.keys(result)
          .filter(function (i) {
            return '$$$main$$$' !== i
          })
          .map(function (curr) {
            return {
              name: curr,
              content: result[curr],
            }
          })),
        out.join('')
      )
    },
    compile: function compile() {
      this.alias = ['ui']
    },
    dependency: {},
  }),
  _obj)
exports.templates = templates
var F = new Factory(templates)
exports.run = function run(context, name) {
  return F.run(context, name)
}

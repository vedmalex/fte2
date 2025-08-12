module.exports = {
  script: function (context, _content, partial, slot, options) {
    var out = []
    out.push(
      "var utils                = require('@grainjs/meta-codegen').utils;\n" +
        'var mongoose             = global.mongoose\n' +
        'var mongooseIncr         = require("@grainjs/mongoose-autoincr");\n' +
        'var mongooseCreated      = require("@grainjs/mongoose-created");\n' +
        'var mongooseLastModified = require("@grainjs/mongoose-last-modified");\n' +
        'var Schema               = mongoose.Schema;\n' +
        'var ObjectId             = Schema.ObjectId;\n' +
        'var Mixed                = Schema.Types.Mixed;\n' +
        'var sm                   = require("@grainjs/aasm-js");\n' +
        '\n' +
        '\n',
    )
    function isArray(obj) {
      return obj.constructor == Array
    }
    function decapitalize(str) {
      return str.charAt(0).toLowerCase() + str.slice(1)
    }
    var dot = context.thingType.indexOf('.')
    var schema = dot > 0 ? context.thingType.slice(dot + 1) : context.thingType
    var schemaName = decapitalize(schema) + 'Def'
    var resCollection = context.topMostParent
      ? context.topMostParent
      : context.namespace + '.' + schema
    if (context.methods) {
      context.methods.forEach(function (method) {
        var funcName = method.name.replace(/ /g, '_')
        if (method.disable) {
          out.push('/*')
        }
        out.push(
          '\n' +
            '//' +
            method.comment +
            '\n' +
            'function ' +
            funcName +
            ' (' +
            (method.params ? method.params : '') +
            '){\n' +
            '' +
            method.body +
            '\n' +
            '};\n' +
            '',
        )
        if (method.disable) {
          out.push('*/')
        }
      })
    }
    if (context.statics) {
      context.statics.forEach(function (method) {
        var funcName = method.name.replace(/ /g, '_')
        out.push(
          '\n' +
            '//' +
            method.comment +
            '\n' +
            'function ' +
            funcName +
            ' (' +
            (method.params ? method.params : '') +
            '){\n' +
            '' +
            method.body +
            '\n' +
            '};\n' +
            '\n',
        )
      })
    }
    out.push('var $' + schemaName + ' = ' + context.propertiesAsString + ';')
    if (context.cal_mapping) {
      out.push(
        '\n' +
          '// Calendar fields\n' +
          '$' +
          schemaName +
          '["_isassigned"]         = Boolean;\n' +
          '$' +
          schemaName +
          '["_isperiodical"]       = Boolean;\n' +
          '$' +
          schemaName +
          '["_isperiodicalroot"]   = Boolean;\n' +
          '$' +
          schemaName +
          '["_isperiodicalbydate"] = Boolean;\n' +
          '$' +
          schemaName +
          '["_groupingid"]         = String;\n' +
          '$' +
          schemaName +
          '["ignoredfields"]       = String;',
      )
      var typeHash = { StartDate: 'Date', EndDate: 'Date', IsAllDay: 'Boolean' }
      for (var keyName in context.cal_mapping) {
        if (context.cal_mapping[keyName] === '') {
          var type = typeHash[keyName]
          out.push(
            '\n' +
              '$' +
              schemaName +
              "['" +
              keyName.toLowerCase() +
              "'] = {\n" +
              '        type:',
          )
          if (type) {
            out.push(type)
          } else {
            out.push('String')
          }
          out.push(',\n' + '        index: true\n' + '      };\n' + '      ')
        }
      }
    }
    //checks whenever the state machine ready
    var stateMachineReady =
      context.stateMachine &&
      context.$$$Properties &&
      context.stateMachine.state &&
      context.stateMachine.state.length > 0
    if (stateMachineReady && context.stateMachine) {
      var localStateMachine = context.stateMachine
      out.push(
        '\n' +
          '// State Machine section\n' +
          'var aasmjs = require("@grainjs/aasm-js");\n' +
          '',
      )
    }
    if (stateMachineReady && localStateMachine) {
      /*stateMachineHash preparing*/
      var stateMachineHash = {
        statuses: {},
        states: {},
      }
      var states = localStateMachine.state
      for (var i = 0; i < states.length; i++) {
        var state = states[i]
        var name = state.name
        var _d = state.displayName.split(';').map(function (e) {
          return e
        })
        var displays = []
        for (var j = 0; j < _d.length; j++) {
          displays[j] = _d[j].trim()
        }
        stateMachineHash.states[name] = displays
        for (var k = 0; k < displays.length; k++) {
          var display = displays[k]
          stateMachineHash.statuses[display] = name
        }
      }
      out.push(
        '\n' +
          '// stateMachineHash\n' +
          'var stateMachineHash = function(config) {\n' +
          '    this.statuses = JSON.parse(JSON.stringify(config.statuses));\n' +
          '    this.states = JSON.parse(JSON.stringify(config.states));\n' +
          '};\n' +
          '\n' +
          'stateMachineHash.prototype.getStatus = function(state) {\n' +
          '    return this.states[state];\n' +
          '};\n' +
          '\n' +
          'stateMachineHash.prototype.getState = function(status) {\n' +
          '    return this.statuses[status];\n' +
          '};\n' +
          '\n' +
          'if(!global["stateMachineHash"]) global["stateMachineHash"] = {};\n' +
          'global["stateMachineHash"][' +
          JSON.stringify(context.thingType) +
          '] = new stateMachineHash(' +
          JSON.stringify(stateMachineHash) +
          ');\n',
      )
      var stateAttribute =
        context.$$$Properties[localStateMachine.stateAttribute]
      if (!stateAttribute) {
        stateAttribute = {
          type: String,
          default: localStateMachine.initialState,
          index: true,
        }
        out.push(
          '\n' +
            '// register state attribute\n' +
            '$' +
            schemaName +
            "['state'] = {\n" +
            '  type:String,\n' +
            '  index:true',
        )
        if (
          localStateMachine.initialState &&
          localStateMachine.initialState != ''
        ) {
          out.push(',\n' + "  default:'" + localStateMachine.initialState + "'")
        }
        out.push('\n' + '};\n')
      } else {
        out.push(
          '\n' +
            '// setup initial State\n' +
            '$' +
            schemaName +
            "['" +
            localStateMachine.stateAttribute +
            "'].default = '" +
            localStateMachine.initialState +
            "';\n" +
            '\n',
        )
      }
    }
    var autoincFields = []
    for (var i = 0; i < context.properties?.length ?? 0; i++) {
      var prop = context.properties[i]
      if (prop.autoInc) {
        autoincFields.push({
          modelName: resCollection + '_' + prop.propertyName,
          attributeName: prop.propertyName,
          beginValue: prop.autoIncBegin || 0,
        })
      }
    }
    out.push(
      '\n' +
        '\n' +
        'var ' +
        schemaName +
        ' = new Schema($' +
        schemaName +
        ', {collection:"' +
        context.collectionType +
        '", autoIndex:false',
    )
    if (!context.strictSchema) {
      out.push(', strict:' + !!context.strictSchema)
    }
    out.push('});')
    if (context.xss?.length > 0) {
      out.push(
        '\n' +
          'function xssProf(_text){\n' +
          "//<img src='u'/> == 14 chars\n" +
          '  if(_text!== undefined && _text!== null && _text.length > 14 ){\n' +
          '  var text = _text.replace(/\\<(\\/?img\\s?.*?\\s*?\\/?)>/igm, "&lt;$1&gt;");\n' +
          '  text = text.replace(/\\<(\\/?script\\s?.*?\\s*?\\/?)>/igm, "&lt;$1&gt;");\n' +
          '  text = text.replace(/\\<(\\/?iframe\\s?.*?\\s*?\\/?)>/igm, "&lt;$1&gt;");\n' +
          '  return text;\n' +
          '  } return _text;\n' +
          '}\n' +
          '\n' +
          '' +
          schemaName +
          ".pre('save', function(next){\n" +
          'var v;\n',
      )
      for (var i = 0, len = context.xss.length; i < len; i++) {
        var xssField = context.xss[i]
        out.push(
          '\n' +
            "  v = this.get('" +
            xssField +
            "');\n" +
            "  if (v && v.length > 14) this.set('" +
            xssField +
            "',xssProf(v));",
        )
      }
      out.push(
        '\n' +
          '  next();\n' +
          '});\n' +
          '\n' +
          '' +
          schemaName +
          ".post('init', function(doc){\n" +
          'var v;\n',
      )
      for (var i = 0, len = context.xss?.length; i < len; i++) {
        var xssField = context.xss[i]
        out.push(
          '\n' +
            "  v = doc.get('" +
            xssField +
            "');\n" +
            "  if (v && v.length > 14) doc.set('" +
            xssField +
            "',xssProf(v));",
        )
      }
      out.push('\n' + '});')
    }
    if (context.namespace) {
      out.push(
        '\n' +
          '\n' +
          'if(!global.SchemaCache) global.SchemaCache = {};\n' +
          'if(!global.SchemaCache.' +
          context.namespace +
          ') global.SchemaCache.' +
          context.namespace +
          ' = {};\n' +
          '\n' +
          'global.SchemaCache.' +
          context.thingType +
          ' = ' +
          schemaName +
          ';',
      )
    }
    if (context.methods) {
      out.push('\n' + '// method connections\n' + '\n')
      context.methods
        .filter((m) => m.type != 'pre' && m.type != 'post')
        .forEach(function (method) {
          var funcName = method.name.replace(/ /g, '_')
          out.push('\n' + '')
          if (method.disable) {
            out.push('/*')
          }
          out.push(
            '\n' +
              '' +
              schemaName +
              '.methods.' +
              funcName +
              ' = ' +
              funcName +
              ';\n' +
              '',
          )
          if (method.disable) {
            out.push('*/')
          }
        })
      out.push('// hooks\n' + '\n')
      context.methods
        .filter((m) => m.type == 'pre' || m.type == 'post')
        .forEach(function (method) {
          var funcName = method.name.replace(/ /g, '_')
          out.push('\n' + '')
          if (method.disable) {
            out.push('/*')
          }
          out.push(
            '\n' +
              '' +
              schemaName +
              '.' +
              (method.type == 'pre' ? 'pre' : 'post') +
              "('" +
              method.hook +
              "', " +
              funcName +
              ');\n' +
              '',
          )
          if (method.disable) {
            out.push('*/')
          }
        })
    }
    if (context.statics) {
      context.statics.forEach(function (method) {
        var funcName = method.name.replace(/ /g, '_')
        out.push(
          '\n' +
            '' +
            schemaName +
            '.statics.' +
            funcName +
            ' = ' +
            funcName +
            ';\n',
        )
      })
    }
    out.push('\n' + '\n' + '')
    if (context.complexindex) {
      out.push('\n' + '// compoundIndex\n')
      var i, index
      var len = context.complexindex.length
      for (i = 0; i < len; i++) {
        index = context.complexindex[i]
        var j, prop, direction
        var propLen = index.properties?.length ?? 0
        var stIndex = {}
        var opts = {
          unique: index.unique === true ? true : undefined,
          sparse: index.sparse === true ? true : undefined,
          dropDups: index.dropDups === true ? true : undefined,
          background: index.background === true ? true : undefined,
        }
        if (context.collectionCount > 1 && context.extends) {
          stIndex.__tid = 1
        }
        for (j = 0; j < propLen; j++) {
          prop = index.properties[j]
          direction = prop.direction === 'DESC' ? -1 : 1
          stIndex[prop.property] = direction
        }
        out.push(
          '\n' +
            '  ' +
            schemaName +
            '.index(' +
            JSON.stringify(stIndex) +
            ', ' +
            JSON.stringify(opts) +
            ');',
        )
      }
    }
    for (var i = 0; i < autoincFields.length; i++) {
      var aif = autoincFields[i]
      out.push(
        '\n' +
          '' +
          schemaName +
          '.plugin(\n' +
          '  mongooseIncr.loadAutoIncr({beginValue: ' +
          aif.beginValue +
          '}, mongoose), {\n' +
          '  beginValue: ' +
          aif.beginValue +
          ',\n' +
          '  modelName: "' +
          aif.modelName +
          '",\n' +
          '  attributeName: "' +
          aif.attributeName +
          '"\n' +
          '});',
      )
    }
    out.push(
      '\n' +
        '\n' +
        '' +
        schemaName +
        '.plugin(mongooseCreated, { index: true });\n' +
        '' +
        schemaName +
        '.plugin(mongooseLastModified, { index: true });\n' +
        '\n' +
        '// derived property zone\n',
    )
    if (context.derivedProperties) {
      out.push(
        '\n' +
          "const mongooseLeanVirtuals = require('mongoose-lean-virtuals');\n" +
          '' +
          schemaName +
          '.plugin(mongooseLeanVirtuals);\n' +
          '\n',
      )
      context.derivedProperties.sort().forEach(function (dprop) {
        if (dprop.requireList)
          dprop.requireList.split(',').forEach(function (req) {
            out.push('\n' + 'require("' + req.trim() + '");\n')
          })
        out.push(
          '\n' +
            '\n' +
            '' +
            schemaName +
            '\n' +
            '  .virtual("' +
            dprop.virtual_propName +
            '")\n' +
            '',
        )
        if (dprop.virtual_getMethod) {
          out.push(
            '\n' +
              '  .get(function(){\n' +
              '    ' +
              dprop.virtual_getMethod +
              '\n' +
              '  })',
          )
        }
        out.push('\n' + '')
        if (dprop.virtual_setMethod) {
          out.push(
            '\n' +
              '  .set(function(value){\n' +
              '  ' +
              dprop.virtual_setMethod +
              '\n' +
              '  })',
          )
        }
      })
    }
    out.push(';\n')
    var derivedRels = context.relations.filter(function (r) {
      return r.derived && r.derivation && r.derivation.mode == 'server'
    })
    out.push('')
    if (derivedRels.length > 0) {
      out.push('// derived associations\n')
      for (var i = 0; i < derivedRels.length; i++) {
        var r1 = derivedRels[i]
        out.push('\n' + '    ')
        if (r1 && r1.derivation) {
          out.push(
            '\n' +
              '    ' +
              schemaName +
              ".method('" +
              r1.derivation.Name +
              "', function(callback){\n" +
              '        ' +
              r1.derivation.DerivationCode +
              '\n' +
              '    });\n' +
              '    ',
          )
        }
        out.push('\n' + '  ')
      }
      out.push('\n' + '')
    }
    if (stateMachineReady && localStateMachine) {
      out.push(
        '\n' +
          '\n' +
          'aasmjs.include(' +
          schemaName +
          ", '" +
          schemaName +
          "-SM')\n" +
          '\n' +
          '' +
          schemaName +
          ".statics.stateMachineName = () => '" +
          schemaName +
          "-SM'\n" +
          '\n' +
          '' +
          schemaName +
          '.statics.aasmInitialState(function(){\n' +
          "    return '" +
          localStateMachine.initialState +
          "'\n" +
          '});\n' +
          '\n' +
          '' +
          schemaName +
          '.methods.aasmWriteState = function(state){\n' +
          '  this.set("' +
          localStateMachine.stateAttribute +
          '", state)\n' +
          '  this.save();\n' +
          '  return true\n' +
          '};\n' +
          '\n' +
          '' +
          schemaName +
          '.methods.aasmWriteStateWithoutPersistence = function(state){\n' +
          '  this.set("' +
          localStateMachine.stateAttribute +
          '", state)\n' +
          '  return true\n' +
          '};\n' +
          '\n' +
          '' +
          schemaName +
          '.methods.aasmReadState = function(state){\n' +
          '  return this.get("' +
          localStateMachine.stateAttribute +
          '")\n' +
          '};\n' +
          '\n' +
          '' +
          schemaName +
          '.methods.aasmEventFailed = function(newState, oldState){\n' +
          "  this.emit('eventFailed', {new:newState, old:oldState})\n" +
          '};\n' +
          '\n' +
          '' +
          schemaName +
          '.methods.aasmEventFired = function(newState, oldState, state){\n' +
          "  this.emit('eventFired', {new:newState, old:oldState})\n" +
          '};\n' +
          '\n' +
          '' +
          schemaName +
          '.methods.fireError = function(error){\n' +
          "  console.log('error', error)\n" +
          '  // if there is no error listeners then code will throw\n' +
          "  this.emit('error', error)\n" +
          '};\n' +
          '\n' +
          '',
      )
    }
    out.push(
      '// ensure section\n' +
        '\n' +
        'global.EnsureIndex.jobs.push(\n' +
        '  (dbPool)=>\n' +
        '    function(err, data){\n' +
        '      var next = this.slot();\n' +
        "      var $collection = dbPool.get('" +
        context.locationType +
        "').model('" +
        context.thingType +
        "');\n" +
        '      if (!err) {\n' +
        '        if(!global.EnsureIndex.dropDone[$collection.collection.name]){\n' +
        "          $collection.collection.dropIndexes(global.EnsureIndex.go($collection, '" +
        context.thingType +
        "', next));\n" +
        '        }\n' +
        '        else{\n' +
        "          global.EnsureIndex.go($collection,'" +
        context.thingType +
        "', next)(null);\n" +
        '        }\n' +
        '      } else next(err);\n' +
        '    });\n' +
        '\n' +
        'global.RegisterSchema.jobs.push(function(mongoose) {\n' +
        '\n' +
        '  if(typeof(global.' +
        context.namespace +
        ")=='undefined') global." +
        context.namespace +
        ' = {};\n' +
        '\n' +
        '  var alreadyOverriden = !!global.' +
        context.thingType +
        " && mongoose.model('" +
        context.thingType +
        "')\n" +
        '\n' +
        '  var $collection = global.' +
        context.thingType +
        " = alreadyOverriden ? mongoose.model('" +
        context.thingType +
        "') : mongoose.model('" +
        context.thingType +
        "', global.SchemaCache." +
        context.thingType +
        ');',
    )
    if (stateMachineReady && localStateMachine) {
      // state machine def
      // take specified element from array
      function take(index) {
        return function (list) {
          return list[0]
        }
      }
      function append(item) {
        return function (list) {
          return [item].concat(list)
        }
      }
      function splitToJSON(str, action) {
        var res =
          str && str != ''
            ? str.split(/[\s,]/).filter(function (item) {
                return item && item != ''
              })
            : []
        if (action && typeof action == 'function') res = action(res)
        return JSON.stringify(res)
      }
      out.push('\n' + '\n' + '')
      localStateMachine.state &&
        localStateMachine.state.forEach(function (st) {
          var count = -1
          out.push(
            '\n' + "$collection.aasmState('" + st.name + "', {\n" + '\n' + '',
          )
          if (st.displayName && st.displayName != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  display: ' + JSON.stringify(st.displayName))
          }
          if (st.beforeEnter && st.beforeEnter != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  beforeEnter:' + splitToJSON(st.beforeEnter))
          }
          if (st.enter && st.enter != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  enter:' + splitToJSON(st.enter))
          }
          if (st.afterEnter && st.afterEnter != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  afterEnter:' + splitToJSON(st.afterEnter))
          }
          if (st.beforeExit && st.beforeExit != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  beforeExit:' + splitToJSON(st.beforeExit))
          }
          if (st.exit && st.exit != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  exit:' + splitToJSON(st.exit))
          }
          if (st.afterExit && st.afterExit != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '  afterExit:' + splitToJSON(st.afterExit))
          }
          if (++count > 0) {
            out.push(',')
          }
          out.push(
            '\n' +
              '  onError:' +
              splitToJSON(st.onError, append('fireError')) +
              '\n' +
              '',
          )
          out.push('\n' + '\n' + '});')
        })
      out.push('\n' + '\n' + '')
      localStateMachine.event &&
        localStateMachine.event.forEach(function (ev) {
          var count = -1
          out.push(
            '\n' + '\n' + '  $collection.aasmEvent("' + ev.eventName + '",{',
          )
          if (ev.onAfter && ev.onAfter != '') {
            if (++count > 0) {
              out.push(',')
            }
            out.push('\n' + '    after:' + splitToJSON(ev.onAfter))
          }
          if (ev.onBefore && ev.onBefore != '') {
            if (++count > 0) {
              out.push(', ')
            }
            out.push('\n' + '    before:' + splitToJSON(ev.onBefore))
          }
          if (ev.onSuccess && ev.onSuccess != '') {
            if (++count > 0) {
              out.push(', ')
            }
            out.push(
              '\n' + '    success:' + splitToJSON(ev.onSuccess) + '\n' + '  ',
            )
          }
          if (++count > 0) {
            out.push(', ')
          }
          out.push(
            '\n' +
              '  error:' +
              splitToJSON(ev.onError, append('fireError')) +
              '\n' +
              '  },\n' +
              '  function(){',
          )
          if (ev.transition) {
            ev.transition
              .sort(function (a, b) {
                if (a.order < b.order) {
                  return -1
                } else if (a.order > b.order) {
                  return 1
                } else return 0
              })
              .forEach(function (trans) {
                out.push(
                  '\n' +
                    '    this.transitions({\n' +
                    '      from:' +
                    splitToJSON(trans.from) +
                    ',\n' +
                    '      to:' +
                    splitToJSON(trans.to, take(0)),
                )
                if (trans.guard && trans.guard != '') {
                  out.push(',\n' + '      guard:' + splitToJSON(trans.guard))
                }
                if (trans.onTransition && trans.onTransition != '') {
                  out.push(
                    ',\n' +
                      '      onTransition:' +
                      splitToJSON(trans.onTransition) +
                      '',
                  )
                }
                out.push(
                  ', onError:' +
                    splitToJSON(trans.onError, append('fireError')) +
                    '\n' +
                    '    });',
                )
              })
          }
          out.push('\n' + '  });')
        })
    }
    out.push('// finders')
    var inList = []
    if (context.collectionCount > 1 && context.extends) {
      if (context.allChilds && context.allChilds.length > 0) {
        inList.push.apply(inList, context.allChilds)
      }
      inList.push(context.thingType)
      out.push(
        '\n' +
          '// TODO придумать конструктор в котором будет инициализироваться это поле по умолчанию!!!\n' +
          '// ну короче что-то придумать чтобы сохранить значение\n' +
          '  // $collection.schema.paths["__tid"] =\n' +
          '  // $collection.schema.interpretAsType("__tid", {type:String, index:true, default:\'' +
          context.thingType +
          "'}, mongoose.model('" +
          context.thingType +
          "').prototype.schema.options);\n" +
          '\n' +
          '  $collection.baseFind = alreadyOverriden ? $collection.baseFind : $collection.find ;\n' +
          '    $collection.find = function (conditions, fields, options, callback) {\n' +
          "        if ('function' == typeof conditions) {\n" +
          '            callback = conditions;\n' +
          '            conditions = {};\n' +
          '            fields = null;\n' +
          '            options = null;\n' +
          "        } else if ('function' == typeof fields) {\n" +
          '            callback = fields;\n' +
          '            fields = null;\n' +
          '            options = null;\n' +
          "        } else if ('function' == typeof options) {\n" +
          '            callback = options;\n' +
          '            options = null;\n' +
          '        }\n' +
          '\n' +
          '        if (!conditions)\n' +
          '            conditions = {};',
      )
      if (inList.length > 1) {
        out.push(
          '\n' +
            "        conditions['__tid'] = {$in:" +
            JSON.stringify(inList) +
            '};',
        )
      } else {
        out.push(
          '\n' + "        conditions['__tid'] = \"" + context.thingType + '";',
        )
      }
      out.push(
        '\n' +
          '        return this.baseFind(conditions, fields, options, callback);\n' +
          '    };\n' +
          '    //findOne\n' +
          '    $collection.baseFindOne = alreadyOverriden ? $collection.baseFindOne : $collection.findOne;\n' +
          '    $collection.findOne = function (conditions, fields, options, callback) {\n' +
          "        if ('function' == typeof conditions) {\n" +
          '            callback = conditions;\n' +
          '            conditions = {};\n' +
          '            fields = null;\n' +
          '            options = null;\n' +
          "        } else if ('function' == typeof fields) {\n" +
          '            callback = fields;\n' +
          '            fields = null;\n' +
          '            options = null;\n' +
          "        } else if ('function' == typeof options) {\n" +
          '            callback = options;\n' +
          '            options = null;\n' +
          '        }\n' +
          '\n' +
          '        if (!conditions)\n' +
          '            conditions = {};',
      )
      if (inList.length > 1) {
        out.push(
          '\n' +
            "        conditions['__tid'] = {$in:" +
            JSON.stringify(inList) +
            '};',
        )
      } else {
        out.push(
          '\n' + "        conditions['__tid'] = \"" + context.thingType + '";',
        )
      }
      out.push(
        '\n' +
          '        return this.baseFindOne(conditions, fields, options, callback);\n' +
          '    };\n' +
          '\n' +
          '    //findOne\n' +
          '    $collection.baseCount = alreadyOverriden ? $collection.baseCount : $collection.count;\n' +
          '    $collection.count = function (conditions, callback) {\n' +
          "        if ('function' == typeof conditions) {\n" +
          '            callback = conditions;\n' +
          '            conditions = {};\n' +
          '            fields = null;\n' +
          '            options = null;\n' +
          "        } else if ('function' == typeof fields) {\n" +
          '            callback = fields;\n' +
          '            fields = null;\n' +
          '            options = null;\n' +
          "        } else if ('function' == typeof options) {\n" +
          '            callback = options;\n' +
          '            options = null;\n' +
          '        }\n' +
          '\n' +
          '        if (!conditions)\n' +
          '            conditions = {};',
      )
      if (inList.length > 1) {
        out.push(
          '\n' +
            "        conditions['__tid'] = {$in:" +
            JSON.stringify(inList) +
            '};',
        )
      } else {
        out.push(
          '\n' + "        conditions['__tid'] = \"" + context.thingType + '";',
        )
      }
      out.push(
        '\n' +
          '        return this.baseCount(conditions, callback);\n' +
          '    };',
      )
    }
    out.push('\n' + '});\n' + '' + '')
    return out.join('')
  },
  compile: function () {},
  dependency: {},
}

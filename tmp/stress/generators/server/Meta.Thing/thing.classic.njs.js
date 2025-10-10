module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        out.push("let mongoose             = global.mongoose\n");
        out.push("let mongooseIncr         = require(\"@grainjs/mongoose-autoincr\");\n");
        out.push("let mongooseCreated      = require(\"@grainjs/mongoose-created\");\n");
        out.push("let mongooseLastModified = require(\"@grainjs/mongoose-last-modified\");\n");
        out.push("let Schema               = mongoose.Schema;\n");
        out.push("let ObjectId             = Schema.ObjectId;\n");
        out.push("let Mixed                = Schema.Types.Mixed;\n");
        function decapitalize(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        }
        let dot = context.thingType.indexOf(".");
        let schema = ((dot > 0) ? context.thingType.slice(dot + 1) : context.thingType);
        let schemaName = decapitalize(schema) + "Def";
        let resCollection = (context.topMostParent) ? context.topMostParent : context.namespace + '.' + schema;
        out.push("\n");
        out.push("\n");
        if (context.methods) {
            context.methods.forEach(function(method) {
                let funcName = method.name.replace(/ /g, "_");
                out.push("\n");
                if (method.disable) {
                    out.push("/*");
                }
                out.push("\n");
                out.push("//" + (method.comment) + "\n");
                out.push("function " + (funcName) + " (" + (method.params ? method.params : "") + "){\n");
                out.push((method.body) + "\n");
                out.push("};\n");
                if (method.disable) {
                    out.push("*/");
                }
                out.push("\n");
            });
        }
        if (context.statics) {
            context.statics.forEach(function(method) {
                let funcName = method.name.replace(/ /g, "_");
                out.push("\n");
                out.push("//" + (method.comment) + "\n");
                out.push("function " + (funcName) + " (" + (method.params ? method.params : "") + "){\n");
                out.push((method.body) + "\n");
                out.push("};\n");
            });
        }
        out.push("\n");
        out.push("\n");
        out.push("let $" + (schemaName) + " = " + (context.propertiesAsString) + ";\n");
        out.push("\n");
        if (context.cal_mapping) {
            out.push("\n");
            out.push("// Calendar fields\n");
            out.push("$" + (schemaName) + "[\"_isassigned\"]         = Boolean;\n");
            out.push("$" + (schemaName) + "[\"_isperiodical\"]       = Boolean;\n");
            out.push("$" + (schemaName) + "[\"_isperiodicalroot\"]   = Boolean;\n");
            out.push("$" + (schemaName) + "[\"_isperiodicalbydate\"] = Boolean;\n");
            out.push("$" + (schemaName) + "[\"_groupingid\"]         = String;\n");
            out.push("$" + (schemaName) + "[\"ignoredfields\"]       = String;\n");
            out.push("\n");
            let typeHash = {
                StartDate: 'Date',
                EndDate: 'Date',
                IsAllDay: 'Boolean'
            };
            for(let keyName in context.cal_mapping){
                if (context.cal_mapping[keyName] === "") {
                    let type = typeHash[keyName];
                    out.push("\n");
                    out.push("$" + (schemaName) + "['" + (keyName.toLowerCase()) + "'] = {\n");
                    out.push("        type:\n");
                    out.push("        ");
                    if (type) {
                        out.push("\n");
                        out.push("        " + (type) + "\n");
                        out.push("        ");
                    } else {
                        out.push("\n");
                        out.push("        String\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("        ,\n");
                    out.push("        index: true\n");
                    out.push("      };\n");
                    out.push("      ");
                }
            }
        }
        out.push("\n");
        out.push("\n");
        let stateMachineReady = context.stateMachine && context.$$$Properties && context.stateMachine.state && context.stateMachine.state.length > 0;
        let localStateMachine = stateMachineReady ? context.stateMachine : undefined;
        if (localStateMachine) {
            out.push("\n");
            out.push("// State Machine section\n");
            out.push("let aasmjs = require(\"@grainjs/aasm-js\");\n");
            out.push("\n");
            let stateMachineHash = {
                thing: context.thingType,
                statuses: {},
                states: {}
            };
            let states = localStateMachine.state;
            for(let i = 0; i < states.length; i++){
                let state = states[i];
                let name = state.name;
                let _d = state.displayName.split(';').map(function(e) {
                    return e;
                });
                let displays = [];
                for(let j = 0; j < _d.length; j++){
                    displays[j] = _d[j].trim();
                }
                ;
                stateMachineHash.states[name] = displays;
                for(let k = 0; k < displays.length; k++){
                    let display = displays[k];
                    stateMachineHash.statuses[display] = name;
                }
            }
            ;
            out.push("\n");
            out.push("// stateMachineHash\n");
            out.push("let stateMachineHash = function(config) {\n");
            out.push("    this.thing = config.thing;\n");
            out.push("    this.statuses = JSON.parse(JSON.stringify(config.statuses));\n");
            out.push("    this.states = JSON.parse(JSON.stringify(config.states));\n");
            out.push("    this._t = (status) => _t(status,'StateMachines', this.thing, 'state')\n");
            out.push("};\n");
            out.push("\n");
            out.push("stateMachineHash.prototype.getProp = function(obj, ...props) {\n");
            out.push("  if (typeof obj == 'object') {\n");
            out.push("    props = props.filter(t => t)\n");
            out.push("    if (props.length > 0) {\n");
            out.push("      const current = props.shift()\n");
            out.push("      return props.length == 0\n");
            out.push("        ? obj[current]\n");
            out.push("        : this.getProp(obj[current], ...props)\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("}\n");
            out.push("\n");
            out.push("stateMachineHash.prototype.revStatus = function(status){\n");
            out.push("    if(status) {\n");
            out.push("        const languages = globalThis.AVAILABLE_LANGUAGES.map(i=>i.code)\n");
            out.push("        for (let code of languages){\n");
            out.push("            const state = this.getProp(globalThis.translation, code,'StateMachines',this.thing, 'state')\n");
            out.push("            const rev = Object.keys(state).reduce((ret, cur)=>{\n");
            out.push("                ret[state[cur]] = cur\n");
            out.push("                return ret\n");
            out.push("            },{})\n");
            out.push("\n");
            out.push("            if(rev[status]) {\n");
            out.push("                return rev[status]\n");
            out.push("            }\n");
            out.push("        }\n");
            out.push("    }\n");
            out.push("}\n");
            out.push("\n");
            out.push("stateMachineHash.prototype.getStatus = function(state) {\n");
            out.push("    return this.states[state];\n");
            out.push("};\n");
            out.push("\n");
            out.push("stateMachineHash.prototype.getState = function(_status) {\n");
            out.push("    const revStatus = this.revStatus(_status)\n");
            out.push("    return this.statuses[this._t(revStatus)];\n");
            out.push("};\n");
            out.push("\n");
            out.push("if(!global[\"stateMachineHash\"]) global[\"stateMachineHash\"] = {};\n");
            out.push("global[\"stateMachineHash\"][" + (JSON.stringify(context.thingType)) + "] = new stateMachineHash(" + (JSON.stringify(stateMachineHash)) + ");\n");
            out.push("\n");
            let stateAttribute = context.$$$Properties[localStateMachine.stateAttribute];
            if (!stateAttribute) {
                stateAttribute = {
                    type: String,
                    default: localStateMachine.initialState,
                    index: true
                };
                out.push("\n");
                out.push("// register state attribute\n");
                out.push("$" + (schemaName) + "['state'] = {\n");
                out.push("  type:String,\n");
                out.push("  index:true\n");
                out.push("  ");
                if (localStateMachine.initialState && localStateMachine.initialState != '') {
                    out.push(",\n");
                    out.push("  default:'" + (localStateMachine.initialState) + "'\n");
                    out.push("  ");
                }
                out.push("\n");
                out.push("};\n");
                out.push("\n");
            } else {
                out.push("\n");
                out.push("// setup initial State\n");
                out.push("$" + (schemaName) + "['" + (localStateMachine.stateAttribute) + "'].default = '" + (localStateMachine.initialState) + "';\n");
            }
        }
        out.push("\n");
        out.push("\n");
        let autoincFields = [];
        for(let i = 0; i < context.properties?.length ?? 0; i++){
            let prop = context.properties[i];
            if (prop.autoInc) {
                autoincFields.push({
                    modelName: resCollection + "_" + prop.propertyName,
                    attributeName: prop.propertyName,
                    beginValue: prop.autoIncBegin || 0
                });
            }
        }
        ;
        out.push("\n");
        out.push("\n");
        out.push("let " + (schemaName) + " = new Schema($" + (schemaName) + ", {collection:\"" + (context.collectionType) + "\", autoIndex:false\n");
        if (!context.strictSchema) {
            out.push("\n");
            out.push(", strict:" + (!!context.strictSchema) + "\n");
        }
        out.push("\n");
        out.push("});\n");
        out.push("\n");
        if (context.xss?.length > 0) {
            out.push("\n");
            out.push("function xssProf(_text){\n");
            out.push("//<img src='u'/> == 14 chars\n");
            out.push("  if(_text!== undefined && _text!== null && _text.length > 14 ){\n");
            out.push("  let text = _text.replace(/\\<(\\/?img\\s?.*?\\s*?\\/?)>/igm, \"&lt;$1&gt;\");\n");
            out.push("  text = text.replace(/\\<(\\/?script\\s?.*?\\s*?\\/?)>/igm, \"&lt;$1&gt;\");\n");
            out.push("  text = text.replace(/\\<(\\/?iframe\\s?.*?\\s*?\\/?)>/igm, \"&lt;$1&gt;\");\n");
            out.push("  return text;\n");
            out.push("  } return _text;\n");
            out.push("}\n");
            out.push("\n");
            out.push((schemaName) + ".pre('save', function(next){\n");
            out.push("let v;\n");
            for(let i = 0, len = context.xss.length; i < len; i++){
                let xssField = context.xss[i];
                out.push("\n");
                out.push("  v = this.get('" + (xssField) + "');\n");
                out.push("  if (v && v.length > 14) this.set('" + (xssField) + "',xssProf(v));\n");
            }
            out.push("\n");
            out.push("  next();\n");
            out.push("});\n");
            out.push("\n");
            out.push((schemaName) + ".post('init', function(doc){\n");
            out.push("let v;\n");
            for(let i = 0, len = context.xss?.length; i < len; i++){
                let xssField = context.xss[i];
                out.push("\n");
                out.push("  v = doc.get('" + (xssField) + "');\n");
                out.push("  if (v && v.length > 14) doc.set('" + (xssField) + "',xssProf(v));\n");
            }
            out.push("\n");
            out.push("});\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        if (context.namespace) {
            out.push("\n");
            out.push("\n");
            out.push("if(!global.SchemaCache) global.SchemaCache = {};\n");
            out.push("if(!global.SchemaCache." + (context.namespace) + ") global.SchemaCache." + (context.namespace) + " = {};\n");
            out.push("\n");
            out.push("global.SchemaCache." + (context.thingType) + " = " + (schemaName) + ";\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        if (context.methods) {
            out.push("\n");
            out.push("// method connections\n");
            context.methods.filter((m)=>(m.type != 'pre' && m.type != 'post')).forEach(function(method) {
                let funcName = method.name.replace(/ /g, "_");
                out.push("\n");
                if (method.disable) {
                    out.push("/*");
                }
                out.push("\n");
                out.push((schemaName) + ".methods." + (funcName) + " = " + (funcName) + ";\n");
                if (method.disable) {
                    out.push("*/");
                }
                out.push("\n");
                out.push("\n");
            });
            out.push("\n");
            out.push("\n");
            out.push("// hooks\n");
            context.methods.filter((m)=>(m.type == 'pre' || m.type == 'post')).forEach(function(method) {
                let funcName = method.name.replace(/ /g, "_");
                out.push("\n");
                if (method.disable) {
                    out.push("/*");
                }
                out.push("\n");
                out.push((schemaName) + "." + (method.type == 'pre' ? 'pre' : 'post') + "('" + (method.hook) + "', " + (funcName) + ");\n");
                if (method.disable) {
                    out.push("*/");
                }
                out.push("\n");
                out.push("\n");
            });
        }
        out.push("\n");
        if (context.statics) {
            context.statics.forEach(function(method) {
                let funcName = method.name.replace(/ /g, "_");
                out.push("\n");
                out.push((schemaName) + ".statics." + (funcName) + " = " + (funcName) + ";\n");
                out.push("\n");
            });
        }
        out.push("\n");
        out.push("\n");
        if (context.complexindex) {
            out.push("\n");
            out.push("// compoundIndex\n");
            let len = context.complexindex.length;
            for(let i = 0; i < len; i++){
                let index = context.complexindex[i];
                let stIndex = {};
                let opts = {
                    name: (index.name === true) ? true : undefined,
                    unique: (index.unique === true) ? true : undefined,
                    sparse: (index.sparse === true) ? true : undefined
                };
                if ((context.collectionCount > 1) && (context.extends)) {
                    stIndex.__tid = 1;
                }
                let propLen = index.properties?.length ?? 0;
                for(let j = 0; j < propLen; j++){
                    let prop = index.properties[j];
                    let direction = (prop.direction === "DESC") ? -1 : 1;
                    stIndex[prop.property] = direction;
                }
                out.push("\n");
                out.push("  " + (schemaName) + ".index(" + (JSON.stringify(stIndex)) + ", " + (JSON.stringify(opts)) + ");\n");
            }
        }
        out.push("\n");
        out.push("\n");
        for(let i = 0; i < autoincFields.length; i++){
            let aif = autoincFields[i];
            out.push("\n");
            out.push((schemaName) + ".plugin(\n");
            out.push("  mongooseIncr.loadAutoIncr({beginValue: " + (aif.beginValue) + "}, mongoose), {\n");
            out.push("  beginValue: " + (aif.beginValue) + ",\n");
            out.push("  modelName: \"" + (aif.modelName) + "\",\n");
            out.push("  attributeName: \"" + (aif.attributeName) + "\"\n");
            out.push("});\n");
        }
        ;
        out.push("\n");
        out.push("\n");
        out.push((schemaName) + ".plugin(mongooseCreated, { index: true });\n");
        out.push((schemaName) + ".plugin(mongooseLastModified, { index: true });\n");
        out.push("\n");
        out.push("// derived property zone\n");
        if (context.derivedProperties) {
            out.push("\n");
            out.push("const mongooseLeanVirtuals = require('mongoose-lean-virtuals');\n");
            out.push((schemaName) + ".plugin(mongooseLeanVirtuals);\n");
            context.derivedProperties.sort().forEach(function(dprop) {
                out.push("\n");
                out.push("\n");
                if (dprop.requireList) dprop.requireList.split(',').forEach(function(req) {
                    out.push("\n");
                    out.push("require(\"" + (req.trim()) + "\");\n");
                });
                out.push("\n");
                out.push("\n");
                out.push((schemaName) + "\n");
                out.push("  .virtual(\"" + (dprop.virtual_propName) + "\")\n");
                if (dprop.virtual_getMethod) {
                    out.push("\n");
                    out.push("  .get(function(){\n");
                    out.push("    " + (dprop.virtual_getMethod) + "\n");
                    out.push("  })\n");
                    out.push("  ");
                }
                out.push("\n");
                if (dprop.virtual_setMethod) {
                    out.push("\n");
                    out.push("  .set(function(value){\n");
                    out.push("  " + (dprop.virtual_setMethod) + "\n");
                    out.push("  })\n");
                    out.push("  ");
                }
                out.push("\n");
            });
        }
        out.push("\n");
        out.push(";\n");
        out.push("\n");
        let derivedRels = context.relations.filter(function(r) {
            return r.derived && r.derivation && r.derivation.mode == 'server';
        });
        out.push("\n");
        if (derivedRels.length > 0) {
            out.push("\n");
            out.push("\n");
            out.push("// derived associations\n");
            for(let i = 0; i < derivedRels.length; i++){
                let r1 = derivedRels[i];
                out.push("\n");
                out.push("    ");
                if (r1 && r1.derivation) {
                    out.push("\n");
                    out.push("    " + (schemaName) + ".method('" + (r1.derivation.Name) + "', function(callback){\n");
                    out.push("        " + (r1.derivation.DerivationCode) + "\n");
                    out.push("    });\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("  ");
            }
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        if (localStateMachine) {
            out.push("\n");
            out.push("\n");
            out.push("aasmjs.include(" + (schemaName) + ", '" + (schemaName) + "-SM')\n");
            out.push("\n");
            out.push((schemaName) + ".statics.stateMachineName = () => '" + (schemaName) + "-SM'\n");
            out.push("\n");
            out.push((schemaName) + ".statics.aasmInitialState(function(){\n");
            out.push("    return '" + (localStateMachine.initialState) + "'\n");
            out.push("});\n");
            out.push("\n");
            out.push((schemaName) + ".methods.aasmWriteState = function(state){\n");
            out.push("  this.set(\"" + (localStateMachine.stateAttribute) + "\", state)\n");
            out.push("  this.save();\n");
            out.push("  return true\n");
            out.push("};\n");
            out.push("\n");
            out.push((schemaName) + ".methods.aasmWriteStateWithoutPersistence = function(state){\n");
            out.push("  this.set(\"" + (localStateMachine.stateAttribute) + "\", state)\n");
            out.push("  return true\n");
            out.push("};\n");
            out.push("\n");
            out.push((schemaName) + ".methods.aasmReadState = function(state){\n");
            out.push("  return this.get(\"" + (localStateMachine.stateAttribute) + "\")\n");
            out.push("};\n");
            out.push("\n");
            out.push((schemaName) + ".methods.aasmEventFailed = function(newState, oldState){\n");
            out.push("  this.emit('eventFailed', {new:newState, old:oldState})\n");
            out.push("};\n");
            out.push("\n");
            out.push((schemaName) + ".methods.aasmEventFired = function(newState, oldState, state){\n");
            out.push("  this.emit('eventFired', {new:newState, old:oldState})\n");
            out.push("};\n");
            out.push("\n");
            out.push((schemaName) + ".methods.fireError = function(error){\n");
            out.push("  console.error('error', error)\n");
            out.push("  // if there is no error listeners then code will throw\n");
            out.push("  this.emit('error', error)\n");
            out.push("};\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("// ensure section\n");
        out.push("\n");
        out.push("global.EnsureIndex.toBeIndexed.push({location: '" + (context.locationType) + "', model:'" + (context.thingType) + "'});\n");
        out.push("\n");
        out.push("global.RegisterSchema.jobs.push(function(mongoose) {\n");
        out.push("\n");
        out.push("  if(typeof(global." + (context.namespace) + ")=='undefined') global." + (context.namespace) + " = {};\n");
        out.push("\n");
        out.push("  let alreadyOverriden = !!global." + (context.thingType) + " && mongoose.model('" + (context.thingType) + "')\n");
        out.push("\n");
        out.push("  let $collection = global." + (context.thingType) + " = alreadyOverriden ? mongoose.model('" + (context.thingType) + "') : mongoose.model('" + (context.thingType) + "', global.SchemaCache." + (context.thingType) + ");\n");
        out.push("\n");
        function take(index) {
            return function(list) {
                return list[index];
            };
        }
        function append(item) {
            return function(list) {
                return [
                    item
                ].concat(list);
            };
        }
        function splitToJSON(str, action) {
            let res = (str && str != '') ? str.split(/[\s,]/).filter(function(item) {
                return item && item != '';
            }) : [];
            if (action && typeof (action) == 'function') res = action(res);
            return JSON.stringify(res);
        }
        if (localStateMachine) {
            out.push("\n");
            out.push("\n");
            localStateMachine.state?.forEach(function(st) {
                let count = -1;
                out.push("\n");
                out.push("$collection.aasmState('" + (st.name) + "', {\n");
                out.push("\n");
                if (st.displayName && st.displayName != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  display: " + (JSON.stringify(st.displayName)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (st.beforeEnter && st.beforeEnter != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  beforeEnter:" + (splitToJSON(st.beforeEnter)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (st.enter && st.enter != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  enter:" + (splitToJSON(st.enter)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (st.afterEnter && st.afterEnter != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  afterEnter:" + (splitToJSON(st.afterEnter)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (st.beforeExit && st.beforeExit != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  beforeExit:" + (splitToJSON(st.beforeExit)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (st.exit && st.exit != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  exit:" + (splitToJSON(st.exit)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (st.afterExit && st.afterExit != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("  afterExit:" + (splitToJSON(st.afterExit)) + "\n");
                }
                out.push("\n");
                out.push("\n");
                if (++count > 0) {
                    out.push(" , ");
                }
                out.push("\n");
                out.push("  onError:" + (splitToJSON(st.onError, append('fireError'))) + "\n");
                out.push("\n");
                out.push("\n");
                out.push("});\n");
            });
            out.push("\n");
            out.push("\n");
            localStateMachine.event?.forEach(function(ev) {
                let count = -1;
                out.push("\n");
                out.push("\n");
                out.push("  $collection.aasmEvent(\"" + (ev.eventName) + "\",{\n");
                out.push("\n");
                if (ev.onAfter && ev.onAfter != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(" , ");
                    }
                    out.push("\n");
                    out.push("    after:" + (splitToJSON(ev.onAfter)) + "\n");
                    out.push("  ");
                }
                out.push("\n");
                out.push("\n");
                if (ev.onBefore && ev.onBefore != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(", ");
                    }
                    out.push("\n");
                    out.push("    before:" + (splitToJSON(ev.onBefore)) + "\n");
                    out.push("  ");
                }
                out.push("\n");
                out.push("\n");
                if (ev.onSuccess && ev.onSuccess != '') {
                    out.push("\n");
                    out.push("  ");
                    if (++count > 0) {
                        out.push(", ");
                    }
                    out.push("\n");
                    out.push("    success:" + (splitToJSON(ev.onSuccess)) + "\n");
                    out.push("  ");
                }
                out.push("\n");
                out.push("\n");
                if (++count > 0) {
                    out.push(", ");
                }
                out.push("\n");
                out.push("  error:" + (splitToJSON(ev.onError, append('fireError'))) + "\n");
                out.push("  },\n");
                out.push("  function(){\n");
                if (ev.transition) {
                    ev.transition.sort(function(a, b) {
                        if (a.order < b.order) {
                            return -1;
                        } else if (a.order > b.order) {
                            return 1;
                        } else return 0;
                    }).forEach(function(trans) {
                        out.push("\n");
                        out.push("    this.transitions({\n");
                        out.push("      from:" + (splitToJSON(trans.from)) + ",\n");
                        out.push("      to:" + (splitToJSON(trans.to, take(0))) + "\n");
                        out.push("\n");
                        if (trans.guard && trans.guard != '') {
                            out.push(",\n");
                            out.push("      guard:" + (splitToJSON(trans.guard)) + "\n");
                        }
                        out.push("\n");
                        out.push("\n");
                        if (trans.onTransition && trans.onTransition != '') {
                            out.push(",\n");
                            out.push("      onTransition:" + (splitToJSON(trans.onTransition)));
                        }
                        out.push(", onError:" + (splitToJSON(trans.onError, append('fireError'))) + "\n");
                        out.push("    });\n");
                    });
                }
                out.push("\n");
                out.push("  });\n");
                out.push("\n");
            });
            out.push("\n");
        }
        out.push("\n");
        out.push("\n");
        out.push("// finders\n");
        out.push("\n");
        let inList = [];
        out.push("\n");
        if ((context.collectionCount > 1) && (context.extends)) {
            if (context.allChilds && context.allChilds.length > 0) {
                inList.push(...context.allChilds);
            }
            inList.push(context.thingType);
            out.push("\n");
            out.push("// TODO придумать конструктор в котором будет инициализироваться это поле по умолчанию!!!\n");
            out.push("// ну короче что-то придумать чтобы сохранить значение\n");
            out.push("  // $collection.schema.paths[\"__tid\"] =\n");
            out.push("  // $collection.schema.interpretAsType(\"__tid\", {type:String, index:true, default:'" + (context.thingType) + "'}, mongoose.model('" + (context.thingType) + "').prototype.schema.options);\n");
            out.push("\n");
            out.push("  $collection.baseFind = alreadyOverriden ? $collection.baseFind : $collection.find ;\n");
            out.push("    $collection.find = function (conditions, fields, options, callback) {\n");
            out.push("        if ('function' == typeof conditions) {\n");
            out.push("            callback = conditions;\n");
            out.push("            conditions = {};\n");
            out.push("            fields = null;\n");
            out.push("            options = null;\n");
            out.push("        } else if ('function' == typeof fields) {\n");
            out.push("            callback = fields;\n");
            out.push("            fields = null;\n");
            out.push("            options = null;\n");
            out.push("        } else if ('function' == typeof options) {\n");
            out.push("            callback = options;\n");
            out.push("            options = null;\n");
            out.push("        }\n");
            out.push("\n");
            out.push("        if (!conditions)\n");
            out.push("            conditions = {};\n");
            out.push("\n");
            if (inList.length > 1) {
                out.push("\n");
                out.push("        conditions['__tid'] = {$in:" + (JSON.stringify(inList)) + "};\n");
            } else {
                out.push("\n");
                out.push("        conditions['__tid'] = \"" + (context.thingType) + "\";\n");
            }
            out.push("\n");
            out.push("        return this.baseFind(conditions, fields, options, callback);\n");
            out.push("    };\n");
            out.push("    //findOne\n");
            out.push("    $collection.baseFindOne = alreadyOverriden ? $collection.baseFindOne : $collection.findOne;\n");
            out.push("    $collection.findOne = function (conditions, fields, options, callback) {\n");
            out.push("        if ('function' == typeof conditions) {\n");
            out.push("            callback = conditions;\n");
            out.push("            conditions = {};\n");
            out.push("            fields = null;\n");
            out.push("            options = null;\n");
            out.push("        } else if ('function' == typeof fields) {\n");
            out.push("            callback = fields;\n");
            out.push("            fields = null;\n");
            out.push("            options = null;\n");
            out.push("        } else if ('function' == typeof options) {\n");
            out.push("            callback = options;\n");
            out.push("            options = null;\n");
            out.push("        }\n");
            out.push("\n");
            out.push("        if (!conditions)\n");
            out.push("            conditions = {};\n");
            if (inList.length > 1) {
                out.push("\n");
                out.push("        conditions['__tid'] = {$in:" + (JSON.stringify(inList)) + "};\n");
            } else {
                out.push("\n");
                out.push("        conditions['__tid'] = \"" + (context.thingType) + "\";\n");
            }
            out.push("\n");
            out.push("        return this.baseFindOne(conditions, fields, options, callback);\n");
            out.push("    };\n");
            out.push("\n");
            out.push("    //findOne\n");
            out.push("    $collection.baseCount = alreadyOverriden ? $collection.baseCount : $collection.count;\n");
            out.push("    $collection.count = function (conditions, callback) {\n");
            out.push("        if ('function' == typeof conditions) {\n");
            out.push("            callback = conditions;\n");
            out.push("            conditions = {};\n");
            out.push("            fields = null;\n");
            out.push("            options = null;\n");
            out.push("        } else if ('function' == typeof fields) {\n");
            out.push("            callback = fields;\n");
            out.push("            fields = null;\n");
            out.push("            options = null;\n");
            out.push("        } else if ('function' == typeof options) {\n");
            out.push("            callback = options;\n");
            out.push("            options = null;\n");
            out.push("        }\n");
            out.push("\n");
            out.push("        if (!conditions)\n");
            out.push("            conditions = {};\n");
            if (inList.length > 1) {
                out.push("\n");
                out.push("        conditions['__tid'] = {$in:" + (JSON.stringify(inList)) + "};\n");
            } else {
                out.push("\n");
                out.push("        conditions['__tid'] = \"" + (context.thingType) + "\";\n");
            }
            out.push("\n");
            out.push("        return this.baseCount(conditions, callback);\n");
            out.push("    };\n");
        }
        out.push("\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/thing.classic.njs.js.map
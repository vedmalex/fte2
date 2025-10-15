/**
 * @typedef {object} Template_Context
 * @property {Record<string, any>} context
 */
const Factory = require("fte.js-standalone").TemplateFactoryStandalone;
const templates = {
    ['web/compile.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("var Factory = require(\"fte.js\").Factory;\n");
            out.push("global.fte = new Factory();\n");
            var item;
            for(var i = 0, len = context.length; i < len; i++){
                item = context[i];
                out.push("\n");
                out.push("fte.load(require(\"./" + (context[i]) + "\"),\"" + (context[i]) + "\");\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['static/thing.njs']: {
        chunks: "$$$main$$$",
        script: function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            const _partial = partial;
            partial = function(obj, template) {
                const result = _partial(obj, template);
                if (Array.isArray(result)) {
                    result.forEach((r)=>{
                        chunkEnsure(r.name, r.content);
                    });
                    return '';
                } else {
                    return result;
                }
            };
            const main = '$$$main$$$';
            var current = main;
            let outStack = [
                current
            ];
            let result;
            function chunkEnsure(name, content) {
                if (!result) {
                    result = {};
                }
                if (!result.hasOwnProperty(name)) {
                    result[name] = content ? content : [];
                }
            }
            function chunkStart(name) {
                chunkEnsure(name);
                chunkEnd();
                current = name;
                out = [];
            }
            function chunkEnd() {
                result[current].push(...out);
                out = [];
                current = outStack.pop() || main;
            }
            chunkStart(main);
            const [ns, thingType] = context.thingType.split('.');
            out.push("\n");
            out.push("\n");
            chunkStart(`./${thingType}.js`);
            out.push("\n");
            out.push("\n");
            const chunks = [
                'model',
                'store',
                'metadata',
                'app'
            ];
            out.push("\n");
            out.push("Ext.require(" + (JSON.stringify(chunks.map((chunk)=>`things.${ns}.${chunk}.${thingType}`))) + ",\n");
            out.push("    function(){\n");
            out.push("        Ext.define('things." + (context.thingType) + "',{});\n");
            out.push("    }\n");
            out.push(")\n");
            chunkStart(`./model/${thingType}.js`);
            out.push("\n");
            out.push("// model\n");
            context.metaview.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("\n");
            context.metamodel.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("\n");
            context.model.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("Ext.define('things." + (ns) + ".model." + (thingType) + "',{});\n");
            out.push("\n");
            chunkStart(`./store/${thingType}.js`);
            out.push("\n");
            out.push("Ext.require('things." + (ns) + ".model." + (thingType) + "', function() {\n");
            out.push("// stores\n");
            out.push("    ");
            context.store.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.metagridcombo.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("\n");
            out.push("    ");
            context.renderstore.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("\n");
            out.push("    Ext.define('things." + (ns) + ".store." + (thingType) + "',{});\n");
            out.push("})\n");
            out.push("\n");
            chunkStart(`./metadata/${thingType}.js`);
            out.push("\n");
            out.push("Ext.require(['things." + (ns) + ".model." + (thingType) + "','things." + (ns) + ".store." + (thingType) + "'], function() {\n");
            out.push("    //metadata\n");
            out.push("    ");
            context.metafieldsets.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.metaclientmethods.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.metagridfields.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.metaviewfields.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.metaeditfields.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.metasearchfields.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    Ext.define('things." + (ns) + ".metadata." + (thingType) + "',{});\n");
            out.push("})\n");
            out.push("\n");
            chunkStart(`./app/${thingType}.js`);
            out.push("\n");
            out.push("Ext.require(['things." + (ns) + ".model." + (thingType) + "','things." + (ns) + ".store." + (thingType) + "','things." + (ns) + ".metadata." + (thingType) + "'], function(){\n");
            out.push("    //extjs\n");
            out.push("    ");
            context.view.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.domain.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    ");
            context.controller.forEach((file)=>{
                out.push("\n");
                out.push("    " + (file) + "\n");
                out.push("    ");
            });
            out.push("\n");
            out.push("    Ext.define('things." + (ns) + ".app." + (thingType) + "',{});\n");
            out.push("})\n");
            chunkEnd();
            chunkEnd();
            out = Object.keys(result).filter((i)=>i !== '$$$main$$$').map((curr)=>({
                    name: curr,
                    content: result[curr]
                }));
            if (out.some((t)=>typeof t == 'object')) {
                return out.map(chunk = ({
                    ...chunk,
                    content: Array.isArray(chunk.content) ? chunk.content.join('') : chunk.content
                }));
            } else {
                return out.join('');
            }
        },
        compile: function() {
            this.chunks = "$$$main$$$";
        },
        dependency: {}
    },
    ['static/namespace.njs']: {
        script: function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            out.push("// model\n");
            out.push("// " + (context.name) + "\n");
            out.push("\n");
            context.metaview.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("\n");
            context.metamodel.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("\n");
            context.model.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("\n");
            out.push("// stores\n");
            context.store.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.metagridcombo.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.renderstore.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("//metadata\n");
            context.metafieldsets.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.metaclientmethods.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.metagridfields.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.metaviewfields.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.metaeditfields.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.metasearchfields.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("//extjs\n");
            context.view.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.domain.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            context.controller.forEach((file)=>{
                out.push("\n");
                out.push((file) + "\n");
            });
            out.push("\n");
            out.push("\n");
            if (context.reqThings.length > 0) {
                out.push("\n");
                out.push("Ext.require(" + (JSON.stringify(context.reqThings)) + ",\n");
                out.push("    function(){\n");
                out.push("        Ext.define('namespace." + (context.name) + "',{});\n");
                out.push("    }\n");
                out.push(")\n");
            } else {
                out.push("\n");
                out.push("Ext.define('namespace." + (context.name) + "',{});\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/undefined.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push((context.thingType) + "\n");
            out.push((context.name) + "\n");
            out.push((JSON.stringify(context)));
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/schema.item.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("var schema = require(USEGLOBAL(\"schemaExport/registerImport.js\"));\n");
            out.push("\n");
            out.push("schema.register(\"" + (context.itemType) + "\"," + (context.itemValue) + ");");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/package.json.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("{\n");
            out.push("  \"name\": \"" + (context.name) + "\",\n");
            out.push("  \"version\": \"0.0.1\",\n");
            out.push("  \"description\": \"grainjs application bundle for '" + (context.name) + "'\",\n");
            out.push("  \"main\": \"start.js\",\n");
            out.push("  \"dependencies\": {\n");
            let modules = context.modules.toArray();
            let len = modules.length ?? 0;
            for(let i = 0; i < len; i++){
                let module = modules[i];
                out.push("\n");
                out.push("  \"" + (module.name) + "\":\"" + (module.version ? module.version : '*') + "\"\n");
                out.push("  ");
                if (i != len - 1) {
                    out.push(",");
                }
                out.push("\n");
            }
            out.push("\n");
            out.push("  },\n");
            out.push("  \"scripts\": {\n");
            out.push("    \"start\": \"node start.js\",\n");
            out.push("    \"debug\": \"DEBUG=* node start.js\"\n");
            out.push("    }\n");
            out.push("}");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/json.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context.body) {
                out.push("\n");
                out.push("function json (){\n");
                out.push("  return " + (context.body) + "\n");
                out.push("}\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/func_template.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context.body) {
                out.push("\n");
                out.push("(" + (context.params ? context.params : '') + ") =>`" + (context.body) + "`\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/func_lambda.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context.body) {
                out.push("\n");
                out.push("(" + (context.params ? context.params : '') + ")=>{\n");
                out.push("    " + (context.body) + "\n");
                out.push("}\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/func.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context.body) {
                out.push("\n");
                out.push("function " + (context.name ?? 'func') + "(" + (context.params ? context.params : '') + "){\n");
                out.push("  " + (context.body) + "\n");
                out.push("}\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/service/grainjs.dev.service.conf.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("#!upstart\n");
            out.push("description \"run dev server for " + (context.grainjsName) + "\"\n");
            out.push("author      \"grain.js-framework\"\n");
            out.push("\n");
            out.push("#start on startup\n");
            out.push("#stop on shutdown\n");
            out.push("start on (net-device-up\n");
            out.push("          and local-filesystems\n");
            out.push("          and runlevel [2345])\n");
            out.push("stop on runlevel [016]\n");
            out.push("\n");
            out.push("script\n");
            out.push("    cd \"" + (context.grainUserRoot) + "\"\n");
            out.push("    sudo grainjs dev 2>&1 >> server.log\n");
            out.push("end script");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/service/grainjs.app.service.conf.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("#!upstart\n");
            out.push("description \"run app server for Modeleditor\"\n");
            out.push("author      \"grain.js-framework\"\n");
            out.push("\n");
            out.push("#start on startup\n");
            out.push("#stop on shutdown\n");
            out.push("start on (net-device-up\n");
            out.push("          and local-filesystems\n");
            out.push("          and runlevel [2345])\n");
            out.push("stop on runlevel [016]\n");
            out.push("\n");
            out.push("script\n");
            out.push("    cd \"" + (context.grainUserRoot) + "\"\n");
            out.push("    sudo grainjs run \"Modeleditor\" 2>&1 >> server.log\n");
            out.push("end script");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/thing.classic.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
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
    },
    ['server/Meta.Thing/graphql.njs']: {
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
            out.push("// условия, такие же как на запросной части приложения\n");
            out.push("\n");
            out.push("\n");
            out.push("\n");
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
                out.push("        " + (context.$namespace) + (context.$name) + "\n");
                out.push("        ");
                context.allChilds.forEach((item)=>{
                    out.push("\n");
                    out.push("        | " + (item.replaceAll('.', '')) + "\n");
                    out.push("        ");
                });
                out.push("\n");
                out.push("    `,\n");
                out.push("    resolver: variant_union_resolver\n");
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
            out.push("    _tid: root => root.__tid,\n");
            out.push("    ");
            if (allRels.length > 0) {
                out.push("\n");
                out.push("    childRel: (root, args, context, info) => {\n");
                out.push("      return root\n");
                out.push("    },\n");
                out.push("    ");
            }
            out.push("\n");
            for(let i = 0, props = context.properties, proplen = props?.length ?? 0; i < proplen; i++){
                out.push("\n");
                out.push("  ");
                let pName = props[i].propertyName.replaceAll('.', '');
                out.push("\n");
                out.push("      ");
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
                    out.push("      " + (pName) + ":(root, args, context, info) => get(root,\"" + (props[i].propertyName) + "\"),\n");
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
                out.push("      _tid: String\n");
                for(let i = 0, props = context.properties, proplen = props?.length ?? 0; i < proplen; i++){
                    let pName = props[i].propertyName.replaceAll('.', '');
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
                return out.join('');
            }
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.metaviewfields_old.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            const arrayToHash = context.arrayToHash;
            const getFormat = context.getFormat;
            let properties = arrayToHash(context.formviewProps, "propertyName");
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.metaviewfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'viewfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("    ");
            for(let pName in properties){
                if (Object.prototype.hasOwnProperty.call(properties, pName)) {
                    let property = properties[pName][0];
                    let fviews = arrayToHash(property.formview, "profile", property, "form");
                    const _fArr = (fviews[context.$$$profile] !== undefined) ? fviews[context.$$$profile] : fviews['default'];
                    const fArr = _.sortBy(_fArr, [
                        'order',
                        'displayName'
                    ]);
                    for(let k = 0; k < fArr.length; k++){
                        let f = fArr[k];
                        out.push("\n");
                        out.push("              [`" + (property.propertyName) + "::" + (f.displayName) + "`]:{\n");
                        out.push("                name:           '" + (property.propertyName) + "',\n");
                        out.push("                ");
                        if (f.displayName !== '_') {
                            out.push("\n");
                            out.push("                fieldLabel:     _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'labels','" + (property.propertyName) + "'),\n");
                            out.push("                cls:   \"displayFld custom-x-field\",\n");
                            out.push("                ");
                        } else {
                            out.push("\n");
                            out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                            out.push("                ");
                        }
                        out.push("\n");
                        out.push("                hidden:         " + (f.hidden) + ",\n");
                        out.push("                ");
                        if (f.labelWidth) {
                            out.push("\n");
                            out.push("                labelStyle:     'min-width:" + (f.labelWidth) + "px;',\n");
                            out.push("                ");
                        }
                        out.push("\n");
                        out.push("                labelAlign:     " + (JSON.stringify(f.labelAlign)) + ",\n");
                        out.push("                labelWidth:     " + (f.labelWidth) + ",\n");
                        out.push("                columnWidth:    " + (f.columnWidth) + ",\n");
                        out.push("                renderer:       " + (context.getDisplayFieldRenderer(f)) + ",\n");
                        out.push("                dataType:       '" + (property.type.toLowerCase()) + "',\n");
                        out.push("                grow:           " + (f.grow) + ",\n");
                        out.push("                format:         " + (getFormat(f)) + ",\n");
                        out.push("                margin: \"4px\",\n");
                        out.push("\n");
                        out.push("                ");
                        if (f.fieldtype === 'checkbox') {
                            out.push("\n");
                            out.push("                xtype:         'checkbox',\n");
                            out.push("                readOnly:       true,\n");
                            out.push("                inputValue:         1,\n");
                            out.push("                uncheckedValue:     0,\n");
                            out.push("                ");
                        } else {
                            out.push("\n");
                            out.push("                xtype:         'displayfield',\n");
                            out.push("                ");
                        }
                        out.push("\n");
                        out.push("                ");
                        if (f.fieldtype === "combobox") {
                            out.push("\n");
                            out.push("                comboOptions:   Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions['" + (property.propertyName) + "'],\n");
                            out.push("                ");
                            if (f.comboForcePreload) {
                                out.push("\n");
                                out.push("                renderStore: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                                out.push("                ");
                            } else {
                                out.push("\n");
                                out.push("                // renderStore: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "]?.store(),\n");
                                out.push("                ");
                            }
                            out.push("\n");
                            out.push("                ");
                        }
                        out.push("\n");
                        out.push("              },\n");
                        out.push("            ");
                    }
                }
            }
            out.push("\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.metaviewfields.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            const arrayToHash = context.arrayToHash;
            const getFormat = context.getFormat;
            let properties = context.formview.filter((fv)=>fv.generated);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.metaviewfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'viewfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("    ");
            for(let i = 0; i < properties.length; i += 1){
                const f = properties[i];
                let property = f.property;
                out.push("\n");
                out.push("              [`" + (property.propertyName) + "::" + (f.displayName) + "`]:{\n");
                out.push("                name:           '" + (property.propertyName) + "',\n");
                out.push("                ");
                if (f.displayName !== '_') {
                    out.push("\n");
                    out.push("                fieldLabel:     _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'labels','" + (property.propertyName) + "'),\n");
                    out.push("                cls:   \"displayFld custom-x-field\",\n");
                    out.push("                ");
                } else {
                    out.push("\n");
                    out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("                hidden:         " + (f.hidden) + ",\n");
                out.push("                ");
                if (f.labelWidth) {
                    out.push("\n");
                    out.push("                labelStyle:     'min-width:" + (f.labelWidth) + "px;',\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("                labelAlign:     " + (JSON.stringify(f.labelAlign)) + ",\n");
                out.push("                labelWidth:     " + (f.labelWidth) + ",\n");
                out.push("                columnWidth:    " + (f.columnWidth) + ",\n");
                out.push("                renderer:       " + (context.getDisplayFieldRenderer(f)) + ",\n");
                out.push("                dataType:       '" + (property.type.toLowerCase()) + "',\n");
                out.push("                grow:           " + (f.grow) + ",\n");
                out.push("                format:         " + (getFormat(f)) + ",\n");
                out.push("                margin: \"4px\",\n");
                out.push("\n");
                out.push("                ");
                if (f.fieldtype === 'checkbox') {
                    out.push("\n");
                    out.push("                xtype:         'checkbox',\n");
                    out.push("                readOnly:       true,\n");
                    out.push("                inputValue:         1,\n");
                    out.push("                uncheckedValue:     0,\n");
                    out.push("                ");
                } else {
                    out.push("\n");
                    out.push("                xtype:         'displayfield',\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("                ");
                if (f.fieldtype === "combobox") {
                    out.push("\n");
                    out.push("                comboOptions:   Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions['" + (property.propertyName) + "'],\n");
                    out.push("                ");
                    if (f.comboForcePreload) {
                        out.push("\n");
                        out.push("                renderStore: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                        out.push("                ");
                    } else {
                        out.push("\n");
                        out.push("                // renderStore: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "]?.store(),\n");
                        out.push("                ");
                    }
                    out.push("\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("              },\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.metasearchfields.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            const getFormat = context.getFormat;
            const needClear = context.needClear;
            let properties = context.formview.filter((fv)=>!fv.hiddenForSearch);
            const searchTypes = {
                baseimage: 'textfield',
                baselabel: 'textfield',
                basetemplateeditor: 'textareafield',
                checkbox: 'checkbox',
                codeeditor: 'textareafield',
                combobox: 'combobox',
                datefield: 'datefield',
                datetimefield: 'datetimefield',
                displayfield: 'displayfield',
                extcalendarcombo: 'extcalendarcombo',
                extentionsGrid: 'textareafield',
                filecontainer: 'textfield',
                numberfield: 'numberfield',
                tbspacer: 'tbspacer',
                textareafield: 'textareafield',
                textfield: 'textfield',
                timefield: 'timefield'
            };
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.metasearchfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'searchfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("    ");
            for(let i = 0; i < properties.length; i += 1){
                const f = properties[i];
                let property = f.property;
                out.push("\n");
                out.push("            [`" + (property.propertyName) + "::" + (f.displayName) + "`]: (legacy)=>{\n");
                out.push("              const res = {\n");
                out.push("                name:               '" + (property.propertyName) + "',\n");
                out.push("                format:             " + (getFormat(f)) + ",\n");
                out.push("                plugins: ");
                if (needClear(f, true)) {
                    out.push("[`clearbutton`]");
                } else {
                    out.push("[]");
                }
                out.push(",\n");
                out.push("              ");
                if (f.fieldtype == 'checkbox') {
                    out.push("\n");
                    out.push("                  margin: \"0 5 5\",\n");
                    out.push("                  inputValue:         1,\n");
                    out.push("                  uncheckedValue:     0,\n");
                    out.push("              ");
                } else if (f.fieldtype == 'numberfield') {
                    out.push("\n");
                    out.push("                  step:" + (f.step) + ",\n");
                    out.push("                  fieldStyle:\"text-align: right;\",\n");
                    out.push("                  ");
                    if (property.enableMin) {
                        out.push("\n");
                        out.push("                      minValue:" + (property.min ? property.min : 0) + ",\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                  ");
                    if (property.enableMax) {
                        out.push("\n");
                        out.push("                      maxValue:" + (property.max ? property.max : 0) + ",\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                  ");
                    if (property.type.toLowerCase() == "integer") {
                        out.push("\n");
                        out.push("                      allowDecimals:false,\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                ");
                } else if (f.fieldtype == 'combobox') {
                    if (f.comboData && f.comboData != "" && f.comboData != "{}") {
                        let cdata = JSON.parse(f.comboData);
                        if (cdata.store != undefined && cdata.displayField != undefined && cdata.valueField != undefined) {
                            out.push("\n");
                            out.push("                      store: ");
                            if (typeof (cdata.store) == "string") {
                                out.push("Ext.create('Modeleditor.store." + (cdata.store) + "', {\n");
                                out.push("                        remoteFilter: false,\n");
                                out.push("                        remoteSort: false,\n");
                                out.push("                        pageSize: -1\n");
                                out.push("                      }),");
                            } else if (typeof (cdata.store) == "object") {
                                out.push("Ext.create(\"Ext.data.Store\", {\n");
                                out.push("                          " + (JSON.stringify(cdata.store)) + "\n");
                                out.push("                        }),");
                            }
                            out.push("\n");
                            out.push("                      displayField: '" + (cdata.displayField) + "',\n");
                            out.push("                      valueField: '" + (cdata.valueField) + "',\n");
                            out.push("                      queryMode: 'local',\n");
                            out.push("                      // queryParam: \"filter::" + (cdata.valueField) + "\",\n");
                            out.push("                      listeners: {\n");
                            out.push("                        focus: function(combo, event, eOpts ){\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          combo.queryFilter = false;\n");
                            out.push("                          store.clearFilter(true);\n");
                            out.push("                        },\n");
                            out.push("                        afterrender: function (combo, opts) {\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          store.clearFilter(true); // If true the filter is cleared silently;\n");
                            out.push("                          if(store.isLoading()){\n");
                            out.push("                            combo.setLoading(true);\n");
                            out.push("                            store.on({\n");
                            out.push("                              load: {\n");
                            out.push("                                fn: function(st, records, success, opts){\n");
                            out.push("                                  if(success) {\n");
                            out.push("                                    this.setLoading(false);\n");
                            out.push("                                  }\n");
                            out.push("                                },\n");
                            out.push("                                scope: combo,\n");
                            out.push("                                single: true\n");
                            out.push("                              }\n");
                            out.push("                            });\n");
                            out.push("                          }else{\n");
                            out.push("                            if (!store.loaded) {\n");
                            out.push("                              combo.setLoading(true);\n");
                            out.push("                              store.load(function(records, operation, success){\n");
                            out.push("                                if(success){\n");
                            out.push("                                  store.loaded = true;\n");
                            out.push("                                  combo.setLoading(false);\n");
                            out.push("                                }\n");
                            out.push("                              });\n");
                            out.push("                            };\n");
                            out.push("                          }\n");
                            out.push("                        }\n");
                            out.push("                      },\n");
                            out.push("                      ");
                        } else if (cdata.customStore != undefined && cdata.customStore === true) {
                            out.push("\n");
                            out.push("                      ");
                            if (cdata.tpl) {
                                out.push("\n");
                                out.push("                        tpl: " + (JSON.stringify(cdata.tpl)) + ",\n");
                                out.push("                      ");
                            }
                            out.push("\n");
                            out.push("                      store: Ext.create(\"Ext.data.Store\", {\n");
                            out.push("                        autoSync: ");
                            if (cdata.autoSync) {
                                out.push((cdata.autoSync));
                            } else {
                                out.push("false");
                            }
                            out.push(",");
                            if (cdata.model) {
                                out.push("\n");
                                out.push("                        model: \"" + (cdata.model) + "\",");
                            } else {
                                out.push("\n");
                                out.push("                        fields: ");
                                if (cdata.fields) {
                                    out.push((JSON.stringify(cdata.fields)));
                                } else {
                                    out.push("['name', 'value']");
                                }
                            }
                            ;
                            if (cdata.sorters) {
                                out.push(",\n");
                                out.push("                        sorters: " + (JSON.stringify(cdata.sorters)));
                            }
                            ;
                            if (cdata.apiRead) {
                                out.push(",\n");
                                out.push("                        autoLoad: ");
                                if (cdata.autoLoad) {
                                    out.push((cdata.autoLoad));
                                } else {
                                    out.push("false");
                                }
                                out.push(",\n");
                                out.push("                        proxy: {\n");
                                out.push("                          type: ");
                                if (cdata.proxyType) {
                                    out.push("\n");
                                    out.push("                                  \"" + (cdata.proxyType) + "\",\n");
                                    out.push("                                ");
                                } else {
                                    out.push("\n");
                                    out.push("                                  \"direct\",\n");
                                    out.push("                                ");
                                }
                                out.push("\n");
                                out.push("                          api: {\n");
                                out.push("                            read: " + (cdata.apiRead) + "\n");
                                out.push("                          }\n");
                                out.push("                          ");
                                if (cdata.extraParams) {
                                    out.push(",\n");
                                    out.push("                          extraParams: " + (JSON.stringify(cdata.extraParams)));
                                }
                                ;
                                if (cdata.reader) {
                                    out.push(",\n");
                                    out.push("                          reader: " + (JSON.stringify(cdata.reader)));
                                }
                                ;
                                if (cdata.writer) {
                                    out.push(",\n");
                                    out.push("                          writer: " + (JSON.stringify(cdata.writer)));
                                }
                                out.push("\n");
                                out.push("                        }");
                            } else {
                                out.push(",\n");
                                out.push("                        data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, [");
                                if (cdata.displayField) {
                                    out.push("\"" + (cdata.displayField) + "\"");
                                } else {
                                    out.push("'name'");
                                }
                                out.push("]: _t(item[");
                                if (cdata.displayField) {
                                    out.push("\"" + (cdata.displayField) + "\"");
                                } else {
                                    out.push("'name'");
                                }
                                out.push("],'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                                out.push("                        ");
                            }
                            out.push("\n");
                            out.push("                      }),\n");
                            out.push("                      displayField: ");
                            if (cdata.displayField) {
                                out.push("\"" + (cdata.displayField) + "\"");
                            } else {
                                out.push("'name'");
                            }
                            out.push(",\n");
                            out.push("                      valueField: ");
                            if (cdata.valueField) {
                                out.push("\"" + (cdata.valueField) + "\"");
                            } else {
                                out.push("\"value\"");
                            }
                            out.push(",\n");
                            out.push("                      queryMode: ");
                            if (cdata.queryMode) {
                                out.push("\"" + (cdata.queryMode) + "\"");
                            } else {
                                out.push("\"local\"");
                            }
                            out.push(",");
                        } else {
                            out.push("\n");
                            out.push("                      store: Ext.create('Ext.data.Store', {\n");
                            out.push("                        fields: ['name', 'value'],\n");
                            out.push("                        data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, name: _t(item.name,'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                            out.push("                      }),\n");
                            out.push("                      displayField: 'name',\n");
                            out.push("                      valueField: 'value',\n");
                            out.push("                      queryMode: 'local',\n");
                            out.push("                      listeners: {\n");
                            out.push("                        focus: function(combo, event, eOpts ){\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          combo.queryFilter = false;\n");
                            out.push("                          store.clearFilter(true);\n");
                            out.push("                        },\n");
                            out.push("                        afterrender: function (combo, opts) {\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          store.clearFilter(true); // If true the filter is cleared silently;\n");
                            out.push("                          if(store.isLoading()){\n");
                            out.push("                            combo.setLoading(true);\n");
                            out.push("                            store.on({\n");
                            out.push("                              load: {\n");
                            out.push("                                fn: function(st, records, success, opts){\n");
                            out.push("                                  if(success) {\n");
                            out.push("                                    this.setLoading(false);\n");
                            out.push("                                  }\n");
                            out.push("                                },\n");
                            out.push("                                scope: combo,\n");
                            out.push("                                single: true\n");
                            out.push("                              }\n");
                            out.push("                            });\n");
                            out.push("                          }else{\n");
                            out.push("                            if (!store.loaded) {\n");
                            out.push("                              combo.setLoading(true);\n");
                            out.push("                              store.load(function(records, operation, success){\n");
                            out.push("                                if(success){\n");
                            out.push("                                  store.loaded = true;\n");
                            out.push("                                  combo.setLoading(false);\n");
                            out.push("                                }\n");
                            out.push("                              });\n");
                            out.push("                            };\n");
                            out.push("                          }\n");
                            out.push("                        }\n");
                            out.push("                      },\n");
                            out.push("                      ");
                        }
                    }
                    out.push("\n");
                    out.push("                  forceSelection: " + (f.forceSelection) + ",\n");
                    out.push("                  editable: " + (f.comboAutocomplete) + ",\n");
                    out.push("              ");
                }
                ;
                out.push("\n");
                out.push("              ");
                if (f.prepareForSearch !== undefined) {
                    out.push("\n");
                    out.push("\t\t\t\t\t\t\t\tprepareFn: function (value) {\n");
                    out.push("\t\t\t\t\t\t\t\t\t" + (f.prepareForSearch) + "\n");
                    out.push("\t\t\t\t\t\t\t\t},");
                }
                out.push("\n");
                out.push("                dataType: '" + (property.type.toLowerCase()) + "',\n");
                out.push("                xtype: '" + (searchTypes[f.fieldtype]) + "',\n");
                out.push("                ");
                if (f.displayName !== '_') {
                    out.push("\n");
                    out.push("                cls:   \"custom-x-field\",\n");
                    out.push("                fieldLabel: _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "','labels','" + (property.propertyName) + "'),\n");
                    out.push("                ");
                } else {
                    out.push("\n");
                    out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("                ");
                if (f.labelWidth) {
                    out.push("\n");
                    out.push("                labelStyle: 'min-width:" + (f.labelWidth) + "px;',\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("            }\n");
                out.push("            if(!legacy) {\n");
                out.push("              return {\n");
                out.push("                xtype: 'fieldcontainer',\n");
                out.push("                layout: 'hbox',\n");
                out.push("                columnWidth: 1,\n");
                out.push("                grow: true,\n");
                out.push("                items: [\n");
                out.push("                  {\n");
                out.push("                    ...res,\n");
                out.push("                    flex:1,\n");
                out.push("                    grow: true,\n");
                out.push("                  },\n");
                out.push("                  {\n");
                out.push("                    xtype: 'tbspacer',\n");
                out.push("                  },\n");
                out.push("                  {\n");
                out.push("                    flex:0.5,\n");
                out.push("                    xtype: 'fieldcontainer',\n");
                out.push("                    layout: 'hbox',\n");
                out.push("                    items:[\n");
                out.push("                      {\n");
                out.push("                        extraSearchOption:true,\n");
                out.push("                        optionName:'exists',\n");
                out.push("                        propertyName: '" + (property.propertyName) + "',\n");
                out.push("                        flex: 0.20,\n");
                out.push("                        xtype: 'checkbox',\n");
                out.push("                        boxLabel  : 'exists',\n");
                out.push("                        name: '" + (property.propertyName) + "|exists',\n");
                out.push("                        margin: \"0 5 5\",\n");
                out.push("                      },\n");
                out.push("                      {\n");
                out.push("                        extraSearchOption:true,\n");
                out.push("                        optionName:'existsValue',\n");
                out.push("                        propertyName: '" + (property.propertyName) + "',\n");
                out.push("                        flex: 0.3,\n");
                out.push("                        xtype: 'radiogroup',\n");
                out.push("                        layout: 'hbox',\n");
                out.push("                        items:[\n");
                out.push("                          {\n");
                out.push("                            extraSearchOption:true,\n");
                out.push("                            optionName:'existsValue',\n");
                out.push("                            propertyName: '" + (property.propertyName) + "',\n");
                out.push("                            margin: \"0 5 5\",\n");
                out.push("                            boxLabel: 'Y',\n");
                out.push("                            name: '" + (property.propertyName) + "|exists_yn',\n");
                out.push("                            inputValue: true,\n");
                out.push("                            checked : true\n");
                out.push("                          },\n");
                out.push("                          {\n");
                out.push("                            extraSearchOption:true,\n");
                out.push("                            optionName:'existsValue',\n");
                out.push("                            propertyName: '" + (property.propertyName) + "',\n");
                out.push("                            margin: \"0 5 0\",\n");
                out.push("                            boxLabel: 'N',\n");
                out.push("                            name: '" + (property.propertyName) + "|exists_yn',\n");
                out.push("                            inputValue: false\n");
                out.push("                          },\n");
                out.push("                        ]\n");
                out.push("                      },\n");
                out.push("                      {\n");
                out.push("                        flex: 0.5,\n");
                out.push("                        extraSearchOption:true,\n");
                out.push("                        optionName: \"json\",\n");
                out.push("                        propertyName: '" + (property.propertyName) + "',\n");
                out.push("                        name: '" + (property.propertyName) + "|json',\n");
                out.push("                        xtype: 'textfield',\n");
                out.push("                        labelWidth: 0,\n");
                out.push("                      }\n");
                out.push("                    ]\n");
                out.push("                  },\n");
                out.push("                ]\n");
                out.push("              }\n");
                out.push("            } else {\n");
                out.push("              return {\n");
                out.push("                xtype: 'fieldcontainer',\n");
                out.push("                grow: true,\n");
                out.push("                labelAlign:         " + (JSON.stringify(f.labelAlign)) + ",\n");
                out.push("                labelWidth:         " + (f.labelWidth) + ",\n");
                out.push("                columnWidth:        " + (f.columnWidth) + ",\n");
                out.push("                grow:               " + (f.grow) + ",\n");
                out.push("                ...res\n");
                out.push("              }\n");
                out.push("            }\n");
                out.push("            },\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("    },\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.metafieldsets.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            const fieldsets = context.fieldset;
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.metafieldsets." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'metafieldsets." + (context.$namespace) + "." + (context.$name) + "':{\n");
            out.push("      ");
            if (fieldsets) {
                for(let i = 0; i < fieldsets.length; i++){
                    let fs = fieldsets[i];
                    if (fs.formItems?.length > 0) {
                        out.push("\n");
                        out.push("            '" + (fs.displayName) + "':  (items)=>{\n");
                        out.push("              const res = {\n");
                        out.push("                xtype:          'fieldset',\n");
                        out.push("                ");
                        if (fs.displayName !== '_') {
                            out.push("\n");
                            out.push("                title:          _t('" + (fs.displayName) + "','" + (context.$namespace) + "." + (context.$name) + "', 'fieldset'),\n");
                            out.push("                ");
                        } else {
                            out.push("\n");
                            out.push("                cls: 'fieldset-empty-title',\n");
                            out.push("                ");
                        }
                        out.push("\n");
                        out.push("                columnWidth:    " + (fs.columnWidth) + ",\n");
                        out.push("                height:         " + (fs.height) + ",\n");
                        out.push("                collapsible:    " + (fs.collapsible) + ",\n");
                        out.push("\n");
                        out.push("                collapsed:      " + (fs.collapsed) + ",\n");
                        out.push("                layout:         'column',\n");
                        out.push("                defaults: {\n");
                        out.push("                  margin: '0 5 5 5',\n");
                        out.push("                  columnWidth: 1,\n");
                        out.push("                  xtype: 'textfield'\n");
                        out.push("                },\n");
                        out.push("                items,\n");
                        out.push("              }\n");
                        out.push("            ");
                        if (fs.extraOptions && fs.extraOptions !== '{}') {
                            out.push("\n");
                            out.push("            return {\n");
                            out.push("                ...res,\n");
                            out.push("                ..." + (fs.extraOptions) + ",\n");
                            out.push("              }\n");
                            out.push("            ");
                        } else {
                            out.push("\n");
                            out.push("            return res\n");
                            out.push("            ");
                        }
                        out.push("\n");
                        out.push("            },\n");
                        out.push("            '" + (fs.displayName) + "-search':  (items)=>({\n");
                        out.push("                xtype:          'fieldset',\n");
                        out.push("                collapsible:    " + (fs.collapsible) + ",\n");
                        out.push("                collapsed:      " + (fs.collapsed) + ",\n");
                        out.push("                ");
                        if (fs.displayName !== '_') {
                            out.push("\n");
                            out.push("                title:          _t('" + (fs.displayName) + "','" + (context.$namespace) + "." + (context.$name) + "', 'fieldset'),\n");
                            out.push("                ");
                        } else {
                            out.push("\n");
                            out.push("                cls: 'fieldset-empty-title',\n");
                            out.push("                ");
                        }
                        out.push("\n");
                        out.push("                items,\n");
                        out.push("            }),\n");
                        out.push("            ");
                    }
                }
            }
            out.push("\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.metaeditfields.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            const getFormat = context.getFormat;
            const needClear = context.needClear;
            let properties = context.formview.filter((fv)=>fv.generated);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.metaeditfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'editfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("    ");
            for(let i = 0; i < properties.length; i += 1){
                const f = properties[i];
                let property = f.property;
                out.push("\n");
                out.push("            [`" + (property.propertyName) + "::" + (f.displayName) + "`]: ()=>{\n");
                out.push("              const res = {\n");
                out.push("                name:               '" + (property.propertyName) + "',\n");
                out.push("                ");
                if (f.displayName !== '_') {
                    out.push("\n");
                    out.push("                ");
                    if (f.fieldtype !== 'filecontainer') {
                        out.push("cls:\"custom-x-field\",");
                    }
                    out.push("\n");
                    out.push("                fieldLabel:         _t(" + (JSON.stringify(f.displayName)) + ",'" + (context.$namespace) + "." + (context.$name) + "','labels','" + (property.propertyName) + "'),\n");
                    out.push("                ");
                } else {
                    out.push("\n");
                    out.push("                cls:   \"emptyLabel custom-x-field\",\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("                hidden:             " + (f.hidden) + ",\n");
                out.push("                readOnly:           " + (f.readOnly) + ",\n");
                out.push("                emptyText:          _t(" + (JSON.stringify(f.emptyText)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'emptyTexts', '" + (property.propertyName) + "'),\n");
                out.push("                labelAlign:         " + (JSON.stringify(f.labelAlign)) + ",\n");
                out.push("                ");
                if (f.labelWidth) {
                    out.push("\n");
                    out.push("                labelStyle:     'min-width:" + (f.labelWidth) + "px;',\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("                labelWidth:         " + (f.labelWidth) + ",\n");
                out.push("                columnWidth:        " + (f.columnWidth) + ",\n");
                out.push("                enableKeyEvents:    " + (f.enableKeyEvents) + ",\n");
                out.push("                grow:               " + (f.grow) + ",\n");
                out.push("                format:             " + (getFormat(f)) + ",\n");
                out.push("                plugins:            ");
                if (needClear(f)) {
                    out.push("[`clearbutton`]");
                } else {
                    out.push("[]");
                }
                out.push(",\n");
                out.push("              ");
                if (property.event) {
                    out.push("\n");
                    out.push("                listeners: {\n");
                    out.push("                  change: function(el, newValue, oldValue){\n");
                    out.push("                    let form = this.up('form');\n");
                    out.push("                    let record = form.getRecord();");
                    property.event.forEach(function(evnt) {
                        out.push("\n");
                        out.push("                    form." + (evnt.fnName) + "(newValue, record , '" + (evnt.propertyName.toLowerCase()) + "')");
                    });
                    out.push("\n");
                    out.push("                  }\n");
                    out.push("                },\n");
                    out.push("              ");
                }
                out.push("\n");
                out.push("              ");
                if (f.fieldtype == 'textfield' && (property.required || f.required)) {
                    out.push("\n");
                    out.push("                allowOnlyWhitespace: false,\n");
                    out.push("              ");
                } else if (f.fieldtype == 'checkbox') {
                    out.push("\n");
                    out.push("                  margin: \"0 5 5\",\n");
                    out.push("                  inputValue:         1,\n");
                    out.push("                  uncheckedValue:     0,\n");
                    out.push("              ");
                } else if (f.fieldtype == 'numberfield') {
                    out.push("\n");
                    out.push("                  step:" + (f.step) + ",\n");
                    out.push("                  fieldStyle:\"text-align: right;\",\n");
                    out.push("                  ");
                    if (property.enableMin) {
                        out.push("\n");
                        out.push("                      minValue:" + (property.min ? property.min : 0) + ",\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                  ");
                    if (property.enableMax) {
                        out.push("\n");
                        out.push("                      maxValue:" + (property.max ? property.max : 0) + ",\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                  ");
                    if (property.type.toLowerCase() == "integer") {
                        out.push("\n");
                        out.push("                      allowDecimals:false,\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                ");
                } else if (f.fieldtype == 'combobox') {
                    if (f.comboData && f.comboData != "" && f.comboData != "{}") {
                        let cdata = JSON.parse(f.comboData);
                        if (cdata.store != undefined && cdata.displayField != undefined && cdata.valueField != undefined) {
                            out.push("\n");
                            out.push("                      store: ");
                            if (typeof (cdata.store) == "string") {
                                out.push("Ext.create('Modeleditor.store." + (cdata.store) + "', {\n");
                                out.push("                        remoteFilter: false,\n");
                                out.push("                        remoteSort: false,\n");
                                out.push("                        pageSize: -1\n");
                                out.push("                      }),");
                            } else if (typeof (cdata.store) == "object") {
                                out.push("Ext.create(\"Ext.data.Store\", {\n");
                                out.push("                          " + (JSON.stringify(cdata.store)) + "\n");
                                out.push("                        }),");
                            }
                            out.push("\n");
                            out.push("                      displayField: '" + (cdata.displayField) + "',\n");
                            out.push("                      valueField: '" + (cdata.valueField) + "',\n");
                            out.push("                      queryMode: 'local',\n");
                            out.push("                      // queryParam: \"filter::" + (cdata.valueField) + "\",\n");
                            out.push("                      listeners: {\n");
                            out.push("                        focus: function(combo, event, eOpts ){\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          combo.queryFilter = false;\n");
                            out.push("                          store.clearFilter(true);\n");
                            out.push("                        },\n");
                            out.push("                        afterrender: function (combo, opts) {\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          store.clearFilter(true); // If true the filter is cleared silently;\n");
                            out.push("                          if(store.isLoading()){\n");
                            out.push("                            combo.setLoading(true);\n");
                            out.push("                            store.on({\n");
                            out.push("                              load: {\n");
                            out.push("                                fn: function(st, records, success, opts){\n");
                            out.push("                                  if(success) {\n");
                            out.push("                                    this.setLoading(false);\n");
                            out.push("                                  }\n");
                            out.push("                                },\n");
                            out.push("                                scope: combo,\n");
                            out.push("                                single: true\n");
                            out.push("                              }\n");
                            out.push("                            });\n");
                            out.push("                          }else{\n");
                            out.push("                            if (!store.loaded) {\n");
                            out.push("                              combo.setLoading(true);\n");
                            out.push("                              store.load(function(records, operation, success){\n");
                            out.push("                                if(success){\n");
                            out.push("                                  store.loaded = true;\n");
                            out.push("                                  combo.setLoading(false);\n");
                            out.push("                                }\n");
                            out.push("                              });\n");
                            out.push("                            };\n");
                            out.push("                          }\n");
                            out.push("                        }\n");
                            out.push("                      },\n");
                            out.push("                      ");
                        } else if (cdata.customStore != undefined && cdata.customStore === true) {
                            out.push("\n");
                            out.push("                      ");
                            if (cdata.tpl) {
                                out.push("\n");
                                out.push("                        tpl: " + (JSON.stringify(cdata.tpl)) + ",\n");
                                out.push("                      ");
                            }
                            out.push("\n");
                            out.push("                      store: Ext.create(\"Ext.data.Store\", {\n");
                            out.push("                        autoSync: ");
                            if (cdata.autoSync) {
                                out.push((cdata.autoSync));
                            } else {
                                out.push("false");
                            }
                            out.push(",");
                            if (cdata.model) {
                                out.push("\n");
                                out.push("                        model: \"" + (cdata.model) + "\",");
                            } else {
                                out.push("\n");
                                out.push("                        fields: ");
                                if (cdata.fields) {
                                    out.push((JSON.stringify(cdata.fields)));
                                } else {
                                    out.push("['name', 'value']");
                                }
                            }
                            ;
                            if (cdata.sorters) {
                                out.push(",\n");
                                out.push("                        sorters: " + (JSON.stringify(cdata.sorters)));
                            }
                            ;
                            if (cdata.apiRead) {
                                out.push(",\n");
                                out.push("                        autoLoad: ");
                                if (cdata.autoLoad) {
                                    out.push((cdata.autoLoad));
                                } else {
                                    out.push("false");
                                }
                                out.push(",\n");
                                out.push("                        proxy: {\n");
                                out.push("                          type: ");
                                if (cdata.proxyType) {
                                    out.push("\n");
                                    out.push("                                  \"" + (cdata.proxyType) + "\",\n");
                                    out.push("                                ");
                                } else {
                                    out.push("\n");
                                    out.push("                                  \"direct\",\n");
                                    out.push("                                ");
                                }
                                out.push("\n");
                                out.push("                          api: {\n");
                                out.push("                            read: " + (cdata.apiRead) + "\n");
                                out.push("                          }\n");
                                out.push("                          ");
                                if (cdata.extraParams) {
                                    out.push(",\n");
                                    out.push("                          extraParams: " + (JSON.stringify(cdata.extraParams)));
                                }
                                ;
                                if (cdata.reader) {
                                    out.push(",\n");
                                    out.push("                          reader: " + (JSON.stringify(cdata.reader)));
                                }
                                ;
                                if (cdata.writer) {
                                    out.push(",\n");
                                    out.push("                          writer: " + (JSON.stringify(cdata.writer)));
                                }
                                out.push("\n");
                                out.push("                        }");
                            } else {
                                out.push(",\n");
                                out.push("                        data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, [");
                                if (cdata.displayField) {
                                    out.push("\"" + (cdata.displayField) + "\"");
                                } else {
                                    out.push("'name'");
                                }
                                out.push("]: _t(item[");
                                if (cdata.displayField) {
                                    out.push("\"" + (cdata.displayField) + "\"");
                                } else {
                                    out.push("'name'");
                                }
                                out.push("],'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                                out.push("                        ");
                            }
                            out.push("\n");
                            out.push("                      }),\n");
                            out.push("                      displayField: ");
                            if (cdata.displayField) {
                                out.push("\"" + (cdata.displayField) + "\"");
                            } else {
                                out.push("'name'");
                            }
                            out.push(",\n");
                            out.push("                      valueField: ");
                            if (cdata.valueField) {
                                out.push("\"" + (cdata.valueField) + "\"");
                            } else {
                                out.push("\"value\"");
                            }
                            out.push(",\n");
                            out.push("                      queryMode: ");
                            if (cdata.queryMode) {
                                out.push("\"" + (cdata.queryMode) + "\"");
                            } else {
                                out.push("\"local\"");
                            }
                            out.push(",");
                        } else {
                            out.push("\n");
                            out.push("                      store: Ext.create('Ext.data.Store', {\n");
                            out.push("                        fields: ['name', 'value'],\n");
                            out.push("                        data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, name: _t(item.name,'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                            out.push("                      }),\n");
                            out.push("                      displayField: 'name',\n");
                            out.push("                      valueField: 'value',\n");
                            out.push("                      queryMode: 'local',\n");
                            out.push("                      listeners: {\n");
                            out.push("                        focus: function(combo, event, eOpts ){\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          combo.queryFilter = false;\n");
                            out.push("                          store.clearFilter(true);\n");
                            out.push("                        },\n");
                            out.push("                        afterrender: function (combo, opts) {\n");
                            out.push("                          let store = combo.getStore();\n");
                            out.push("                          store.clearFilter(true); // If true the filter is cleared silently;\n");
                            out.push("                          if(store.isLoading()){\n");
                            out.push("                            combo.setLoading(true);\n");
                            out.push("                            store.on({\n");
                            out.push("                              load: {\n");
                            out.push("                                fn: function(st, records, success, opts){\n");
                            out.push("                                  if(success) {\n");
                            out.push("                                    this.setLoading(false);\n");
                            out.push("                                  }\n");
                            out.push("                                },\n");
                            out.push("                                scope: combo,\n");
                            out.push("                                single: true\n");
                            out.push("                              }\n");
                            out.push("                            });\n");
                            out.push("                          }else{\n");
                            out.push("                            if (!store.loaded) {\n");
                            out.push("                              combo.setLoading(true);\n");
                            out.push("                              store.load(function(records, operation, success){\n");
                            out.push("                                if(success){\n");
                            out.push("                                  store.loaded = true;\n");
                            out.push("                                  combo.setLoading(false);\n");
                            out.push("                                }\n");
                            out.push("                              });\n");
                            out.push("                            };\n");
                            out.push("                          }\n");
                            out.push("                        }\n");
                            out.push("                      },\n");
                            out.push("                      ");
                        }
                    }
                    out.push("\n");
                    out.push("                  forceSelection: " + (f.forceSelection) + ",\n");
                    out.push("                  editable: " + (f.comboAutocomplete) + ",\n");
                    out.push("                  ");
                }
                ;
                if (f.validator) {
                    out.push("\n");
                    out.push("                validator: function(value){\n");
                    out.push("                  " + (f.validator) + "\n");
                    out.push("                },");
                }
                out.push("\n");
                out.push("                dataType: '" + (property.type.toLowerCase()) + "',\n");
                out.push("                xtype: '" + (f.fieldtype) + "'\n");
                out.push("            }\n");
                out.push("            res.allowBlank = " + (!(property.required || f.required || property.clientRequired)) + "\n");
                out.push("            ");
                if (property.required || f.required || property.clientRequired) {
                    out.push("\n");
                    out.push("            res.afterLabelTextTpl = '<span style=\"color:red;\" data-qtip=\"Required\">*</span>'\n");
                    out.push("            ");
                }
                out.push("\n");
                out.push("            ");
                if (f.extraOptions && f.extraOptions !== '{}') {
                    out.push("\n");
                    out.push("            return {\n");
                    out.push("                ...res,\n");
                    out.push("                ..." + (f.extraOptions) + ",\n");
                    out.push("              }\n");
                    out.push("            ");
                } else {
                    out.push("\n");
                    out.push("            return res\n");
                    out.push("            ");
                }
                out.push("\n");
                out.push("            },\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("    },\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.metaclientmethods.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            let clMeth = context.clientMethods ?? [];
            let localStateMachine = context.stateMachine;
            out.push("\n");
            out.push("\n");
            out.push("\n");
            out.push("// TODO:\n");
            out.push("// исправить методы для работы с состояниями, и сделать их правильными...\n");
            out.push("// нужно передавать название события, а перевод состояния тоже делать, но отдельно\n");
            out.push("// форма должна отображать события, и текущее состояние, которое должно меняться, по методу\n");
            out.push("// перенести stateMachine на клиента\n");
            out.push("Ext.define('Grainjs.metaclientmethods." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'metaclientmethods." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("      buttons: {\n");
            out.push("      ");
            if (localStateMachine && context.debugSM) {
                out.push("\n");
                out.push("        ");
                for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                    let ev = localStateMachine.event[i];
                    out.push("\n");
                    out.push("        \"btn_" + (ev.eventName) + "\": () => ({\n");
                    out.push("          xtype: \"button\",\n");
                    out.push("          itemId: \"" + (ev.eventName) + "\",\n");
                    out.push("          iconCls: _r(\"" + (ev.eventName) + "\", \"StateMachines\", \"" + (context.$namespace) + "." + (context.$name) + "\", \"state\", \"iconCls\"),\n");
                    out.push("          columnWidth: void 0,\n");
                    out.push("          _order: 0,\n");
                    out.push("          //\n");
                    out.push("          minWidth: 160,\n");
                    out.push("          text: _r(\"" + (ev.eventName) + "\", \"" + (ev.displayName) + "\", \"StateMachines\", \"" + (context.$namespace) + "." + (context.$name) + "\", \"state\"),\n");
                    out.push("          textAlign: \"left\",\n");
                    out.push("          toggleGroup: \"state\",\n");
                    out.push("          name: '" + (ev.eventName) + "',\n");
                    out.push("          disabled: true,\n");
                    out.push("          pressed: false,\n");
                    out.push("          enableToggle: true\n");
                    out.push("        }),\n");
                    out.push("        ");
                }
                out.push("\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("        ");
            const buttons = clMeth.filter((m)=>(m.type == 'toggle' || m.type == 'button') && !m.disabled);
            for(let i = 0; i < buttons.length; i++){
                let clientMethodCur = buttons[i];
                out.push("\n");
                out.push("            \"" + (clientMethodCur.name) + "\": ()=>({\n");
                out.push("                xtype:'button',\n");
                out.push("                itemId:\"" + (clientMethodCur.name) + "\",\n");
                out.push("                iconCls: _r(");
                if (clientMethodCur.displayName) {
                    out.push((JSON.stringify(clientMethodCur.displayName)));
                } else {
                    out.push((JSON.stringify(clientMethodCur.name)));
                }
                out.push(",'', '" + (context.$namespace) + "." + (context.$name) + "', 'methods','iconCls')");
                if (clientMethodCur.iconCls) {
                    out.push("||\" " + (clientMethodCur.iconCls) + "\"");
                }
                out.push(",\n");
                out.push("                columnWidth:  " + (clientMethodCur.currentSettings?.columnWidth) + ",\n");
                out.push("                _order:  " + (clientMethodCur.currentSettings?.order) + ",\n");
                out.push("                //\n");
                out.push("                minWidth: 160,\n");
                out.push("                text: _t(");
                if (clientMethodCur.displayName) {
                    out.push((JSON.stringify(clientMethodCur.displayName)));
                } else {
                    out.push((JSON.stringify(clientMethodCur.name)));
                }
                out.push(",'" + (context.$namespace) + "." + (context.$name) + "','buttons',\"" + (clientMethodCur.name) + "\"),\n");
                out.push("                textAlign: 'left',\n");
                out.push("                ");
                if (clientMethodCur.type == 'toggle') {
                    out.push("\n");
                    out.push("                  ");
                    if (!clientMethodCur.currentSettings?.showInsideForm) {
                        out.push("\n");
                        out.push("                toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
                        out.push("                  ");
                    }
                    out.push("\n");
                    out.push("                enableToggle: true,\n");
                    out.push("                ");
                } else if (clientMethodCur.type == 'button') {
                    out.push("\n");
                    out.push("                enableToggle: false,\n");
                    out.push("                ");
                }
                out.push("\n");
                out.push("              }),\n");
                out.push("            ");
            }
            out.push("\n");
            out.push("      },\n");
            out.push("      methods: {\n");
            out.push("        ");
            if (localStateMachine) {
                const stateAttribute = localStateMachine.stateAttribute;
                out.push("\n");
                out.push("          _initstates: function (record, form) {\n");
                out.push("            if (record) {\n");
                out.push("              const currentState = record.get(\"" + (stateAttribute) + "\")\n");
                out.push("              ret = Promisify.direct(StoredQuery, \"getAvailableEvents\", {\n");
                out.push("                thing: \"" + (context.$namespace) + "." + (context.$name) + "\",\n");
                out.push("                state: currentState,\n");
                out.push("                page: 1,\n");
                out.push("                start: 0,\n");
                out.push("                limit: 25\n");
                out.push("              })\n");
                out.push("              .then(data => {\n");
                out.push("                const wnd = form.up(\"window\");\n");
                out.push("                const list = wnd.query('button[toggleGroup=state]')\n");
                out.push("                const states = data.reduce((ret, cur)=>{\n");
                out.push("                  ret[cur.key] = _t(cur.value, \"StateMachines\", \"" + (context.$namespace) + "." + (context.$name) + "\", \"state\")\n");
                out.push("                  return ret\n");
                out.push("                },{})\n");
                out.push("\n");
                out.push("                for(const btn of list){\n");
                out.push("                  if(states[btn.name]){\n");
                out.push("                    btn.enable()\n");
                out.push("                  } else {\n");
                out.push("                    btn.disable()\n");
                out.push("                  }\n");
                out.push("                }\n");
                out.push("              })\n");
                out.push("              .catch(e => {\n");
                out.push("                console.log('_initstates for " + (context.$namespace) + "." + (context.$name) + ": " + (stateAttribute) + " ->',e)\n");
                out.push("              })\n");
                out.push("            }\n");
                out.push("          },\n");
                out.push("          ");
                for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                    let ev = localStateMachine.event[i];
                    out.push("\n");
                    out.push("          \"execute_" + (ev.eventName) + "\": function (btn, pressed, eOpts) {\n");
                    out.push("            const wnd = btn.up(\"window\");\n");
                    out.push("            if (wnd && pressed) {\n");
                    out.push("              DirectCacheLogger.userStories('State Machine Event Execute', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', eventName: '" + (ev.eventName) + "', windowId: wnd.id });\n");
                    out.push("              const rec = wnd.rec;\n");
                    out.push("              if (!rec.changingState) {\n");
                    out.push("                rec.changingState = true;\n");
                    out.push("              }\n");
                    out.push("              wnd.fireEvent(\"commitrecord\", wnd, {\n");
                    out.push("                callback: function () {\n");
                    out.push("                  wnd.zIndexManager.getActive();\n");
                    out.push("                  var ctrl = wnd.modeleditorController.application.getController(\"" + (context.$namespace) + "." + (context.$name) + "\");\n");
                    out.push("                  rec.changingState = false;\n");
                    out.push("                  ctrl[\"fire_" + (ev.eventName) + "\"](wnd.down(), rec);\n");
                    out.push("                }\n");
                    out.push("              });\n");
                    out.push("            }\n");
                    out.push("          },\n");
                    out.push("          ");
                }
                out.push("\n");
                out.push("        ");
            }
            out.push("\n");
            out.push("        ");
            const methods = clMeth.filter((m)=>m.type != 'model' && m.type != 'constructor' && !m.disabled);
            for(let i = 0; i < methods.length; i++){
                const clMethod = methods[i];
                out.push("\n");
                out.push("          ");
                if (clMethod.comment) {
                    out.push("/* " + (clMethod.comment) + " */");
                }
                out.push("\n");
                out.push("            " + (clMethod.name) + ": function(");
                if (clMethod.params) {
                    out.push((clMethod.params));
                }
                out.push("){\n");
                out.push("              DirectCacheLogger.userStories('Custom Method Execute', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', methodName: '" + (clMethod.name) + "', methodType: '" + (clMethod.type) + "' });\n");
                out.push("              " + (clMethod.body) + "\n");
                out.push("            },\n");
                out.push("        ");
            }
            out.push("\n");
            out.push("      }\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.View.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const _ = require('lodash');
            const smartSort = context.smartSort;
            const fieldsets = context.fieldset;
            const inFieldset = context.inFieldset;
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".View." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Modeleditor.view.base.baseForm',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "view',\n");
            out.push("  // iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "'),\n");
            out.push("  layout: 'column',\n");
            out.push("  border: false,\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            if (context.periodicalRel) {
                out.push("\n");
                out.push("  periodicalRel:{\n");
                out.push("    from:'" + (context.periodicalRel.from) + "',\n");
                out.push("    to:'" + (context.periodicalRel.to) + "',\n");
                out.push("    fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
                out.push("    toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
                out.push("  },\n");
            }
            out.push("\n");
            out.push("\n");
            out.push("  embedKey: '" + (context.$namespace) + (context.$name) + "',\n");
            out.push("  modelName: 'Modeleditor.model." + (context.$namespace) + "." + (context.$name) + "',\n");
            out.push("  defaults: {\n");
            out.push("    margin: '0 5 5 5',\n");
            out.push("    xtype: 'textfield',\n");
            out.push("    columnWidth: 1\n");
            out.push("  },\n");
            out.push("  initComponent: function() {\n");
            out.push("    DirectCacheLogger.userStories('View Form Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      items: [\n");
            out.push("        {\n");
            out.push("          name: 'id',\n");
            out.push("          fieldLabel: _t('id','SYSTEM', 'labels'),\n");
            out.push("          hidden: true\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          name: '_id',\n");
            out.push("          fieldLabel: _t('id','SYSTEM', 'labels'),\n");
            out.push("          hidden: true\n");
            out.push("        },\n");
            out.push("        ");
            function builItems(items) {
                const fiit = items.filter((i)=>i.type != 'fieldset');
                const fsit = items.filter((i)=>i.type == 'fieldset');
                for(let i = 0; i < fiit.length; i += 1){
                    const item = fiit[i];
                    switch(item.type){
                        case 'property':
                            const f = item.item;
                            const property = f.property;
                            if (f.generated) {
                                out.push("\n");
                                out.push("                  Grainjs.metadata['viewfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`],\n");
                                out.push("                ");
                            }
                            break;
                        case 'fieldset':
                            const fs = item.item;
                            if (fs.formItems?.length > 0) {
                                out.push("\n");
                                out.push("              Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "']['" + (fs.displayName) + "']([\n");
                                out.push("                ");
                                builItems(fs.formItems);
                                out.push("]),\n");
                                out.push("              ");
                            }
                            break;
                    }
                }
                for(let i = 0; i < fsit.length; i += 1){
                    const item = fsit[i];
                    switch(item.type){
                        case 'property':
                            const f = item.item;
                            const property = f.property;
                            if (f.generated) {
                                out.push("\n");
                                out.push("                  Grainjs.metadata['viewfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`],\n");
                                out.push("                ");
                            }
                            break;
                        case 'fieldset':
                            const fs = item.item;
                            if (fs.formItems?.length > 0) {
                                out.push("\n");
                                out.push("              Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "']['" + (fs.displayName) + "']([\n");
                                out.push("                ");
                                builItems(fs.formItems);
                                out.push("]),\n");
                                out.push("              ");
                            }
                            break;
                    }
                }
            }
            builItems(context.formItems);
            out.push("\n");
            out.push("      ],\n");
            out.push("      listeners: {\n");
            out.push("        recordloaded: function(form, record, operation) {\n");
            out.push("          DirectCacheLogger.userStories('View Form Record Loaded', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
            out.push("        },\n");
            out.push("        beforerecordload: function(form, record, operation) {\n");
            out.push("          DirectCacheLogger.userStories('View Form Before Record Load', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
            out.push("        },\n");
            out.push("        render: function(form) {\n");
            out.push("          DirectCacheLogger.userStories('View Form Render', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.SearchWindow.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".SearchWindow." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Modeleditor.view.base.baseWindow',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "searchwindow',\n");
            out.push("  widget: \"" + (context.$widgetName) + "\",\n");
            out.push("  queryName: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + ",\n");
            out.push("  iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  ");
            if (context.queryResult || context.legacySearch) {
                out.push("\n");
                out.push("  customSearch: true,\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  initComponent: function(){\n");
            out.push("    Ext.apply( this, {\n");
            out.push("      title: _t('Search', 'SYSTEM', 'titles') + ': ' + _t('" + (context.$namespace) + "." + (context.$name) + "','" + (context.$namespace) + "." + (context.$name) + "', 'titles', 'SearchWindow'),\n");
            out.push("      layout: 'card',\n");
            out.push("      // closable: true,\n");
            out.push("      items: [\n");
            out.push("        {\n");
            out.push("          xtype: 'panel',\n");
            out.push("          border: false,\n");
            out.push("          layout: 'anchor',\n");
            out.push("          autoScroll: true,\n");
            out.push("          defaults:{\n");
            out.push("            anchor: '100%'\n");
            out.push("          },\n");
            out.push("          items:[\n");
            out.push("            {\n");
            out.push("              xtype: \"" + (context.$widgetName) + "search\",\n");
            out.push("              ");
            if (context.queryResult || context.legacySearch) {
                out.push("\n");
                out.push("              customSearch: true,\n");
                out.push("              ");
            }
            out.push("\n");
            out.push("            }\n");
            out.push("          ]\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          dockedItems: [\n");
            out.push("            {\n");
            out.push("              xtype: \"basesearchgridtoolbar\"\n");
            out.push("            }\n");
            out.push("          ],\n");
            out.push("          xtype: \"" + (context.$widgetName) + "listsearch\",\n");
            out.push("          border: 0,\n");
            out.push("          paginator: false,\n");
            out.push("          store: Ext.create('Modeleditor.store." + (context.$namespace) + ".Search." + (context.$name) + "')\n");
            out.push("        }\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      buttons: [\n");
            out.push("        {\n");
            out.push("          text: _t('Search','SYSTEM','buttons'),\n");
            out.push("          action: \"startSearch\",\n");
            out.push("          resultGrid: \"" + (context.$widgetName) + "listsearch\",\n");
            out.push("          itemId: 'startSearchButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Search Window Start Search', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Reset','SYSTEM','buttons'),\n");
            out.push("          action: \"resetSearch\",\n");
            out.push("          itemId: 'resetSearchButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Search Window Reset', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Back','SYSTEM', 'buttons'),\n");
            out.push("          action: \"backSearch\",\n");
            out.push("          disable: true,\n");
            out.push("          hidden: true,\n");
            out.push("          itemId: 'backSearchButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Search Window Back', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Close','SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'closeButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Search Window Close', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      ]\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.Search.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".Search." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Ext.form.Panel',\n");
            out.push("  property: { root:1 },\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "search',\n");
            out.push("  layout: 'column',\n");
            out.push("  border: false,\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            out.push("  // iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  embedKey: '" + (context.$namespace) + (context.$name) + "',\n");
            out.push("  modelName: 'Modeleditor.model." + (context.$namespace) + "." + (context.$name) + "',\n");
            out.push("  defaults: {\n");
            out.push("    margin: '0 5 5 5',\n");
            out.push("    xtype: 'textfield',\n");
            out.push("    columnWidth: 1\n");
            out.push("  },\n");
            out.push("  ");
            const localStateMachine = context.stateMachine;
            if (localStateMachine && localStateMachine.event && localStateMachine.event.length > 0) {
                out.push("\n");
                out.push("  stateMachineHash: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].stateMachineHash,\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ");
            if (context.queryResult || context.legacySearch) {
                out.push("\n");
                out.push("  customSearch: true,\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("\n");
            out.push("  initComponent: function() {\n");
            out.push("    const me = this\n");
            out.push("    DirectCacheLogger.userStories('Search Form Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, customSearch: this.customSearch });\n");
            out.push("    let items = [\n");
            out.push("      {\n");
            out.push("        name: 'id',\n");
            out.push("        fieldLabel: _t('id','SYSTEM', 'labels'),\n");
            out.push("        hidden: true\n");
            out.push("      },\n");
            out.push("      {\n");
            out.push("        name: '_id',\n");
            out.push("        fieldLabel: _t('id','SYSTEM', 'labels'),\n");
            out.push("        hidden: true\n");
            out.push("      },\n");
            out.push("      ");
            function builItems(items) {
                for(let i = 0; i < items.length; i += 1){
                    const item = items[i];
                    switch(item.type){
                        case 'property':
                            const f = item.item;
                            const property = f.property;
                            if (!f.hiddenForSearch) {
                                out.push("\n");
                                out.push("                Grainjs.metadata['searchfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`](me.customSearch),\n");
                                out.push("              ");
                            }
                            break;
                        case 'fieldset':
                            const fs = item.item;
                            if (fs.formItems?.length > 0 && !fs.hiddenForSearch) {
                                out.push("\n");
                                out.push("            Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "'][`" + (fs.displayName) + "${me.customSearch ? '':'-search'}`]([");
                                builItems(fs.formItems);
                                out.push("]),\n");
                                out.push("            ");
                            }
                            break;
                    }
                }
            }
            builItems(context.formItems);
            out.push("\n");
            out.push("    ];\n");
            out.push("    if(!me.customSearch) {\n");
            out.push("      items.splice(1,0, {\n");
            out.push("        xtype:'fieldset',\n");
            out.push("        layout:         'column',\n");
            out.push("        collapsible:    true,\n");
            out.push("        collapsed:      true,\n");
            out.push("        title:         _t('Search params','SYSTEM', 'labels'),\n");
            out.push("        defaults: {\n");
            out.push("          margin: '0 5 5 5',\n");
            out.push("          columnWidth: 1,\n");
            out.push("          xtype: 'textfield',\n");
            out.push("        },\n");
            out.push("        items: [{\n");
            out.push("          name: 'ensure',\n");
            out.push("          fieldLabel: _t('Ensure it exists','SYSTEM', 'labels'),\n");
            out.push("          columnWidth: 0.5,\n");
            out.push("          xtype: 'checkbox',\n");
            out.push("          hidden: this.property.root,\n");
            out.push("        },{\n");
            out.push("          name: 'absent',\n");
            out.push("          fieldLabel: _t('Ensure it absent','SYSTEM', 'labels'),\n");
            out.push("          columnWidth: 0.5,\n");
            out.push("          xtype: 'checkbox',\n");
            out.push("          hidden: this.property.root,\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          name: 'json',\n");
            out.push("          xtype: 'textareafield',\n");
            out.push("          extraSearchOption:true,\n");
            out.push("          optionName: \"json\",\n");
            out.push("          propertyName: 'root',\n");
            out.push("          rows: 3,\n");
            out.push("          grow: true,\n");
            out.push("          labelWidth: 0,\n");
            out.push("        }]\n");
            out.push("      })\n");
            out.push("    }\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      items,\n");
            out.push("      listeners: {\n");
            out.push("        render: function(form) {\n");
            out.push("          DirectCacheLogger.userStories('Search Form Render', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, customSearch: this.customSearch });\n");
            out.push("        },\n");
            out.push("        fieldchange: function(form, field, newValue, oldValue) {\n");
            out.push("          DirectCacheLogger.userStories('Search Form Field Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, fieldName: field.name, newValue: newValue, oldValue: oldValue });\n");
            out.push("        },\n");
            out.push("        reset: function(form) {\n");
            out.push("          DirectCacheLogger.userStories('Search Form Reset', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.FormNavigationToolbar.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const getRS = context.getRS;
            const makeRelVariants = context.makeRelVariants;
            const iterateGroups = context.iterateRelGroups;
            const localStateMachine = context.stateMachine;
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".FormNavigationToolbar." + (context.$name) + "',{\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: \"Ext.toolbar.Toolbar\",\n");
            out.push("  alias: \"widget." + (context.$widgetName) + "formnavigationtoolbar\",\n");
            out.push("  dock: 'left',\n");
            out.push("  overflowY: 'auto',\n");
            out.push("  initComponent: function(){\n");
            out.push("\n");
            out.push("    const items = [\n");
            out.push("        {\n");
            out.push("          _order:-1000,\n");
            out.push("          xtype:'button',\n");
            out.push("          itemId: 'General',\n");
            out.push("          text: _t('General', 'SYSTEM', 'titles'),\n");
            out.push("          relGroup: _t('General', 'SYSTEM', 'titles'),\n");
            out.push("          iconCls: _r('General','', 'SYSTEM','titles', 'iconCls') || _r('iconCls','', '" + (context.$namespace) + "." + (context.$name) + "'),\n");
            out.push("          enableToggle: true,\n");
            out.push("          pressed: true,\n");
            out.push("          textAlign: 'left',\n");
            out.push("          minWidth: 160,\n");
            out.push("          toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
            out.push("          widgetName: \"" + (context.$widgetName) + "edit\",\n");
            out.push("          listeners: {\n");
            out.push("            toggle: function(btn, pressed) {\n");
            out.push("              if (pressed) {\n");
            out.push("                DirectCacheLogger.userStories('Form Navigation General Tab', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', buttonId: btn.itemId, widgetName: btn.widgetName });\n");
            out.push("              }\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          _order: -999,\n");
            out.push("          xtype:'tbseparator'\n");
            out.push("        },\n");
            out.push("        ");
            if (context.navigationRels) {
                iterateGroups(makeRelVariants(context.navigationRels), (variant, rel, relIndex, variantIndex)=>{
                    let rs = getRS(rel);
                    let group = rel._toGroup;
                    if (!group) {
                        out.push("\n");
                        out.push("        {\n");
                        out.push("          _order: " + (rs.toOrder) + ",\n");
                        out.push("          xtype:\"button\",\n");
                        out.push("          itemId: \"" + (rel.to));
                        if (variant !== '*') {
                            out.push((rel.relName.split('.').join('')));
                        }
                        out.push("\",\n");
                        out.push("          widgetname: \"" + (([
                            rel.refNorm.namespace,
                            rel.refNorm.name
                        ].join("")).toLowerCase()) + "\",\n");
                        out.push("          propname: \"" + (rel.to));
                        if (variant !== '*') {
                            out.push((rel.relName.split('.').join('')));
                        }
                        out.push("\",\n");
                        out.push("          text: _t(\"" + (rs.toDisplay) + "\",'" + (context.$namespace) + "." + (context.$name) + "' ,'toDisplay', '" + (rel.to) + "')");
                        if (rel.toRequired) {
                            out.push(" + \" *\"");
                        }
                        out.push(",\n");
                        out.push("          iconCls: _r(\"" + (rs.toDisplay) + "\",'','" + (context.$namespace) + "." + (context.$name) + "' ,'toDisplay', '" + (rel.to) + "', 'iconCls') || _r(\"iconCls\",'', '" + (rel.ref.thingType) + "')");
                        if (rel.ref.iconCls) {
                            out.push(" || \"" + (rel.ref.iconCls) + "\"");
                        }
                        out.push(",\n");
                        out.push("          enableToggle: true,\n");
                        out.push("          textAlign: 'left',\n");
                        out.push("          minWidth: 160,\n");
                        out.push("          toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
                        out.push("          listeners: {\n");
                        out.push("            toggle: function(btn, pressed) {\n");
                        out.push("              if (pressed) {\n");
                        out.push("                DirectCacheLogger.userStories('Form Navigation Tab', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', buttonId: btn.itemId, propname: btn.propname, widgetName: btn.widgetname, relationName: '" + (rel.to) + "' });\n");
                        out.push("              }\n");
                        out.push("            }\n");
                        out.push("          }\n");
                        out.push("        },\n");
                        out.push("        ");
                    } else {
                        out.push("\n");
                        out.push("        {\n");
                        out.push("          _order: " + (rs.toOrder) + ",\n");
                        out.push("          xtype:'button',\n");
                        out.push("          itemId: \"" + (rel.to));
                        if (variant !== '*') {
                            out.push((rel.relName.split('.').join('')));
                        }
                        out.push("\",\n");
                        out.push("          widgetname: \"" + (([
                            rel.refNorm.namespace,
                            rel.refNorm.name
                        ].join("")).toLowerCase()) + "\",\n");
                        out.push("          text: _t(" + (JSON.stringify(group)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'buttons'),\n");
                        out.push("          iconCls: _r(" + (JSON.stringify(group)) + ",'', '" + (context.$namespace) + "." + (context.$name) + "','iconCls'),\n");
                        out.push("          relGroup: _t('" + (group) + "','" + (context.$namespace) + "." + (context.$name) + "', 'toGroup'),\n");
                        out.push("          textAlign: 'left',\n");
                        out.push("          minWidth: 160,\n");
                        out.push("          toggleGroup: '" + (context.$widgetName) + "FormNavigation',\n");
                        out.push("          listeners: {\n");
                        out.push("            toggle: function(btn, pressed) {\n");
                        out.push("              if (pressed) {\n");
                        out.push("                DirectCacheLogger.userStories('Form Navigation Group Tab', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', buttonId: btn.itemId, relGroup: btn.relGroup, widgetName: btn.widgetname, relationName: '" + (rel.to) + "' });\n");
                        out.push("              }\n");
                        out.push("            }\n");
                        out.push("          }\n");
                        out.push("        },\n");
                        out.push("        ");
                    }
                });
            }
            if (context.clientMethods) {
                let clMeth = context.clientMethods.filter((m)=>(m.type == 'button' || m.type == 'toggle') && !m.disable && !m.currentSettings?.hidden && !m.currentSettings?.showInsideForm);
                let separatorExist = false;
                for(let i = 0; i < clMeth.length; i++){
                    out.push("\n");
                    out.push("        Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].buttons['" + (clMeth[i].name) + "'](),\n");
                    out.push("        ");
                }
            }
            out.push("\n");
            out.push("      ");
            if (localStateMachine && context.debugSM) {
                out.push("\n");
                out.push("        ");
                for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                    let ev = localStateMachine.event[i];
                    out.push("\n");
                    out.push("        Grainjs.metadata[\"metaclientmethods." + (context.$namespace) + "." + (context.$name) + "\"].buttons[\"btn_" + (ev.eventName) + "\"](),\n");
                    out.push("        ");
                }
                out.push("\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      ];\n");
            out.push("\n");
            out.push("    Ext.apply( this, {\n");
            out.push("      type: \"formNavigation\",\n");
            out.push("      items: items.sort((a,b)=> a._order - b._order)\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.EditWindow.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".EditWindow." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Modeleditor.view.base.baseWindow',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "editwindow',\n");
            out.push("  widget: \"" + (context.$widgetName) + "\",\n");
            out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  initComponent: function(){\n");
            out.push("    Ext.apply( this, {\n");
            out.push("\n");
            out.push("      title: _t('" + (context.$namespace) + "." + (context.$name) + "','" + (context.$namespace) + "." + (context.$name) + "','titles','EditWindow'),\n");
            out.push("      layout: 'anchor',\n");
            out.push("      autoScroll: true,\n");
            out.push("      defaults:{\n");
            out.push("        anchor: '100%'\n");
            out.push("      },\n");
            out.push("      dockedItems: [\n");
            out.push("        {\n");
            out.push("          xtype: '" + (context.$widgetName) + "formnavigationtoolbar'\n");
            out.push("        }\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      items:[\n");
            out.push("        {\n");
            out.push("          xtype: \"" + (context.$widgetName) + "edit\",\n");
            out.push("          hideable: true,\n");
            out.push("          required: true,\n");
            out.push("          toDisplay: _t('General', 'SYSTEM', 'titles'),\n");
            out.push("          margin: \"5 15 5 15\",\n");
            out.push("          relGroup: [_t('General', 'SYSTEM', 'titles'),]\n");
            out.push("        }\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      relNames: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].relNames,\n");
            out.push("      groupedRels: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].groupedRels,\n");
            out.push("\n");
            out.push("      buttons: [\n");
            out.push("        {\n");
            out.push("          text: _t('Apply','SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'applyButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Edit Window Apply Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Ok','SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'okButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Edit Window OK Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Cancel', 'SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'cancelButton',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Edit Window Cancel Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', windowId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      ]\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.view-thing.Edit.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".Edit." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Modeleditor.view.base.baseForm',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "edit',\n");
            out.push("  layout: 'column',\n");
            out.push("  bodyPadding: 10,\n");
            out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            out.push("  ");
            if (context.periodicalRel) {
                out.push("\n");
                out.push("    periodicalRel:{\n");
                out.push("      from:'" + (context.periodicalRel.from) + "',\n");
                out.push("      to:'" + (context.periodicalRel.to) + "',\n");
                out.push("      fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
                out.push("      toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
                out.push("    },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  embedKey: '" + (context.$namespace) + (context.$name) + "',\n");
            out.push("  modelName: 'Modeleditor.model." + (context.$namespace) + "." + (context.$name) + "',\n");
            out.push("  defaults: {\n");
            out.push("    margin: '0 5 5 5',\n");
            out.push("    xtype: 'textfield',\n");
            out.push("    columnWidth: 1\n");
            out.push("  },\n");
            out.push("\n");
            out.push("  initComponent: function() {\n");
            out.push("    DirectCacheLogger.userStories('Edit Form Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id });\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      title: this.title || this.toDisplay || _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','List'),\n");
            out.push("      items: [\n");
            out.push("        {\n");
            out.push("          name: 'id',\n");
            out.push("          fieldLabel: _t('id', 'SYSTEM', 'labels'),\n");
            out.push("          hidden: true\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          name: '_id',\n");
            out.push("          fieldLabel: _t('id', 'SYSTEM', 'labels'),\n");
            out.push("          hidden: true\n");
            out.push("        },\n");
            out.push("        ");
            function builItems(items) {
                for(let i = 0; i < items.length; i += 1){
                    const item = items[i];
                    switch(item.type){
                        case 'property':
                            const f = item.item;
                            const property = f.property;
                            if (f.generated) {
                                out.push("\n");
                                out.push("                  Grainjs.metadata['editfields." + (context.$namespace) + "." + (context.$name) + "'][`" + (property.propertyName) + "::" + (f.displayName) + "`](),\n");
                                out.push("                ");
                            }
                            break;
                        case 'method':
                            const method = item.item.clientmethod;
                            out.push("\n");
                            out.push("                Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].buttons['" + (method.name) + "'](),\n");
                            out.push("              ");
                            break;
                        case 'fieldset':
                            const fs = item.item;
                            if (fs.formItems?.length > 0) {
                                out.push("\n");
                                out.push("              Grainjs.metadata['metafieldsets." + (context.$namespace) + "." + (context.$name) + "']['" + (fs.displayName) + "']([");
                                builItems(fs.formItems);
                                out.push("]),\n");
                                out.push("              ");
                            }
                            break;
                    }
                }
            }
            builItems(context.formItems);
            if (context.periodicalRel) {
                out.push(",\n");
                out.push("        {\n");
                out.push("          xtype: 'periodicaleventbar',\n");
                out.push("          panelWidget: '" + (context.$widgetName) + "edit',\n");
                out.push("          startProp: '" + (context.startProp) + "',\n");
                out.push("          endProp: '" + (context.endProp) + "',\n");
                out.push("        },");
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("      listeners: {\n");
            out.push("        recordloaded: function(form, record, operation) {\n");
            out.push("          DirectCacheLogger.userStories('Edit Form Record Loaded', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
            out.push("        },\n");
            out.push("        beforerecordload: function(form, record, operation) {\n");
            out.push("          DirectCacheLogger.userStories('Edit Form Before Record Load', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, recordId: record?.getId() });\n");
            out.push("        },\n");
            out.push("        fieldchange: function(form, field, newValue, oldValue) {\n");
            out.push("          DirectCacheLogger.userStories('Edit Form Field Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', formId: this.id, fieldName: field.name, newValue: newValue, oldValue: oldValue });\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.thing.renderstore.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let properties = [
                ...context.gridviewProps
            ].sort((a, b)=>a.property.propertyName > b.property.propertyName ? 1 : -1);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.renderstore." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'renderstore." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("        ");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                const props = context.formPropsHash[property.propertyName].filter((f)=>f.generated && f.comboForcePreload);
                if (props.length === 0) {
                    out.push("\n");
                    out.push("          " + (JSON.stringify(property.propertyName)) + ": {},\n");
                    out.push("          ");
                } else {
                    for(let j = 0; j < props.length; j++){
                        const f = props[j];
                        out.push("\n");
                        out.push("          " + (JSON.stringify(property.propertyName)) + ":Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions['" + (property.propertyName) + "']?.store?.(),\n");
                        out.push("        ");
                    }
                }
                out.push("\n");
                out.push("        ");
            }
            out.push("\n");
            out.push("    },\n");
            out.push("  },\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.store.selected.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let $namespace = "";
            let nsa = [];
            for(let i = 0; i < context.normalizedName.length - 1; i++){
                nsa.push(context.normalizedName[i]);
            }
            const config = context.getThingConfig(context);
            $namespace = nsa.join(".");
            let name = context.normalizedName[context.normalizedName.length - 1];
            out.push("\n");
            out.push("Ext.define('Modeleditor.store." + ($namespace) + ".Selected." + (name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  requires:['Modeleditor.model." + ($namespace) + "." + (name) + "'],\n");
            out.push("  extend: 'Ext.data.LoggedStore',\n");
            out.push("  model: 'Modeleditor.model." + ($namespace) + "." + (name) + "',\n");
            out.push("  staticStore:" + (context.staticStore) + ",\n");
            out.push("  autoLoad:false,\n");
            out.push("  autoSync:false,\n");
            out.push("  remoteFilter:true,\n");
            out.push("  remoteSort:true,\n");
            out.push("  pageSize: " + (config.pageSizeEmbedded) + ",\n");
            out.push("  proxy: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].proxy(),\n");
            out.push("  data:[],  ");
            if (context.sortProperty && context.sortProperty.length > 0) {
                out.push("\n");
                out.push("  sorters: [");
                for(let i = 0, len = context.sortProperty.length; i < len; i++){
                    let sortPr = context.sortProperty[i];
                    if (i > 0) {
                        out.push(", ");
                    }
                    out.push("{\n");
                    out.push("    property:'" + (sortPr.property) + "',\n");
                    out.push("    direction:'" + (sortPr.direction) + "'\n");
                    out.push("  }");
                }
                out.push("\n");
                out.push("  ]\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.store.search.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let $namespace = "";
            let nsa = [];
            for(let i = 0; i < context.normalizedName.length - 1; i++){
                nsa.push(context.normalizedName[i]);
            }
            const config = context.getThingConfig(context);
            $namespace = nsa.join(".");
            let name = context.normalizedName[context.normalizedName.length - 1];
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.store." + ($namespace) + ".Search." + (name) + "', {\n");
            out.push("  storeId: \"" + (context.$namespace) + ".Search." + (context.$name) + "\",\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  requires:['Modeleditor.model." + ($namespace) + "." + (name) + "'],\n");
            out.push("  extend: 'Ext.data.LoggedStore',\n");
            out.push("  model: 'Modeleditor.model." + ($namespace) + "." + (name) + "',\n");
            out.push("  autoLoad:false,\n");
            out.push("  autoSync:false,\n");
            out.push("  remoteFilter:true,\n");
            out.push("  remoteSort:true,\n");
            out.push("  pageSize: " + (config.pageSizeSearch) + ",\n");
            out.push("  ");
            if (context.sortProperty && context.sortProperty.length > 0) {
                out.push("\n");
                out.push("  sorters: [");
                let sortPr;
                for(let i = 0, len = context.sortProperty.length; i < len; i++){
                    sortPr = context.sortProperty[i];
                    if (i > 0) {
                        out.push(", ");
                    }
                    out.push("{\n");
                    out.push("    property:'" + (sortPr.property) + "',\n");
                    out.push("    direction:'" + (sortPr.direction) + "'\n");
                    out.push("  },");
                }
                out.push("\n");
                out.push("  ],\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  proxy: {\n");
            out.push("    type: 'direct',\n");
            out.push("    directFn: Modeleditor.runSearch,\n");
            out.push("    ");
            if (!(context.queryResult || context.legacySearch)) {
                out.push("\n");
                out.push("    writer: {\n");
                out.push("      type: \"jsonmn\",\n");
                out.push("      writeAllFields: true\n");
                out.push("    },\n");
                out.push("    reader: {\n");
                out.push("      type: \"jsonmn\",\n");
                out.push("      root: \"data\"\n");
                out.push("    },\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    extraParams:{\n");
            out.push("      queryName: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + "\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.store.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let $namespace = "";
            let nsa = [];
            for(let i = 0; i < context.normalizedName.length - 1; i++){
                nsa.push(context.normalizedName[i]);
            }
            const config = context.getThingConfig(context);
            $namespace = nsa.join(".");
            let name = context.normalizedName[context.normalizedName.length - 1];
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.store." + ($namespace) + "." + (name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  requires:['Modeleditor.model." + ($namespace) + "." + (name) + "'],\n");
            out.push("  extend: 'Ext.data.LoggedStore',\n");
            out.push("  model: 'Modeleditor.model." + ($namespace) + "." + (name) + "',\n");
            out.push("  ");
            if (context.extension) {
                out.push((context.extension) + ",");
            }
            out.push("\n");
            out.push("  staticStore:" + (context.staticStore) + ",\n");
            out.push("  autoLoad:false,\n");
            out.push("  autoSync:false,");
            if (!context.staticStore && !context.queryResult) {
                out.push("\n");
                out.push("  remoteFilter:true,\n");
                out.push("  remoteSort:true,\n");
                out.push("  pageSize: " + (config.pageSize) + ",");
            } else {
                out.push("\n");
                out.push("  remoteFilter:false,\n");
                out.push("  remoteSort:false,\n");
                out.push("  pageSize: -1,\n");
                out.push("  ");
            }
            if (context.sortProperty && context.sortProperty.length > 0) {
                out.push("\n");
                out.push("  sorters: [");
                let sortPr;
                for(let i = 0, len = context.sortProperty.length; i < len; i++){
                    sortPr = context.sortProperty[i];
                    if (i > 0) {
                        out.push(", ");
                    }
                    out.push("{\n");
                    out.push("    property:'" + (sortPr.property) + "',\n");
                    out.push("    direction:'" + (sortPr.direction) + "'\n");
                    out.push("  }");
                }
                out.push("\n");
                out.push("  ]\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.store.catalog.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let $namespace = "";
            let nsa = [];
            for(let i = 0; i < context.normalizedName.length - 1; i++){
                nsa.push(context.normalizedName[i]);
            }
            $namespace = nsa.join(".");
            const config = context.getThingConfig(context);
            let name = context.normalizedName[context.normalizedName.length - 1];
            out.push("\n");
            out.push("Ext.define('Modeleditor.store." + ($namespace) + ".Catalog." + (name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  requires:['Modeleditor.model." + ($namespace) + ".Catalog." + (name) + "'],\n");
            out.push("  extend: 'Ext.data.LoggedStore',\n");
            out.push("  model: 'Modeleditor.model." + ($namespace) + ".Catalog." + (name) + "',\n");
            out.push("  staticStore:" + (context.staticStore) + ",\n");
            out.push("  autoLoad:false,\n");
            out.push("  autoSync:false,");
            if (!context.staticStore && !context.queryResult) {
                out.push("\n");
                out.push("  remoteFilter:true,\n");
                out.push("  remoteSort:true,\n");
                out.push("  pageSize: " + (config.pageSizeEmbedded) + ",");
            } else {
                out.push("\n");
                out.push("  remoteFilter:false,\n");
                out.push("  remoteSort:false,\n");
                out.push("  pageSize: -1,\n");
                out.push("  ");
            }
            out.push("extKeys:{},  ");
            if (context.sortProperty && context.sortProperty.length > 0) {
                out.push("\n");
                out.push("  sorters: [");
                let sortPr;
                for(let i = 0, len = context.sortProperty.length; i < len; i++){
                    sortPr = context.sortProperty[i];
                    if (i > 0) {
                        out.push(", ");
                    }
                    out.push("{\n");
                    out.push("    property:'" + (sortPr.property) + "',\n");
                    out.push("    direction:'" + (sortPr.direction) + "'\n");
                    out.push("  }");
                }
                out.push("\n");
                out.push("  ]\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.model.new.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.model." + (context.namespace) + "." + (context.$name) + "', {\n");
            out.push("  extend: \"Ext.data.ActiveModel\",\n");
            out.push("  idgen: {\n");
            out.push("    type: 'mongoIdgen',\n");
            out.push("    model: '" + (context.namespace) + "." + (context.$name) + "',\n");
            out.push("    location: 'db'\n");
            out.push("  },\n");
            out.push("  alternateClassName:'Workspace.model." + (context.namespace) + "." + (context.$name) + "',\n");
            out.push("  widget: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].widget,\n");
            out.push("  queryResult: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].queryResult,\n");
            out.push("  refreshMethod: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].refreshMethod,\n");
            out.push("  ");
            if (context.cal_mapping) {
                out.push("\n");
                out.push("  statics: {\n");
                out.push("    calendarMapping : Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].statics?.calendarMapping,\n");
                out.push("  },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  serverModel:'" + (context.$normalizedName) + "',\n");
            out.push("  relNames: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].relNames,\n");
            out.push("  groupedRels: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].groupedRels,\n");
            out.push("  fields: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].fields?.(),\n");
            out.push("  validations: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].validations?.(),\n");
            out.push("  associations: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].associations?.(),\n");
            out.push("  proxy:Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].proxy(),\n");
            out.push("  inheritance: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].inheritance,\n");
            out.push("  stateMachineHash: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].stateMachineHash,\n");
            out.push("  _fireSMEvent: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "']._fireSMEvent,\n");
            out.push("  ...Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].methods,\n");
            out.push("  }\n");
            out.push(");");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.model.metadata.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const makeRelVariants = context.makeRelVariants;
            const iterateRelGroups = context.iterateRelGroups;
            const rels = makeRelVariants(context.relations ?? []);
            const getThingConfig = context.getThingConfig;
            const config = getThingConfig(context);
            function prohibitArray(key, value) {
                if (Array.isArray(value)) {
                    return undefined;
                } else {
                    return value;
                }
            }
            let defaultQuery = context.defaultQuery ? context.defaultQuery.name : '';
            if (!defaultQuery) {
                defaultQuery = "ReadByQuery." + context.$fullName;
            }
            let refreshMethod = context.defaultRefresh ? context.defaultRefresh.name : '';
            if (!refreshMethod) {
                refreshMethod = "ReadByQuery." + context.$fullName;
            }
            const getRS = context.getRS;
            const calendar_mapping = context.cal_mapping;
            function parseStringDeep(str) {
                if (typeof str === 'string') {
                    try {
                        const v = JSON.parse(str);
                        if (typeof v === 'string') {
                            return parseStringDeep(v);
                        }
                        return str;
                    } catch (err) {
                        return str;
                    }
                }
            }
            function fixDefaultValue(value, type) {
                if (value !== undefined) {
                    let result;
                    switch(type){
                        case 'string':
                        case 'date':
                            if (typeof value === 'string') {
                                result = parseStringDeep(value);
                            } else if (value) {
                                result = JSON.stringify(value);
                            }
                            break;
                        case 'int':
                        case 'integer':
                        case 'float':
                            if (typeof value === 'number') {
                                result = value;
                            } else if (typeof value === 'string') {
                                try {
                                    const val = parseFloat(value);
                                    if (typeof val === 'number') {
                                        result = val;
                                    } else {
                                        result = value;
                                    }
                                } catch (err) {
                                    result = value;
                                }
                            }
                            break;
                        case 'boolean':
                            if (typeof value === 'boolean') {
                                result = value;
                            } else {
                                try {
                                    const val = JSON.parse(value);
                                    if (typeof val === 'boolean') {
                                        result = val;
                                    } else {
                                        result = value;
                                    }
                                } catch (err) {
                                    result = value;
                                }
                            }
                            break;
                        default:
                            result = value;
                    }
                    return JSON.stringify(result);
                }
                return JSON.stringify(value);
            }
            function capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            out.push("\n");
            out.push("\n");
            out.push("  Ext.define('Model.metamodel." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("    override: 'Grainjs.metadata',\n");
            out.push("    statics:{\n");
            out.push("    'model." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("    widget: \"" + (context.$widgetName) + "\",\n");
            out.push("    queryResult: " + (context.queryResult) + ",\n");
            out.push("    refreshMethod: " + (refreshMethod) + ",\n");
            out.push("    ");
            if (context.properties) {
                out.push("\n");
                out.push("    fields:()=> ([");
                let ignoredFields = {};
                for(let i = 0; i < context.$$$ClientProperties.length; i++){
                    let prop = context.$$$ClientProperties[i];
                    if (prop['autoInc']) {
                        ignoredFields[prop.propertyName] = true;
                    }
                    out.push("\n");
                    out.push("      {\n");
                    out.push("        name: '" + (prop.propertyName) + "'\n");
                    out.push("        ");
                    if (prop.type) {
                        out.push(",\n");
                        out.push("          type:'" + (prop.type) + "'\n");
                        out.push("          ");
                        if (prop.type == "date") {
                            out.push(",\n");
                            out.push("          dateFormat: 'c'");
                        }
                    }
                    if (prop.defaultValue) {
                        out.push(",\n");
                        out.push("        defaultValue:" + (fixDefaultValue(prop.defaultValue, prop.type)));
                    }
                    out.push("\n");
                    out.push("      },");
                }
                if (calendar_mapping) {
                    out.push("\n");
                    out.push("      /* Standard calendar property\n");
                    out.push("        Using:\n");
                    out.push("          AbstarctCalendar.prepareData();\n");
                    out.push("          base.periodicalMethods;\n");
                    out.push("          base.unAssignPanel;\n");
                    out.push("          base.periodicalEventBar;\n");
                    out.push("          app.gen.view.list...;\n");
                    out.push("          app.get.store...;\n");
                    out.push("      */\n");
                    out.push("      {\n");
                    out.push("        name:'_isassigned',\n");
                    out.push("        defaultValue:false,\n");
                    out.push("        type:'boolean'\n");
                    out.push("      },\n");
                    out.push("      {\n");
                    out.push("        name:'_isperiodical',\n");
                    out.push("        defaultValue:false,\n");
                    out.push("        type:'boolean'\n");
                    out.push("      },\n");
                    out.push("      {\n");
                    out.push("        name:'_isperiodicalroot',\n");
                    out.push("        defaultValue:false,\n");
                    out.push("        type:'boolean'\n");
                    out.push("      },\n");
                    out.push("      {\n");
                    out.push("        name:'_isperiodicalbydate',\n");
                    out.push("        defaultValue:true,\n");
                    out.push("        type:'boolean'\n");
                    out.push("      },\n");
                    out.push("      {\n");
                    out.push("        name:'_groupingid',\n");
                    out.push("        type:'string'\n");
                    out.push("      },\n");
                    out.push("      {\n");
                    out.push("        name: 'ignoredfields',\n");
                    out.push("        type: 'string',\n");
                    out.push("        defaultValue: '" + (JSON.stringify(ignoredFields)) + "'\n");
                    out.push("      },");
                }
                out.push("\n");
                out.push("\n");
                out.push("      /* Relations property */\n");
                out.push("      ");
                iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
                    if (rel.single && ((rel.derived && rel.derivation && rel.derivation.mode == 'server') || (!rel.derived && !rel.oppositeEmbedded))) {
                        out.push("      {\n");
                        out.push("        name: '" + (rel.to));
                        if (variant !== "*") {
                            out.push((rel.relName.split('.').join('')));
                        }
                        out.push("',\n");
                        out.push("        type:'string'\n");
                        out.push("      },");
                    }
                });
                out.push("\n");
                out.push("      /* key field */\n");
                out.push("      {\n");
                out.push("        name: 'id',\n");
                out.push("        type:'string'\n");
                out.push("      },\n");
                out.push("      {\n");
                out.push("        name: '_id',\n");
                out.push("        type:'string'\n");
                out.push("      }\n");
                out.push("    ]),\n");
                out.push("\n");
                out.push("    validations: ()=> ([");
                for(let i = 0; i < context.properties.length; i++){
                    let prop = context.properties[i];
                    if (prop.required) {
                        out.push("\n");
                        out.push("      {type: 'presence',  field: '" + (prop.propertyName) + "'},");
                    }
                }
                out.push("\n");
                out.push("      {type: 'presence',  field: 'id'}\n");
                out.push("    ]),\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ");
            if (calendar_mapping) {
                out.push("\n");
                out.push("    statics: {\n");
                out.push("      calendarMapping: {\n");
                out.push("        ");
                if (calendar_mapping.cal_displayInfo && !calendar_mapping.cal_displayInfo.disable) {
                    out.push("DisplayInfo:{\n");
                    out.push("          name: '" + (calendar_mapping.cal_displayInfo.name) + "',\n");
                    out.push("          function: function(record, callback){\n");
                    out.push("            " + (calendar_mapping.cal_displayInfo.function) + "\n");
                    out.push("          }\n");
                    out.push("        },");
                }
                out.push("\n");
                out.push("\n");
                out.push("        ");
                if (calendar_mapping.cal_toolTip && !calendar_mapping.cal_toolTip.disable) {
                    out.push("ToolTipInfo:{\n");
                    out.push("          name: '" + (calendar_mapping.cal_toolTip.name) + "',\n");
                    out.push("          function: function(record, callback){\n");
                    out.push("            " + (calendar_mapping.cal_toolTip.function) + "\n");
                    out.push("          }\n");
                    out.push("        },");
                }
                out.push("\n");
                out.push("\n");
                out.push("        EventId: {\n");
                out.push("          name:'id',\n");
                out.push("          type:'string'\n");
                out.push("        },");
                if (calendar_mapping.CalendarId) {
                    out.push("CalendarId: {\n");
                    out.push("          name:'" + (calendar_mapping.CalendarId) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.Title) {
                    out.push("Title: {\n");
                    out.push("          name:'" + (calendar_mapping.Title) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.StartDate) {
                    out.push("StartDate: {\n");
                    out.push("          name:'" + (calendar_mapping.StartDate) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.EndDate) {
                    out.push("EndDate: {\n");
                    out.push("          name:'" + (calendar_mapping.EndDate) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.RRule) {
                    out.push("RRule: {\n");
                    out.push("          name:'" + (calendar_mapping.RRule) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.Location) {
                    out.push("Location: {\n");
                    out.push("          name:'" + (calendar_mapping.Location) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.Notes) {
                    out.push("Notes: {\n");
                    out.push("          name:'" + (calendar_mapping.Notes) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.Url) {
                    out.push("Url: {\n");
                    out.push("          name:'" + (calendar_mapping.Url) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.IsAllDay) {
                    out.push("IsAllDay: {\n");
                    out.push("          name:'" + (calendar_mapping.IsAllDay) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.Reminder) {
                    out.push("Reminder: {\n");
                    out.push("          name:'" + (calendar_mapping.Reminder) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.IsHidden) {
                    out.push("IsHidden: {\n");
                    out.push("          name:'" + (calendar_mapping.IsHidden) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        },");
                }
                if (calendar_mapping.Duration) {
                    out.push("Duration: {\n");
                    out.push("          name:'" + (calendar_mapping.Duration) + "',\n");
                    out.push("          type:'int'\n");
                    out.push("        }");
                }
                out.push("\n");
                out.push("      }\n");
                out.push("    },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("\n");
            if (context.relations) {
                out.push("\n");
                out.push("  associations:()=>([\n");
                out.push("    ");
                iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
                    let rs = getRS(rel);
                    if (!rel.navigable) {
                        return;
                    }
                    let $pk = (rel.single) ? rel.toKeyField : rel.fromKeyField;
                    let $fk = (rel.single) ? rel.to : rel.from;
                    let $value = (rel.single) ? rel.to : rel.from;
                    if (!rel.single && Array.isArray(global.RelationCache.thing[rel.ref.thingType]?.[rel.from])) {
                        $fk += rel.relName.split('.').join('');
                    } else if (rel.single && Array.isArray(global.RelationCache.thing[rel.model.thingType]?.[rel.to])) {
                        $fk += rel.relName.split('.').join('');
                    }
                    let $oppositePk = (rel.single) ? rel.fromKeyField : rel.toKeyField;
                    out.push("\n");
                    out.push("    {\n");
                    out.push("      ");
                    const rConfg = getThingConfig(rel.ref);
                    out.push("\n");
                    out.push("      queryResult: " + (rel.ref.queryResult) + ",\n");
                    out.push("      storeConfig: { pageSize: " + (rConfg.pageSizeEmbedded) + " },\n");
                    out.push("      variant: " + (JSON.stringify(variant)) + ",\n");
                    out.push("      relName: '" + (rel.relName) + "',\n");
                    out.push("      noScan: " + (rs?.noScan ?? false) + ",\n");
                    out.push("      requireValidOwner: " + (rs?.requireValidOwner ?? false) + ",\n");
                    out.push("  ");
                    let serverSide = (rel.derived && rel.derivation && rel.derivation.mode == 'server') ? 'ServerDerived' : '';
                    if (!rel.derived || serverSide) {
                        out.push("\n");
                        out.push("      name:\"" + (rel.to));
                        if (variant !== "*") {
                            out.push((rel.relName.split('.').join('')));
                        }
                        out.push("\",\n");
                        out.push("      type:\"" + (rel.single ? 'belongsTo' : ('manyhasmany' + serverSide)) + "\",\n");
                        out.push("      serverModel:\"" + (rel.ref.thingType) + "\",\n");
                        out.push("      model:\"Modeleditor.model." + (rel.ref.thingType) + "\",\n");
                        out.push("\n");
                        out.push("      // primaryKey:'id',\n");
                        out.push("      primaryKey:'" + ($pk) + "',\n");
                        out.push("      foreignKey:'" + ($fk) + "',\n");
                        out.push("      embedded: " + (rel.embedded) + ",\n");
                        out.push("      oppositeEmbedded: " + (rel.oppositeEmbedded) + "\n");
                        out.push("    ");
                        if (rel.single) {
                            out.push(",\n");
                            out.push("      getterName:\"get" + ($fk) + "\",\n");
                            out.push("      setterName:\"set" + ($fk) + "\"\n");
                            out.push("    ");
                        } else if (!rel.single) {
                            out.push(",\n");
                            out.push("      ");
                            out.push("\n");
                            out.push("      /*opposite key to store in relation*/\n");
                            out.push("      oppositePk: \"" + ($oppositePk) + "\"\n");
                            out.push("    ");
                        }
                    } else {
                        out.push("\n");
                        out.push("\n");
                        out.push("      name:\"" + (rel.to));
                        if (variant !== "*") {
                            out.push((rel.relName.split('.').join('')));
                        }
                        out.push("\",\n");
                        out.push("      type:\"" + (rel.single ? 'belongsTo' : 'manyhasmany') + "Derived\",\n");
                        out.push("      serverModel:\"" + (rel.ref.thingType) + "\",\n");
                        out.push("      model:\"Modeleditor.model." + (rel.ref.thingType) + "\"");
                        if (rel.single) {
                            out.push(",\n");
                            out.push("      getterName:\"get" + ($fk) + "\",\n");
                            out.push("      setterName:\"set" + ($fk) + "\"");
                        }
                        out.push(",\n");
                        out.push("      ");
                        if (rel.derivation) {
                            out.push("\n");
                            out.push("      derivation: function(callback){\n");
                            out.push("        " + (rel.derivation.DerivationCode) + "\n");
                            out.push("      }");
                        }
                        out.push("\n");
                        out.push("\n");
                        out.push("    ");
                    }
                    out.push("},\n");
                    out.push("  ");
                });
                out.push("\n");
                out.push("  ]),\n");
                out.push("  relNames: {\n");
                out.push("    ");
                iterateRelGroups(rels, (variant, rel, relIndex, variantIndex)=>{
                    let rs = getRS(rel);
                    if (!rel.navigable) {
                        return;
                    }
                    let middle = (rel.single) ? (rs && rs.toReadOnly === true) ? "View" : "Edit" : "ListEmbedded";
                    const from = (Array.isArray(global.RelationCache.thing[rel.ref.thingType]?.[rel.from])) ? rel.from + rel.relName.split('.').join('') : rel.from;
                    const to = (variant !== "*") ? rel.to + rel.relName.split('.').join('') : rel.to;
                    out.push("\n");
                    out.push("\n");
                    out.push("    '" + (rel.to));
                    if (variant !== "*") {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("':  {\n");
                    out.push("        \"variant\"           : " + (JSON.stringify(variant)) + ",\n");
                    out.push("        \"serverModel\"       : \"" + (rel.ref.thingType) + "\",\n");
                    out.push("        \"relName\"           : " + (JSON.stringify(rel.namespace + '.' + rel.name + '-' + rel.to)) + ",\n");
                    out.push("        \"name\"              : " + (JSON.stringify('Modeleditor.view.' + rel.$refNamespace + '.' + middle + '.' + rel.$refName)) + ",\n");
                    out.push("        \"toXType\"           : " + (JSON.stringify([
                        rel.$refNamespace,
                        rel.$refName,
                        middle
                    ].join("").toLowerCase())) + ",\n");
                    out.push("        \"middle\"            : " + (JSON.stringify(middle)) + ",\n");
                    out.push("        \"to\"                : " + (JSON.stringify(to)) + ",\n");
                    out.push("        \"toSearchable\"      : " + (rs.toSearchable) + ",\n");
                    out.push("        \"fromSearchable\"      : " + (rs.fromSearchable) + ",\n");
                    out.push("        \"toAggregation\"     : " + ((rel.toAggregation) ? JSON.stringify(rel.toAggregation) : undefined) + ",\n");
                    out.push("        \"fromAggregation\"   : " + ((rel.fromAggregation) ? JSON.stringify(rel.fromAggregation) : undefined) + ",\n");
                    out.push("        \"toGroup\"           : _t(" + ((rs && rs.toGroup) ? JSON.stringify(rs.toGroup) : undefined) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'toGroup'),\n");
                    out.push("        \"toDisable\"         : " + ((rs) ? JSON.stringify(rs.toDisable) : undefined) + ",\n");
                    out.push("        \"fromDisable\"       : " + ((rs) ? JSON.stringify(rs.fromDisable) : undefined) + ",\n");
                    out.push("        \"toReadOnly\"        : " + ((rs) ? JSON.stringify(rs.toReadOnly) : undefined) + ",\n");
                    out.push("        \"toOrder\"           : " + ((rs) ? JSON.stringify(rs.toOrder) : undefined) + ",\n");
                    out.push("        \"toPreLoad\"         : " + ((rs) ? new Function("wnd, component, store, callback", rs.toPreLoad) : undefined) + ",\n");
                    out.push("        \"toToolbar\"         : " + ((rs) ? JSON.stringify(rs.toToolbar, prohibitArray) : undefined) + ",\n");
                    out.push("        \"toHeight\"          : " + ((rs) ? rs.toHeight : undefined) + ",\n");
                    out.push("        \"toDisplay\"         : _t(" + ((rs) ? JSON.stringify(rs.toDisplay) : JSON.stringify(rel.to)) + ",'" + (context.$namespace) + "." + (context.$name) + "', 'toDisplay', '" + (rel.to) + "'),\n");
                    out.push("        \"toKeyField\"        : " + (JSON.stringify(rel.toKeyField)) + ",\n");
                    out.push("        \"from\"              : " + (JSON.stringify(from)) + ",\n");
                    out.push("        \"fromKeyField\"      : " + (JSON.stringify(rel.fromKeyField)) + ",\n");
                    out.push("        \"single\"            : " + (JSON.stringify(rel.single)) + ",\n");
                    out.push("        \"required\"          : " + (JSON.stringify(rel.toRequired || rs.toRequired)) + ",\n");
                    out.push("        \"oppositeSingle\"    : " + (JSON.stringify(rel.oppositeSingle)) + ",\n");
                    out.push("        \"noScan\"            : " + (rs?.noScan ?? false) + ",\n");
                    out.push("        \"requireValidOwner\": " + (rs?.requireValidOwner ?? false) + ",\n");
                    out.push("      },\n");
                    out.push("  ");
                });
                out.push("\n");
                out.push("  },\n");
                out.push("  // old_proxu: () => new Ext.data.proxy.Direct({\n");
                out.push("  //   type: 'direct',\n");
                out.push("  //   directFn: \"" + (defaultQuery) + "\",\n");
                out.push("  //   /*do we need to load all associations? single and multiple???  */\n");
                out.push("  //   writer:{\n");
                out.push("  //     type:'jsonmn',\n");
                out.push("  //     writeAllFields: true\n");
                out.push("  //   },\n");
                out.push("  //   reader:{\n");
                out.push("  //     type:'jsonmn',\n");
                out.push("  //     root:'data'\n");
                out.push("  //   }\n");
                out.push("  // }),\n");
                out.push("  // always create new\n");
                out.push("  proxy: () => new Ext.data.proxy.Direct({\n");
                out.push("    type: 'direct',\n");
                out.push("    directFn: '" + (defaultQuery) + "',\n");
                out.push("    writer: {\n");
                out.push("      type: 'jsonmn',\n");
                out.push("      writeAllFields: true\n");
                out.push("    },\n");
                out.push("    reader: {\n");
                out.push("      type: 'jsonmn',\n");
                out.push("      root: 'data'\n");
                out.push("    }\n");
                out.push("  }),\n");
            }
            out.push("\n");
            if (context.collectionCount > 1) {
                out.push("\n");
                out.push("    inheritance: {\n");
                out.push("      \"successors\": " + (JSON.stringify(context.successors)) + ",\n");
                out.push("      \"extends\": " + (JSON.stringify(context.extends)) + ",\n");
                out.push("      \"extendsXType\": " + (context.extends ? JSON.stringify(context.extends.replace(/\./g, "").toLowerCase()) : undefined) + ",\n");
                out.push("      \"allSuccessors\":");
                let chlds = context.allChilds;
                let len = chlds ? chlds.length : 0;
                if (len > 0) {
                    let res = [];
                    for(let i = 0; i < len; i++){
                        res.push({
                            name: chlds[i]
                        });
                    }
                    out.push("\n");
                    out.push("        " + (JSON.stringify(res)) + "\n");
                    out.push("      ");
                } else {
                    out.push("null");
                }
                out.push("\n");
                out.push("    },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ");
            let localStateMachine = context.stateMachine;
            if (localStateMachine && localStateMachine.event && localStateMachine.event.length > 0) {
                out.push("\n");
                out.push("      /*State Machine support*/\n");
                out.push("      _fireSMEvent: function(event, callback){\n");
                out.push("        Modeleditor.fireEvent({model:this.serverModel, id:this.getId(), event:event}, callback);\n");
                out.push("      },\n");
                out.push("      ");
                let stateMachineHash = {
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
                    stateMachineHash["states"][name] = displays;
                    for(let k = 0; k < displays.length; k++){
                        let display = displays[k];
                        stateMachineHash["statuses"][display] = name;
                    }
                }
                ;
                out.push("\n");
                out.push("    // нужно сделать перевод внутри JSON, для этого просто проходим по JSON, его структура известна и дальше просто выводим значения в текстовый файл\n");
                out.push("    /* stateMachineHash: Ext.create(\"DualSideHash\", " + (JSON.stringify(stateMachineHash)) + "), */\n");
                out.push("    stateMachineHash: Ext.create(\"DualSideHash\", {\n");
                out.push("      thing: \"" + (context.$namespace) + "." + (context.$name) + "\",\n");
                out.push("      statuses: {\n");
                out.push("      ");
                for (const name of Object.keys(stateMachineHash["statuses"])){
                    out.push("\n");
                    out.push("        [_t(\"" + (name) + "\",\"StateMachines\",\"" + (context.$namespace) + "." + (context.$name) + "\",\"state\")]: \"" + (stateMachineHash["statuses"][name]) + "\",\n");
                    out.push("      ");
                }
                out.push("\n");
                out.push("      },\n");
                out.push("      states: {\n");
                out.push("      ");
                for (const name of Object.keys(stateMachineHash["states"])){
                    out.push("\n");
                    out.push("        " + (JSON.stringify(name)) + ": [\n");
                    out.push("        ");
                    if (stateMachineHash["states"]?.[name] && Array.isArray(stateMachineHash["states"][name])) {
                        const statuses = stateMachineHash["states"]?.[name];
                        for (const status of statuses){
                            out.push("\n");
                            out.push("        _t(" + (JSON.stringify(status)) + ",\"StateMachines\",\"" + (context.$namespace) + "." + (context.$name) + "\",\"state\"),\n");
                            out.push("        ");
                        }
                    }
                    out.push("\n");
                    out.push("        ],\n");
                    out.push("      ");
                }
                out.push("\n");
                out.push("      },\n");
                out.push("    }),\n");
                out.push("\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  groupedRels:()=> ({");
            let counter = Object.keys(context.groupedRels).length;
            for(let group in context.groupedRels){
                if (Object.prototype.hasOwnProperty.call(context.groupedRels, group)) {
                    let grRels = makeRelVariants(context.groupedRels[group]);
                    out.push("\n");
                    out.push("    [_t(\"" + (group) + "\",\"" + (context.$namespace) + "." + (context.$name) + "\",'toGroup')] : {\n");
                    out.push("      ");
                    iterateRelGroups(grRels, (variant, rel, relIndex, variantIndex)=>{
                        let rs = getRS(rel);
                        out.push("\n");
                        out.push("      \"" + (rel.to) + "\n");
                        out.push("        ");
                        if (variant !== "*") {
                            out.push("\n");
                            out.push("          " + (rel.relName.split('.').join('')) + "\n");
                            out.push("        ");
                        }
                        out.push("\":\n");
                        out.push("        _t(\"" + (rs.toDisplay) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'toDisplay', '" + (rel.to) + "'),\n");
                        out.push("      ");
                    });
                    out.push("\n");
                    out.push("    },\n");
                    out.push("    ");
                }
            }
            out.push("}),\n");
            out.push("  methods: {\n");
            out.push("  ");
            let initConstructors = context.clientMethods?.filter(function(m) {
                return m.type == 'constructor' && !m.disable;
            }) ?? [];
            if (initConstructors.length > 0) {
                out.push("\n");
                out.push("      ensureDefaults: function(){\n");
                out.push("        /*constructor init*/\n");
                out.push("        ");
                for(let i = initConstructors.length - 1; i >= 0; i--){
                    let clMethod = initConstructors[i];
                    if (!clMethod.disable) {
                        out.push("/*metodName >>> " + (clMethod.name) + "*/");
                        if (clMethod.comment) {
                            out.push("/* " + (clMethod.comment) + " */");
                        }
                        out.push("\n");
                        out.push("            " + (clMethod.body) + "\n");
                        out.push("          ");
                    }
                }
                out.push("\n");
                out.push("      },\n");
            }
            ;
            out.push("\n");
            let methods = context.clientMethods?.filter(function(m) {
                return m.type == 'model' && !m.disable;
            }) ?? [];
            if ((localStateMachine && context.debugSM) || (methods.length > 0)) {
                out.push("\n");
                out.push("    /* initListeners for subscriptions*/\n");
                out.push("    initListeners: function() {\n");
                out.push("      this.callParent();\n");
                out.push("        ");
                if (localStateMachine && context.debugSM) {
                    const stateAttribute = localStateMachine.stateAttribute;
                    out.push("\n");
                    out.push("      this." + (`es${capitalize(localStateMachine.stateAttribute)}`) + ".subscribe(function (e) {\n");
                    out.push("        var wnd;\n");
                    out.push("        var wnds = Ext.ComponentQuery.query(\"window\");\n");
                    out.push("        for (var i = wnds.length - 1; i >= 0; i--) {\n");
                    out.push("          var w = wnds[i];\n");
                    out.push("          if (w.zIndexManager && w.modeleditorController) {\n");
                    out.push("            wnd = w;\n");
                    out.push("            break;\n");
                    out.push("          }\n");
                    out.push("        }\n");
                    out.push("          if (e.record) {\n");
                    out.push("          const currentState = e.record.get(\"" + (stateAttribute) + "\")\n");
                    out.push("          ret = Promisify.direct(StoredQuery, \"getAvailableEvents\", {\n");
                    out.push("            thing: \"" + (context.$namespace) + "." + (context.$name) + "\",\n");
                    out.push("            state: currentState,\n");
                    out.push("            page: 1,\n");
                    out.push("            start: 0,\n");
                    out.push("            limit: 25\n");
                    out.push("          })\n");
                    out.push("          .then(data => {\n");
                    out.push("            const list = wnd.query('button[toggleGroup=state]')\n");
                    out.push("            const states = data.events.reduce((ret, cur)=>{\n");
                    out.push("              ret[cur.key] = _t(cur.value, \"StateMachines\", \"" + (context.$namespace) + "." + (context.$name) + "\", \"state\")\n");
                    out.push("              return ret\n");
                    out.push("            },{})\n");
                    out.push("\n");
                    out.push("            for(const btn of list){\n");
                    out.push("              if(states[btn.name]){\n");
                    out.push("                btn.enable()\n");
                    out.push("              } else {\n");
                    out.push("                btn.disable()\n");
                    out.push("              }\n");
                    out.push("            }\n");
                    out.push("          })\n");
                    out.push("          .catch(e => {\n");
                    out.push("            console.error('initListeners " + (`es${capitalize(localStateMachine.stateAttribute)}`) + " error', e)\n");
                    out.push("          })\n");
                    out.push("        }\n");
                    out.push("\n");
                    out.push("      });\n");
                    out.push("        ");
                }
                out.push("\n");
                out.push("    ");
                if (methods.length > 0) {
                    let rxInit = methods.filter(function(m) {
                        return !(m.initListeners == '' || !m.initListeners) && !m.disable;
                    });
                    if (rxInit.length > 0) {
                        out.push("\n");
                        out.push("          ");
                        for(let i = rxInit.length - 1; i >= 0; i--){
                            out.push("\n");
                            out.push("      /*method >> " + (rxInit[i].name) + "*/\n");
                            out.push("      " + (rxInit[i].initListeners) + "\n");
                            out.push("          ");
                        }
                        out.push("\n");
                        out.push("      ");
                    }
                }
                out.push("\n");
                out.push("    },\n");
                if (methods.length > 0) {
                    for(let i = methods.length - 1; i >= 0; i--){
                        let clMethod = methods[i];
                        if (!clMethod.disable) {
                            out.push("\n");
                            out.push("            ");
                            if (i == methods.length - 1) {
                                out.push("\n");
                                out.push("              /*model methods*/\n");
                                out.push("            ");
                            }
                            if (clMethod.comment) {
                                out.push("/* " + (clMethod.comment) + " */");
                            }
                            out.push("\n");
                            out.push("            " + (clMethod.name) + ": function(");
                            if (clMethod.params) {
                                out.push((clMethod.params));
                            }
                            out.push("){\n");
                            out.push("              " + (clMethod.body) + "\n");
                            out.push("            },");
                        }
                    }
                }
                out.push("\n");
            }
            out.push("\n");
            out.push("  }\n");
            out.push("  }\n");
            out.push("  }\n");
            out.push("  })");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.model.direct.old.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("let pipeline = require('pipeline.js');\n");
            out.push("let Context = require('pipeline.js').Context;\n");
            out.push("let _ = require('lodash')\n");
            out.push("\n");
            const makeRelVariants = context.makeRelVariants;
            const iterateRelGroups = context.iterateRelGroups;
            const allRels = makeRelVariants(context.relations);
            const allNonEmbedded = makeRelVariants(context.relations);
            const allSearchable = makeRelVariants(context.relations);
            const anyRel = Object.keys(allNonEmbedded).length > 0;
            out.push("\n");
            out.push("\n");
            out.push("// Default Query\n");
            out.push("if (typeof(global.CustomQuery) == 'undefined') global.CustomQuery = {};\n");
            out.push("\n");
            out.push("let ComplexQuery  = require(\"@grainjs/loaders\").ComplexQuery;\n");
            out.push("\n");
            out.push("let queryLoadRelated = function(db, prm, callback){\n");
            out.push("  let child = prm.opposite;\n");
            out.push("\n");
            out.push("  if(prm.extKeys) child.childRel = prm.extKeys;\n");
            out.push("  let rels = (prm.extKeys && typeof(prm.extKeys) === 'object') ? Object.keys(prm.extKeys) : [];\n");
            out.push("\n");
            out.push("  let q = {\n");
            out.push("    \"model\":prm.model,\n");
            out.push("    \"options\": prm.options,\n");
            out.push("    \"conditions\": prm.itemId,\n");
            out.push("    \"childRel\": [child]\n");
            out.push("  };\n");
            out.push("\n");
            out.push("  ComplexQuery.execQueryOne(db, q, function(err, data) {\n");
            out.push("    if (err) {\n");
            out.push("      callback(err)\n");
            out.push("    } else {\n");
            out.push("      const res = data ? data[prm.opposite.opposite] : []\n");
            out.push("      const total = res.length == prm.opposite.options.limit ? data.total[prm.opposite.opposite]: (prm.opposite.options.skip ?? 0) + res.length\n");
            out.push("\n");
            out.push("      callback(null,\n");
            out.push("        {\n");
            out.push("          data:res,\n");
            out.push("          total,\n");
            out.push("        },\n");
            out.push("        rels);\n");
            out.push("    }\n");
            out.push("  });\n");
            out.push("};\n");
            out.push("\n");
            out.push("const childRel = [\n");
            out.push("  ");
            iterateRelGroups(allNonEmbedded, (variant, rel, relIndex, variantIndex)=>{
                out.push("\n");
                out.push("  {\n");
                out.push("    opposite: \"" + (rel.to) + "\",\n");
                out.push("    ");
                if (variant !== '*') {
                    out.push("\n");
                    out.push("    relName: \"" + (rel.relName) + "\",\n");
                    out.push("    propName:\"" + (rel.to) + (rel.relName.split('.').join('')) + "\",\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("    model: \"" + (rel.ref.thingType) + "\",\n");
                out.push("    onlyIds: true,\n");
                out.push("  },\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("]\n");
            out.push("\n");
            out.push("let queryForDetail = function(prm){\n");
            out.push("  return {\n");
            out.push("    \"model\": \"" + (context.$normalizedName) + "\",\n");
            out.push("    \"options\": prm.options,\n");
            out.push("    \"conditions\": prm.root,\n");
            out.push("    \"childRel\": childRel\n");
            out.push("  };\n");
            out.push("};\n");
            out.push("\n");
            out.push("if (typeof(global.GenericSearchQueries) == 'undefined') global.GenericSearchQueries = {};\n");
            out.push("\n");
            out.push("let queryForSearch = function(prm) {\n");
            out.push("  const params = prm.search ?? {}\n");
            out.push("  const query = {\n");
            out.push("    \"model\": \"" + (context.$normalizedName) + "\",\n");
            out.push("    options: prm.options, //{ skip:0, limit: -1 },\n");
            out.push("    conditions: params.root ?? {}\n");
            out.push("  }\n");
            out.push("\n");
            out.push("  if(prm.fields) {\n");
            out.push("    query.fields = prm.fields\n");
            out.push("  }\n");
            out.push("\n");
            out.push("  const cr = []\n");
            out.push("  ");
            iterateRelGroups(allSearchable, (variant, rel, relIndex, variantIndex)=>{
                out.push("\n");
                out.push("  if(params.root_" + (rel.to) + "){\n");
                out.push("    cr.push({\n");
                out.push("      opposite: \"" + (rel.to) + "\",\n");
                out.push("      ");
                if (variant !== '*') {
                    out.push("\n");
                    out.push("      relName: \"" + (rel.relName) + "\",\n");
                    out.push("      propName:\"" + (rel.to) + (rel.relName.split('.').join('')) + "\",\n");
                    out.push("      ");
                }
                out.push("\n");
                out.push("      model: \"" + (rel.ref.thingType) + "\",\n");
                out.push("      onlyIds: true,\n");
                out.push("      conditions : params.root_" + (rel.to) + " ? _.omit(params.root_" + (rel.to) + ", ['ensure','absent']) : {},\n");
                out.push("      ensure: !params.root_" + (rel.to) + "?.absent && params.root_" + (rel.to) + " ? true : false,\n");
                out.push("      absent: !params.root_" + (rel.to) + "?.ensure && params.root_" + (rel.to) + "?.absent,\n");
                out.push("    })\n");
                out.push("  }\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("\n");
            out.push("  if(cr.length > 0) query.childRel = cr\n");
            out.push("  return query\n");
            out.push("};\n");
            out.push("\n");
            out.push("global.GenericSearchQueries['ReadByQuery." + (context.$fullName) + "'] = queryForSearch\n");
            out.push("\n");
            out.push("let queryForList = function(prm){\n");
            out.push("  let q = {\n");
            out.push("    \"model\": \"" + (context.$normalizedName) + "\",\n");
            out.push("    \"options\": prm.options,\n");
            out.push("    \"conditions\": prm.root\n");
            out.push("  };\n");
            out.push("  if (prm.extKeys) { q.childRel = prm.extKeys; }\n");
            out.push("  return q;\n");
            out.push("};\n");
            out.push("\n");
            out.push("let query" + (context.$fullName) + " = global.CustomQuery.query" + (context.$fullName) + " = exports.query" + (context.$fullName) + " = function (db, prm, callback) {\n");
            out.push("  let qry = prm.query(prm);\n");
            out.push("  let notEmpty = prm.notEmpty;\n");
            out.push("  let run = new pipeline.MultiWaySwitch([\n");
            out.push("    new pipeline.Stage(function(ctx, done) {\n");
            out.push("      ComplexQuery.execQueryList(db, qry, function(err, data) {\n");
            out.push("        if (!err) {\n");
            out.push("          ctx.data = data;\n");
            out.push("        }\n");
            out.push("        done(err);\n");
            out.push("      });\n");
            out.push("    }),\n");
            out.push("    new pipeline.Stage(function(ctx, done) {\n");
            out.push("      ComplexQuery.execQueryCount(db, qry, function(err, data) {\n");
            out.push("        if (!err) {\n");
            out.push("          ctx.total = data;\n");
            out.push("        }\n");
            out.push("        done(err);\n");
            out.push("      });\n");
            out.push("    })\n");
            out.push("  ]);\n");
            out.push("  run.execute(new Context({}), function(err, ctx) {\n");
            out.push("    if (err) {\n");
            out.push("      return callback(err);\n");
            out.push("    } else {\n");
            out.push("      // let result = {\n");
            out.push("      //   data: ctx.data ? ctx.data : [],\n");
            out.push("      //   total: ctx.total\n");
            out.push("      // };\n");
            out.push("\n");
            out.push("      const data = ctx.data ? ctx.data : []\n");
            out.push("      const total = data.length == qry.options.limit ? ctx.total : (qry.options.skip ?? 0) + data.length\n");
            out.push("\n");
            out.push("      let result = {\n");
            out.push("        data,\n");
            out.push("        total,\n");
            out.push("      }\n");
            out.push("      let rels;\n");
            out.push("      if (qry.childRel && typeof(qry.childRel) === 'object') rels = (qry.childRel && typeof(qry.childRel) === 'object') ? Object.keys(qry.childRel) : [];\n");
            out.push("      else if (qry.childRel && typeof(qry.childRel) === 'object') rels = (qry.childRel && typeof(qry.childRel) === 'string') ? qry.childRel.split(' ') : [];\n");
            out.push("      if (notEmpty && ctx.data.length === 0) {\n");
            out.push("        err = new Error(prm.emptyErrorMsg);\n");
            out.push("      }\n");
            out.push("      callback(err, result, rels);\n");
            out.push("    }\n");
            out.push("  });\n");
            out.push("};\n");
            out.push("Ext.directFn({\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  namespace: 'ReadByQuery',\n");
            out.push("  name: '" + (context.$fullName) + "',\n");
            out.push("  locationType:\"" + (context.locationType) + "\",\n");
            out.push("  body: function(para) {\n");
            out.push("    let search = para.search ?? false;\n");
            out.push("    let context = this;\n");
            out.push("    let prm = para.data.shift();\n");
            out.push("    let cond = {};\n");
            out.push("    let qOptions = {\n");
            out.push("    ");
            if (!(context.derivedProperties && context.derivedProperties.length > 0)) {
                out.push("\n");
                out.push("      //lean:true disabled for future only when we change the code generation engine\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    };\n");
            out.push("    let limit = (prm.hasOwnProperty('limit') && typeof prm.limit === 'number' && prm.limit > 0) ? prm.limit : 0;\n");
            out.push("    let skip = prm.start;\n");
            out.push("    let sort = Ext.decodeSort(prm.sort);\n");
            out.push("    // check if we need to load related ids for specific associations\n");
            out.push("    let extKeys = Ext.decodeExtKeys(prm);\n");
            out.push("    if (limit) qOptions.limit = limit;\n");
            out.push("    if (skip && limit) qOptions.skip = skip;\n");
            out.push("    if (typeof(sort) ==='object' && Object.keys(sort).length > 0) qOptions.sort = sort;\n");
            out.push("    let loadRecord = prm.full ? true : false;\n");
            out.push("    let relHash = {\n");
            out.push("      ");
            iterateRelGroups(allRels, (variant, rel, relIndex, variantIndex)=>{
                out.push("\n");
                out.push("        \"" + (rel.to));
                if (variant !== '*') {
                    out.push((rel.relName.split('.').join('')));
                }
                out.push("\":\"" + (rel.relName) + "\",\n");
                out.push("      ");
            });
            out.push("\n");
            out.push("    };\n");
            out.push("         //перенести в кодогенерацию --> цель: улучшить синхронизацию кэшированных данных так, чтобы она не удаляла нужные атрибуты или не заменяла пустыми\n");
            out.push("    let clean = function(obj, allRels, relList) {\n");
            out.push("    // relList это те реляции которые я хочу видеть... заказал.\n");
            out.push("    // allRels это все реляции доступные в объекте...\n");
            out.push("      let anyrels = false;\n");
            out.push("      if (relList) {\n");
            out.push("        let rels = {};\n");
            out.push("        for (let i = rels.length - 1; i >= 0; i--) {\n");
            out.push("          anyrels = true;\n");
            out.push("          rels[relList[i]] = 1;\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("      let ret;\n");
            out.push("      if (obj) {\n");
            out.push("        if (obj.data && Array.isArray(obj.data)) {\n");
            out.push("          obj.data = clean(obj.data, allRels, relList);\n");
            out.push("          ret = obj;\n");
            out.push("        } else if (Array.isArray(obj)) {\n");
            out.push("          ret = obj.map(function(item) {\n");
            out.push("            return clean(item, allRels, relList);\n");
            out.push("          });\n");
            out.push("        } else {\n");
            out.push("          ret = (obj.toObject) ? obj.toObject({virtuals:true}) : obj;\n");
            out.push("          if (anyrels) {\n");
            out.push("            for (let prop in allRels) {\n");
            out.push("              if(!relList.hasOwnProperty(prop))\n");
            out.push("                delete ret[prop];\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("      return ret;\n");
            out.push("    };\n");
            out.push("    let callback = function(err, data, rels) {\n");
            out.push("      if (!err) context.success(data ? clean(data, relHash, rels) : []);\n");
            out.push("      else context.failure(err);\n");
            out.push("    };\n");
            out.push("    if(!search) {\n");
            out.push("      cond.options = qOptions;\n");
            out.push("      let conditions = Ext.decodeFilters(prm.conditions, relHash)\n");
            out.push("      let filters = Ext.decodeFilters(prm.filter, relHash);\n");
            out.push("      let serverFilters = Ext.decodeFilters(prm.serverFilters, relHash);\n");
            out.push("      for(let fp in serverFilters){\n");
            out.push("        filters[fp] = serverFilters[fp];\n");
            out.push("      }\n");
            out.push("\n");
            out.push("      let qry;\n");
            out.push("\n");
            out.push("      ");
            if (anyRel > 0) {
                out.push("\n");
                out.push("        let filter;\n");
                out.push("        ");
                iterateRelGroups(allNonEmbedded, (variant, rel, relIndex, variantIndex)=>{
                    if (relIndex > 0 || variantIndex > 0) {
                        out.push(" else ");
                    }
                    out.push("\n");
                    out.push("        if(filters.hasOwnProperty('" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("')){\n");
                    out.push("          filter = filters['" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("'];\n");
                    out.push("          qry = {\n");
                    out.push("            model: \"" + (rel.ref.thingType) + "\",\n");
                    out.push("            itemId: {\n");
                    out.push("              \"" + (rel.toKeyField) + "\": filter\n");
                    out.push("            },\n");
                    out.push("            opposite: {\n");
                    out.push("              opposite: \"" + (rel.from) + "\",\n");
                    out.push("              options: qOptions,\n");
                    out.push("              conditions,\n");
                    out.push("              total:true,\n");
                    out.push("              \"childRel\": childRel\n");
                    out.push("            }\n");
                    out.push("          };\n");
                    out.push("\n");
                    out.push("          if(extKeys) qry.extKeys = extKeys;\n");
                    out.push("          queryLoadRelated(context.dbPool, qry, callback);\n");
                    out.push("        }\n");
                    out.push("      ");
                });
                out.push("\n");
                out.push("      else {\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("      let filterKeys = (filters && typeof(filters) ==='object') ? Object.keys(filters) : [];\n");
            out.push("\n");
            out.push("      if (prm.hasOwnProperty('id')) {\n");
            out.push("        loadRecord = true;\n");
            out.push("        if(prm.id === '$$$unlink$rel$$$') prm.id = '000000000000000000000000';\n");
            out.push("        cond.root = {\n");
            out.push("          _id: prm.id\n");
            out.push("        };\n");
            out.push("        cond.notEmpty = true;\n");
            out.push("        cond.emptyErrorMsg = 'Item of " + (context.$normalizedName) + " model with specified ID (' + prm.id + ') is not found.';\n");
            out.push("      } else {\n");
            out.push("        if(filterKeys.length > 0){\n");
            out.push("          // delete cond.options.skip;\n");
            out.push("          // delete cond.options.limit;\n");
            out.push("          let len = filterKeys.length;\n");
            out.push("          if (!cond.root) cond.root = {};\n");
            out.push("          for (let i = 0; i < len; i++) {\n");
            out.push("            cond.root[filterKeys[i]] = filters[filterKeys[i]];\n");
            out.push("          }\n");
            out.push("          if('id' in cond.root) {\n");
            out.push("            cond.root._id = cond.root.id\n");
            out.push("            cond.root.id = undefined\n");
            out.push("          }\n");
            out.push("          loadRecord = '_id' in cond.root;\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("\n");
            out.push("      if(extKeys) cond.extKeys = extKeys;\n");
            out.push("      // load Full Record Only(!!!) when id is present.\n");
            out.push("      cond.query = loadRecord ? queryForDetail : queryForList;\n");
            out.push("\n");
            out.push("      global.CustomQuery['query" + (context.$fullName) + "'](context.dbPool, cond, callback);\n");
            out.push("    ");
            if (anyRel > 0) {
                out.push("\n");
                out.push("      }\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    } else {\n");
            out.push("      global.CustomQuery['query" + (context.$fullName) + "'](context.dbPool, { ... prm, search: prm.query, query: queryForSearch, options: qOptions }, callback);\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.model.direct.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("let pipeline = require('pipeline.js');\n");
            out.push("let { deep_has_own, deep_rename_field } = require(\"@grainjs/loaders\")\n");
            out.push("let Context = require('pipeline.js').Context;\n");
            out.push("let _ = require('lodash')\n");
            out.push("\n");
            const makeRelVariants = context.makeRelVariants;
            const iterateRelGroups = context.iterateRelGroups;
            const allRels = makeRelVariants(context.relations);
            const allNonEmbedded = makeRelVariants(context.relations);
            const allSearchable = makeRelVariants(context.relations);
            const anyRel = Object.keys(allNonEmbedded).length > 0;
            out.push("\n");
            out.push("\n");
            out.push("// Default Query\n");
            out.push("if (typeof(global.CustomQuery) == 'undefined') global.CustomQuery = {};\n");
            out.push("\n");
            out.push("let ComplexQuery  = require(\"@grainjs/loaders\").ComplexQuery;\n");
            out.push("\n");
            out.push("let queryLoadRelated = function(db, prm, callback){\n");
            out.push("\n");
            out.push("  const totalQuery = {\n");
            out.push("    model: prm.model,\n");
            out.push("    options: prm.options,\n");
            out.push("    conditions: prm.itemId,\n");
            out.push("    childRel: [{\n");
            out.push("      opposite: prm.opposite.opposite,\n");
            out.push("      options: prm.opposite.options,\n");
            out.push("      conditions: prm.opposite.conditions,\n");
            out.push("      total: true,\n");
            out.push("    }]\n");
            out.push("  }\n");
            out.push("\n");
            out.push("  deep_rename_field(prm.opposite, (key) => {\n");
            out.push("    let result = key\n");
            out.push("    switch (key) {\n");
            out.push("      case 'limit':\n");
            out.push("        result = 'r_limit'\n");
            out.push("        break\n");
            out.push("      case 'skip':\n");
            out.push("        result = 'r_skip'\n");
            out.push("        break\n");
            out.push("      case 'sort':\n");
            out.push("        result = 'r_sort'\n");
            out.push("        break\n");
            out.push("    }\n");
            out.push("    return result\n");
            out.push("  })\n");
            out.push("\n");
            out.push("  let child = prm.opposite;\n");
            out.push("\n");
            out.push("  if(prm.extKeys) child.childRel = prm.extKeys;\n");
            out.push("  let rels = (prm.extKeys && typeof(prm.extKeys) === 'object') ? Object.keys(prm.extKeys) : [];\n");
            out.push("\n");
            out.push("  let q = {\n");
            out.push("    \"model\":prm.model,\n");
            out.push("    \"options\": prm.options,\n");
            out.push("    \"conditions\": prm.itemId,\n");
            out.push("    \"childRel\": [child]\n");
            out.push("  };\n");
            out.push("\n");
            out.push("\n");
            out.push("    Promise.all([ComplexQuery.execQuery(db, totalQuery), ComplexQuery.execQuery(db, q)])\n");
            out.push("    .then(([r_total, data]) => {\n");
            out.push("    const res =\n");
            out.push("      Array.isArray(data) && data.length > 0\n");
            out.push("        ? data\n");
            out.push("          .map((item) => item[prm.opposite.opposite])\n");
            out.push("          .reduce((acc, val) => acc.concat(val), [])\n");
            out.push("        : []\n");
            out.push("\n");
            out.push("    const total =\n");
            out.push("      res.length == prm.opposite.options.r_limit\n");
            out.push("        ? r_total\n");
            out.push("          .map((item) => item.total[prm.opposite.opposite])\n");
            out.push("          .reduce((acc, val) => acc + val, 0)\n");
            out.push("        : (prm.opposite.options.r_skip ?? 0) + res.length\n");
            out.push("\n");
            out.push("    callback(\n");
            out.push("      null,\n");
            out.push("      {\n");
            out.push("        data: res,\n");
            out.push("        total,\n");
            out.push("      },\n");
            out.push("      rels,\n");
            out.push("    )\n");
            out.push("\n");
            out.push("  }).catch((err) => {\n");
            out.push("    callback(err)\n");
            out.push("  })\n");
            out.push("};\n");
            out.push("\n");
            out.push("const childRel = [\n");
            out.push("  ");
            iterateRelGroups(allNonEmbedded, (variant, rel, relIndex, variantIndex)=>{
                out.push("\n");
                out.push("  {\n");
                out.push("    opposite: \"" + (rel.to) + "\",\n");
                out.push("    ");
                if (variant !== '*') {
                    out.push("\n");
                    out.push("    relName: \"" + (rel.relName) + "\",\n");
                    out.push("    propName:\"" + (rel.to) + (rel.relName.split('.').join('')) + "\",\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("    model: \"" + (rel.ref.thingType) + "\",\n");
                out.push("    onlyIds: true,\n");
                out.push("  },\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("]\n");
            out.push("\n");
            out.push("let queryForDetail = function(prm){\n");
            out.push("  return {\n");
            out.push("    \"model\": \"" + (context.$normalizedName) + "\",\n");
            out.push("    \"options\": prm.options,\n");
            out.push("    \"conditions\": prm.root,\n");
            out.push("    \"childRel\": childRel\n");
            out.push("  };\n");
            out.push("};\n");
            out.push("\n");
            out.push("if (typeof(global.GenericSearchQueries) == 'undefined') global.GenericSearchQueries = {};\n");
            out.push("\n");
            out.push("let queryForSearch = function(prm) {\n");
            out.push("  const params = prm.search ?? {}\n");
            out.push("  const query = {\n");
            out.push("    \"model\": \"" + (context.$normalizedName) + "\",\n");
            out.push("    options: prm.options, //{ skip:0, limit: -1 },\n");
            out.push("    conditions: params.root ?? {}\n");
            out.push("  }\n");
            out.push("\n");
            out.push("  if(prm.fields) {\n");
            out.push("    query.fields = prm.fields\n");
            out.push("  }\n");
            out.push("\n");
            out.push("  const cr = []\n");
            out.push("  ");
            iterateRelGroups(allSearchable, (variant, rel, relIndex, variantIndex)=>{
                out.push("\n");
                out.push("  if(params.root_" + (rel.to) + "){\n");
                out.push("    cr.push({\n");
                out.push("      opposite: \"" + (rel.to) + "\",\n");
                out.push("      ");
                if (variant !== '*') {
                    out.push("\n");
                    out.push("      relName: \"" + (rel.relName) + "\",\n");
                    out.push("      propName:\"" + (rel.to) + (rel.relName.split('.').join('')) + "\",\n");
                    out.push("      ");
                }
                out.push("\n");
                out.push("      model: \"" + (rel.ref.thingType) + "\",\n");
                out.push("      onlyIds: true,\n");
                out.push("      conditions : params.root_" + (rel.to) + " ? _.omit(params.root_" + (rel.to) + ", ['ensure','absent']) : {},\n");
                out.push("      ensure: !params.root_" + (rel.to) + "?.absent && params.root_" + (rel.to) + " ? true : false,\n");
                out.push("      absent: !params.root_" + (rel.to) + "?.ensure && params.root_" + (rel.to) + "?.absent,\n");
                out.push("    })\n");
                out.push("  }\n");
                out.push("  ");
            });
            out.push("\n");
            out.push("\n");
            out.push("  if(cr.length > 0) query.childRel = cr\n");
            out.push("  return query\n");
            out.push("};\n");
            out.push("\n");
            out.push("global.GenericSearchQueries['ReadByQuery." + (context.$fullName) + "'] = queryForSearch\n");
            out.push("\n");
            out.push("let queryForList = function(prm){\n");
            out.push("  let q = {\n");
            out.push("    \"model\": \"" + (context.$normalizedName) + "\",\n");
            out.push("    \"options\": prm.options,\n");
            out.push("    \"conditions\": prm.root\n");
            out.push("  };\n");
            out.push("  if (prm.extKeys) { q.childRel = prm.extKeys; }\n");
            out.push("  return q;\n");
            out.push("};\n");
            out.push("\n");
            out.push("let query" + (context.$fullName) + " = global.CustomQuery.query" + (context.$fullName) + " = exports.query" + (context.$fullName) + " = function (db, prm, callback) {\n");
            out.push("  let qry = prm.query(prm);\n");
            out.push("  let notEmpty = prm.notEmpty;\n");
            out.push("\n");
            out.push("  Promise.all([ComplexQuery.execQueryList(db, qry), ComplexQuery.execQueryCount(db, qry)])\n");
            out.push("  .then(([res_data, res_total])=>{\n");
            out.push("      const data = res_data ? res_data : []\n");
            out.push("      const total = data.length == qry.options.limit ? res_total : (qry.options.skip ?? 0) + data.length\n");
            out.push("      let result = {\n");
            out.push("        data,\n");
            out.push("        total,\n");
            out.push("      }\n");
            out.push("      let rels;\n");
            out.push("      if (qry.childRel && typeof(qry.childRel) === 'object') rels = (qry.childRel && typeof(qry.childRel) === 'object') ? Object.keys(qry.childRel) : [];\n");
            out.push("      else if (qry.childRel && typeof(qry.childRel) === 'object') rels = (qry.childRel && typeof(qry.childRel) === 'string') ? qry.childRel.split(' ') : [];\n");
            out.push("      let err = null\n");
            out.push("      if (notEmpty && res_total.length === 0) {\n");
            out.push("        err = new Error(prm.emptyErrorMsg);\n");
            out.push("      }\n");
            out.push("      callback(err, result, rels);\n");
            out.push("  }).catch(err=>{\n");
            out.push("    callback(err)\n");
            out.push("  })\n");
            out.push("};\n");
            out.push("\n");
            out.push("Ext.directFn({\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  namespace: 'ReadByQuery',\n");
            out.push("  name: '" + (context.$fullName) + "',\n");
            out.push("  locationType:\"" + (context.locationType) + "\",\n");
            out.push("  body: function(para) {\n");
            out.push("    let search = para.search ?? false;\n");
            out.push("    let context = this;\n");
            out.push("    let prm = para.data.shift();\n");
            out.push("    let cond = {};\n");
            out.push("    let qOptions = {\n");
            out.push("    ");
            if (!(context.derivedProperties && context.derivedProperties.length > 0)) {
                out.push("\n");
                out.push("      //lean:true disabled for future only when we change the code generation engine\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    };\n");
            out.push("    let limit = (prm.hasOwnProperty('limit') && typeof prm.limit === 'number' && prm.limit > 0) ? prm.limit : 0;\n");
            out.push("    let skip = prm.start;\n");
            out.push("    let sort = Ext.decodeSort(prm.sort);\n");
            out.push("    // check if we need to load related ids for specific associations\n");
            out.push("    let extKeys = Ext.decodeExtKeys(prm);\n");
            out.push("    if (limit) qOptions.limit = limit;\n");
            out.push("    if (skip && limit) qOptions.skip = skip;\n");
            out.push("    if (typeof(sort) ==='object' && Object.keys(sort).length > 0) qOptions.sort = sort;\n");
            out.push("    let loadRecord = prm.full ? true : false;\n");
            out.push("    let relHash = {\n");
            out.push("      ");
            iterateRelGroups(allRels, (variant, rel, relIndex, variantIndex)=>{
                out.push("\n");
                out.push("        \"" + (rel.to));
                if (variant !== '*') {
                    out.push((rel.relName.split('.').join('')));
                }
                out.push("\":\"" + (rel.relName) + "\",\n");
                out.push("      ");
            });
            out.push("\n");
            out.push("    };\n");
            out.push("         //перенести в кодогенерацию --> цель: улучшить синхронизацию кэшированных данных так, чтобы она не удаляла нужные атрибуты или не заменяла пустыми\n");
            out.push("    let clean = function(obj, allRels, relList) {\n");
            out.push("    // relList это те реляции которые я хочу видеть... заказал.\n");
            out.push("    // allRels это все реляции доступные в объекте...\n");
            out.push("      let anyrels = false;\n");
            out.push("      if (relList) {\n");
            out.push("        let rels = {};\n");
            out.push("        for (let i = rels.length - 1; i >= 0; i--) {\n");
            out.push("          anyrels = true;\n");
            out.push("          rels[relList[i]] = 1;\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("      let ret;\n");
            out.push("      if (obj) {\n");
            out.push("        if (obj.data && Array.isArray(obj.data)) {\n");
            out.push("          obj.data = clean(obj.data, allRels, relList);\n");
            out.push("          ret = obj;\n");
            out.push("        } else if (Array.isArray(obj)) {\n");
            out.push("          ret = obj.map(function(item) {\n");
            out.push("            return clean(item, allRels, relList);\n");
            out.push("          });\n");
            out.push("        } else {\n");
            out.push("          ret = (obj.toObject) ? obj.toObject({virtuals:true}) : obj;\n");
            out.push("          if (anyrels) {\n");
            out.push("            for (let prop in allRels) {\n");
            out.push("              if(!relList.hasOwnProperty(prop))\n");
            out.push("                delete ret[prop];\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("      return ret;\n");
            out.push("    };\n");
            out.push("    let callback = function(err, data, rels) {\n");
            out.push("      if (!err) context.success(data ? clean(data, relHash, rels) : []);\n");
            out.push("      else context.failure(err);\n");
            out.push("    };\n");
            out.push("    if(!search) {\n");
            out.push("      cond.options = qOptions;\n");
            out.push("      let conditions = Ext.decodeFilters(prm.conditions, relHash)\n");
            out.push("      let filters = Ext.decodeFilters(prm.filter, relHash);\n");
            out.push("      let serverFilters = Ext.decodeFilters(prm.serverFilters, relHash);\n");
            out.push("      for(let fp in serverFilters){\n");
            out.push("        filters[fp] = serverFilters[fp];\n");
            out.push("      }\n");
            out.push("\n");
            out.push("      let qry;\n");
            out.push("\n");
            out.push("      ");
            if (anyRel > 0) {
                out.push("\n");
                out.push("        let filter;\n");
                out.push("        ");
                iterateRelGroups(allNonEmbedded, (variant, rel, relIndex, variantIndex)=>{
                    if (relIndex > 0 || variantIndex > 0) {
                        out.push(" else ");
                    }
                    out.push("\n");
                    out.push("        if(filters.hasOwnProperty('" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("')){\n");
                    out.push("          filter = filters['" + (rel.to));
                    if (variant !== '*') {
                        out.push((rel.relName.split('.').join('')));
                    }
                    out.push("'];\n");
                    out.push("          qry = {\n");
                    out.push("            model: \"" + (rel.ref.thingType) + "\",\n");
                    out.push("            itemId: {\n");
                    out.push("              \"" + (rel.toKeyField) + "\": filter\n");
                    out.push("            },\n");
                    out.push("            opposite: {\n");
                    out.push("              opposite: \"" + (rel.from) + "\",\n");
                    out.push("              options: qOptions,\n");
                    out.push("              conditions,\n");
                    out.push("              total:true,\n");
                    out.push("              childRel: childRel\n");
                    out.push("            }\n");
                    out.push("          };\n");
                    out.push("\n");
                    out.push("          if(extKeys) qry.extKeys = extKeys;\n");
                    out.push("          queryLoadRelated(context.dbPool, qry, callback);\n");
                    out.push("        }\n");
                    out.push("      ");
                });
                out.push("\n");
                out.push("      else {\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("      let filterKeys = (filters && typeof(filters) ==='object') ? Object.keys(filters) : [];\n");
            out.push("\n");
            out.push("      if (prm.hasOwnProperty('id')) {\n");
            out.push("        loadRecord = true;\n");
            out.push("        if(prm.id === '$$$unlink$rel$$$') prm.id = '000000000000000000000000';\n");
            out.push("        cond.root = {\n");
            out.push("          // mongo specific\n");
            out.push("          _id: prm.id\n");
            out.push("        };\n");
            out.push("        cond.notEmpty = true;\n");
            out.push("        cond.emptyErrorMsg = 'Item of " + (context.$normalizedName) + " model with specified ID (' + prm.id + ') is not found.';\n");
            out.push("      } else {\n");
            out.push("        if(filterKeys.length > 0){\n");
            out.push("          // delete cond.options.skip;\n");
            out.push("          // delete cond.options.limit;\n");
            out.push("          let len = filterKeys.length;\n");
            out.push("          if (!cond.root) cond.root = {};\n");
            out.push("          for (let i = 0; i < len; i++) {\n");
            out.push("            cond.root[filterKeys[i]] = filters[filterKeys[i]];\n");
            out.push("          }\n");
            out.push("\n");
            out.push("          if(deep_has_own(cond, 'id')){\n");
            out.push("            // mongo specific\n");
            out.push("            deep_rename_field(cond, key=> key === 'id' ? '_id' : key)\n");
            out.push("          }\n");
            out.push("          // mongo specific\n");
            out.push("          loadRecord = deep_has_own(cond, '_id')\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("\n");
            out.push("      if(extKeys) cond.extKeys = extKeys;\n");
            out.push("      // load Full Record Only(!!!) when id is present.\n");
            out.push("      cond.query = loadRecord ? queryForDetail : queryForList;\n");
            out.push("\n");
            out.push("      global.CustomQuery['query" + (context.$fullName) + "'](context.dbPool, cond, callback);\n");
            out.push("    ");
            if (anyRel > 0) {
                out.push("\n");
                out.push("      }\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    } else {\n");
            out.push("      global.CustomQuery['query" + (context.$fullName) + "'](context.dbPool, { ... prm, search: prm.query, query: queryForSearch, options: qOptions }, callback);\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.model.catalog.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.model." + (context.namespace) + ".Catalog." + (context.$name) + "', {\n");
            out.push("  extend: \"Ext.data.ActiveModel\",\n");
            out.push("  idgen: {\n");
            out.push("    type: 'mongoIdgen',\n");
            out.push("    model: '" + (context.namespace) + "." + (context.$name) + "',\n");
            out.push("    location: 'db'\n");
            out.push("  },\n");
            out.push("  widget: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].widget,\n");
            out.push("  queryResult: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].queryResult,\n");
            out.push("  refreshMethod: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].refreshMethod,\n");
            out.push("  ");
            if (context.cal_mapping) {
                out.push("\n");
                out.push("  statics: {\n");
                out.push("    calendarMapping : Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].statics?.calendarMapping,\n");
                out.push("  },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  serverModel:'" + (context.$normalizedName) + "',\n");
            out.push("  relNames: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].relNames,\n");
            out.push("  groupedRels: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].groupedRels,\n");
            out.push("  fields: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].fields?.(),\n");
            out.push("  validations: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].validations?.(),\n");
            out.push("  associations: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].associations?.(),\n");
            out.push("  proxy:Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].proxy(),\n");
            out.push("  inheritance: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].inheritance,\n");
            out.push("  stateMachineHash: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].stateMachineHash,\n");
            out.push("  _fireSMEvent: Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "']._fireSMEvent,\n");
            out.push("  ...Grainjs.metadata['model." + (context.$namespace) + "." + (context.$name) + "'].methods,\n");
            out.push("  }\n");
            out.push(");");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.metagridfields.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const getFormat = context.getFormat;
            let properties = [
                ...context.gridviewProps
            ].sort((a, b)=>a.property.propertyName > b.property.propertyName ? 1 : -1);
            out.push("\n");
            out.push("  Ext.define('Grainjs.metagridfields." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("    override: 'Grainjs.metadata',\n");
            out.push("    statics:{\n");
            out.push("      'gridfields." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("        fields: {\n");
            out.push("        ");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                let g = properties[i];
                const viewProps = context.formPropsHash[property.propertyName].filter((f)=>f.generated);
                let f;
                if (viewProps.length > 0) {
                    f = viewProps[0];
                } else {
                    f = {};
                }
                out.push("\n");
                out.push("          [`" + (property.propertyName) + "::" + (g.columnText) + "`]:()=> ({\n");
                out.push("            dataIndex:\"" + (property.propertyName) + "\",\n");
                out.push("            text:      _t(" + (JSON.stringify(g.columnText)) + ",'" + (context.$namespace) + "." + (context.$name) + "','labels','" + (property.propertyName) + "'),\n");
                out.push("            flex:      " + (g.flex) + ",");
                if (g.width && g.width > 0) {
                    out.push("\n");
                    out.push("            width:    " + (g.width) + ",");
                }
                out.push("\n");
                out.push("            hidden:      " + (g.hidden) + ",\n");
                out.push("            filterable:  " + (property.isVirtual ? false : g.filterable) + ",\n");
                out.push("            ");
                if (g.filterable) {
                    out.push("\n");
                    out.push("            filter:\n");
                    out.push("            ");
                    if (g.enforceFilter === 'none' || !g.enforceFilter) {
                        out.push("\n");
                        out.push("            ");
                        if (!property.isVirtual) {
                            if (f.fieldtype === "combobox" && g.filterable) {
                                out.push("{\n");
                                out.push("              type: 'combo',\n");
                                out.push("              ");
                                if (f.comboForcePreload) {
                                    out.push("\n");
                                    out.push("              store: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                                    out.push("              ");
                                } else {
                                    out.push("\n");
                                    out.push("              store: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].store(),\n");
                                    out.push("              ");
                                }
                                out.push("\n");
                                out.push("              displayField:  Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].displayField,\n");
                                out.push("              valueField:  Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].valueField\n");
                                out.push("            }\n");
                                out.push("            ");
                            } else if (!(g.filter || g.filterable) && property.relation) {
                                out.push("\n");
                                out.push("              \"key\"\n");
                                out.push("            ");
                            } else if (g.filter || g.filterable) {
                                out.push("\n");
                                out.push("              " + ((g.filter || g.filterable)) + "\n");
                                out.push("            ");
                            }
                        } else {
                            out.push("false");
                        }
                        out.push("\n");
                        out.push("            ");
                    } else if (g.enforceFilter === 'key') {
                        out.push("\n");
                        out.push("            \"key\"\n");
                        out.push("            ");
                    } else if (g.enforceFilter === 'filter') {
                        out.push("\n");
                        out.push("            true\n");
                        out.push("            ");
                    }
                    out.push("\n");
                    out.push("            ,\n");
                    out.push("            ");
                }
                out.push("\n");
                out.push("            sortable:     " + (g.sortable) + ",\n");
                out.push("            hideable:     " + (g.hideable) + ",\n");
                out.push("            draggable:    " + (g.draggable) + ",\n");
                out.push("            resizeable:   " + (g.resizeable) + ",\n");
                out.push("            menuDisabled: " + (g.menuDisabled) + ",\n");
                out.push("            format:      " + (getFormat(g)) + ",\n");
                out.push("            xtype:      \"" + (g.columntype) + "\"");
                if (!g.columnRenderer && f.fieldtype === "combobox") {
                    out.push(",\n");
                    out.push("            ");
                    if (f.comboForcePreload) {
                        out.push("\n");
                        out.push("            renderStore: Grainjs.metadata['renderstore." + (context.$namespace) + "." + (context.$name) + "'][" + (JSON.stringify(property.propertyName)) + "],\n");
                        out.push("            ");
                    } else {
                        out.push("\n");
                        out.push("            // renderStore: Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "].store(),\n");
                        out.push("            ");
                    }
                    out.push("\n");
                    out.push("            renderer:  function(value, me){\n");
                    out.push("              let res = value;\n");
                    out.push("              let options = Grainjs.metadata['gridcombo." + (context.$namespace) + "." + (context.$name) + "'].comboOptions[" + (JSON.stringify(property.propertyName)) + "];\n");
                    out.push("              let store = me.column.renderStore ?? options.store();\n");
                    out.push("              if(store?.loadState !== Ext.data.LoggedStore.STATE_LOADED && !me.column.renderStoreLoaded) {\n");
                    out.push("                const grid = me.column.up('grid')\n");
                    out.push("                const column = me.column\n");
                    out.push("                column.renderStoreLoaded = true\n");
                    out.push("                column.renderStore = store\n");
                    out.push("                Promisify.event(store, 'load').then(_=> {\n");
                    out.push("                  grid.view.refresh();\n");
                    out.push("                })\n");
                    out.push("              }\n");
                    out.push("              let index = store?.findExact(options.valueField, value) ?? -1;\n");
                    out.push("              if (index != -1) {\n");
                    out.push("                let result = store.getAt(index).data;\n");
                    out.push("                res = result[options.displayField];\n");
                    out.push("              }\n");
                    out.push("              return res;\n");
                    out.push("            }");
                } else if (!g.columnRenderer && g.columntype === "numbercolumn") {
                    out.push(",\n");
                    out.push("              renderer: function(value) {\n");
                    out.push("                return Ext.String.format('<div style=\"text-align: right;\">{0}</div>', Ext.util.Format.number(value, " + (getFormat(g)) + "));\n");
                    out.push("              }\n");
                    out.push("            ");
                } else if (g.columnRenderer) {
                    out.push(",\n");
                    out.push("            renderer:  function(value){\n");
                    out.push("              " + (g.columnRenderer) + "\n");
                    out.push("            }");
                }
                if (context.periodicalRel && property.propertyName == context.titleProp) {
                    out.push(",\n");
                    out.push("              xtype: \"gridcolumn\",\n");
                    out.push("              renderer: function(val, metaData, record){\n");
                    out.push("                let styling = false;\n");
                    out.push("                let txt = \"\";\n");
                    out.push("                let color = \"#E8E8E8\";\n");
                    out.push("\n");
                    out.push("                if (record.get(\"_isperiodical\")) {\n");
                    out.push("                  styling = true;\n");
                    out.push("                  txt = \"P\";\n");
                    out.push("                  color = \"#F5DEB3\";\n");
                    out.push("                } else if (record.get(\"_isperiodicalroot\")) {\n");
                    out.push("                  styling = true;\n");
                    out.push("                  txt = \"R\";\n");
                    out.push("                  color = \"#E8E8E8\";\n");
                    out.push("                }\n");
                    out.push("\n");
                    out.push("                if (styling) {\n");
                    out.push("                  return '<div>'+\n");
                    out.push("                    '<div style=\"float:left\";>' +\n");
                    out.push("                      val +\n");
                    out.push("                    '</div>'+\n");
                    out.push("                    '<div style=\"padding:1px 4px;'+\n");
                    out.push("                      ' margin:0 0 0 10px;'+\n");
                    out.push("                      ' -moz-border-radius:3px;'+\n");
                    out.push("                      ' -webkit-border-radius:3px;'+\n");
                    out.push("                      ' border-radius:3px;'+\n");
                    out.push("                      ' background-color: '+color+';'+\n");
                    out.push("                      ' float:right;>'+\n");
                    out.push("                      ' -moz-box-shadow: 0 0 2px #888;'+\n");
                    out.push("                      ' -webkit-box-shadow: 0 0 2px#888;'+\n");
                    out.push("                      ' box-shadow: 0 0 2px #888;'+\n");
                    out.push("                    '\">'+txt+\n");
                    out.push("                    '</div>'+\n");
                    out.push("                  '</div>'\n");
                    out.push("                } else {\n");
                    out.push("                  return val;\n");
                    out.push("                }\n");
                    out.push("              }\n");
                    out.push("            ");
                }
                out.push("\n");
                out.push("          ");
                if (g.extraOptions && g.extraOptions !== '{}') {
                    out.push(",..." + (g.extraOptions) + ",");
                }
                out.push("\n");
                out.push("          }),\n");
                out.push("              ");
            }
            out.push("\n");
            out.push("      }\n");
            out.push("    }\n");
            out.push("  }\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.metagridcombo.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let properties = [
                ...context.gridviewProps
            ].sort((a, b)=>a.property.propertyName > b.property.propertyName ? 1 : -1);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Grainjs.metagridcombo." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  override: 'Grainjs.metadata',\n");
            out.push("  statics:{\n");
            out.push("    'gridcombo." + (context.$namespace) + "." + (context.$name) + "': {\n");
            out.push("      comboOptions: {\n");
            out.push("        ");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                const props = context.formPropsHash[property.propertyName].filter((f)=>f.generated);
                if (props.length === 0) {
                    out.push("\n");
                    out.push("          " + (JSON.stringify(property.propertyName)) + ": {},\n");
                    out.push("          ");
                } else {
                    for(let j = 0; j < props.length; j++){
                        const f = props[j];
                        out.push("\n");
                        out.push("          " + (JSON.stringify(property.propertyName)) + ": {\n");
                        out.push("          ");
                        if (f.comboData && f.comboData != "" && f.comboData != "{}") {
                            let cdata = JSON.parse(f.comboData);
                            out.push("\n");
                            out.push("            ");
                            if (cdata.store != undefined && cdata.displayField != undefined && cdata.valueField != undefined) {
                                out.push("\n");
                                out.push("                ");
                                if (cdata.tpl) {
                                    out.push("\n");
                                    out.push("                tpl: " + (JSON.stringify(cdata.tpl)) + ",\n");
                                    out.push("                ");
                                }
                                out.push("\n");
                                out.push("                store:\n");
                                out.push("                ");
                                if (typeof (cdata.store) == "string") {
                                    out.push("\n");
                                    out.push("                  ()=>Ext.create('Modeleditor.store." + (cdata.store) + "', {\n");
                                    out.push("                  autoLoad: true,\n");
                                    out.push("                  remoteFilter: false,\n");
                                    out.push("                  remoteSort: false,\n");
                                    out.push("                  pageSize: -1\n");
                                    out.push("                }),\n");
                                    out.push("                ");
                                } else if (typeof (cdata.store) == "object") {
                                    out.push("\n");
                                    out.push("                  ()=>Ext.create(\"Ext.data.Store\", {\n");
                                    out.push("                    " + (JSON.stringify(cdata.store)) + "\n");
                                    out.push("                  }),\n");
                                    out.push("                ");
                                }
                                out.push("\n");
                                out.push("                displayField: '" + (cdata.displayField) + "',\n");
                                out.push("                valueField: '" + (cdata.valueField) + "',\n");
                                out.push("                queryMode: 'local',\n");
                                out.push("                // queryParam: \"filter::" + (cdata.valueField) + "\",\n");
                                out.push("                listeners:{\n");
                                out.push("                  focus: function(combo, event, eOpts ) {\n");
                                out.push("                    let store = combo.getStore();\n");
                                out.push("                    combo.queryFilter = false;\n");
                                out.push("                    store.clearFilter(true);\n");
                                out.push("                  },\n");
                                out.push("                  afterrender: function (combo, opts) {\n");
                                out.push("                    let store = combo.getStore();\n");
                                out.push("                    store.clearFilter(true); // If true the filter is cleared silently;\n");
                                out.push("                    if(store.isLoading()){\n");
                                out.push("                      combo.setLoading(true);\n");
                                out.push("                      store.on({\n");
                                out.push("                        load: {\n");
                                out.push("                          fn: function(st, records, success, opts){\n");
                                out.push("                            if(success) {\n");
                                out.push("                              this.setLoading(false);\n");
                                out.push("                            }\n");
                                out.push("                          },\n");
                                out.push("                          scope: combo,\n");
                                out.push("                          single: true\n");
                                out.push("                        }\n");
                                out.push("                      });\n");
                                out.push("                    }else{\n");
                                out.push("                      if (!store.loaded) {\n");
                                out.push("                        combo.setLoading(true);\n");
                                out.push("                        store.load(function(records, operation, success){\n");
                                out.push("                          if(success){\n");
                                out.push("                            store.loaded = true;\n");
                                out.push("                            combo.setLoading(false);\n");
                                out.push("                          }\n");
                                out.push("                        });\n");
                                out.push("                      };\n");
                                out.push("                    }\n");
                                out.push("                  },\n");
                                out.push("                },\n");
                                out.push("              ");
                            } else if (cdata.customStore != undefined && cdata.customStore === true) {
                                out.push("\n");
                                out.push("                store: ()=>Ext.create(\"Ext.data.Store\", {\n");
                                out.push("                  autoSync:\n");
                                out.push("                  ");
                                if (cdata.autoSync) {
                                    out.push("\n");
                                    out.push("                    " + (cdata.autoSync) + ",\n");
                                    out.push("                  ");
                                } else {
                                    out.push("\n");
                                    out.push("                    false,\n");
                                    out.push("                  ");
                                }
                                out.push("\n");
                                out.push("                  ");
                                if (cdata.model) {
                                    out.push("\n");
                                    out.push("                  model: \"" + (cdata.model) + "\",\n");
                                    out.push("                  ");
                                } else {
                                    out.push("\n");
                                    out.push("                  fields:\n");
                                    out.push("                    ");
                                    if (cdata.fields) {
                                        out.push("\n");
                                        out.push("                      " + (JSON.stringify(cdata.fields)) + ",\n");
                                        out.push("                    ");
                                    } else {
                                        out.push("\n");
                                        out.push("                    ['name', 'value'],\n");
                                        out.push("                    ");
                                    }
                                    out.push("\n");
                                    out.push("                  ");
                                }
                                out.push("\n");
                                out.push("                  ");
                                if (cdata.sorters) {
                                    out.push("\n");
                                    out.push("                  sorters: " + (JSON.stringify(cdata.sorters)) + ",\n");
                                    out.push("                  ");
                                }
                                out.push("\n");
                                out.push("                ");
                                if (cdata.apiRead) {
                                    out.push("\n");
                                    out.push("                  autoLoad: ");
                                    if (cdata.autoLoad) {
                                        out.push((cdata.autoLoad));
                                    } else {
                                        out.push("false");
                                    }
                                    out.push(",\n");
                                    out.push("                  proxy: {\n");
                                    out.push("                    type:\n");
                                    out.push("                    ");
                                    if (cdata.proxyType) {
                                        out.push("\n");
                                        out.push("                      \"" + (cdata.proxyType) + "\",\n");
                                        out.push("                    ");
                                    } else {
                                        out.push("\n");
                                        out.push("                      \"direct\",\n");
                                        out.push("                    ");
                                    }
                                    out.push("\n");
                                    out.push("                    api: {\n");
                                    out.push("                      read: " + (cdata.apiRead) + "\n");
                                    out.push("                    },\n");
                                    out.push("                    ");
                                    if (cdata.extraParams) {
                                        out.push("\n");
                                        out.push("                    extraParams: " + (JSON.stringify(cdata.extraParams)) + ",\n");
                                        out.push("                    ");
                                    }
                                    out.push("\n");
                                    out.push("                    ");
                                    if (cdata.reader) {
                                        out.push("\n");
                                        out.push("                    reader: " + (JSON.stringify(cdata.reader)));
                                    }
                                    out.push("\n");
                                    out.push("                    ");
                                    if (cdata.writer) {
                                        out.push(",\n");
                                        out.push("                    writer: " + (JSON.stringify(cdata.writer)) + "\n");
                                        out.push("                    ");
                                    }
                                    out.push("\n");
                                    out.push("                  },\n");
                                    out.push("                ");
                                } else {
                                    out.push(",\n");
                                    out.push("                  data: (" + (JSON.stringify(cdata.data)) + " || [])\n");
                                    out.push("                  ");
                                    const displayField = cdata.displayField ? cdata.displayField : 'name';
                                    out.push("\n");
                                    out.push("                  .map(item=>({\n");
                                    out.push("                    ...item,\n");
                                    out.push("                    ['" + (displayField) + "']:\n");
                                    out.push("                      _t(item['" + (displayField) + "'],\n");
                                    out.push("                      '" + (context.$namespace) + "." + (context.$name) + "',\n");
                                    out.push("                      'combobox',\n");
                                    out.push("                      '" + (property.propertyName) + "')\n");
                                    out.push("                    }))\n");
                                    out.push("                  ");
                                }
                                out.push("\n");
                                out.push("                }),\n");
                                out.push("                displayField: ");
                                if (cdata.displayField) {
                                    out.push("\"" + (cdata.displayField) + "\"");
                                } else {
                                    out.push("'name'");
                                }
                                out.push(",\n");
                                out.push("                valueField: ");
                                if (cdata.valueField) {
                                    out.push("\"" + (cdata.valueField) + "\"");
                                } else {
                                    out.push("\"value\"");
                                }
                                out.push(",\n");
                                out.push("                queryMode: ");
                                if (cdata.queryMode) {
                                    out.push("\"" + (cdata.queryMode) + "\"");
                                } else {
                                    out.push("\"local\"");
                                }
                                out.push(",\n");
                                out.push("              ");
                            } else {
                                out.push("\n");
                                out.push("                store:()=> Ext.create('Ext.data.Store', {\n");
                                out.push("                  autoLoad: true,\n");
                                out.push("                  fields: ['name', 'value'],\n");
                                out.push("                  data: (" + (JSON.stringify(cdata.data)) + " || []).map(item=>({...item, name: _t(item.name,'" + (context.$namespace) + "." + (context.$name) + "', 'combobox', '" + (property.propertyName) + "')}))\n");
                                out.push("                }),\n");
                                out.push("                displayField: 'name',\n");
                                out.push("                valueField: 'value',\n");
                                out.push("                queryMode: 'local',\n");
                                out.push("                listeners: {\n");
                                out.push("                  focus: function(combo, event, eOpts ){\n");
                                out.push("                    let store = combo.getStore();\n");
                                out.push("                    combo.queryFilter = false;\n");
                                out.push("                    store.clearFilter(true);\n");
                                out.push("                  },\n");
                                out.push("                  afterrender: function (combo, opts) {\n");
                                out.push("                    let store = combo.getStore();\n");
                                out.push("                    store.clearFilter(true); // If true the filter is cleared silently;\n");
                                out.push("                    if(store.isLoading()){\n");
                                out.push("                      combo.setLoading(true);\n");
                                out.push("                      store.on({\n");
                                out.push("                        load: {\n");
                                out.push("                          fn: function(st, records, success, opts){\n");
                                out.push("                            if(success) {\n");
                                out.push("                              this.setLoading(false);\n");
                                out.push("                            }\n");
                                out.push("                          },\n");
                                out.push("                          scope: combo,\n");
                                out.push("                          single: true\n");
                                out.push("                        }\n");
                                out.push("                      });\n");
                                out.push("                    }else{\n");
                                out.push("                      if (!store.loaded) {\n");
                                out.push("                        combo.setLoading(true);\n");
                                out.push("                        store.load(function(records, operation, success){\n");
                                out.push("                          if(success){\n");
                                out.push("                            store.loaded = true;\n");
                                out.push("                            combo.setLoading(false);\n");
                                out.push("                          }\n");
                                out.push("                        });\n");
                                out.push("                      };\n");
                                out.push("                    }\n");
                                out.push("                  },\n");
                                out.push("                },\n");
                                out.push("                ");
                            }
                        }
                        out.push("\n");
                        out.push("          },\n");
                        out.push("        ");
                    }
                }
                out.push("\n");
                out.push("        ");
            }
            out.push("\n");
            out.push("      },\n");
            out.push("    },\n");
            out.push("  },\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.ListSearch.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const getToolbar = context.getToolbar;
            let properties = context.gridviewProps;
            const config = context.getThingConfig(context);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".ListSearch." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "listsearch',\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  ");
            if (context.periodicalRel) {
                out.push("\n");
                out.push("  periodicalRel:{\n");
                out.push("    from:'" + (context.periodicalRel.from) + "',\n");
                out.push("    to:'" + (context.periodicalRel.to) + "',\n");
                out.push("    fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
                out.push("    toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
                out.push("  },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  border: true,\n");
            out.push("  calendarMapping: " + (!!context.cal_mapping) + ",\n");
            out.push("  searchQuery: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + ",\n");
            out.push("  // tbar: " + (JSON.stringify(getToolbar(context.gridsettings))) + ",\n");
            out.push("  initComponent: function(){\n");
            out.push("    let me = this;\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      ");
            if (!(context.queryResult || context.legacySearch) && config.pageSizeSearch !== -1 && !context.staticStore) {
                out.push("\n");
                out.push("      bbar: {\n");
                out.push("        xtype: \"pagingtoolbar\",\n");
                out.push("        store: this.store,\n");
                out.push("        displayInfo: true,\n");
                out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
                out.push("        emptyMsg: \"No data to display\"\n");
                out.push("      },\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      title: this.title || this.toDisplay || _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','List'),\n");
            out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
            out.push("      autoRender: true,\n");
            out.push("      overflowY: 'auto',\n");
            out.push("      columns: [{xtype: 'rownumberer', width:40},");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                let g = properties[i];
                if (g.generated) {
                    out.push("\n");
                    out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                    out.push("          ");
                }
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      listeners: {\n");
            out.push("        'selectionchange': function(view, records) {\n");
            out.push("          DirectCacheLogger.userStories('Search Grid Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, selectedCount: records.length });\n");
            out.push("          let rbutton = this.down('#removeButton');\n");
            out.push("          let ubutton = this.down('#unlinkButton');\n");
            out.push("          let dbutton = this.down('#detailsButton');\n");
            out.push("          if(rbutton) rbutton.setDisabled(!records.length);\n");
            out.push("          if(ubutton) ubutton.setDisabled(!records.length);\n");
            out.push("          if(dbutton) dbutton.setDisabled(records.length-1);\n");
            out.push("        },\n");
            out.push("        'itemdblclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Search Grid Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        },\n");
            out.push("        'itemclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Search Grid Item Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        }\n");
            out.push("      },\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.ListEmbedded.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const getToolbar = context.getToolbar;
            let properties = context.gridviewProps;
            const config = context.getThingConfig(context);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".ListEmbedded." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "listembedded',\n");
            out.push("  // store: Ext.create('Modeleditor.store." + (context.namespace) + "." + (context.$name) + "'),\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  ");
            if (context.periodicalRel) {
                out.push("\n");
                out.push("  periodicalRel:{\n");
                out.push("    from:'" + (context.periodicalRel.from) + "',\n");
                out.push("    to:'" + (context.periodicalRel.to) + "',\n");
                out.push("    fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
                out.push("    toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
                out.push("  },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  border: true,\n");
            out.push("  plugins: [\n");
            out.push("  ");
            if (config.filterForEmbedded) {
                out.push("\n");
                out.push("    {\n");
                out.push("      ptype: \"filterbar\",\n");
                out.push("      pluginId: \"filterbar\",\n");
                out.push("      renderHidden: false,\n");
                out.push("      showShowHideButton: true,\n");
                out.push("      showClearAllButton: true\n");
                out.push("    }\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ],\n");
            out.push("\n");
            out.push("  calendarMapping: " + (!!context.cal_mapping) + ",\n");
            out.push("  searchQuery: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + ",\n");
            out.push("  tbar: " + (JSON.stringify(getToolbar(context.gridsettings))) + ",\n");
            out.push("  initComponent: function(){\n");
            out.push("    let me = this;\n");
            out.push("    Ext.apply(this,{\n");
            out.push("    ");
            if (!context.queryResult && config.pageSizeEmbedded !== -1 && !context.staticStore) {
                out.push("\n");
                out.push("      bbar: {\n");
                out.push("        xtype: \"pagingtoolbar\",\n");
                out.push("        store: this.store,\n");
                out.push("        displayInfo: true,\n");
                out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
                out.push("        emptyMsg: \"No data to display\"\n");
                out.push("      },\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("      title: this.title || this.toDisplay || _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','List'),\n");
            out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
            out.push("      autoRender: true,\n");
            out.push("      overflowY: 'auto',\n");
            out.push("      columns: [{xtype: 'rownumberer', width:40},");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                let g = properties[i];
                if (g.generated) {
                    out.push("\n");
                    out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                    out.push("          ");
                }
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      listeners: {\n");
            out.push("        'selectionchange': function(view, records) {\n");
            out.push("          DirectCacheLogger.userStories('Embedded Grid Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, selectedCount: records.length });\n");
            out.push("          let rbutton = this.down('#removeButton');\n");
            out.push("          let ubutton = this.down('#unlinkButton');\n");
            out.push("          let dbutton = this.down('#detailsButton');\n");
            out.push("          if(rbutton) rbutton.setDisabled(!records.length);\n");
            out.push("          if(ubutton) ubutton.setDisabled(!records.length);\n");
            out.push("          if(dbutton) dbutton.setDisabled(records.length-1);\n");
            out.push("        },\n");
            out.push("        'itemdblclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Embedded Grid Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        },\n");
            out.push("        'itemclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Embedded Grid Item Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        }\n");
            out.push("      },\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.ListDictionary.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const config = context.getThingConfig(context);
            out.push("\n");
            out.push("Ext.define(\"Modeleditor.view." + (context.namespace) + ".ListDictionary." + (context.$name) + "\", {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  filters:[],\n");
            out.push("  extend:\"Modeleditor.view.base.baseWindowDictionaryList\",\n");
            out.push("  iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  alias: \"widget." + (context.$widgetName) + "listdictionary\",\n");
            out.push("  initComponent: function(){\n");
            out.push("    const me = this\n");
            out.push("    DirectCacheLogger.userStories('List Dictionary Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
            out.push("    const catalogConfig = {\n");
            out.push("      xtype: '" + (context.$widgetName) + "catalog',\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogPaginator')){\n");
            out.push("      catalogConfig.catalogPaginator = me.catalogPaginator\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogPlugins')){\n");
            out.push("      catalogConfig.catalogPlugins = me.catalogPlugins\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogStore')){\n");
            out.push("      catalogConfig.catalogStore = me.catalogStore\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogBbar')){\n");
            out.push("      catalogConfig.catalogBbar = me.catalogBbar\n");
            out.push("    }\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      itemId: \"ListDictionary\",\n");
            out.push("      listDictionary: true,\n");
            out.push("      title: _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','ListDictionary'),\n");
            out.push("      border: true,\n");
            out.push("      layout: {\n");
            out.push("        type:\"hbox\",\n");
            out.push("        align: \"stretch\"\n");
            out.push("      },\n");
            out.push("      defaults:{\n");
            out.push("        flex: 1,\n");
            out.push("        margin: '2'\n");
            out.push("      },\n");
            out.push("      items: [\n");
            out.push("        {\n");
            out.push("          ...catalogConfig,\n");
            out.push("          btns: true,\n");
            out.push("          viewConfig: {\n");
            out.push("            // copy: true,\n");
            out.push("            plugins: {\n");
            out.push("              ptype: 'gridviewdragdrop',\n");
            out.push("              pluginId: \"gridviewdragdrop\",\n");
            out.push("              dragGroup: 'catalog',\n");
            out.push("              dropGroup: 'elements'\n");
            out.push("            },\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        Ext.widget('" + (context.$widgetName) + "elements', {\n");
            out.push("          filters: this.filters\n");
            out.push("        }),\n");
            out.push("      ],\n");
            out.push("      buttons : [\n");
            out.push("        {\n");
            out.push("          text: _t('Ok','SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'okMany',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('List Dictionary OK Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Cancel','SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'dictCancel',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('List Dictionary Cancel Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      ],\n");
            out.push("      listeners: {\n");
            out.push("        show: function(window) {\n");
            out.push("          DirectCacheLogger.userStories('List Dictionary Show', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
            out.push("        },\n");
            out.push("        beforeclose: function(window) {\n");
            out.push("          DirectCacheLogger.userStories('List Dictionary Before Close', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.List.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const getToolbar = context.getToolbar;
            let properties = context.gridviewProps;
            const config = context.getThingConfig(context);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".List." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "list',\n");
            out.push("  store: Ext.create('Modeleditor.store." + (context.namespace) + "." + (context.$name) + "'),\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  ");
            if (context.periodicalRel) {
                out.push("\n");
                out.push("  periodicalRel:{\n");
                out.push("    from:'" + (context.periodicalRel.from) + "',\n");
                out.push("    to:'" + (context.periodicalRel.to) + "',\n");
                out.push("    fromKeyField:'" + (context.periodicalRel.fromKeyField) + "',\n");
                out.push("    toKeyField:'" + (context.periodicalRel.toKeyField) + "',\n");
                out.push("  },\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  border: true,\n");
            out.push("  plugins: [\n");
            out.push("    {\n");
            out.push("      ptype: \"filterbar\",\n");
            out.push("      pluginId: \"filterbar\",\n");
            out.push("      renderHidden: false,\n");
            out.push("      showShowHideButton: true,\n");
            out.push("      showClearAllButton: true\n");
            out.push("    }\n");
            out.push("  ],\n");
            out.push("\n");
            out.push("  calendarMapping: " + (!!context.cal_mapping) + ",\n");
            out.push("  searchQuery: " + (context.searchQuery ? JSON.stringify(context.searchQuery.name) : undefined) + ",\n");
            out.push("  tbar: " + (JSON.stringify(getToolbar(context.gridsettings))) + ",\n");
            out.push("  initComponent: function(){\n");
            out.push("    let me = this;\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      ");
            if (!context.queryResult && config.pageSize !== -1 && !context.staticStore) {
                out.push("\n");
                out.push("      bbar: {\n");
                out.push("        xtype: \"pagingtoolbar\",\n");
                out.push("        store: this.store,\n");
                out.push("        displayInfo: true,\n");
                out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
                out.push("        emptyMsg: \"No data to display\"\n");
                out.push("      },\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      title: this.title || this.toDisplay || _t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles','List'),\n");
            out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
            out.push("      autoRender: true,\n");
            out.push("      overflowY: 'auto',\n");
            out.push("      columns: [{xtype: 'rownumberer', width:40},\n");
            out.push("    ");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                let g = properties[i];
                if (g.generated) {
                    out.push("\n");
                    out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                    out.push("          ");
                }
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      listeners: {\n");
            out.push("        'selectionchange': function(view, records) {\n");
            out.push("          DirectCacheLogger.userStories('Grid Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, selectedCount: records.length });\n");
            out.push("          let rbutton = this.down('#removeButton');\n");
            out.push("          let ubutton = this.down('#unlinkButton');\n");
            out.push("          let dbutton = this.down('#detailsButton');\n");
            out.push("          if(rbutton) rbutton.setDisabled(!records.length);\n");
            out.push("          if(ubutton) ubutton.setDisabled(!records.length);\n");
            out.push("          if(dbutton) dbutton.setDisabled(records.length-1);\n");
            out.push("        },\n");
            out.push("        'itemdblclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Grid Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        },\n");
            out.push("        'itemclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Grid Item Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        }\n");
            out.push("      },\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.EditDictionary.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const config = context.getThingConfig(context);
            out.push("\n");
            out.push("Ext.define(\"Modeleditor.view." + (context.namespace) + ".EditDictionary." + (context.$name) + "\", {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend:\"Modeleditor.view.base.baseWindowDictionarySingle\",\n");
            out.push("  alias: \"widget." + (context.$widgetName) + "editdictionary\",\n");
            out.push("  iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  // tobe passed from Dictinary Call\n");
            out.push("  // {\n");
            out.push("  //   catalogPaginator: false,\n");
            out.push("  //   catalogPlugins: [],\n");
            out.push("  //   catalogStore: customFieldsetStore\n");
            out.push("  //   catalogBbar: undefined\n");
            out.push("  // }\n");
            out.push("  initComponent: function(){\n");
            out.push("    const me = this;\n");
            out.push("    DirectCacheLogger.userStories('Edit Dictionary Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
            out.push("    const catalogConfig = {\n");
            out.push("      xtype: '" + (context.$widgetName) + "catalog',\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogPaginator')){\n");
            out.push("      catalogConfig.catalogPaginator = me.catalogPaginator\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogPlugins')){\n");
            out.push("      catalogConfig.catalogPlugins = me.catalogPlugins\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogStore')){\n");
            out.push("      catalogConfig.catalogStore = me.catalogStore\n");
            out.push("    }\n");
            out.push("    if(me.hasOwnProperty('catalogBbar')){\n");
            out.push("      catalogConfig.catalogBbar = me.catalogBbar\n");
            out.push("    }\n");
            out.push("\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      itemId: \"EditDictionary\",\n");
            out.push("      editDictionary: true,\n");
            out.push("      title: this.title || this.toDisplay ||_t(\"" + (context.$name) + "\",'" + (context.$namespace) + "." + (context.$name) + "', 'titles', 'EditDictionary', ),\n");
            out.push("      border: true,\n");
            out.push("      layout: 'fit',\n");
            out.push("      defaults:{\n");
            out.push("        border: false,\n");
            out.push("        margin: '2'\n");
            out.push("      },\n");
            out.push("      items: [\n");
            out.push("        catalogConfig,\n");
            out.push("      ],\n");
            out.push("      buttons: [\n");
            out.push("        {\n");
            out.push("          text: _t('Ok', 'SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'okOne',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Edit Dictionary OK Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        },\n");
            out.push("        {\n");
            out.push("          text: _t('Cancel', 'SYSTEM', 'buttons'),\n");
            out.push("          itemId: 'dictCancel',\n");
            out.push("          listeners: {\n");
            out.push("            click: function(btn) {\n");
            out.push("              DirectCacheLogger.userStories('Edit Dictionary Cancel Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: btn.up('window').id });\n");
            out.push("            }\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      ],\n");
            out.push("      listeners: {\n");
            out.push("        show: function(window) {\n");
            out.push("          DirectCacheLogger.userStories('Edit Dictionary Show', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
            out.push("        },\n");
            out.push("        beforeclose: function(window) {\n");
            out.push("          DirectCacheLogger.userStories('Edit Dictionary Before Close', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', dictionaryId: this.id });\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("    })\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.DictionaryElements.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let properties = context.gridviewProps;
            const config = context.getThingConfig(context);
            const hasDictionaryFields = properties.filter((p)=>p.forDictionary).length > 0;
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.namespace) + ".DictionaryElements." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$normalizedName) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "elements',\n");
            out.push("  itemId: \"DictionaryElements\",\n");
            out.push("  //iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "')");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  plugins: [\n");
            out.push("    ");
            if (config.filterForDicElements && hasDictionaryFields) {
                out.push("\n");
                out.push("    {\n");
                out.push("      ptype: 'filterbar',\n");
                out.push("      pluginId: \"filterbar\",\n");
                out.push("      renderHidden: false,\n");
                out.push("      showShowHideButton: true,\n");
                out.push("      showClearAllButton: true,\n");
                out.push("    }\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    ],\n");
            out.push("  initComponent: function(){\n");
            out.push("    let me = this;\n");
            out.push("    const store = Ext.create('Modeleditor.store." + (context.namespace) + ".Selected." + (context.$name) + "',{filters: this.filters})\n");
            out.push("\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
            out.push("      autoRender: true,\n");
            out.push("      overflowY: 'auto',\n");
            out.push("      store,\n");
            out.push("      ");
            if (config.pageSizeEmbedded !== -1) {
                out.push("\n");
                out.push("      bbar:{\n");
                out.push("        xtype: 'pagingtoolbar',\n");
                out.push("        store,\n");
                out.push("        displayInfo: true,\n");
                out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
                out.push("        emptyMsg: 'No data to display',\n");
                out.push("      },\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      viewConfig: {\n");
            out.push("        plugins: {\n");
            out.push("          ptype: 'gridviewdragdrop',\n");
            out.push("          pluginId: \"gridviewdragdrop\",\n");
            out.push("          dragGroup: 'elements',\n");
            out.push("          dropGroup: 'catalog'\n");
            out.push("        },\n");
            out.push("      },\n");
            out.push("\n");
            out.push("      columns: [\n");
            out.push("        {\n");
            out.push("          xtype: 'rownumberer',\n");
            out.push("          width:40\n");
            out.push("        },\n");
            out.push("      ");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                let g = properties[i];
                if (g.generated && ((hasDictionaryFields && g.forDictionary) || !hasDictionaryFields)) {
                    out.push("\n");
                    out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                    out.push("        ");
                }
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("\n");
            out.push("      listeners: {\n");
            out.push("        'selectionchange': function(view, records) {\n");
            out.push("          DirectCacheLogger.userStories('Dictionary Elements Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, selectedCount: records.length });\n");
            out.push("        },\n");
            out.push("        'itemdblclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Dictionary Elements Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        },\n");
            out.push("        'itemclick': function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Dictionary Elements Item Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', gridId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        }\n");
            out.push("      }\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.grid-thing.DictionaryCatalog.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let properties = context.gridviewProps;
            const config = context.getThingConfig(context);
            const hasDictionaryFields = properties.filter((p)=>p.forDictionary).length > 0;
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.namespace) + ".DictionaryCatalog." + (context.$name) + "',{\n");
            out.push("  serverModel: '" + (context.$namespace) + "." + (context.$name) + "',\n");
            out.push("  // requires: [" + (context.requires) + "],\n");
            out.push("  extend: 'Modeleditor.view.base.baseGrid',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "catalog',\n");
            out.push("  itemId: \"DictionaryCatalog\",\n");
            out.push("  //iconCls:  _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  btns: true,\n");
            out.push("  initComponent: function(){\n");
            out.push("    let me = this;\n");
            out.push("    DirectCacheLogger.userStories('Dictionary Catalog Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id });\n");
            out.push("    // {\n");
            out.push("    //   catalogPaginator: false,\n");
            out.push("    //   catalogPlugins: [],\n");
            out.push("    //   catalogStore: customFieldsetStore\n");
            out.push("    //   catalogBbar: undefined\n");
            out.push("    // }\n");
            out.push("    const store = me.hasOwnProperty('catalogStore') ? me.catalogStore: Ext.create('Modeleditor.store." + (context.namespace) + ".Catalog." + (context.$name) + "')\n");
            out.push("\n");
            out.push("    Ext.apply(this,{\n");
            out.push("      plugins: me.hasOwnProperty('catalogPlugins') ? me.catalogPlugins: [\n");
            out.push("      ");
            if (config.filterForDicCatalog && hasDictionaryFields) {
                out.push("\n");
                out.push("        {\n");
                out.push("          ptype: 'filterbar',\n");
                out.push("          pluginId: \"filterbar\",\n");
                out.push("          renderHidden: false,\n");
                out.push("          showShowHideButton: true,\n");
                out.push("          showClearAllButton: true,\n");
                out.push("        }\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("      store,\n");
            out.push("      tbar: (this.btns === true) ? [\n");
            out.push("        {\n");
            out.push("          xtype: \"basecreatebutton\"\n");
            out.push("        }\n");
            out.push("      ] : undefined,\n");
            out.push("      selModel: Ext.create('Ext.selection.CheckboxModel', {pruneRemoved: false}),\n");
            out.push("      autoRender: true,\n");
            out.push("      overflowY: 'auto',\n");
            out.push("    ");
            if (config.pageSizeEmbedded !== -1) {
                out.push("\n");
                out.push("      bbar: me.hasOwnProperty('catalogBbar') ? me.catalogBbar :\n");
                out.push("      me.hasOwnProperty('catalogPaginator') && !me.catalogPaginator ? undefined: {\n");
                out.push("        xtype: \"pagingtoolbar\",\n");
                out.push("        store,\n");
                out.push("        displayInfo: true,\n");
                out.push("        displayMsg: 'Displaying topics {0} - {1} of {2}',\n");
                out.push("        emptyMsg: \"No data to display\"\n");
                out.push("      },\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("      listeners: {\n");
            out.push("        filterupdated: function(filters){\n");
            out.push("          DirectCacheLogger.userStories('Dictionary Catalog Filter Updated', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id, filtersCount: filters.length });\n");
            out.push("          let grid = this;\n");
            out.push("          if(grid.defaultFilters && grid.defaultFilters.length > 0)\n");
            out.push("            grid.getStore().filter(grid.defaultFilters);\n");
            out.push("        },\n");
            out.push("        selectionchange: function(view, records) {\n");
            out.push("          DirectCacheLogger.userStories('Dictionary Catalog Selection Change', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id, selectedCount: records.length });\n");
            out.push("        },\n");
            out.push("        itemdblclick: function(view, record, item, index, e, eOpts) {\n");
            out.push("          DirectCacheLogger.userStories('Dictionary Catalog Item Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', catalogId: this.id, recordId: record.getId(), index: index });\n");
            out.push("        }\n");
            out.push("      },\n");
            out.push("\n");
            out.push("      columns: [{\n");
            out.push("          xtype: 'rownumberer',\n");
            out.push("          width:40\n");
            out.push("        },\n");
            for(let i = 0; i < properties.length; i++){
                let property = properties[i].property;
                let g = properties[i];
                if (g.generated && ((hasDictionaryFields && g.forDictionary) || !hasDictionaryFields)) {
                    out.push("\n");
                    out.push("          Grainjs.metadata['gridfields." + (context.$namespace) + "." + (context.$name) + "'].fields[`" + (property.propertyName) + "::" + (g.columnText) + "`](),\n");
                    out.push("          ");
                }
            }
            out.push("\n");
            out.push("      ],\n");
            out.push("    });\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.controller.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.controller." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$namespace) + "." + (context.$name) + "',\n");
            out.push("  extend: 'Ext.app.Controller',\n");
            out.push("  req_controllers:[\n");
            out.push("  ");
            let ctnrs = [];
            if (context.controllers) {
                let cname = context.namespace + '.' + context.name;
                ctnrs = context.controllers.filter(function(c) {
                    return c != cname;
                });
                for(let i = 0; i < ctnrs.length; i++){
                    out.push("\n");
                    out.push("      \"" + (ctnrs[i]) + "\"\n");
                    out.push("    ");
                    if (i < ctnrs.length - 1) {
                        out.push("\n");
                        out.push("    ,\n");
                        out.push("    ");
                    }
                }
            }
            out.push("],\n");
            out.push("  views:[\n");
            out.push("  ");
            for(let i = 0; i < context.prop?.view?.length ?? 0; i++){
                out.push("\n");
                out.push("    '" + (context.prop.view[i]) + "'\n");
                out.push("    ");
                if (i != context.prop.view.length - 1) {
                    out.push("\n");
                    out.push("    ,\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ],\n");
            out.push("  models: [\n");
            out.push("  ");
            for(let i = 0; i < context.prop?.model?.length ?? 0; i++){
                out.push("\n");
                out.push("    '" + (context.prop.model[i]) + "'\n");
                out.push("    ");
                if (i != context.prop.model.length - 1) {
                    out.push("\n");
                    out.push("    ,\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ],\n");
            out.push("  stores: [\n");
            out.push("  ");
            for(let i = 0; i < context.prop?.store?.length ?? 0; i++){
                out.push("\n");
                out.push("    '" + (context.prop.store[i]) + "'\n");
                out.push("    ");
                if (i != context.prop.store.length - 1) {
                    out.push("\n");
                    out.push("    ,\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("  ],\n");
            out.push("  initStarted:false,\n");
            out.push("\n");
            out.push("  init: function(){\n");
            out.push("    if(!this.initStarted){\n");
            out.push("      this.initStarted = true;\n");
            out.push("      let me = this;\n");
            out.push("      DirectCacheLogger.userStories('Controller Init', { controllerName: '" + (context.$namespace) + "." + (context.$name) + "' });\n");
            out.push("      ");
            if (context.requireNs && context.requireNs.length > 0) {
                out.push("\n");
                out.push("      Ext.require([");
                for(let i = 0; i < context.requireNs.length; i++){
                    out.push("\n");
                    out.push("        \"namespace." + (context.requireNs[i]) + "\"");
                    if (i != context.requireNs.length - 1) {
                        out.push(",");
                    }
                }
                out.push("\n");
                out.push("      ], function() {");
                ctnrs.forEach(function(contr) {
                    out.push("\n");
                    out.push("        me.application.getController(\"" + (contr) + "\");");
                });
                out.push("\n");
                out.push("      });\n");
                out.push("      ");
            } else {
                out.push("\n");
                out.push("      ");
                if (context.controllers) {
                    ctnrs.forEach(function(contr) {
                        out.push("\n");
                        out.push("        me.application.getController(\"" + (contr) + "\");");
                    });
                }
            }
            out.push("\n");
            let localStateMachine = context.stateMachine;
            out.push("\n");
            out.push("      this.control({\n");
            if (localStateMachine && context.debugSM) {
                out.push("\n");
                out.push("        '" + (context.$widgetName) + "editwindow " + (context.$widgetName) + "edit':{\n");
                out.push("          recordloaded: {\n");
                out.push("            fn: this._initstates\n");
                out.push("          }\n");
                out.push("        },\n");
                out.push("    ");
                for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                    let ev = localStateMachine.event[i];
                    out.push("\n");
                    out.push("        \"" + (context.$widgetName) + "editwindow > toolbar[type=formNavigation] > button[name=" + (ev.eventName) + "]\": {\n");
                    out.push("          toggle: {\n");
                    out.push("            fn: this[\"execute_" + (ev.eventName) + "\"]\n");
                    out.push("          }\n");
                    out.push("        },\n");
                    out.push("    ");
                }
                out.push("\n");
            }
            out.push("\n");
            out.push("        ");
            const hashSelector = context.hashSelector;
            for(let selector in hashSelector){
                if (Object.prototype.hasOwnProperty.call(hashSelector, selector)) {
                    out.push("\n");
                    out.push("            '" + (selector) + "':{");
                    for(let i = 0; i < hashSelector[selector].length; i++){
                        out.push("\n");
                        out.push("                " + (hashSelector[selector][i]) + ",\n");
                        out.push("              ");
                    }
                    out.push("\n");
                    out.push("            },\n");
                    out.push("          ");
                }
            }
            out.push("\n");
            out.push("      });\n");
            out.push("    }\n");
            out.push("  },\n");
            out.push("\n");
            out.push("  ");
            if (context.clientMethods) {
                let methods = context.clientMethods.filter(function(m) {
                    return m.type != 'model' && m.type != 'constructor';
                });
                for(let i = 0; i < methods.length; i++){
                    let clMethod = methods[i];
                    if (!clMethod.disable) {
                        out.push("\n");
                        out.push("  " + (clMethod.name) + ": Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].methods['" + (clMethod.name) + "'],\n");
                        out.push("      ");
                    }
                    out.push("\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("\n");
            out.push("  ");
            if (localStateMachine && localStateMachine.event && localStateMachine.event.length > 0) {
                out.push("\n");
                out.push("  // init call\n");
                if (localStateMachine && context.debugSM) {
                    out.push("\n");
                    out.push("  _initstates: Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].methods[\"_initstates\"],\n");
                    out.push("  ");
                    for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                        let ev = localStateMachine.event[i];
                        out.push("\n");
                        out.push("  \"execute_" + (ev.eventName) + "\": Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].methods[\"execute_" + (ev.eventName) + "\"],\n");
                        out.push("  ");
                    }
                    out.push("\n");
                }
                out.push("\n");
                out.push("/*state machine interaction section*/\n");
                out.push("    _callAction:function(self, func, args){\n");
                out.push("      DirectCacheLogger.userStories('State Machine Call Action', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', functionType: typeof(func), args: args });\n");
                out.push("      if(self && func){\n");
                out.push("        switch(typeof(func)){\n");
                out.push("          case 'function':\n");
                out.push("            func.apply(self,args);\n");
                out.push("            break;\n");
                out.push("          case 'string':\n");
                out.push("            if(self[func])\n");
                out.push("              self[func](args);\n");
                out.push("            break;\n");
                out.push("          default:\n");
                out.push("            console.error('unkonwn type of func to _callAction', typeof(func));\n");
                out.push("            break;\n");
                out.push("        }\n");
                out.push("      }\n");
                out.push("    },\n");
                out.push("\n");
                out.push("    _fireSMEventCallback : function(eventName, rec, wnd){\n");
                out.push("      return function (res, act) {\n");
                out.push("        console.trace('fire event: done with -> ', arguments);\n");
                out.push("        DirectCacheLogger.userStories('State Machine Event Callback', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', eventName: eventName, recordId: rec.getId(), windowId: wnd?.id, success: res?.success });\n");
                out.push("        if(rec.firingEvent == eventName){\n");
                out.push("          if (wnd) {\n");
                out.push("            wnd.enable()\n");
                out.push("          }\n");
                out.push("          delete rec.firingEvent;\n");
                out.push("          const stateMachineHash = Grainjs.metadata[`model.${rec.serverModel}`].stateMachineHash\n");
                out.push("          if(res.success) {\n");
                out.push("            Ext.popup.msg(_t('Fire event ', 'SYSTEM', 'titles')+ _t(stateMachineHash.states[eventName],'" + (context.$namespace) + "." + (context.$name) + "', 'events'), _t('success', 'SYSTEM', 'messages'));\n");
                out.push("          } else {\n");
                out.push("            Ext.Msg.alert(_t('Saving the Data Failed : event ', 'SYSTEM', 'titles') + _t(stateMachineHash.states[eventName],'" + (context.$namespace) + "." + (context.$name) + "', 'events'), _t(res.errors.name, 'SYSTEM', 'messages') +': '+_t(res.errors.message, 'SYSTEM', 'messages'));\n");
                out.push("          }\n");
                out.push("        } else {\n");
                out.push("          throw new Error(_t('wrong callback', 'SYSTEM', 'messages'));\n");
                out.push("        }\n");
                out.push("      };\n");
                out.push("    },\n");
                out.push("\n");
                out.push("    _fireSMEvent: function(srcrec, eventName, callback){\n");
                out.push("      console.trace('prepare callback for commit for ', eventName);\n");
                out.push("      DirectCacheLogger.userStories('State Machine Fire Event', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', eventName: eventName, recordId: srcrec.getId() });\n");
                out.push("      let self = this;\n");
                out.push("      return function(err){\n");
                out.push("        if(err){\n");
                out.push("          if(typeof callback === 'function') callback(err)\n");
                out.push("        } else {\n");
                out.push("          console.trace('execute callback for commit for ',eventName);\n");
                out.push("          let rec = srcrec;\n");
                out.push("          function update(res, act){\n");
                out.push("            console.trace('update record with result for event',eventName);\n");
                out.push("            DirectCacheLogger.userStories('State Machine Update Record', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', eventName: eventName, recordId: rec.getId(), success: res?.success });\n");
                out.push("            if(res.success){\n");
                out.push("              rec.syncRaw(res);\n");
                out.push("              rec.dirty = false;\n");
                out.push("              rec.phantom = false;\n");
                out.push("              self._callAction(rec,rec.onStateChangeSuccess,[res." + (localStateMachine.stateAttribute) + "]);\n");
                out.push("            } else {\n");
                out.push("              self._callAction(rec,rec.onStateChangeFailure,[rec.get('" + (localStateMachine.stateAttribute) + "')]);\n");
                out.push("            }\n");
                out.push("            if(callback) callback.apply(self, arguments);\n");
                out.push("          }\n");
                out.push("          rec._fireSMEvent(eventName, update);\n");
                out.push("        }\n");
                out.push("      };\n");
                out.push("    },\n");
                out.push("    ");
                for(let i = localStateMachine.event.length - 1; i >= 0; i--){
                    let ev = localStateMachine.event[i];
                    out.push("\n");
                    out.push("    \"fire_" + (ev.eventName) + "\": function(btn, rec){\n");
                    out.push("      DirectCacheLogger.userStories('State Machine Fire Event Button', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', eventName: '" + (ev.eventName) + "', recordId: rec.getId(), buttonId: btn.id });\n");
                    out.push("      if(!rec.firingEvent){\n");
                    out.push("        rec.firingEvent = '" + (ev.eventName) + "';\n");
                    out.push("        console.trace('start to fire event: " + (ev.eventName) + "');\n");
                    out.push("        let wnd = btn.up('window');\n");
                    out.push("        let self = this;\n");
                    out.push("        wnd.fireEvent('commitrecord', wnd, {\n");
                    out.push("          callback: (...args) => {\n");
                    out.push("            wnd.disable()\n");
                    out.push("            const call = self._fireSMEvent(rec, '" + (ev.eventName) + "', this._fireSMEventCallback('" + (ev.eventName) + "', rec, wnd))\n");
                    out.push("            call(...args)\n");
                    out.push("            setTimeout(() => {\n");
                    out.push("              if (wnd.disabled) {\n");
                    out.push("                wnd.enable()\n");
                    out.push("              }\n");
                    out.push("            }, 2000)\n");
                    out.push("          },\n");
                    out.push("        });\n");
                    out.push("      }\n");
                    out.push("    }");
                    if (i != 0) {
                        out.push(", ");
                    }
                    out.push("\n");
                    out.push("    ");
                }
                out.push("\n");
                out.push("  /*end state machine definition*/\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Thing/ext.calendar-thing.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const config = context.getThingConfig(context);
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.$namespace) + ".Calendar." + (context.$name) + "', {\n");
            out.push("  serverModel: '" + (context.$namespace) + "." + (context.$name) + "',\n");
            out.push("  extend: 'Modeleditor.view.base.extCalendar',\n");
            out.push("  alias: 'widget." + (context.$widgetName) + "calendar',\n");
            out.push("  widget: '" + (context.$widgetName) + "',\n");
            out.push("  //iconCls: _r('iconCls', '', '" + (context.$namespace) + "." + (context.$name) + "') ");
            if (context.iconCls) {
                out.push("|| \"" + (context.iconCls) + "\"");
            }
            out.push(" ,\n");
            out.push("  name:'" + (context.$name) + "',\n");
            out.push("  namespace:'" + (context.$namespace) + "',\n");
            out.push("\n");
            out.push("  fnLoad : function(view) {\n");
            out.push("    DirectCacheLogger.userStories('Calendar Load Function', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, embedded: !!view.embeddedKey });\n");
            out.push("    if (view.embeddedKey) {\n");
            out.push("      view.record = this.rec;\n");
            out.push("      view.embeddedKey = this.embeddedKey;\n");
            out.push("      view.eventStore = view.rec[this.embeddedKey]();\n");
            out.push("      view.allowCreateNew = " + (context.cal_mapping.allowCreateEmbedded) + ";\n");
            out.push("      view.readOnly =  " + (context.cal_mapping.readOnlyEmbedded) + ";\n");
            out.push("      view.showUnassignedPanel = " + (context.cal_mapping.showUnassignedPanelEmbedded) + ";\n");
            out.push("    } else {\n");
            out.push("      view.sortPanels = [\n");
            let spAll = context.cal_mapping.cal_sortBy;
            if (spAll) {
                let sortPanels = spAll.filter(function(item) {
                    return !item.disable;
                });
                for(let k = 0; k < sortPanels.length; k++){
                    out.push("\n");
                    out.push("        {\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].fields) {
                        out.push("\n");
                        out.push("        fields: \"" + ([
                            sortPanels[k].fields.match(/[A-Za-z0-9]*[A-Za-z0-9]/g)
                        ].join(',')) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].filterDisplayField) {
                        out.push("\n");
                        out.push("        filterDisplayField: \"" + (sortPanels[k].filterDisplayField) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].name) {
                        out.push("\n");
                        out.push("        name: \"" + (sortPanels[k].name) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].sortBy) {
                        out.push("\n");
                        out.push("        sortByQuery: \"" + (sortPanels[k].sortBy) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].sortByStore) {
                        out.push("\n");
                        out.push("        sortByStore: Ext.create('Modeleditor.store." + (sortPanels[k].sortByStore) + "', {\n");
                        out.push("                  extKeys: [],\n");
                        out.push("                  remoteFilter: false,\n");
                        out.push("                  remoteSort: false,\n");
                        out.push("                  proxy: {\n");
                        out.push("                      type: \"direct\",\n");
                        out.push("                      directFn: ReadByQuery." + (sortPanels[k].sortByStore.replace(/\./g, "")) + ",\n");
                        out.push("                      reader: {\n");
                        out.push("                          type: 'jsonmn',\n");
                        out.push("                          root: 'data'\n");
                        out.push("                      }\n");
                        out.push("                  },\n");
                        out.push("                  pageSize: -1\n");
                        out.push("              }),\n");
                        out.push("              ");
                    }
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].thingFilter) {
                        out.push("\n");
                        out.push("        thingFilter: \"" + (sortPanels[k].thingFilter) + "\",");
                    }
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].thingFilter) {
                        out.push("\n");
                        out.push("        filterStore: Ext.create('Modeleditor.store." + (sortPanels[k].thingFilter) + "', {\n");
                        out.push("                  extKeys: [],\n");
                        out.push("                  remoteFilter: false,\n");
                        out.push("                  remoteSort: false,\n");
                        out.push("                  proxy: {\n");
                        out.push("                      type: \"direct\",\n");
                        out.push("                      directFn: ReadByQuery." + (sortPanels[k].thingFilter.replace(/\./g, "")) + ",\n");
                        out.push("                      reader: {\n");
                        out.push("                          type: 'jsonmn',\n");
                        out.push("                          root: 'data'\n");
                        out.push("                      }\n");
                        out.push("                  },\n");
                        out.push("                  pageSize: -1\n");
                        out.push("              }),\n");
                        out.push("              ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].key) {
                        out.push("\n");
                        out.push("        key:\"" + (sortPanels[k].key) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].fromKey) {
                        out.push("\n");
                        out.push("        fromKey:\"" + (sortPanels[k].fromKey) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        ");
                    if (sortPanels[k].id) {
                        out.push("\n");
                        out.push("        id:\"" + (sortPanels[k].id) + "\",\n");
                        out.push("        ");
                    }
                    out.push("\n");
                    out.push("\n");
                    out.push("        pUid:\"_" + ('PFCAL00' + k) + "\"\n");
                    out.push("      }\n");
                    out.push("          ");
                    if (k != sortPanels.length - 1) {
                        out.push("\n");
                        out.push("          ,\n");
                        out.push("          ");
                    }
                    out.push("\n");
                    out.push("        ");
                }
            }
            out.push("];\n");
            out.push("\n");
            out.push("      view.eventStore = Ext.create('Modeleditor.store." + (context.$namespace) + "." + (context.$name) + "', {\n");
            out.push("                extKeys: [],\n");
            out.push("                remoteFilter: false,\n");
            out.push("                remoteSort: false,\n");
            out.push("                proxy: {\n");
            out.push("                    type: \"direct\",\n");
            out.push("                    directFn: ReadByQuery." + (context.$namespace) + (context.$name) + ",\n");
            out.push("                    reader: {\n");
            out.push("                        type: 'jsonmn',\n");
            out.push("                        root: 'data'\n");
            out.push("                    }\n");
            out.push("                },\n");
            out.push("                pageSize: -1\n");
            out.push("            });\n");
            out.push("            view.defaultReadFn = \"" + (context.$namespace) + (context.$name) + "\";\n");
            out.push("      view.allowCreateNew = " + (context.cal_mapping.allowCreate) + ";\n");
            out.push("      view.readOnly =  " + (context.cal_mapping.readOnly) + ";\n");
            out.push("      view.showUnassignedPanel = " + (context.cal_mapping.showUnassignedPanel) + ";\n");
            out.push("    }\n");
            out.push("\n");
            out.push("    view.filterCfg = ");
            if (context.cal_mapping.cal_filter) {
                out.push("\n");
                out.push("    {\n");
                out.push("      queryName:'" + (context.cal_mapping.cal_filter.queryRef) + "',\n");
                out.push("      props: function(){" + (context.cal_mapping.cal_filter.filterProps) + "}\n");
                out.push("    }\n");
                out.push("    ");
            } else {
                out.push("\n");
                out.push("    false\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    ;\n");
            out.push("\n");
            out.push("    view.jumpToFormat = '" + (context.cal_mapping.jumpToFormat) + "';\n");
            out.push("\n");
            out.push("    view.multiDayViewCfg = {\n");
            out.push("      showMultiDayView: " + (context.cal_mapping.showMultiDayView) + ",\n");
            out.push("      dayCount: " + (context.cal_mapping.dayCount) + "\n");
            out.push("    };\n");
            out.push("\n");
            out.push("    view.multiWeekViewCfg = {\n");
            out.push("      showMultiWeekView: " + (context.cal_mapping.showMultiWeekView) + ",\n");
            out.push("      weekCount: " + (context.cal_mapping.weekCount) + "\n");
            out.push("    };\n");
            out.push("\n");
            out.push("        view.viewConfig = {\n");
            out.push("          enableEventResize: " + (context.cal_mapping.enableResize) + ",\n");
            out.push("      ddIncrement: " + (context.cal_mapping.ddIncrement) + ",\n");
            out.push("      minEventDisplayMinutes: " + (context.cal_mapping.minEventDisplayMinutes) + ",\n");
            out.push("      viewStartHour: " + (context.cal_mapping.viewStartHour) + ",\n");
            out.push("      viewEndHour: " + (context.cal_mapping.viewEndHour) + ",\n");
            out.push("      scrollStartHour: " + (context.cal_mapping.scrollStartHour) + ",\n");
            out.push("      hourHeight: " + (context.cal_mapping.hourHeight) + ",\n");
            out.push("            contextMenuCfg: " + (JSON.stringify(context.cal_mapping.contextMenuCfg)) + "\n");
            out.push("        };\n");
            out.push("\n");
            out.push("        view.colorSchemes = [\n");
            out.push("        ");
            let schemes = context.cal_mapping.cal_colorScheme;
            if (schemes) {
                for(let k = 0; k < schemes.length; k++){
                    if (!schemes[k].disable) {
                        out.push("\n");
                        out.push("        {\n");
                        out.push("      name: '" + (schemes[k].name) + "',\n");
                        out.push("      func: function(record, callback){\n");
                        out.push("        " + (schemes[k].function) + "\n");
                        out.push("      }\n");
                        out.push("    }\n");
                        out.push("    ");
                        if (k != schemes.length - 1) {
                            out.push("\n");
                            out.push("    ,\n");
                            out.push("    ");
                        }
                        out.push("\n");
                        out.push("    ");
                    }
                }
            }
            out.push("\n");
            out.push("    ];\n");
            out.push("  },\n");
            out.push("\n");
            out.push("  listeners: {\n");
            out.push("    render: function(view){\n");
            out.push("      DirectCacheLogger.userStories('Calendar Render', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id });\n");
            out.push("      view.fnLoad(view);\n");
            out.push("    },\n");
            out.push("    eventclick: function(view, record, htmlEl) {\n");
            out.push("      DirectCacheLogger.userStories('Calendar Event Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, eventId: record.getId() });\n");
            out.push("    },\n");
            out.push("    eventdblclick: function(view, record, htmlEl) {\n");
            out.push("      DirectCacheLogger.userStories('Calendar Event Double Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, eventId: record.getId() });\n");
            out.push("    },\n");
            out.push("    dayclick: function(view, date, allDay, htmlEl) {\n");
            out.push("      DirectCacheLogger.userStories('Calendar Day Click', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: view.id, date: date, allDay: allDay });\n");
            out.push("    }\n");
            out.push("  },\n");
            out.push("\n");
            out.push("  initComponent: function() {\n");
            out.push("    let me = this;\n");
            out.push("    DirectCacheLogger.userStories('Calendar Init Component', { serverModel: '" + (context.$namespace) + "." + (context.$name) + "', calendarId: me.id });\n");
            out.push("    me.fnLoad(me);\n");
            out.push("    me.grid = Ext.widget('" + (context.$widgetName) + "list');\n");
            out.push("\n");
            out.push("    Ext.apply(this, {\n");
            out.push("      calendarStore: Ext.create('PF_Calendar.calendar.data.MemoryCalendarStore', {\n");
            out.push("        data: PF_Calendar.calendar.data.EventColors\n");
            out.push("      })\n");
            out.push("    });\n");
            out.push("\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Template/template.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push((context.template));
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Relation/relation.graphql.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("const { Type, Query, Schema, Enum, Interface, Union} = require('@grainjs/gql-schema-builder')\n");
            out.push("const gql = require('graphql-tag')\n");
            out.push("const {registerSchema} = require(global.USEGLOBAL('graphql/registerSchema'))\n");
            out.push("\n");
            out.push("const {\n");
            out.push("  build_relate_options,\n");
            out.push("  relate_count,\n");
            out.push("  relate,\n");
            out.push("  build_variation,\n");
            out.push("  variant_union_resolver,\n");
            out.push("} = require('@grainjs/loaders')\n");
            out.push("\n");
            let { extractRelationEndForRel } = require(global.USEGLOBAL('/lib/metaDataLoader'));
            const { parentSymbol } = require(global.USEGLOBAL('schemaExport/lib/common.js'));
            let resolver = require(global.USEGLOBAL('./genpack/resolveLocationType.js'));
            function GQLName(thingType) {
                return thingType.replaceAll('.', '');
            }
            let getType = function(name) {
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
                    case 'objectid':
                        return 'ID';
                    case 'id':
                        return 'ID';
                    case 'stringref':
                        return 'String';
                    default:
                        return name;
                }
            };
            let notGenerateClass = context.source.embedded || context.dest.embedded;
            const getChildren = (thingType)=>(global.ThingsAllChilds ? global.ThingsAllChilds[thingType] ? global.ThingsAllChilds[thingType] : false : false);
            const getEnumName = (thingType)=>{
                if (getChildren(thingType)) {
                    return `${thingType.replaceAll('.', '')}Childs`;
                } else {
                    return thingType.replaceAll('.', '');
                }
            };
            out.push("\n");
            out.push("\n");
            out.push("const types = []\n");
            if (!notGenerateClass) {
                out.push("\n");
                out.push("const relSchama = new Type({\n");
                out.push("  schema:gql`\n");
                out.push("  type " + (GQLName(context.name)) + " {\n");
                out.push("    _tid: String,\n");
                out.push("    " + (context.source.name) + ": " + (getType(global.ThingsProps[context.source.thingType.thingType][context.source.keyField].type)) + "\n");
                out.push("    " + (context.dest.name) + ": " + (getType(global.ThingsProps[context.dest.thingType.thingType][context.dest.keyField].type)) + "\n");
                out.push("    childRel: " + (GQLName(context.name)) + "Edges\n");
                out.push("  }\n");
                out.push("`})\n");
                out.push("types.push(relSchama)\n");
                out.push("\n");
                out.push("const relSchameEdges = new Type({\n");
                out.push("  schema: gql`\n");
                out.push("  type " + (GQLName(context.name)) + "Edges {\n");
                out.push("    " + (context.source.name) + ": " + (GQLName(context.source.thingType.thingType)) + "\n");
                out.push("    " + (context.dest.name) + ": " + (GQLName(context.dest.thingType.thingType)) + "\n");
                out.push("  }\n");
                out.push("`})\n");
                out.push("types.push(relSchameEdges)\n");
            }
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
                r2 = extractRelationEndForRel(context, true);
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
            out.push("// relations\n");
            out.push("const relations = [\n");
            for(let i = 0, aneLen = rels.length; i < aneLen; i++){
                let rel = rels[i];
                const refHasChildren = getChildren(rel.ref.thingType);
                const hasChildren = getChildren(rel.model.thingType);
                const relDef = global.RelationCache.thing[rel.model.thingType][rel.propName];
                const relIsArray = Array.isArray(relDef);
                out.push("\n");
                out.push("\n");
                if (relIsArray) {
                    out.push("\n");
                    out.push("/*\n");
                    out.push("  enum " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum {\n");
                    out.push("    " + (GQLName(rel.relName)) + "\n");
                    out.push("  }\n");
                    out.push("  union " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union =\n");
                    out.push("    " + (GQLName(rel.ref.thingType)) + "\n");
                    out.push("    " + (rel.model.thingType) + "\n");
                    out.push("    " + (rel.ref.thingType) + "\n");
                    out.push("    " + (rel.propName) + "\n");
                    out.push("*/\n");
                    out.push("  new Union({\n");
                    out.push("    schema:gql`\n");
                    out.push("    union " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union =\n");
                    out.push("      " + (GQLName(rel.ref.thingType)) + "\n");
                    out.push("    `,\n");
                    out.push("    resolver: variant_union_resolver\n");
                    out.push("  }),\n");
                    out.push("  new Enum({schema:gql`\n");
                    out.push("    enum " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum {\n");
                    out.push("      " + (GQLName(rel.relName)) + "\n");
                    out.push("    }`,\n");
                    out.push("    resolver:{\n");
                    out.push("      " + (GQLName(rel.relName)) + ":\"" + (rel.relName) + "\"\n");
                    out.push("    }\n");
                    out.push("  }),\n");
                }
                out.push("\n");
                out.push("\n");
                const names = [
                    rel.model.thingType
                ];
                if (hasChildren) {
                    names.push(...hasChildren.filter((t)=>{
                        const r = global.RelationCache.thing[t][rel.propName];
                        if (Array.isArray(r)) {
                            return r.some((el)=>el.relName == rel.relName);
                        } else {
                            return r.relName == rel.relName;
                        }
                    }));
                }
                for(let j = names.length - 1; j >= 0; j -= 1){
                    const currentThingType = names[j];
                    out.push("\n");
                    if (!rel.oppositeEmbedded) {
                        out.push("\n");
                        out.push("// !oppositeEmbedded\n");
                        if (rel.single) {
                            out.push("\n");
                            out.push("// !oppositeEmbedded & single\n");
                            if (rel.embedded) {
                                out.push("\n");
                                out.push("// !oppositeEmbedded & single & embedded\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("        " + (rel.propName.replaceAll('.', '')) + "(\n");
                                out.push("          ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("          variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("          ");
                                }
                                out.push("\n");
                                out.push("          onlyIds: Boolean,\n");
                                out.push("          ensure: Boolean,\n");
                                out.push("          absent: Boolean,\n");
                                out.push("          options: JSON,\n");
                                out.push("          conditions:JSON\n");
                                out.push("          ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("          kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("          ");
                                }
                                out.push("\n");
                                out.push("        ):\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union\n");
                                    out.push("        ");
                                } else {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.ref.thingType)));
                                    if (refHasChildren) {
                                        out.push("Union");
                                    }
                                    out.push("\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + ":\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(\n");
                                out.push("          ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("          variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("          ");
                                }
                                out.push("\n");
                                out.push("          onlyIds: Boolean,\n");
                                out.push("          ensure:Boolean,\n");
                                out.push("          absent:Boolean,\n");
                                out.push("          options: JSON,\n");
                                out.push("          conditions:JSON\n");
                                out.push("          ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("          kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("          ");
                                }
                                out.push("\n");
                                out.push("        ): Int\n");
                                out.push("      }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "Count:\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "Count',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate_count(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                            } else {
                                out.push("\n");
                                out.push("// !oppositeEmbedded & single & !embedded\n");
                                out.push("  // edges\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "(\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        onlyIds: Boolean,\n");
                                out.push("        ensure:Boolean,\n");
                                out.push("        absent:Boolean,\n");
                                out.push("        options: JSON,\n");
                                out.push("        conditions:JSON\n");
                                out.push("        ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      ):\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union\n");
                                    out.push("        ");
                                } else {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.ref.thingType)));
                                    if (refHasChildren) {
                                        out.push("Union");
                                    }
                                    out.push("\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + ":\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "Count(\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("        onlyIds: Boolean,\n");
                                out.push("        ensure:Boolean,\n");
                                out.push("        absent:Boolean,\n");
                                out.push("        options: JSON,\n");
                                out.push("        conditions:JSON\n");
                                out.push("        ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("        kind:" + (getEnumName(rel.ref.thingType)));
                                }
                                out.push("\n");
                                out.push("      ):Int\n");
                                out.push("    }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "Count:\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "Count',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate_count(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                            }
                            out.push("\n");
                        } else {
                            out.push("\n");
                            out.push("// !oppositeEmbedded & many\n");
                            if (rel.embedded) {
                                out.push("\n");
                                out.push("// !oppositeEmbedded & many & embedded\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "(\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("        onlyIds: Boolean,\n");
                                out.push("        ensure:Boolean,\n");
                                out.push("        absent:Boolean,\n");
                                out.push("        options: JSON,\n");
                                out.push("        conditions:JSON\n");
                                out.push("        ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      ):[\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union\n");
                                    out.push("        ");
                                } else {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.ref.thingType)));
                                    if (refHasChildren) {
                                        out.push("Union");
                                    }
                                    out.push("\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      ]\n");
                                out.push("    }\n");
                                out.push("    `,\n");
                                out.push("    resolver:{\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + ":\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("        " + (rel.propName.replaceAll('.', '')) + "Count(\n");
                                out.push("          ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("          variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("          ");
                                }
                                out.push("\n");
                                out.push("          onlyIds: Boolean,\n");
                                out.push("          ensure:Boolean,\n");
                                out.push("          absent:Boolean,\n");
                                out.push("          options: JSON,\n");
                                out.push("          conditions:JSON\n");
                                out.push("          ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("          kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("          ");
                                }
                                out.push("\n");
                                out.push("        ):Int\n");
                                out.push("      }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "Count:\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "Count',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate_count(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                            } else {
                                out.push("\n");
                                out.push("// !oppositeEmbedded & many & !embedded\n");
                                out.push("  // edges\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "(\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("        onlyIds: Boolean,\n");
                                out.push("        ensure:Boolean,\n");
                                out.push("        absent:Boolean,\n");
                                out.push("        options: JSON,\n");
                                out.push("        conditions:JSON\n");
                                out.push("        ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      ):[\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union\n");
                                    out.push("        ");
                                } else {
                                    out.push("\n");
                                    out.push("        " + (GQLName(rel.ref.thingType)));
                                    if (refHasChildren) {
                                        out.push("Union");
                                    }
                                    out.push("\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      ]\n");
                                out.push("    }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + ":\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("      }\n");
                                out.push("  }),\n");
                                out.push("  new Type({\n");
                                out.push("    schema: gql`\n");
                                out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "Count(\n");
                                out.push("        ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("        onlyIds: Boolean,\n");
                                out.push("        ensure:Boolean,\n");
                                out.push("        absent:Boolean,\n");
                                out.push("        options: JSON,\n");
                                out.push("        conditions:JSON\n");
                                out.push("        ");
                                if (refHasChildren) {
                                    out.push(",\n");
                                    out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                    out.push("        ");
                                }
                                out.push("\n");
                                out.push("      ):Int\n");
                                out.push("    }\n");
                                out.push("    `,\n");
                                out.push("    resolver: {\n");
                                out.push("      " + (rel.propName.replaceAll('.', '')) + "Count:\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      build_variation(\n");
                                    out.push("        '" + (rel.model.thingType) + "',\n");
                                    out.push("        '" + (rel.propName) + "Count',\n");
                                    out.push("        '" + (rel.relName) + "',\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("        relate_count(\n");
                                out.push("          build_relate_options(\n");
                                out.push("            '" + (rel.model.thingType) + "',\n");
                                out.push("            '" + (rel.propName) + "',\n");
                                out.push("            '" + (rel.relName) + "'\n");
                                out.push("          )\n");
                                out.push("        )\n");
                                out.push("      ");
                                if (relIsArray) {
                                    out.push("\n");
                                    out.push("      )\n");
                                    out.push("      ");
                                }
                                out.push("\n");
                                out.push("    }\n");
                                out.push("  }),\n");
                            }
                            out.push("\n");
                        }
                        out.push("\n");
                    } else {
                        out.push("\n");
                        out.push("// oppositeEmbedded\n");
                        out.push("// can be properties of thing\n");
                        if (rel.single) {
                            out.push("\n");
                            out.push("// oppositeEmbedded & single\n");
                            out.push("  new Type({\n");
                            out.push("    // исправить: поставить правильную ссылку на модель\n");
                            out.push("    schema: gql`\n");
                            out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + "(\n");
                            out.push("        ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("        onlyIds: Boolean,\n");
                            out.push("        ensure:Boolean,\n");
                            out.push("        absent:Boolean,\n");
                            out.push("        options: JSON,\n");
                            out.push("        conditions:JSON\n");
                            out.push("        ");
                            if (refHasChildren) {
                                out.push(",\n");
                                out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("      ):\n");
                            out.push("        ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union\n");
                                out.push("        ");
                            } else {
                                out.push("\n");
                                out.push("        " + (GQLName(rel.ref.thingType)));
                                if (refHasChildren) {
                                    out.push("Union");
                                }
                                out.push("\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("    }\n");
                            out.push("    `,\n");
                            out.push("    resolver:{\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + ":\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      build_variation(\n");
                                out.push("        '" + (rel.model.thingType) + "',\n");
                                out.push("        '" + (rel.propName) + "',\n");
                                out.push("        '" + (rel.relName) + "',\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("        relate(\n");
                            out.push("          build_relate_options(\n");
                            out.push("            '" + (rel.model.thingType) + "',\n");
                            out.push("            '" + (rel.propName) + "',\n");
                            out.push("            '" + (rel.relName) + "'\n");
                            out.push("          )\n");
                            out.push("        )\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      )\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("    }\n");
                            out.push("  }),\n");
                            out.push("  new Type({\n");
                            out.push("    // исправить: поставить правильную ссылку на модель\n");
                            out.push("    schema: gql`\n");
                            out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + "Count(\n");
                            out.push("        ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("        onlyIds: Boolean,\n");
                            out.push("        ensure:Boolean,\n");
                            out.push("        absent:Boolean,\n");
                            out.push("        options: JSON,\n");
                            out.push("        conditions:JSON\n");
                            out.push("        ");
                            if (refHasChildren) {
                                out.push(",\n");
                                out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("      ):Int\n");
                            out.push("    }\n");
                            out.push("    `,\n");
                            out.push("    resolver:{\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + "Count:\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      build_variation(\n");
                                out.push("        '" + (rel.model.thingType) + "',\n");
                                out.push("        '" + (rel.propName) + "Count',\n");
                                out.push("        '" + (rel.relName) + "',\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("        relate_count(\n");
                            out.push("          build_relate_options(\n");
                            out.push("            '" + (rel.model.thingType) + "',\n");
                            out.push("            '" + (rel.propName) + "',\n");
                            out.push("            '" + (rel.relName) + "'\n");
                            out.push("          )\n");
                            out.push("        )\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      )\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("    }\n");
                            out.push("  }),\n");
                        } else {
                            out.push("\n");
                            out.push("// oppositeEmbedded & many\n");
                            out.push("  new Type({\n");
                            out.push("    // исправить: поставить правильную ссылку на модель\n");
                            out.push("    schema: gql`\n");
                            out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + "(\n");
                            out.push("        ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("        onlyIds: Boolean,\n");
                            out.push("        ensure:Boolean,\n");
                            out.push("        absent:Boolean,\n");
                            out.push("        options: JSON,\n");
                            out.push("        conditions:JSON\n");
                            out.push("        ");
                            if (refHasChildren) {
                                out.push(",\n");
                                out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("      ):[\n");
                            out.push("        ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("        " + (GQLName(rel.model.thingType)) + (rel.propName) + "Union\n");
                                out.push("        ");
                            } else {
                                out.push("\n");
                                out.push("        " + (GQLName(rel.ref.thingType)));
                                if (refHasChildren) {
                                    out.push("Union");
                                }
                                out.push("\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("        ]\n");
                            out.push("    }\n");
                            out.push("    `,\n");
                            out.push("    resolver:{\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + ":\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      build_variation(\n");
                                out.push("        '" + (rel.model.thingType) + "',\n");
                                out.push("        '" + (rel.propName) + "',\n");
                                out.push("        '" + (rel.relName) + "',\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("        relate(\n");
                            out.push("          build_relate_options(\n");
                            out.push("            '" + (rel.model.thingType) + "',\n");
                            out.push("            '" + (rel.propName) + "',\n");
                            out.push("            '" + (rel.relName) + "'\n");
                            out.push("          )\n");
                            out.push("        )\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      )\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("    }\n");
                            out.push("  }),\n");
                            out.push("  new Type({\n");
                            out.push("    // исправить: поставить правильную ссылку на модель\n");
                            out.push("    schema: gql`\n");
                            out.push("      type " + (GQLName(currentThingType)) + "Edges {\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + "Count(\n");
                            out.push("        ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("        variation: " + (GQLName(rel.model.thingType)) + (rel.propName) + "Enum!,\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("        onlyIds: Boolean,\n");
                            out.push("        ensure:Boolean,\n");
                            out.push("        absent:Boolean,\n");
                            out.push("        options: JSON,\n");
                            out.push("        conditions:JSON\n");
                            out.push("        ");
                            if (refHasChildren) {
                                out.push(",\n");
                                out.push("        kind:" + (getEnumName(rel.ref.thingType)) + "\n");
                                out.push("        ");
                            }
                            out.push("\n");
                            out.push("      ): Int\n");
                            out.push("    }\n");
                            out.push("    `,\n");
                            out.push("    resolver:{\n");
                            out.push("      " + (rel.propName.replaceAll('.', '')) + "Count:\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      build_variation(\n");
                                out.push("        '" + (rel.model.thingType) + "',\n");
                                out.push("        '" + (rel.propName) + "Count',\n");
                                out.push("        '" + (rel.relName) + "',\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("        relate_count(\n");
                            out.push("          build_relate_options(\n");
                            out.push("            '" + (rel.model.thingType) + "',\n");
                            out.push("            '" + (rel.propName) + "',\n");
                            out.push("            '" + (rel.relName) + "'\n");
                            out.push("          )\n");
                            out.push("        )\n");
                            out.push("      ");
                            if (relIsArray) {
                                out.push("\n");
                                out.push("      )\n");
                                out.push("      ");
                            }
                            out.push("\n");
                            out.push("    }\n");
                            out.push("  }),\n");
                        }
                        out.push("\n");
                    }
                    out.push("\n");
                }
                out.push("\n");
            }
            out.push("\n");
            out.push("]\n");
            out.push("\n");
            out.push("//\n");
            out.push("registerSchema('" + (GQLName(context.name)) + "',\n");
            out.push("  new Schema({\n");
            out.push("    name: '" + (GQLName(context.name)) + "',\n");
            out.push("    items: [\n");
            out.push("      ...types,\n");
            out.push("      ...relations,\n");
            out.push("    ],\n");
            out.push("  })\n");
            out.push(")");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Relation/relation.classic.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
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
    },
    ['server/Meta.Query/query.query.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if ("string" === typeof context.queryText) {
                out.push("\n");
                out.push("function query(prm){\n");
                out.push("    return " + (context.queryText) + "\n");
                out.push("}\n");
            } else if ("function" === typeof context.queryText) {
                out.push("\n");
                out.push("  " + (context.queryText) + "\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Query/query.extractor.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context.extractor) {
                out.push("\n");
                if ("string" === typeof context.extractor) {
                    if (/^function extractData/.test(context.extractor.trim())) {
                        out.push("\n");
                        out.push((context.extractor) + "\n");
                    } else {
                        out.push("\n");
                        out.push("function extractData(db, prm, data, callback) {\n");
                        out.push("  " + (context.extractor) + "\n");
                        out.push("}\n");
                    }
                    out.push("\n");
                } else if ("function" === typeof context.extractor) {
                    out.push("\n");
                    out.push((context.extractor) + "\n");
                }
                out.push("\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Query/meta.query.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("if (typeof(global.CustomQuery) == 'undefined') global.CustomQuery = {};\n");
            out.push("\n");
            out.push("let ComplexQuery  = require(\"@grainjs/loaders\").ComplexQuery;\n");
            out.push("let extractor    = require(global.USEGLOBAL('/lib/extractor')).extractor;\n");
            out.push("\n");
            out.push((partial(context, "query")) + "\n");
            out.push("\n");
            out.push((partial(context, "extractor")) + "\n");
            const [namespace, name] = context.name.split('.');
            out.push("\n");
            out.push("\n");
            out.push("let " + (name) + " = global.CustomQuery." + (name) + " = exports." + (name) + " = function (db, prm, callback) {\n");
            out.push("    ComplexQuery.execQuery(db, query(prm), function(err, data) {\n");
            out.push("        if(err) return callback(err);\n");
            if (context.extractor && context.extractor.length > 0) {
                out.push("\n");
                out.push("        extractData.call(this, db, prm, data, callback);\n");
            } else {
                out.push("\n");
                out.push("        callback(err, data);\n");
            }
            out.push("\n");
            out.push("    });\n");
            out.push("};");
            return out.join('');
        },
        compile: function() {
            this.aliases = {};
            this.aliases["query"] = "server/Meta.Query/query.query.njs";
            this.factory.ensure("server/Meta.Query/query.query.njs");
            this.aliases["extractor"] = "server/Meta.Query/query.extractor.njs";
            this.factory.ensure("server/Meta.Query/query.extractor.njs");
        },
        dependency: {
            "server/Meta.Query/query.query.njs": true,
            "query": true,
            "server/Meta.Query/query.extractor.njs": true,
            "extractor": true
        }
    },
    ['server/Meta.Query/meta.query.direct.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            const [namespace, name] = context.name.split('.');
            out.push("\n");
            out.push("Ext.directFn({\n");
            out.push("  namespace: '" + (namespace) + "',\n");
            out.push("  name: '" + (name) + "',\n");
            out.push("  locationType:\"" + (context.locationType) + "\",\n");
            out.push("  body: function(para) {\n");
            out.push("    let context = this;\n");
            out.push("    let prm = para.data.shift();\n");
            out.push("    prm.context = context;\n");
            out.push("    ");
            const hasCondition = context.queryRunCondition !== 'true' && context.queryRunCondition != true && context.queryRunCondition != '' && context.queryRunCondition !== null && context.queryRunCondition !== undefined;
            out.push("\n");
            out.push("    ");
            if (hasCondition) {
                out.push("\n");
                out.push("    if(" + (context.queryRunCondition) + "){\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("    CustomQuery['" + (name) + "'].call(this, this.db, prm, function(err, data) {\n");
            out.push("      if (!err) context.success(data);\n");
            out.push("      else context.failure(err);\n");
            out.push("    })\n");
            out.push("    ");
            if (hasCondition) {
                out.push("\n");
                out.push("    } else {\n");
                out.push("      context.success(" + (context.queryEmptyResult ? context.queryEmptyResult : context.queryIsListResult ? [] : 'null') + ")\n");
                out.push("    }\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Module/module.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("/*/////////////////////////////////////////////////////////////////////////////////\n");
            out.push("DO NOT TRY TO EDIT THIS CODE, ALL CHANGES WILL BE LOST AFTER CODEGENERATION\n");
            out.push("BE SURE YOU SAVE ALL YOUR CHANGES BEFORE CODEGENERATION\n");
            out.push("Module \"" + (context.name) + "\"\n");
            out.push("/////////////////////////////////////////////////////////////////////////////////*/\n");
            out.push("\n");
            out.push((context.body));
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Meta.Direct/ext.directfn.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("/*\n");
            out.push(" * autogenerated\n");
            out.push(" * {comment}\n");
            out.push(" */\n");
            out.push("Ext.directFn({\n");
            out.push("  namespace: \"" + (context.namespace) + "\",\n");
            out.push("  name: '" + (context.name) + "',\n");
            if (context.formHandler) {
                out.push("\n");
                out.push("  extension: {\n");
                out.push("    formHandler: true\n");
                out.push("  },\n");
            }
            out.push("\n");
            out.push("  locationType: \"" + (context.locationType) + "\",\n");
            out.push("  body: function(para){" + (context.body) + "}\n");
            out.push("});\n");
            out.push("/*\n");
            out.push(" * end autogenerated\n");
            out.push(" */");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.ScreenWebPage/extControl.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.controller ? context.controller : "base") + "." + (context.name) + "',{\n");
            out.push("  extend: 'Ext.ux.IFrame',\n");
            out.push("  alias: 'widget." + (context.widgetName) + "',\n");
            out.push("  src: '" + (context.address) + "',\n");
            out.push("  autoScroll: false,\n");
            out.push("  title: _t(\n");
            out.push("    '" + (context.title) + "',\n");
            out.push("    '" + (context.controller ? context.controller : "base") + "." + (context.name) + "',\n");
            out.push("    'titles',\n");
            out.push("  ),\n");
            out.push("})");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.ScreenHtmlPage/serverPage.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("// приложение будет хранить код Html и выдавать его по требованию клиента... код не будет лежать ни в каких старических ресурсах, тогда можно будет разделять по профилям код.... если это будет нужно\n");
            out.push("Ext.page(\"" + (context.name) + "\"," + (JSON.stringify(context.code)) + ");");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.ScreenHtmlPage/extControl.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define(\n");
            out.push("  'Modeleditor.view." + (context.controller ? context.controller : "base") + "." + (context.name) + "',\n");
            out.push("  {\n");
            out.push("    extend: 'Ext.ux.IFrame',\n");
            out.push("    alias: 'widget." + (context.widgetName) + "',\n");
            out.push("    src: '/page/" + (context.name) + "',\n");
            out.push("    autoScroll: false,\n");
            out.push("    title: _t(\n");
            out.push("      '" + (context.title) + "',\n");
            out.push("      '" + (context.controller ? context.controller : "base") + "." + (context.name) + "',\n");
            out.push("      'titles',\n");
            out.push("    ),\n");
            out.push("  },\n");
            out.push(")");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/toolbarFuncs.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context && context.currentProfile && context.currentProfile.toolBarItem) {
                out.push("\n");
                out.push("/*START TOOLBAR FUNCTIONS*/\n");
                let toolbars = context.currentProfile.toolBarItem;
                for(let i = 0; i < toolbars.length; i++){
                    out.push("\n");
                    out.push("  " + (toolbars[i].itemId) + "Func: function(){\n");
                    out.push("    DirectCacheLogger.userStories('Toolbar Function', { toolbarItemId: '" + (toolbars[i].itemId) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
                    out.push("    " + (toolbars[i].func) + "\n");
                    out.push("  },\n");
                    out.push("  ");
                }
                out.push("\n");
                out.push("/*END TOOLBAR FUNCTIONS*/\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/requireThings.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            let requireNs = Object.keys(context.nsList);
            if (requireNs.length > 0) {
                out.push("\n");
                out.push("Ext.require([\n");
                for(let i = 0; i < requireNs.length; i++){
                    out.push("\n");
                    out.push("    \"things." + (requireNs[i]) + "\",\n");
                }
                out.push("\n");
                out.push("], function() {\n");
                out.push("    me.loadProfile();\n");
                out.push("});\n");
            } else {
                out.push("\n");
                out.push("    me.loadProfile();\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/registerModules.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context && context.currentProfile && context.currentProfile.module) {
                if (context.currentProfile.module) {
                    for(let i = 0; i < context.currentProfile.module.length; i++){
                        if (context.currentProfile.module[i].controllerName) {
                            out.push("\n");
                            out.push("self.loadModule(\"" + (context.currentProfile.module[i].controllerName) + "\");\n");
                        }
                    }
                }
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/profileControl.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context && context.currentProfile && context.currentProfile.toolBarItem) {
                let toolbars = context.currentProfile.toolBarItem;
                let len = toolbars?.length ?? 0;
                out.push("\n");
                out.push("me.control({\n");
                for(let i = 0; i < len; i++){
                    out.push("\n");
                    out.push("  \"button[itemId=" + (toolbars[i].itemId) + "]\": {click: this." + (toolbars[i].itemId) + "Func},\n");
                }
                out.push("\n");
                out.push("});\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/profileControl copy.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            if (context && context.currentProfile && context.currentProfile.toolBarItem) {
                let toolbars = context.currentProfile.toolBarItem;
                let len = toolbars?.length ?? 0;
                out.push("\n");
                out.push("me.control({\n");
                for(let i = 0; i < len; i++){
                    out.push("\n");
                    out.push("  \"button[itemId=" + (toolbars[i].itemId) + "]\": {click: this." + (toolbars[i].itemId) + "Func},\n");
                }
                out.push("\n");
                out.push("});\n");
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/package.json.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("{\n");
            out.push("  \"name\": \"" + (context.name.toLowerCase()) + "\",\n");
            out.push("  \"version\": \"0.0.1\",\n");
            out.push("  \"private\": \"true\",\n");
            out.push("  \"dependencies\": {\n");
            out.push("    \"@grainjs/grainjs\": \"" + (global.VERSION) + "\"\n");
            out.push("  },\n");
            out.push("  \"scripts\": {\n");
            out.push("    \"start\": \"npx grainjs edit\",\n");
            out.push("    \"start-mt-3\": \"npx grainjs editwt 3\",\n");
            out.push("    \"restore\": \"npx grainjs import\",\n");
            out.push("    \"debug\": \"node  --inspect-brk --trace-deprecation --trace-warnings ./node_modules/.bin/grainjs edit\"\n");
            out.push("  }\n");
            out.push("}");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/application.viewport.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define(\"Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".Viewport\", {\n");
            out.push("  extend: \"Ext.panel.Panel\",\n");
            out.push("  require: [\n");
            out.push("    //'Admin.SpeedTestToolbar'\n");
            out.push("    ],\n");
            out.push("  alias: \"widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "viewport\",\n");
            out.push("\n");
            out.push("  initComponent: function() {\n");
            out.push("    Ext.apply(this, {\n");
            out.push("      layout:\"border\",\n");
            out.push("      items: [{\n");
            out.push("        region: \"north\",\n");
            out.push("        xtype: \"panel\",\n");
            out.push("        border: false,\n");
            out.push("        dockedItems: [{\n");
            out.push("          xtype: \"" + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "toolbar\"\n");
            out.push("        }]\n");
            out.push("      },\n");
            out.push("      ");
            if (context.currentProfile?.navItem?.length > 0) {
                out.push("\n");
                out.push("      {\n");
                out.push("        xtype: \"" + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "navigation\",\n");
                out.push("        region: \"west\"\n");
                out.push("      },\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      {\n");
            out.push("        xtype: \"" + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "screencontainer\",\n");
            out.push("        itemId: \"mainContainer\",\n");
            out.push("        region:\"center\",\n");
            out.push("        margin: 2\n");
            out.push("      },\n");
            out.push("      ");
            if (!context.noHealthCheck) {
                out.push("\n");
                out.push("      {\n");
                out.push("        region: 'south',\n");
                out.push("        xtype: 'panel',\n");
                out.push("        border: false,\n");
                out.push("        dockedItems: [\n");
                out.push("          {\n");
                out.push("            xtype: 'speedtesttoolbar',\n");
                out.push("          },\n");
                out.push("        ],\n");
                out.push("      },\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      ]\n");
            out.push("    });\n");
            out.push("\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/application.view-toolbar.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            context.currentProfile.toolBarItem.sort(function(a, b) {
                if (a !== undefined && b !== undefined) return a.itemIndex - b.itemIndex;
                return 0;
            });
            out.push("\n");
            out.push("\n");
            out.push("Ext.define('Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".ToolBar', {\n");
            out.push("  extend: 'Ext.toolbar.Toolbar',\n");
            out.push("  alias: 'widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "toolbar',\n");
            out.push("  dock: \"top\",\n");
            out.push("\n");
            out.push("  initComponent: function() {\n");
            out.push("    const currentLocale = globalThis.CURRENT_LOCALE || globalThis.AVAILABLE_LANGUAGES[0]\n");
            out.push("    DirectCacheLogger.userStories('Toolbar Init Component', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("\n");
            out.push("    Ext.apply(this, {\n");
            out.push("      items:[\n");
            out.push("    ");
            for(let i = 0; i < context.currentProfile?.toolBarItem?.length ?? -1; i++){
                let settings = JSON.parse(context.currentProfile.toolBarItem[i].settings);
                settings.itemId = context.currentProfile.toolBarItem[i].itemId;
                out.push("\n");
                out.push("      " + (JSON.stringify(settings)) + ",\n");
                out.push("    ");
            }
            out.push("\n");
            out.push("\n");
            out.push("      /* DEFAULT ITEMS */\n");
            out.push("      \"->\",\n");
            out.push("      ");
            if (!context.noTranslationTools) {
                out.push("\n");
                out.push("      {\n");
                out.push("        xtype: 'button',\n");
                out.push("        iconCls: `gi-lang_${currentLocale.code}`,\n");
                out.push("        menu: {\n");
                out.push("          items: globalThis.AVAILABLE_LANGUAGES.filter(\n");
                out.push("            l => l.code != globalThis.CURRENT_LOCALE.code,\n");
                out.push("          ).map(l => ({\n");
                out.push("            iconCls: `gi-lang_${l.code}`,\n");
                out.push("            text: `${l.nativeName} (${l.code})`,\n");
                out.push("            data: l,\n");
                out.push("          })),\n");
                out.push("          listeners: {\n");
                out.push("            click(menu, item, e, eOpts) {\n");
                out.push("              DirectCacheLogger.userStories('Language Change', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "', newLanguage: item.data.code });\n");
                out.push("              const button = this.up('button')\n");
                out.push("              button.setText(item.text)\n");
                out.push("              button.setIconCls(item.iconCls)\n");
                out.push("              globalThis._tChangeLang(item.data)\n");
                out.push("              menu.removeAll()\n");
                out.push("              globalThis.AVAILABLE_LANGUAGES.filter(\n");
                out.push("                l => l.code != globalThis.CURRENT_LOCALE.code,\n");
                out.push("              )\n");
                out.push("                .map(\n");
                out.push("                  l =>\n");
                out.push("                    new Ext.createWidget('menuitem', {\n");
                out.push("                      iconCls: `gi-lang_${l.code}`,\n");
                out.push("                      text: `${l.nativeName} (${l.code})`,\n");
                out.push("                      data: l,\n");
                out.push("                    }),\n");
                out.push("                )\n");
                out.push("                .forEach(item => menu.items.add(item))\n");
                out.push("            },\n");
                out.push("          },\n");
                out.push("        },\n");
                out.push("      },\n");
                out.push("      ");
            }
            out.push("\n");
            out.push("      {\n");
            out.push("        xtype: 'button',\n");
            out.push("        text: _t('Logout', 'SYSTEM', 'buttons'),\n");
            out.push("        itemId: 'logout',\n");
            out.push("        scale: 'medium',\n");
            out.push("        href: '/logout',\n");
            out.push("        hrefTarget: '_self',\n");
            out.push("        iconCls: _r(\n");
            out.push("          'Logout',\n");
            out.push("          'icon-signout medium-icon',\n");
            out.push("          'SYSTEM',\n");
            out.push("          'iconCls',\n");
            out.push("        ),\n");
            out.push("        listeners: {\n");
            out.push("          click: function() {\n");
            out.push("            DirectCacheLogger.userStories('Logout Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("          }\n");
            out.push("        }\n");
            out.push("      },\n");
            out.push("        {\n");
            out.push("          xtype: 'button',\n");
            out.push("          text: _t('current session info?', 'SYSTEM', 'toolbars'),\n");
            out.push("          iconCls: _r('current session info?', '', 'SYSTEM', 'iconCls'),\n");
            out.push("          menu: [\n");
            out.push("            {\n");
            out.push("              xtype: 'button',\n");
            out.push("              text: _t('current session info?', 'SYSTEM', 'toolbars'),\n");
            out.push("              itemId: 'showUserInfo',\n");
            out.push("              iconCls: _r('current session info?', '', 'SYSTEM', 'iconCls'),\n");
            out.push("              scale: 'medium',\n");
            out.push("              listeners: {\n");
            out.push("                click: function() {\n");
            out.push("                  DirectCacheLogger.userStories('Show User Info Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("                }\n");
            out.push("              }\n");
            out.push("            },\n");
            out.push("            {\n");
            out.push("              xtype: 'button',\n");
            out.push("              text: _t('Impersonate User', 'SYSTEM', 'toolbars'),\n");
            out.push("              itemId: 'impersonateUser',\n");
            out.push("              iconCls: _r(\n");
            out.push("                'Impersonate User',\n");
            out.push("                'gi-fa_solid_user-secret',\n");
            out.push("                'SYSTEM',\n");
            out.push("                'iconCls',\n");
            out.push("              ),\n");
            out.push("              scale: 'medium',\n");
            out.push("              hidden: !Ext.util.Cookies.get('isAdmin'),\n");
            out.push("              handler: function () {\n");
            out.push("                DirectCacheLogger.userStories('Impersonate User Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("                Ext.create('Modeleditor.view.Admin.ImpersonateForm').show()\n");
            out.push("              },\n");
            out.push("            },\n");
            out.push("            {\n");
            out.push("              xtype: 'button',\n");
            out.push("              text: _t('Return to Original User', 'SYSTEM', 'toolbars'),\n");
            out.push("              itemId: 'revertImpersonate',\n");
            out.push("              iconCls: _r(\n");
            out.push("                'Return to Original User',\n");
            out.push("                'gi-fa_solid_user',\n");
            out.push("                'SYSTEM',\n");
            out.push("                'iconCls',\n");
            out.push("              ),\n");
            out.push("              scale: 'medium',\n");
            out.push("              hidden: !Ext.util.Cookies.get('isImpersonating'),\n");
            out.push("              handler: function () {\n");
            out.push("                DirectCacheLogger.userStories('Revert Impersonate Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("                Ext.Ajax.request({\n");
            out.push("                  url: '/impersonate/revert',\n");
            out.push("                  method: 'POST',\n");
            out.push("                  success: function () {\n");
            out.push("                    window.location.reload()\n");
            out.push("                  },\n");
            out.push("                  failure: function (response) {\n");
            out.push("                    Ext.Msg.alert(\n");
            out.push("                      _t('Error', 'SYSTEM', 'messages'),\n");
            out.push("                      Ext.decode(response.responseText).error,\n");
            out.push("                    )\n");
            out.push("                  },\n");
            out.push("                })\n");
            out.push("              },\n");
            out.push("            },\n");
            out.push("            {\n");
            out.push("              xtype: 'button',\n");
            out.push("              text: _t('Clear Cache', 'SYSTEM', 'toolbars'),\n");
            out.push("              itemId: 'clearCache',\n");
            out.push("              iconCls: _r('Clear Cache', '', 'SYSTEM', 'iconCls'),\n");
            out.push("              scale: 'medium',\n");
            out.push("              listeners: {\n");
            out.push("                click: () => {\n");
            out.push("                  DirectCacheLogger.userStories('Clear Cache Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("                  Workspace.DirectCatcher.clear()\n");
            out.push("                },\n");
            out.push("              },\n");
            out.push("            },\n");
            out.push("            {\n");
            out.push("              xtype: 'button',\n");
            out.push("              text: _t('Capture Start', 'SYSTEM', 'toolbars'),\n");
            out.push("              itemId: 'captureStart',\n");
            out.push("              iconCls: _r('Capture Start', '', 'SYSTEM', 'iconCls'),\n");
            out.push("              scale: 'medium',\n");
            out.push("              listeners: {\n");
            out.push("                click: () => {\n");
            out.push("                  DirectCacheLogger.userStories('Capture Start Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("                  Workspace.DirectCatcher.startCapture()\n");
            out.push("                },\n");
            out.push("              },\n");
            out.push("            },\n");
            out.push("            {\n");
            out.push("              xtype: 'button',\n");
            out.push("              text: _t('Capture Stop', 'SYSTEM', 'toolbars'),\n");
            out.push("              itemId: 'captureStop',\n");
            out.push("              iconCls: _r('Capture Stop', '', 'SYSTEM', 'iconCls'),\n");
            out.push("              scale: 'medium',\n");
            out.push("              listeners: {\n");
            out.push("                click: () => {\n");
            out.push("                  DirectCacheLogger.userStories('Capture Stop Button Click', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("                  Workspace.DirectCatcher.stopCapture()\n");
            out.push("                },\n");
            out.push("              },\n");
            out.push("            },\n");
            out.push("          ],\n");
            out.push("        },\n");
            out.push("      ]\n");
            out.push("    });\n");
            out.push("\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/application.view-screencontainer.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".ScreenContainer', {\n");
            let mainContainerType = "Modeleditor.view.content.TabPanel";
            let printErr = false;
            let screenItem = context.currentProfile.rootScreen;
            if (screenItem && screenItem.layoutType != "") {
                mainContainerType = screenItem.layoutType;
            } else {
                printErr = true;
            }
            out.push("\n");
            out.push("  extend: \"" + (mainContainerType) + "\",\n");
            out.push("  contentType: \"" + (mainContainerType) + "\",\n");
            out.push("\n");
            out.push("  alias: 'widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "screencontainer',\n");
            out.push("\n");
            out.push("  initComponent: function() {\n");
            out.push("  ");
            if (printErr) {
                out.push("\n");
                out.push("    console.warn(_t('Your screen configuration have no main container! Now using default container (Tab panel)', 'SYSTEM', 'messages'));\n");
                out.push("  ");
            }
            out.push("\n");
            out.push("    this.callParent(arguments);\n");
            out.push("  }\n");
            out.push("});");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/application.view-navigation.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.view." + (context.name) + (context.currentProfile.name) + ".Navigation', {\n");
            out.push("extend: 'Ext.tab.Panel',\n");
            out.push("alias: 'widget." + (context.name.toLowerCase()) + (context.currentProfile.name.toLowerCase()) + "navigation',\n");
            out.push("\n");
            out.push("initComponent: function() {\n");
            out.push("  DirectCacheLogger.userStories('Navigation Init Component', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "' });\n");
            out.push("  Ext.apply(this, {\n");
            out.push("      plain: true,\n");
            out.push("      activeTab: 0,\n");
            out.push("      margin: \"2 0 2 2\",\n");
            out.push("      collapsible: true,\n");
            out.push("      iconCls: _r('Navigation','', 'SYSTEM', 'iconCls'),\n");
            out.push("      width: 200,\n");
            out.push("      defaults: {\n");
            out.push("        xtype: 'treepanel',\n");
            out.push("        rootVisible: false,\n");
            out.push("        bodyStyle: \"border: 0px;\"\n");
            out.push("      },\n");
            out.push("      items:[\n");
            out.push("        {\n");
            out.push("          title: _t('Navigation', 'SYSTEM', 'titles'),\n");
            out.push("          itemId: 'applicationNavigation',\n");
            out.push("          store: Ext.create('Ext.data.TreeStore', {\n");
            out.push("              autoLoad:true,\n");
            out.push("              autoSync:false,\n");
            out.push("              fields:[\n");
            out.push("                {name: 'id',      type: 'string'},\n");
            out.push("                {name: 'text',      type: 'string'},\n");
            out.push("                {name: 'name',      type: 'string'},\n");
            out.push("                {name: 'type',      type: 'string'},\n");
            out.push("                {name: 'require',    type: 'string'},\n");
            out.push("                {name: 'reference',    type: 'string'},\n");
            out.push("                {name: 'widgetName',  type: 'string'},\n");
            out.push("                {name: 'queryResult',  type: 'boolean',  defaultValue: false},\n");
            out.push("                {name: 'disable',    type: 'boolean',  defaultValue: false},\n");
            out.push("              ],\n");
            out.push("              proxy: {\n");
            out.push("                type: 'direct',\n");
            out.push("                api:{\n");
            out.push("                  read: " + (context.name) + ".read" + (context.name) + (context.currentProfile.name) + "Navigation\n");
            out.push("                }\n");
            out.push("              },\n");
            out.push("              listeners: {\n");
            out.push("                load: function(store, records, successful, operation) {\n");
            out.push("                  DirectCacheLogger.userStories('Navigation Store Load', { applicationName: '" + (context.name) + "', profileName: '" + (context.currentProfile.name) + "', recordCount: records.length, successful: successful });\n");
            out.push("                }\n");
            out.push("              }\n");
            out.push("            })\n");
            out.push("          }\n");
            out.push("        ]\n");
            out.push("      });\n");
            out.push("      \n");
            out.push("      this.callParent(arguments);\n");
            out.push("    }\n");
            out.push("  });");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/application.view-navigation.direct.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Grainjs.RegisterProfile('" + (context.currentProfile.name) + "')\n");
            out.push("\n");
            out.push("let gl = require(global.global.USEGLOBAL('/app/server/direct/global.js'))\n");
            out.push("// register profile code need to refactor\n");
            out.push("Ext.directFn({\n");
            out.push("    namespace: '" + (context.name) + "',\n");
            out.push("    name: 'read" + (context.name) + (context.currentProfile.name) + "Navigation',\n");
            out.push("    locationType: 'system',\n");
            out.push("    body: function (para) {\n");
            out.push("      para.appName = '" + (context.name) + "'\n");
            out.push("      para.profileName = '" + (context.currentProfile.name) + "'\n");
            out.push("      gl.readAppNavigation(para, this)\n");
            out.push("    },\n");
            out.push("  })");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/application.profiler.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("Ext.define('Modeleditor.controller.Profile', {\n");
            out.push("    extend: 'Ext.app.Controller',\n");
            out.push("    views: [\n");
            if (!context.noHealthCheck) {
                out.push("\n");
                out.push("      //'Admin.SpeedTestToolbar',\n");
            }
            out.push("\n");
            out.push("      '" + (context.name) + (context.currentProfile.name) + ".Viewport',\n");
            out.push("      '" + (context.name) + (context.currentProfile.name) + ".Navigation',\n");
            out.push("      '" + (context.name) + (context.currentProfile.name) + ".ToolBar',\n");
            out.push("      '" + (context.name) + (context.currentProfile.name) + ".ScreenContainer'\n");
            out.push("    ],\n");
            out.push("    models: [ ],\n");
            out.push("    stores: [ ],\n");
            out.push("\n");
            out.push("    /*SCREEN CONFIG*/\n");
            out.push("    screens:" + (context.renderedScreens) + ",\n");
            out.push("\n");
            out.push("    /*SCREEN CONTAINER DISPLAY CONFIG FOR: TABPANEL, PORTALPANEL, SINGLEPANEL*/\n");
            out.push("    SCREENCONFIG:{\n");
            out.push("      tabpanel:{\n");
            out.push("        plain: true,\n");
            out.push("        margin: \"2 0 0 0\"\n");
            out.push("      },\n");
            out.push("      singlepanel:{\n");
            out.push("        plain: false,\n");
            out.push("        margin: \"0\"\n");
            out.push("      }\n");
            out.push("    },\n");
            out.push("\n");
            out.push("    compareIndex: function(a,b) {\n");
            out.push("      if (a.index < b.index)\n");
            out.push("      return 1;\n");
            out.push("      if (a.index > b.index)\n");
            out.push("      return -1;\n");
            out.push("      return 0;\n");
            out.push("    },\n");
            out.push("\n");
            out.push("    compareOrder: function(a,b) {\n");
            out.push("      if (a.order < b.order)\n");
            out.push("      return 1;\n");
            out.push("      if (a.order > b.order)\n");
            out.push("      return -1;\n");
            out.push("      return 0;\n");
            out.push("    },\n");
            out.push("\n");
            out.push("    actionLoad: function(v, max) {\n");
            out.push("      return function() {\n");
            out.push("        if (v == 0) {\n");
            out.push("          Ext.MessageBox.hide();\n");
            out.push("        } else {\n");
            out.push("        let i = (max - v + 1) / max;\n");
            out.push("        Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '% completed');\n");
            out.push("      }\n");
            out.push("    };\n");
            out.push("  },\n");
            out.push("\n");
            out.push("  init: function() {\n");
            out.push("    let me = this;\n");
            out.push("    me.mainController = me.application.getController(\"Modeleditor.controller.Modeleditor\");\n");
            out.push((partial(context, 'requireThings')) + "\n");
            out.push((partial(context, 'control')) + "\n");
            out.push("  },\n");
            out.push("\n");
            out.push("  loadProfile: function() {\n");
            out.push("    let self = this;\n");
            out.push("\n");
            out.push("    /*LOAD VIEWPORT*/\n");
            out.push("    this.mainController.getMainViewport().add(Ext.widget('" + (context.name.toLowerCase() + context.currentProfile.name.toLowerCase()) + "viewport'));\n");
            out.push("    /*LOAD SCREENS*/\n");
            if (context.SCREENS > 2) {
                out.push("\n");
                out.push("    Ext.MessageBox.show({\n");
                out.push("        title: _t('Please wait', 'SYSTEM', 'titles'),\n");
                out.push("        msg: _t('Loading views...', 'SYSTEM','messages'),\n");
                out.push("        progressText: _t('Initializing...', 'SYSTEM', 'messages'),\n");
                out.push("        width: 300,\n");
                out.push("        progress: true,\n");
                out.push("        closable: false\n");
                out.push("      });\n");
                out.push("      self.SCREEN_LENGTH = self.screens?.length ?? 0;\n");
            }
            out.push("\n");
            out.push("      if (self.screens) {\n");
            out.push("        self.initScreen(self.screens, self);\n");
            out.push("      }\n");
            out.push((partial(context, 'modules')) + "\n");
            out.push("    },\n");
            out.push("\n");
            out.push("    " + (partial(context, 'toolbarFuncs')) + "\n");
            out.push("\n");
            out.push("    initScreen: function(screenItem, scope, callback) {\n");
            out.push("      let self = scope;\n");
            out.push("      if (screenItem) {\n");
            out.push("        if (screenItem.defaultViews?.length > 0) {\n");
            out.push("          screenItem.defaultViews.sort(self.compareOrder);\n");
            out.push("          screenItem.defaultViews.sort(self.compareIndex);\n");
            out.push("        }\n");
            out.push("        let key = screenItem.type.split(\".\").pop().toLowerCase();\n");
            out.push("        self.addScreenContainer(screenItem, key, self, function(el) {\n");
            out.push("            let item;\n");
            out.push("            let cnt = screenItem.defaultViews.length;\n");
            out.push("            length = 0;\n");
            out.push("\n");
            out.push("            function done(err) {\n");
            out.push("              if (err || ++length > cnt)\n");
            out.push("              if (callback) callback();\n");
            out.push("            }\n");
            out.push("            for (let i = 0; i < cnt; i++) {\n");
            out.push("              item = screenItem.defaultViews[i];\n");
            out.push("              item.parentEl = el;\n");
            out.push("              self.addContent(item, self, done);\n");
            out.push("            }\n");
            out.push("          });\n");
            out.push("        } else {\n");
            out.push("        if (callback) callback();\n");
            out.push("      }\n");
            out.push("    },\n");
            out.push("\n");
            out.push("    addScreenContainer: function(screenItem, key, scope, callback) {\n");
            out.push("      let self = scope;\n");
            out.push("      let itemData = {\n");
            out.push("        element: Ext.create(screenItem.type, {\n");
            out.push("            plain: self.SCREENCONFIG[key].plain,\n");
            out.push("            margin: self.SCREENCONFIG[key].margin,\n");
            out.push("            title: _t(screenItem.title,'" + (context.name) + (context.currentProfile.name) + "', 'titles')\n");
            out.push("          }),\n");
            out.push("          index: screenItem.index,\n");
            out.push("          contentPanel: self.mainController.getMainContainer(),\n");
            out.push("          closable: screenItem.closable\n");
            out.push("        };\n");
            out.push("\n");
            out.push("        self.mainController.preLoadItem(itemData, function() {\n");
            out.push("            if (callback) callback(itemData.element);\n");
            out.push("          });\n");
            out.push("        },\n");
            out.push("\n");
            out.push("        addContent: function(screenItem, scope, callback) {\n");
            out.push("          let me = this;\n");
            out.push("          let reference = screenItem.reference;\n");
            out.push("          let title = screenItem.title;\n");
            out.push("          let type = screenItem.type;\n");
            out.push("          let suffix = \"\";\n");
            out.push("          switch (type) {\n");
            out.push("          case 'list':\n");
            out.push("          suffix = \"list\";\n");
            out.push("          break;\n");
            out.push("        case 'calendar':\n");
            out.push("        suffix = \"calendar\";\n");
            out.push("        break;\n");
            out.push("      }\n");
            out.push("      let widgetName = screenItem.widgetName;\n");
            out.push("      let loadWidget = widgetName + suffix;\n");
            out.push("      if (widgetName) {\n");
            out.push("        let itemData = {\n");
            out.push("          type: type,\n");
            out.push("          element: null,\n");
            out.push("          contentPanel: me.mainController.getMainContainer(),\n");
            out.push("          require: screenItem.require,\n");
            out.push("          reference: screenItem.reference,\n");
            out.push("          widget: widgetName,\n");
            out.push("          widgetName: loadWidget,\n");
            out.push("          thingId: null,\n");
            out.push("          queryResult: null,\n");
            out.push("          title: _t(title,'" + (context.name) + (context.currentProfile.name) + "','titles'),\n");
            out.push("          closable: screenItem.closable\n");
            out.push("        };\n");
            out.push("        me.mainController.preLoadItem(itemData, function() {\n");
            out.push("            if (callback) callback();\n");
            out.push("          });\n");
            out.push("        }\n");
            out.push("      },\n");
            out.push("\n");
            out.push("      loadModule: function(moduleName) {\n");
            out.push("        let self = this;\n");
            out.push("        Ext.require([\n");
            out.push("            moduleName\n");
            out.push("          ], function() {\n");
            out.push("          self.application.getController(moduleName);\n");
            out.push("        });\n");
            out.push("      }\n");
            out.push("    });");
            return out.join('');
        },
        compile: function() {
            this.aliases = {};
            this.aliases["requireThings"] = "server/Application.Config/requireThings.njs";
            this.factory.ensure("server/Application.Config/requireThings.njs");
            this.aliases["control"] = "server/Application.Config/profileControl.njs";
            this.factory.ensure("server/Application.Config/profileControl.njs");
            this.aliases["modules"] = "server/Application.Config/registerModules.njs";
            this.factory.ensure("server/Application.Config/registerModules.njs");
            this.aliases["toolbarFuncs"] = "server/Application.Config/toolbarFuncs.njs";
            this.factory.ensure("server/Application.Config/toolbarFuncs.njs");
        },
        dependency: {
            "server/Application.Config/requireThings.njs": true,
            "requireThings": true,
            "server/Application.Config/profileControl.njs": true,
            "control": true,
            "server/Application.Config/registerModules.njs": true,
            "modules": true,
            "server/Application.Config/toolbarFuncs.njs": true,
            "toolbarFuncs": true
        }
    },
    ['server/Application.Config/application.config.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("global.STARTTIME = new Date('" + ((new Date()).toGMTString()) + "');\n");
            out.push("\n");
            out.push("const debug = process.env.DEBUG_APP?.toLowerCase() == 'true'\n");
            out.push("if (debug) {\n");
            out.push("  const { Config } = require('pipeline.js')\n");
            out.push("  Config.timeout = parseInt(process.env.DEBUG_STAGE_TIMEOUT ?? '1000', 10)\n");
            out.push("}\n");
            out.push("\n");
            out.push("global.SERVERCONFIG =\n");
            out.push("exports.config = {\n");
            out.push("  ssl: process.env.SSL?.toLowerCase() == 'true',\n");
            out.push("  sslConfig: {\n");
            out.push("    key: process.env.SSL_KEY_PATH || USELOCAL('./ssl/server.key'),\n");
            out.push("    cert: process.env.SSL_CERT_PATH || USELOCAL('./ssl/server.crt'),\n");
            out.push("  },\n");
            out.push("  enableGraphQL: process.env.ENABLE_GRAPHQL?.toLowerCase() == 'true',\n");
            out.push("  dbConnectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '1000', 10),\n");
            out.push("  sessionTimeout: parseInt(process.env.SESSION_CONNECTION_TIMEOUT ?? '1000', 10),\n");
            out.push("  noClientCache: process.env.NO_CLIENT_CACHE?.toLowerCase() == 'true',\n");
            out.push("  noHealthCheck: process.env.NO_HEALTH_CHECK?.toLowerCase() == 'true',\n");
            out.push("  noServerCache: process.env.NO_SERVER_CACHE?.toLowerCase() == 'true',\n");
            out.push("  noTranslationTools: process.env.NO_TRANSLATION_TOOLS?.toLowerCase() == 'true',\n");
            out.push("  theme: process.env.THEME,\n");
            out.push("  debug,\n");
            out.push("  RTL: process.env.RTL?.toLowerCase() == 'true',\n");
            out.push("  AppName: process.env.APP_NAME,\n");
            out.push("  language: process.env.LOCALE,\n");
            out.push("  genFolders: [global.USEGLOBAL(\"app.gen\"), USELOCAL(\"app.gen\")],\n");
            out.push("  frameworkFolder: global.USEGLOBAL(\"app.gen\"),\n");
            out.push("  directEntryTimeout: process.env.DIRECT_TIMEOUT,\n");
            out.push("    telemetry: {\n");
            out.push("    enabled: process.env.TELEMETRY_ENABLED?.toLowerCase() === 'true' ?? true,\n");
            out.push("    serviceName: process.env.TELEMETRY_SERVICE_NAME ?? 'grainjs',\n");
            out.push("    exporter: process.env.TELEMETRY_EXPORTER ?? 'file', // 'file', 'otlp' или 'console'\n");
            out.push("    options: {\n");
            out.push("      file: {\n");
            out.push("        path:\n");
            out.push("          process.env.TELEMETRY_FILE_PATH ?? USELOCAL('telemetry/traces.json'),\n");
            out.push("        writeInterval: parseInt(\n");
            out.push("          process.env.TELEMETRY_WRITE_INTERVAL ?? '1000',\n");
            out.push("          10,\n");
            out.push("        ),\n");
            out.push("      },\n");
            out.push("      otlp: {\n");
            out.push("        endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,\n");
            out.push("        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS,\n");
            out.push("      },\n");
            out.push("      console: {\n");
            out.push("        prettyPrint:\n");
            out.push("          process.env.TELEMETRY_CONSOLE_PRETTY?.toLowerCase() === 'true' ??\n");
            out.push("          true,\n");
            out.push("      },\n");
            out.push("    },\n");
            out.push("    mongodb: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_MONGODB_ENABLED?.toLowerCase() === 'true' ?? true,\n");
            out.push("      enhancedDatabaseReporting:\n");
            out.push("        process.env.TELEMETRY_MONGODB_ENHANCED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("    },\n");
            out.push("    dataloader: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_DATALOADER_ENABLED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("      enhancedReporting:\n");
            out.push("        process.env.TELEMETRY_DATALOADER_ENHANCED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("    },\n");
            out.push("    mongoose: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_MONGOOSE_ENABLED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("      enhancedDatabaseReporting:\n");
            out.push("        process.env.TELEMETRY_MONGOOSE_ENHANCED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("    },\n");
            out.push("    graphql: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_ENABLED?.toLowerCase() === 'true' ?? true,\n");
            out.push("      allowValues:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_ALLOW_VALUES?.toLowerCase() === 'true' ??\n");
            out.push("        false,\n");
            out.push("      depth: parseInt(process.env.TELEMETRY_GRAPHQL_DEPTH ?? '7', 10),\n");
            out.push("      mergeItems:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_MERGE_ITEMS?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("      ignoreTrivialResolveSpans:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_IGNORE_TRIVIAL_RESOLVE_SPANS?.toLowerCase() ===\n");
            out.push("          'true' ?? true,\n");
            out.push("    },\n");
            out.push("  },\n");
            out.push("  impersonate: {\n");
            out.push("    maxAge: parseInt(process.env.IMPERSONATE_MAX_AGE ?? '86400', 10), // default 24 hours in seconds\n");
            out.push("  },\n");
            out.push("  connections: {\n");
            out.push("    system: process.env.SYSTEM_URL,\n");
            out.push("    local: process.env.LOCAL_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    files: process.env.FILES_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    users: process.env.USERS_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    audit: process.env.AUDIT_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    transactions: process.env.TRANSACTIONS_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    session: process.env.SESSION_URL ?? process.env.SYSTEM_URL,\n");
            out.push("  },\n");
            out.push("};");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/app.dotenv.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("DEBUG_STAGE_TIMEOUT=10000\n");
            out.push("DEBUG_APP=false\n");
            out.push("NO_CLIENT_CACHE=" + (context.noClientCache) + "\n");
            out.push("NO_HEALTH_CHECK=" + (context.noHealthCheck) + "\n");
            out.push("NO_SERVER_CACHE=" + (context.noServerCache) + "\n");
            out.push("NO_TRANSLATION_TOOLS=" + (context.noTranslationTools) + "\n");
            out.push("PORT=" + (context.httpPort || 3000) + "\n");
            out.push("THEME=" + (context.theme || '') + "\n");
            out.push("DIRECT_TIMEOUT=" + (context.directEntryTimeout || 100000) + "\n");
            out.push("DIRECT_API_BUFFER=" + (context.directApiBufferTime || 0) + "\n");
            out.push("TRANSLATION=false\n");
            out.push("APP_NAME=" + (context.name) + "\n");
            out.push("RTL=" + (context.rtl) + "\n");
            out.push("LOCALE=" + (context.language) + "\n");
            out.push("SYSTEM_URL=" + (context.dbUrl) + "\n");
            out.push("LOCAL_URL=" + (context.dbUrl) + "\n");
            out.push("#COOKIE_SECRET='your secret here'\n");
            if (!context.filesDb || context.filesDb === context.dbUrl) {
                out.push("#");
            }
            out.push("FILES_URL=" + (context.filesDb ?? "") + "\n");
            if (!context.usersDb || context.usersDb === context.dbUrl) {
                out.push("#");
            }
            out.push("USERS_URL=" + (context.usersDb ?? "") + "\n");
            if (!context.auditDb || context.auditDb === context.dbUrl) {
                out.push("#");
            }
            out.push("AUDIT_URL=" + (context.auditDb ?? "") + "\n");
            if (!context.transactionsDb || context.transactionsDb === context.dbUrl) {
                out.push("#");
            }
            out.push("TRANSACTIONS_URL=" + (context.transactionsDb ?? "") + "\n");
            if (!context.sessionDb || context.sessionDb === context.dbUrl) {
                out.push("#");
            }
            out.push("SESSION_URL=" + (context.sessionDb ?? "") + "\n");
            if (context.env) {
                const env = JSON.parse(context.env);
                const envList = Object.keys(env);
                for(let i = 0; i < envList.length; i++){
                    const key = envList[i];
                    out.push("\n");
                    out.push((key) + "=" + (env[key]) + "\n");
                }
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/app.dotenv copy.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("DEBUG_STAGE_TIMEOUT=10000DEBUG_APP=falseNO_CLIENT_CACHE=" + (context.noClientCache) + "NO_HEALTH_CHECK=" + (context.noHealthCheck) + "NO_SERVER_CACHE=" + (context.noServerCache) + "NO_TRANSLATION_TOOLS=" + (context.noTranslationTools) + "PORT=" + (context.httpPort || 3000) + "THEME=" + (context.theme || '') + "DIRECT_TIMEOUT=" + (context.directEntryTimeout || 100000) + "DIRECT_API_BUFFER=" + (context.directApiBufferTime || 0) + "TRANSLATION=falseAPP_NAME=" + (context.name) + "RTL=" + (context.rtl) + "LOCALE=" + (context.language) + "SYSTEM_URL=" + (context.dbUrl) + "LOCAL_URL=" + (context.dbUrl) + "#COOKIE_SECRET='your secret here'\n");
            out.push("\n");
            if (!context.filesDb || context.filesDb === context.dbUrl) {
                out.push("\n");
                out.push("#\n");
                out.push("\n");
            }
            out.push("\n");
            out.push("FILES_URL=" + (context.filesDb ?? "") + "\n");
            out.push("\n");
            if (!context.usersDb || context.usersDb === context.dbUrl) {
                out.push("\n");
                out.push("#\n");
                out.push("\n");
            }
            out.push("\n");
            out.push("USERS_URL=" + (context.usersDb ?? "") + "\n");
            out.push("\n");
            if (!context.auditDb || context.auditDb === context.dbUrl) {
                out.push("\n");
                out.push("#\n");
                out.push("\n");
            }
            out.push("\n");
            out.push("AUDIT_URL=" + (context.auditDb ?? "") + "\n");
            out.push("\n");
            if (!context.transactionsDb || context.transactionsDb === context.dbUrl) {
                out.push("\n");
                out.push("#\n");
                out.push("\n");
            }
            out.push("\n");
            out.push("TRANSACTIONS_URL=" + (context.transactionsDb ?? "") + "\n");
            out.push("\n");
            if (!context.sessionDb || context.sessionDb === context.dbUrl) {
                out.push("\n");
                out.push("#\n");
                out.push("\n");
            }
            out.push("\n");
            out.push("SESSION_URL=" + (context.sessionDb ?? "") + "\n");
            out.push("\n");
            if (context.env) {
                const env = JSON.parse(context.env);
                const envList = Object.keys(env);
                for(let i = 0; i < envList.length; i++){
                    const key = envList[i];
                    out.push("\n");
                    out.push((key) + "=" + (env[key]) + "\n");
                    out.push("\n");
                }
            }
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    },
    ['server/Application.Config/app.config.njs']: {
        script: function(context, _content, partial, slot, options) {
            var out = [];
            out.push("global.STARTTIME = new Date();\n");
            out.push("\n");
            out.push("const debug = process.env.DEBUG_APP?.toLowerCase() == 'true'\n");
            out.push("if (debug) {\n");
            out.push("  const { Config } = require('pipeline.js')\n");
            out.push("  Config.timeout = parseInt(process.env.DEBUG_STAGE_TIMEOUT ?? '1000', 10)\n");
            out.push("}\n");
            out.push("\n");
            out.push("global.SERVERCONFIG =\n");
            out.push("exports.config = {\n");
            out.push("  ssl: process.env.SSL?.toLowerCase() == 'true',\n");
            out.push("  sslConfig: {\n");
            out.push("    key: process.env.SSL_KEY_PATH || USELOCAL('./ssl/server.key'),\n");
            out.push("    cert: process.env.SSL_CERT_PATH || USELOCAL('./ssl/server.crt'),\n");
            out.push("  },\n");
            out.push("  enableGraphQL: process.env.ENABLE_GRAPHQL?.toLowerCase() == 'true',\n");
            out.push("  dbConnectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '1000', 10),\n");
            out.push("  sessionTimeout: parseInt(process.env.SESSION_CONNECTION_TIMEOUT ?? '1000', 10),\n");
            out.push("  noClientCache: process.env.NO_CLIENT_CACHE?.toLowerCase() == 'true',\n");
            out.push("  noHealthCheck: process.env.NO_HEALTH_CHECK?.toLowerCase() == 'true',\n");
            out.push("  noServerCache: process.env.NO_SERVER_CACHE?.toLowerCase() == 'true',\n");
            out.push("  noTranslationTools: process.env.NO_TRANSLATION_TOOLS?.toLowerCase() == 'true',\n");
            out.push("  theme: process.env.THEME,\n");
            out.push("  debug,\n");
            out.push("  RTL: process.env.RTL?.toLowerCase() == 'true',\n");
            out.push("  AppName: process.env.APP_NAME,\n");
            out.push("  language: process.env.LOCALE,\n");
            out.push("  genFolders: [global.USEGLOBAL(\"app.gen\"), USELOCAL(\"app.gen\")],\n");
            out.push("  frameworkFolder: global.USEGLOBAL(\"app.gen\"),\n");
            out.push("  directEntryTimeout: process.env.DIRECT_TIMEOUT,\n");
            out.push("    telemetry: {\n");
            out.push("    enabled: process.env.TELEMETRY_ENABLED?.toLowerCase() === 'true' ?? true,\n");
            out.push("    serviceName: process.env.TELEMETRY_SERVICE_NAME ?? 'grainjs',\n");
            out.push("    exporter: process.env.TELEMETRY_EXPORTER ?? 'file', // 'file', 'otlp' или 'console'\n");
            out.push("    options: {\n");
            out.push("      file: {\n");
            out.push("        path:\n");
            out.push("          process.env.TELEMETRY_FILE_PATH ?? USELOCAL('telemetry/traces.json'),\n");
            out.push("        writeInterval: parseInt(\n");
            out.push("          process.env.TELEMETRY_WRITE_INTERVAL ?? '1000',\n");
            out.push("          10,\n");
            out.push("        ),\n");
            out.push("      },\n");
            out.push("      otlp: {\n");
            out.push("        endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,\n");
            out.push("        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS,\n");
            out.push("      },\n");
            out.push("      console: {\n");
            out.push("        prettyPrint:\n");
            out.push("          process.env.TELEMETRY_CONSOLE_PRETTY?.toLowerCase() === 'true' ??\n");
            out.push("          true,\n");
            out.push("      },\n");
            out.push("    },\n");
            out.push("    mongodb: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_MONGODB_ENABLED?.toLowerCase() === 'true' ?? true,\n");
            out.push("      enhancedDatabaseReporting:\n");
            out.push("        process.env.TELEMETRY_MONGODB_ENHANCED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("    },\n");
            out.push("    dataloader: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_DATALOADER_ENABLED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("      enhancedReporting:\n");
            out.push("        process.env.TELEMETRY_DATALOADER_ENHANCED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("    },\n");
            out.push("    mongoose: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_MONGOOSE_ENABLED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("      enhancedDatabaseReporting:\n");
            out.push("        process.env.TELEMETRY_MONGOOSE_ENHANCED?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("    },\n");
            out.push("    graphql: {\n");
            out.push("      enabled:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_ENABLED?.toLowerCase() === 'true' ?? true,\n");
            out.push("      allowValues:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_ALLOW_VALUES?.toLowerCase() === 'true' ??\n");
            out.push("        false,\n");
            out.push("      depth: parseInt(process.env.TELEMETRY_GRAPHQL_DEPTH ?? '7', 10),\n");
            out.push("      mergeItems:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_MERGE_ITEMS?.toLowerCase() === 'true' ??\n");
            out.push("        true,\n");
            out.push("      ignoreTrivialResolveSpans:\n");
            out.push("        process.env.TELEMETRY_GRAPHQL_IGNORE_TRIVIAL_RESOLVE_SPANS?.toLowerCase() ===\n");
            out.push("          'true' ?? true,\n");
            out.push("    },\n");
            out.push("  },\n");
            out.push("  impersonate: {\n");
            out.push("    maxAge: parseInt(process.env.IMPERSONATE_MAX_AGE ?? '86400', 10), // default 24 hours in seconds\n");
            out.push("  },\n");
            out.push("  connections: {\n");
            out.push("    system: process.env.SYSTEM_URL,\n");
            out.push("    local: process.env.LOCAL_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    files: process.env.FILES_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    users: process.env.USERS_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    audit: process.env.AUDIT_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    transactions: process.env.TRANSACTIONS_URL ?? process.env.SYSTEM_URL,\n");
            out.push("    session: process.env.SESSION_URL ?? process.env.SYSTEM_URL,\n");
            out.push("  },\n");
            out.push("};");
            return out.join('');
        },
        compile: function() {},
        dependency: {}
    }
};
exports.templates = templates;
const F = new Factory(templates);
function run(context, name) {
    return F.run(context, name);
}
exports.run = run;

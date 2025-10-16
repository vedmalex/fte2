module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("Ext.define('Modeleditor.controller." + (context.$namespace) + "." + (context.$name) + "', {\n");
        out.push("  serverModel: '" + (context.$namespace) + "." + (context.$name) + "',\n");
        out.push("  extend: 'Ext.app.Controller',\n");
        out.push("  req_controllers:[");
        let ctnrs = [];
        if (context.controllers) {
            let cname = context.namespace + '.' + context.name;
            ctnrs = context.controllers.filter(function(c) {
                return c != cname;
            });
            for(let i = 0; i < ctnrs.length; i++){
                out.push("\n");
                out.push("      \"" + (ctnrs[i]) + "\"");
                if (i < ctnrs.length - 1) {
                    out.push(",");
                }
            }
        }
        out.push("]," + "  views:[");
        for(let i = 0; i < context.prop?.view?.length ?? 0; i++){
            out.push("\n");
            out.push("    '" + (context.prop.view[i]) + "'");
            if (i != context.prop.view.length - 1) {
                out.push(",");
            }
        }
        out.push("\n");
        out.push("  ],\n");
        out.push("  models: [");
        for(let i = 0; i < context.prop?.model?.length ?? 0; i++){
            out.push("\n");
            out.push("    '" + (context.prop.model[i]) + "'");
            if (i != context.prop.model.length - 1) {
                out.push(",");
            }
        }
        out.push("\n");
        out.push("  ],\n");
        out.push("  stores: [");
        for(let i = 0; i < context.prop?.store?.length ?? 0; i++){
            out.push("\n");
            out.push("    '" + (context.prop.store[i]) + "'");
            if (i != context.prop.store.length - 1) {
                out.push(",");
            }
        }
        out.push("\n");
        out.push("  ],\n");
        out.push("  initStarted:false,\n");
        out.push("\n");
        out.push("  init: function(){\n");
        out.push("    if(!this.initStarted){\n");
        out.push("      this.initStarted = true;\n");
        out.push("      let me = this;\n");
        out.push("      DirectCacheLogger.userStories('Controller Init', { controllerName: '" + (context.$namespace) + "." + (context.$name) + "' });");
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
            out.push("      });");
        } else {
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
                    out.push("                " + (hashSelector[selector][i]) + ",");
                }
                out.push("\n");
                out.push("            },");
            }
        }
        out.push("\n");
        out.push("      });\n");
        out.push("    }\n");
        out.push("  },");
        if (context.clientMethods) {
            let methods = context.clientMethods.filter(function(m) {
                return m.type != 'model' && m.type != 'constructor';
            });
            for(let i = 0; i < methods.length; i++){
                let clMethod = methods[i];
                if (!clMethod.disable) {
                    out.push("\n");
                    out.push("  " + (clMethod.name) + ": Grainjs.metadata['metaclientmethods." + (context.$namespace) + "." + (context.$name) + "'].methods['" + (clMethod.name) + "'],");
                }
            }
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
            }
            out.push("\n");
            out.push("  /*end state machine definition*/");
        }
        out.push("\n");
        out.push("});");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.controller.njs.js.map
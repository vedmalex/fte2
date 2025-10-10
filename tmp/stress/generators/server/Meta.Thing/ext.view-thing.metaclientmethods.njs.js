module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
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
};

//# sourceMappingURL=generators/server/Meta.Thing/ext.view-thing.metaclientmethods.njs.js.map
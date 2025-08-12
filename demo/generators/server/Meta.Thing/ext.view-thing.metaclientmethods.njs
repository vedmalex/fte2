<#@ noContent #>
<#
  const _ = require('lodash')
  let clMeth = context.clientMethods ?? []
  let localStateMachine = context.stateMachine;
#>


// TODO:
// исправить методы для работы с состояниями, и сделать их правильными...
// нужно передавать название события, а перевод состояния тоже делать, но отдельно
// форма должна отображать события, и текущее состояние, которое должно меняться, по методу
// перенести stateMachine на клиента
Ext.define('Grainjs.metaclientmethods.#{context.$namespace}.#{context.$name}', {
  override: 'Grainjs.metadata',
  statics:{
    'metaclientmethods.#{context.$namespace}.#{context.$name}': {
      buttons: {
      <#if (localStateMachine && context.debugSM) { #>
        <# for (let i = localStateMachine.event.length - 1; i >= 0; i--) {
            let ev = localStateMachine.event[i]
        #>
        "btn_#{ev.eventName}": () => ({
          xtype: "button",
          itemId: "#{ev.eventName}",
          iconCls: _r("#{ev.eventName}", "StateMachines", "#{context.$namespace}.#{context.$name}", "state", "iconCls"),
          columnWidth: void 0,
          _order: 0,
          //
          minWidth: 160,
          text: _r("#{ev.eventName}", "#{ev.displayName}", "StateMachines", "#{context.$namespace}.#{context.$name}", "state"),
          textAlign: "left",
          toggleGroup: "state",
          name: '#{ev.eventName}',
          disabled: true,
          pressed: false,
          enableToggle: true
        }),
        <#}#>
      <#}#>
        <#
          const buttons = clMeth.filter(m=> (m.type == 'toggle' || m.type == 'button') && !m.disabled);
          for (let i = 0; i < buttons.length; i++) {
            let clientMethodCur = buttons[i];
            #>
            "#{clientMethodCur.name}": ()=>({
                xtype:'button',
                itemId:"#{clientMethodCur.name}",
                iconCls: _r(<#if(clientMethodCur.displayName){#>#{JSON.stringify(clientMethodCur.displayName)}<#}else{#>#{JSON.stringify(clientMethodCur.name)}<#}#>,'', '#{context.$namespace}.#{context.$name}', 'methods','iconCls')<#if(clientMethodCur.iconCls){#>||" #{clientMethodCur.iconCls}"<#}#>,
                columnWidth:  #{clientMethodCur.currentSettings?.columnWidth},
                _order:  #{clientMethodCur.currentSettings?.order},
                //
                minWidth: 160,
                text: _t(<#if(clientMethodCur.displayName){#>#{JSON.stringify(clientMethodCur.displayName)}<#}else{#>#{JSON.stringify(clientMethodCur.name)}<#}#>,'#{context.$namespace}.#{context.$name}','buttons',"#{clientMethodCur.name}"),
                textAlign: 'left',
                <#- if(clientMethodCur.type=='toggle'){#>
                  <#- if(!clientMethodCur.currentSettings?.showInsideForm){#>
                toggleGroup: '#{context.$widgetName}FormNavigation',
                  <#- }#>
                enableToggle: true,
                <#- } else if(clientMethodCur.type=='button'){#>
                enableToggle: false,
                <#- }#>
              }),
            <#
          }
        #>
      },
      methods: {
        <#if (localStateMachine) {
          const stateAttribute = localStateMachine.stateAttribute
        #>
          _initstates: function (record, form) {
            if (record) {
              const currentState = record.get("#{stateAttribute}")
              ret = Promisify.direct(StoredQuery, "getAvailableEvents", {
                thing: "#{context.$namespace}.#{context.$name}",
                state: currentState,
                page: 1,
                start: 0,
                limit: 25
              })
              .then(data => {
                const wnd = form.up("window");
                const list = wnd.query('button[toggleGroup=state]')
                const states = data.reduce((ret, cur)=>{
                  ret[cur.key] = _t(cur.value, "StateMachines", "#{context.$namespace}.#{context.$name}", "state")
                  return ret
                },{})

                for(const btn of list){
                  if(states[btn.name]){
                    btn.enable()
                  } else {
                    btn.disable()
                  }
                }
              })
              .catch(e => {
                console.log('_initstates for #{context.$namespace}.#{context.$name}: #{stateAttribute} ->',e)
              })
            }
          },
          <#
            for (let i = localStateMachine.event.length - 1; i >= 0; i--) {
              let ev = localStateMachine.event[i]
          #>
          "execute_#{ev.eventName}": function (btn, pressed, eOpts) {
            const wnd = btn.up("window");
            if (wnd && pressed) {
              DirectCacheLogger.userStories('State Machine Event Execute', { serverModel: '#{context.$namespace}.#{context.$name}', eventName: '#{ev.eventName}', windowId: wnd.id });
              const rec = wnd.rec;
              if (!rec.changingState) {
                rec.changingState = true;
              }
              wnd.fireEvent("commitrecord", wnd, {
                callback: function () {
                  wnd.zIndexManager.getActive();
                  var ctrl = wnd.modeleditorController.application.getController("#{context.$namespace}.#{context.$name}");
                  rec.changingState = false;
                  ctrl["fire_#{ev.eventName}"](wnd.down(), rec);
                }
              });
            }
          },
          <#}#>
        <#}#>
        <#-  const methods = clMeth.filter(m=> m.type != 'model' && m.type != 'constructor' && !m.disabled);
        for (let i = 0; i < methods.length; i++) {
          const clMethod = methods[i]
          #>
          <#- if(clMethod.comment){#>/* #{clMethod.comment} */<#}#>
            #{clMethod.name}: function(<#if(clMethod.params){#>#{clMethod.params}<#}#>){
              DirectCacheLogger.userStories('Custom Method Execute', { serverModel: '#{context.$namespace}.#{context.$name}', methodName: '#{clMethod.name}', methodType: '#{clMethod.type}' });
              #{clMethod.body}
            },
        <#- }
        #>
      }
    }
  }
})

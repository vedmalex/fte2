<#@ noContent #>
Ext.define('Modeleditor.controller.#{context.$namespace}.#{context.$name}', {
  serverModel: '#{context.$namespace}.#{context.$name}',
  extend: 'Ext.app.Controller',
  req_controllers:[
  <#-
    let ctnrs = []
    if(context.controllers){
    let cname = context.namespace+'.'+context.name;
    ctnrs = context.controllers.filter(function(c){
      return c != cname;
    });
    for (let i = 0; i< ctnrs.length; i++){
      #>
      "#{ctnrs[i]}"
    <#- if(i < ctnrs.length - 1) {-#>
    ,
    <#- }
    }
  }-#>],
  views:[
  <#-for(let i=0; i<context.prop?.view?.length ?? 0; i++){#>
    '#{context.prop.view[i]}'
    <#-if(i!=context.prop.view.length-1){-#>
    ,
    <#- }#>
  <#-}#>
  ],
  models: [
  <#-for(let i=0; i<context.prop?.model?.length ?? 0; i++){#>
    '#{context.prop.model[i]}'
    <#-if(i!=context.prop.model.length-1){-#>
    ,
    <#- }#>
  <#-}#>
  ],
  stores: [
  <#- for(let i=0; i<context.prop?.store?.length ?? 0; i++){#>
    '#{context.prop.store[i]}'
    <#-if(i!=context.prop.store.length-1){-#>
    ,
    <#-}#>
  <#-}#>
  ],
  initStarted:false,

  init: function(){
    if(!this.initStarted){
      this.initStarted = true;
      let me = this;
      DirectCacheLogger.userStories('Controller Init', { controllerName: '#{context.$namespace}.#{context.$name}' });
      <#-  if(context.requireNs && context.requireNs.length > 0){#>
      Ext.require([<#for(let i=0; i<context.requireNs.length; i++){#>
        "namespace.#{context.requireNs[i]}"<#if(i!=context.requireNs.length-1){#>,<#}}#>
      ], function() {<#ctnrs.forEach(function(contr){#>
        me.application.getController("#{contr}");<#})
      #>
      });
      <#- } else {#>
      <#- if(context.controllers){ctnrs.forEach(function(contr){#>
        me.application.getController("#{contr}");<#})}
      }#>
<#
let localStateMachine = context.stateMachine;
#>
      this.control({
<# if (localStateMachine && context.debugSM) {#>
        '#{context.$widgetName}editwindow #{context.$widgetName}edit':{
          recordloaded: {
            fn: this._initstates
          }
        },
    <#
      for (let i = localStateMachine.event.length - 1; i >= 0; i--) {
        let ev = localStateMachine.event[i]
    #>
        "#{context.$widgetName}editwindow > toolbar[type=formNavigation] > button[name=#{ev.eventName}]": {
          toggle: {
            fn: this["execute_#{ev.eventName}"]
          }
        },
    <# } #>
<# } #>
        <#
          const hashSelector = context.hashSelector

          for(let selector in hashSelector){
            if (Object.prototype.hasOwnProperty.call(hashSelector, selector)) {
            #>
            '#{selector}':{<# for (let i = 0; i < hashSelector[selector].length; i++) {#>
                #{hashSelector[selector][i]},
              <#- }#>
            },
          <#- }
          }#>
      });
    }
  },

  <#- if (context.clientMethods ) {
  let methods = context.clientMethods.filter(function(m){ return m.type != 'model' && m.type != 'constructor'})
    for (let i=0; i<methods.length; i++){
    let clMethod = methods[i];
      if(!clMethod.disable){#>
  #{clMethod.name}: Grainjs.metadata['metaclientmethods.#{context.$namespace}.#{context.$name}'].methods['#{clMethod.name}'],
      <#- }#>
    <#- }#>
  <#- }#>

  <#
    if(localStateMachine && localStateMachine.event && localStateMachine.event.length > 0){
  #>
  // init call
<# if(localStateMachine && context.debugSM) {#>
  _initstates: Grainjs.metadata['metaclientmethods.#{context.$namespace}.#{context.$name}'].methods["_initstates"],
  <#
  for (let i = localStateMachine.event.length - 1; i >= 0; i--) {
    let ev = localStateMachine.event[i]
#>
  "execute_#{ev.eventName}": Grainjs.metadata['metaclientmethods.#{context.$namespace}.#{context.$name}'].methods["execute_#{ev.eventName}"],
  <#}#>
<# } #>
/*state machine interaction section*/
    _callAction:function(self, func, args){
      DirectCacheLogger.userStories('State Machine Call Action', { serverModel: '#{context.$namespace}.#{context.$name}', functionType: typeof(func), args: args });
      if(self && func){
        switch(typeof(func)){
          case 'function':
            func.apply(self,args);
            break;
          case 'string':
            if(self[func])
              self[func](args);
            break;
          default:
            console.error('unkonwn type of func to _callAction', typeof(func));
            break;
        }
      }
    },

    _fireSMEventCallback : function(eventName, rec, wnd){
      return function (res, act) {
        console.trace('fire event: done with -> ', arguments);
        DirectCacheLogger.userStories('State Machine Event Callback', { serverModel: '#{context.$namespace}.#{context.$name}', eventName: eventName, recordId: rec.getId(), windowId: wnd?.id, success: res?.success });
        if(rec.firingEvent == eventName){
          if (wnd) {
            wnd.enable()
          }
          delete rec.firingEvent;
          const stateMachineHash = Grainjs.metadata[`model.${rec.serverModel}`].stateMachineHash
          if(res.success) {
            Ext.popup.msg(_t('Fire event ', 'SYSTEM', 'titles')+ _t(stateMachineHash.states[eventName],'#{context.$namespace}.#{context.$name}', 'events'), _t('success', 'SYSTEM', 'messages'));
          } else {
            Ext.Msg.alert(_t('Saving the Data Failed : event ', 'SYSTEM', 'titles') + _t(stateMachineHash.states[eventName],'#{context.$namespace}.#{context.$name}', 'events'), _t(res.errors.name, 'SYSTEM', 'messages') +': '+_t(res.errors.message, 'SYSTEM', 'messages'));
          }
        } else {
          throw new Error(_t('wrong callback', 'SYSTEM', 'messages'));
        }
      };
    },

    _fireSMEvent: function(srcrec, eventName, callback){
      console.trace('prepare callback for commit for ', eventName);
      DirectCacheLogger.userStories('State Machine Fire Event', { serverModel: '#{context.$namespace}.#{context.$name}', eventName: eventName, recordId: srcrec.getId() });
      let self = this;
      return function(err){
        if(err){
          if(typeof callback === 'function') callback(err)
        } else {
          console.trace('execute callback for commit for ',eventName);
          let rec = srcrec;
          function update(res, act){
            console.trace('update record with result for event',eventName);
            DirectCacheLogger.userStories('State Machine Update Record', { serverModel: '#{context.$namespace}.#{context.$name}', eventName: eventName, recordId: rec.getId(), success: res?.success });
            if(res.success){
              rec.syncRaw(res);
              rec.dirty = false;
              rec.phantom = false;
              self._callAction(rec,rec.onStateChangeSuccess,[res.#{localStateMachine.stateAttribute}]);
            } else {
              self._callAction(rec,rec.onStateChangeFailure,[rec.get('#{localStateMachine.stateAttribute}')]);
            }
            if(callback) callback.apply(self, arguments);
          }
          rec._fireSMEvent(eventName, update);
        }
      };
    },
    <#
      for (let i = localStateMachine.event.length - 1; i >= 0; i--) {
        let ev = localStateMachine.event[i]
    #>
    "fire_#{ev.eventName}": function(btn, rec){
      DirectCacheLogger.userStories('State Machine Fire Event Button', { serverModel: '#{context.$namespace}.#{context.$name}', eventName: '#{ev.eventName}', recordId: rec.getId(), buttonId: btn.id });
      if(!rec.firingEvent){
        rec.firingEvent = '#{ev.eventName}';
        console.trace('start to fire event: #{ev.eventName}');
        let wnd = btn.up('window');
        let self = this;
        wnd.fireEvent('commitrecord', wnd, {
          callback: (...args) => {
            wnd.disable()
            const call = self._fireSMEvent(rec, '#{ev.eventName}', this._fireSMEventCallback('#{ev.eventName}', rec, wnd))
            call(...args)
            setTimeout(() => {
              if (wnd.disabled) {
                wnd.enable()
              }
            }, 2000)
          },
        });
      }
    }<#if(i != 0){#>, <#}#>
    <#-     }#>
  /*end state machine definition*/
  <#- }#>
});
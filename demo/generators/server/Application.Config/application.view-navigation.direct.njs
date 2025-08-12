<#@ noContent #>
Grainjs.RegisterProfile('#{context.currentProfile.name}')

let gl = require(global.global.USEGLOBAL('/app/server/direct/global.js'))
// register profile code need to refactor
Ext.directFn({
    namespace: '#{context.name}',
    name: 'read#{context.name}#{context.currentProfile.name}Navigation',
    locationType: 'system',
    body: function (para) {
      para.appName = '#{context.name}'
      para.profileName = '#{context.currentProfile.name}'
      gl.readAppNavigation(para, this)
    },
  })
  

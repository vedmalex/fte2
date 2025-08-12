<#@ noContent #>
{
  "name": "#{context.name}",
  "version": "0.0.1",
  "description": "grainjs application bundle for '#{context.name}'",
  "main": "start.js",
  "dependencies": {
<#-
let modules = context.modules.toArray()
let len = modules.length ?? 0;
for (let i = 0; i < len; i++) {
  let module = modules[i]
-#>
  "#{module.name}":"#{ module.version ? module.version : '*'}"
  <#- if( i != len-1){#>,<#}#>
<#-}#>
  },
  "scripts": {
    "start": "node start.js",
    "debug": "DEBUG=* node start.js"
    }
}

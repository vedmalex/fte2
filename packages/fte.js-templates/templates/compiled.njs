<#@ alias 'compiled.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
<# const coreResult = partial(context, 'core') #>
<# if (typeof coreResult === 'string') { #>
const core: any = #{coreResult} as any;
<# } else if (coreResult && typeof coreResult === 'object' && 'code' in coreResult) { #>
const core: any = #{JSON.stringify(coreResult, null, 2)} as any;
<# } else { #>
const core: any = '[object Object]' as any;
<# } #>
if (typeof core === 'string') {
  return "module.exports = " + core + ";";
} else {
  return {
    code: "module.exports = " + core.code + ";",
    map: core.map
  };
}

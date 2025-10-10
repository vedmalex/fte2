<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
<# const coreResult = partial(context, 'core') #>
<# if (typeof coreResult === 'string') { #>
const core: any = #{coreResult} as any;
<# } else { #>
const core: any = #{JSON.stringify(coreResult, null, 2)} as any;
<# } #>
if (typeof core === 'string') {
  return "export default " + core + ";";
} else {
  return {
    code: "export default " + core.code + ";",
    map: core.map
  };
}

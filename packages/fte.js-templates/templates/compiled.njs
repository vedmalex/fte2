<#@ alias 'compiled.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
const core: any = #{partial(context, 'core')} as any;
if (typeof core === 'string') {
  return "module.exports = " + core + ";";
} else {
  return {
    code: "module.exports = " + core.code + ";",
    map: core.map
  };
}

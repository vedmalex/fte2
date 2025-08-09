<#@ alias 'raw.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.njs','core') #>
const core: any = #{partial(context, 'core')} as any;
if (typeof core === 'string') {
  return "(function(){\n  return " + core + ";\n})();";
} else {
  return {
    code: "(function(){\n  return " + core.code + ";\n})();",
    map: core.map
  };
}
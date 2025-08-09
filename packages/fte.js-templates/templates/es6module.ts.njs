<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.ts.njs','core') #>
import { TemplateBase } from 'fte.js-base'

const core: any = #{partial(context, 'core')} as any;
if (typeof core === 'string') {
  return "export default " + core + ";";
} else {
  return {
    code: "export default " + core.code + ";",
    map: core.map
  };
}

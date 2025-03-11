<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.ts.njs','core') #>
import { TemplateBase } from 'fte.js-base'

export default #{partial(context, 'core')};

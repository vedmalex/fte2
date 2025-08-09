<#@ alias 'es6module.njs' #>
<#@ noContent #>
<#@ requireAs ('MainTemplate.ts.njs','core') #>
import { TemplateBase } from 'fte.js-base'

export default #{(() => { const __core = partial(context, 'core'); return typeof __core === 'string' ? __core : __core.code })()};

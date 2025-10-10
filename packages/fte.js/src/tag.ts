import { F } from './compile'
import { compileFull } from './compileFull'
import { safeEval } from './safeEval'

/**
 * Tagged template helper for inline fte templates.
 * Usage: const tpl = fte`<#@ context 'data' #>Hello #{data.name}`; tpl({ name: 'World' })
 */
export function fte(strings: TemplateStringsArray, ...values: unknown[]) {
  // Reconstruct the template text from the template literal
  let source = ''
  for (let i = 0; i < strings.length; i += 1) {
    source += strings[i]
    if (i < values.length) {
      source += String(values[i] ?? '')
    }
  }

  // Compile to CommonJS module code and evaluate once
  const compiled = compileFull(source, false)
  const code = typeof compiled === 'string' ? compiled : compiled.code
  const templateConfig = safeEval(code)

  return function render<TContext = any>(
    context?: TContext,
    options?: any,
  ): string {
    const noop = () => ''
    return templateConfig.script(
      context ?? ({} as TContext),
      noop as any,
      noop as any,
      noop as any,
      { ...F.options, ...(options ?? {}) } as any,
    ) as string
  }
}

export default fte

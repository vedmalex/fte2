import { TemplateFactoryStandalone } from 'fte.js-standalone'
import templates from 'fte.js-templates'
import { inferTypesInSource } from '../inferer/type-infer'

export type GeneratedContextTypes = {
  tsInterface: string
  jsTypedef: string
  name: string
}

function buildAnalysisCode(template: any): string {
  const F = new TemplateFactoryStandalone(templates as any)
  const parts: string[] = []
  try {
    // main
    const mainRes: any = F.run(template.main, 'codeblock.njs')
    const mainCode = typeof mainRes === 'string' ? mainRes : mainRes?.code
    if (mainCode) parts.push(String(mainCode))
    // blocks
    const blocks = template?.blocks
      ? (Object.values(template.blocks) as any[])
      : []
    for (const b of blocks) {
      const bres: any = F.run((b as any).main, 'codeblock.njs')
      const bcode = typeof bres === 'string' ? bres : bres?.code
      if (bcode) parts.push(String(bcode))
    }
    // slots
    const slots = template?.slots
      ? (Object.values(template.slots) as any[])
      : []
    for (const s of slots) {
      const sres: any = F.run((s as any).main, 'codeblock.njs')
      const scode = typeof sres === 'string' ? sres : sres?.code
      if (scode) parts.push(String(scode))
    }
  } catch {
    // ignore
  }
  return parts.join('\n')
}

export function generateContextTypes(template: any): GeneratedContextTypes {
  const name =
    (template?.name || 'Template').replace(/[^A-Za-z0-9_]/g, '_') + '_Context'
  const code = buildAnalysisCode(template)
  const fields = new Set<string>()
  const types: Record<string, string> = {}
  if (code && code.trim().length) {
    const inferred = inferTypesInSource(code, [
      'out',
      'options',
      'Array',
      'Object',
    ]).variables
    Object.keys(inferred).forEach((k) => {
      fields.add(k)
      types[k] = inferred[k] || 'any'
    })
  }

  const entries = Array.from(fields)
    .sort()
    .map((k) => `  ${JSON.stringify(k)}: ${types[k] || 'any'}`)
  const tsInterface = entries.length
    ? `interface ${name} {\n${entries.join('\n')}\n}`
    : `interface ${name} {}`
  const jsTypedef = entries.length
    ? `/**\n * @typedef {object} ${name}\n${Array.from(fields)
        .sort()
        .map((k) => ` * @property {${types[k] || '*'}} ${k}`)
        .join('\n')}\n */`
    : `/**\n * @typedef {object} ${name}\n */`
  return { tsInterface, jsTypedef, name }
}

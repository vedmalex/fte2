type HostLanguage = 'html' | 'markdown' | 'javascript' | 'typescript'

type DualExtractionOptions = {
  hostLanguage?: HostLanguage
  instructionLanguage?: 'javascript' | 'typescript'
}

function getHostAdapter(host: HostLanguage | undefined) {
  const resolved = host || 'html'
  if (resolved === 'html' || resolved === 'markdown') {
    return { commentStart: '<!--', commentEnd: '-->', stringQuote: '"' }
  }
  // default to JS/TS style comments
  return { commentStart: '/*', commentEnd: '*/', stringQuote: '"' }
}

function escapeForStringLiteral(text: string, quote: string) {
  const q = quote || '"'
  return text
    .replace(/\\/g, '\\\\')
    .replace(
      new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\\\$&'), 'g'),
      `\\${q}`,
    )
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
}

export function extractTemplateCodeView(
  originalText: string,
  ast: any,
  options: DualExtractionOptions = {},
): { code: string } {
  const tokens: any[] = Array.isArray(ast?.tokens) ? ast.tokens : []
  if (!tokens.length) return { code: originalText }
  const { commentStart, commentEnd } = getHostAdapter(
    options.hostLanguage || 'html',
  )
  const PLACEHOLDER = '⟦expr⟧'
  const out: string[] = []
  for (const t of tokens) {
    const raw = (t.start || '') + (t.content || '') + (t.end || '')
    switch (t.type) {
      case 'text': {
        out.push(raw)
        if (t.eol) out.push('\n')
        break
      }
      case 'expression': {
        out.push(PLACEHOLDER)
        if (t.eol) out.push('\n')
        break
      }
      case 'directive':
      case 'code':
      case 'blockStart':
      case 'blockEnd':
      case 'slotStart':
      case 'comments': {
        out.push(`${commentStart} ${raw.trim()} ${commentEnd}`)
        if (t.eol) out.push('\n')
        break
      }
      default: {
        out.push(raw)
        if (t.eol) out.push('\n')
        break
      }
    }
  }
  return { code: out.join('') }
}

export function extractInstructionCodeView(
  originalText: string,
  ast: any,
  options: DualExtractionOptions = {},
): { code: string } {
  const tokens: any[] = Array.isArray(ast?.tokens) ? ast.tokens : []
  if (!tokens.length) return { code: '' }
  const quote = getHostAdapter(
    options.hostLanguage === 'typescript'
      ? 'javascript'
      : options.hostLanguage || 'javascript',
  ).stringQuote
  const out: string[] = []
  for (const t of tokens) {
    const raw = (t.start || '') + (t.content || '') + (t.end || '')
    if (t.type === 'text') {
      const text = t.content + (t.eol ? '\n' : '')
      out.push(`${quote}${escapeForStringLiteral(text || '', quote)}${quote}`)
      continue
    }
    if (t.type === 'expression') {
      const inner = String(t.content || '').trim()
      out.push(`(${inner})`)
      continue
    }
    if (t.type === 'code') {
      const inner = String(t.content || '').trim()
      if (inner) out.push(inner)
      continue
    }
    if (
      t.type === 'directive' ||
      t.type === 'blockStart' ||
      t.type === 'blockEnd' ||
      t.type === 'slotStart' ||
      t.type === 'comments'
    ) {
      out.push(`/* ${raw.trim()} */`)
      continue
    }
    out.push(raw)
  }
  return { code: out.join('\n') }
}

import { describe, expect, test } from 'vitest'

describe('semantic tokens', () => {
  test('cover delimiters and keywords', () => {
    const { buildSemanticTokensFromText } = require('../out/semanticTokens.js')
    const sample = [
      "<#@ context 'data' #>",
      "<# block 'main' : #>",
      '  #{ data.title }',
      '<# end #>',
    ].join('\n')
    const tokens = buildSemanticTokensFromText(sample)
    expect(Array.isArray(tokens)).toBe(true)
    const types = new Set(tokens.map((t) => t.type))
    expect(types.has('operator')).toBe(true)
    // blockStart should mark 'block' keyword
    expect(types.has('keyword') || types.has('macro')).toBe(true)
  })

  test('highlights trimmed code tags and control keywords', () => {
    const { buildSemanticTokensFromText } = require('../out/semanticTokens.js')
    const sample = [
      "<#@ lang js #>",
      "<#@ noContent #>",
      "<#- if(context.body){ -#>",
      "(#{context.params?context.params:''})=>{",
      '    #{context.body}',
      '}',
      '<#-}#>',
    ].join('\n')
    const tokens = buildSemanticTokensFromText(sample)
    expect(tokens.some((t) => t.type === 'operator' && t.line === 2 && t.char === 0)).toBe(true)
    expect(tokens.some((t) => t.type === 'operator' && t.line === 2 && t.char >= sample.split('\n')[2].length - 3)).toBe(true)
    expect(tokens.some((t) => t.type === 'keyword' && t.line === 2)).toBe(true)
  })
})

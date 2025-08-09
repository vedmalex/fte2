import { escapeIt, applyIndent, applyDeindent } from '..'

describe('fte.js-base utils', () => {
  test('escapeIt escapes HTML characters', () => {
    expect(escapeIt('&<>"')).toBe('&amp;&lt;&gt;&quot;')
    expect(escapeIt('plain')).toBe('plain')
    expect(escapeIt(null as any)).toBe('')
  })

  test('applyIndent works for string and array', () => {
    expect(applyIndent('a\nb', 2)).toBe('  a\n  b')
    expect(applyIndent(['x', 'y'], 2)).toEqual(['  x', '  y'])
    expect(applyIndent('a\nb', '>>')).toBe('>>a\n>>b')
  })

  test('applyDeindent removes common indentation (auto by first non-empty line)', () => {
    const text = '  a\n    b\n  c'
    // Pass a non-zero value to trigger auto-detection by first non-empty line
    expect(applyDeindent(text, 1)).toBe('a\n  b\nc')
    expect(applyDeindent(['  a', '    b', '  c'], 1)).toEqual(['a', '  b', 'c'])
    // String argument treated as its length but still only spaces are removed
    expect(applyDeindent('  a\n  b', '  ')).toBe('a\nb')
  })
})

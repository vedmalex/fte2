import { describe, expect, test } from 'vitest'
import { format } from '../index'

describe('fte.js-formatter embedded JS formatting', () => {
  test('formats ternary expression inside #{...}', () => {
    const input = 'Status: #{condition?foo:bar}\n'
    const output = format(input)
    expect(output).toBe('Status: #{condition ? foo : bar}\n')
  })

  test('formats unescaped <%= ... %> as JS expression', () => {
    const input = '<%=items.filter(i=>i.active).map(i=>i.name).join(",")%>\n'
    const output = format(input)
    expect(output).toBe(
      '<%=items.filter(i => i.active).map(i => i.name).join(",")%>\n',
    )
  })

  test('formats <# ... #> code block as JS', () => {
    const input = '<# if(x){return foo}else{ return bar } #>\n'
    const output = format(input)
    expect(output).toBe(
      '<# if (x) {\n  return foo;\n} else {\n  return bar;\n} #>\n',
    )
  })
})

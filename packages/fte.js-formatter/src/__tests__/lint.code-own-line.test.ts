import { describe, expect, test } from 'vitest'
import { format, lint } from '../index'

describe('code tags own line', () => {
  test('lint warns when code tag has neighbors', () => {
    const src = 'a <% const x=1 %> b\n'
    const issues = lint(src)
    expect(issues.find((i) => i.ruleId === 'code-on-own-line')).toBeTruthy()
  })

  test('format splits code onto its own line', () => {
    const src = 'a <% const x=1 %> b\n'
    const out = format(src)
    expect(out).toBe(['a', '<% const x = 1; %>', 'b', ''].join('\n'))
  })
})

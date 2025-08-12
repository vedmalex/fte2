import { lint, format } from '../index'

describe('comments own line (no inline)', () => {
  test('lint warns when <* or *> inline with other content', () => {
    const src = 'text <* comment *> more\n'
    const issues = lint(src)
    expect(issues.find(i => i.ruleId === 'comment-on-own-line')).toBeTruthy()
  })

  test('format splits comment markers to own lines', () => {
    const src = 'before <* some comment *> after\n'
    const out = format(src)
    expect(out).toBe(['before', '<* some comment *>', 'after', ''].join('\n'))
  })
})

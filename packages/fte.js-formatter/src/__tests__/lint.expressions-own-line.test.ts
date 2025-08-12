import { lint, format } from '../index'

describe('expression and unescaped expression own line (if chosen)', () => {
  test('format splits <%- %> and <%= %> when neighbors exist', () => {
    const src = 'a <%= expr %> b <%- raw %> c\n'
    const out = format(src)
    expect(out).toBe(['a', '<%= expr %>', 'b', '<%- raw %>', 'c', ''].join('\n'))
  })

  test('lint warns when multiple constructs including expressions appear on one line', () => {
    const src = 'x <%= e %> <%- r %> y\n'
    const issues = lint(src)
    expect(issues.find(i => i.ruleId === 'one-construct-per-line')).toBeTruthy()
  })
})

import { format, lint } from '../index'

describe('fte.js-formatter blocks/slots and end rules', () => {
  test('splits block declaration to its own line', () => {
    const input = 'before <# block main : #> after\n'
    const out = format(input)
    expect(out).toBe('before\n<# block main : #>\n  after\n')

    const issues = lint('before <# block main : #> after\n')
    expect(issues.find(i => i.ruleId === 'block-or-slot-on-own-line')).toBeTruthy()
  })

  test('splits slot declaration to its own line', () => {
    const input = 'a <# slot header : #> b\n'
    const out = format(input)
    expect(out).toBe('a\n<# slot header : #>\n  b\n')
  })

  test('splits end to its own line', () => {
    const input = 'x <# end #> y\n'
    const out = format(input)
    expect(out).toBe('x\n<# end #>\ny\n')

    const issues = lint('x <# end #> y\n')
    expect(issues.find(i => i.ruleId === 'end-on-own-line')).toBeTruthy()
  })
})

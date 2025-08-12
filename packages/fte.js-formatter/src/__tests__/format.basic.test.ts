import { format, lint } from '../index'

describe('fte.js-formatter basic', () => {
  test('trims trailing spaces and adds final newline', () => {
    const input = '<div>  \n</div>\n' + 'line with space   \n' + 'last line without newline'
    const expected = '<div>\n</div>\n' + 'line with space\n' + 'last line without newline\n'
    expect(format(input)).toBe(expected)
  })

  test('moves directive to its own line', () => {
    const input = 'before <#@ context("x") #> after\n'
    const out = format(input)
    expect(out).toBe('before\n<#@ context("x") #>\nafter\n')

    const issues = lint('before <#@ context("x") #> after\n')
    expect(issues.find(i => i.ruleId === 'directive-on-own-line')).toBeTruthy()
  })
})

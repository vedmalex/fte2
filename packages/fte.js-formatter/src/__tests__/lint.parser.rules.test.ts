import { describe, expect, test } from 'vitest'
import { lint } from '../index'

describe('fte.js-formatter linter with parser rules', () => {
  test('no nested blocks inside block', () => {
    const input = [
      '<# block outer : #>',
      '<# block inner : #>',
      '<# end #>',
      '<# end #>',
      '',
    ].join('\n')

    const issues = lint(input)
    expect(issues.find((i) => i.ruleId === 'no-nested-blocks')).toBeTruthy()
  })
})

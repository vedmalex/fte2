import { describe, expect, test } from 'vitest'
import { lint } from '../index'

describe('empty constructs', () => {
  test('flags empty expression', () => {
    const issues = lint('Hello #{} world\n')
    expect(issues.find((i) => i.ruleId === 'no-empty-expression')).toBeTruthy()
  })

  test('flags empty code tags', () => {
    const issues1 = lint('<% %>\n')
    expect(issues1.find((i) => i.ruleId === 'no-empty-code')).toBeTruthy()

    const issues2 = lint('<# #>\n')
    expect(issues2.find((i) => i.ruleId === 'no-empty-code')).toBeTruthy()
  })
})

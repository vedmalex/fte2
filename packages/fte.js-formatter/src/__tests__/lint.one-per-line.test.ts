import { describe, expect, test } from 'vitest'
import { format, lint } from '../index'

describe('one construct per line', () => {
  test('lint warns on multiple constructs per line', () => {
    const src = '<#@ context("x") #> <# block a : #> text <# end #>\n'
    const issues = lint(src)
    expect(
      issues.find((i) => i.ruleId === 'one-construct-per-line'),
    ).toBeTruthy()
  })

  test('format splits multiple constructs onto separate lines', () => {
    const src = '<#@ context("x") #> <# block a : #> x <# end #>\n'
    const out = format(src)
    expect(out).toBe(
      ['<#@ context("x") #>', '<# block a : #>', '  x', '<# end #>', ''].join(
        '\n',
      ),
    )
  })
})

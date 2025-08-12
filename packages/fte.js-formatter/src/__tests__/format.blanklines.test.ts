import { format } from '../index'

describe('blank lines normalization', () => {
  test('collapses multiple blank lines to single', () => {
    const input = ['line1', '', '', 'line2', '', '', '', 'line3', ''].join('\n')
    const out = format(input)
    expect(out).toBe(['line1', '', 'line2', '', 'line3', ''].join('\n'))
  })
})

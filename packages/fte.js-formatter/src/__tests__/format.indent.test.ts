import { format } from '../index'

describe('indentation formatting', () => {
  test('indents code tags and content inside a single block (no nested blocks)', () => {
    const input = [
      '<# block main : #>',
      '<# const x = 1; #>',
      'text',
      '<# end #>',
      ''
    ].join('\n')

    const out = format(input)
    expect(out).toBe([
      '<# block main : #>',
      '  <# const x = 1; #>',
      '  text',
      '<# end #>',
      ''
    ].join('\n'))
  })
})

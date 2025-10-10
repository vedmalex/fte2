import { describe, expect, test } from 'vitest'

const { format } = require('fte.js-formatter')
const { formatText } = require('../out/adapters/format.js')

describe('Formatter adapter', () => {
  test('delegates to fte.js-formatter for document formatting', () => {
    const input = `<#@ context 'data' #>
<div>
  Hello #{ data.name }!
</div>`

    const adapterResult = formatText(input, { indentSize: 4 })
    const libraryResult = format(input, { indent: 4 })
    expect(adapterResult).toBe(libraryResult)
  })

  test('respects indentSize option passed from VS Code', () => {
    const input = `<# if (ok) { #>
<# block 'name' : #>
Content
<# end #>
<# } #>`

    const twoSpaces = formatText(input, { indentSize: 2 })
    const fourSpaces = formatText(input, { indentSize: 4 })
    expect(twoSpaces).toBe(format(input, { indent: 2 }))
    expect(fourSpaces).toBe(format(input, { indent: 4 }))
  })
})

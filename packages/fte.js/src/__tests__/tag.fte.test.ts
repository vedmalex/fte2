import { fte } from '../index'

describe('fte tagged template', () => {
  it('renders simple inline template', () => {
    const tpl = fte`<#@ context 'd' #>Hello #{d.name}`
    const out = tpl({ name: 'World' })
    expect(out).toBe('Hello World')
  })

  it('supports multiple renders with same compiled function', () => {
    const tpl = fte`<#@ context 'd' #>Hi #{d.name}!`
    expect(tpl({ name: 'A' })).toBe('Hi A!')
    expect(tpl({ name: 'B' })).toBe('Hi B!')
  })

  it('allows overriding options per call', () => {
    const tpl = fte`<#@ context 'd' #>#{d.value}`
    const out = tpl({ value: '<b>x</b>' }, { escapeIt: (s: string) => s })
    // raw pass-through check
    expect(out).toBe('<b>x</b>')
  })
})

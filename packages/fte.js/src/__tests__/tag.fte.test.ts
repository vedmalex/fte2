import { describe, expect, test } from 'vitest'
import { fte } from '../index'

describe('fte tagged template', () => {
  test('renders simple inline template', () => {
    const tpl = fte`<#@ context 'd' #>Hello #{d.name}`
    const out = tpl({ name: 'World' })
    expect(out).toBe('Hello World')
  })

  test('supports multiple renders with same compiled function', () => {
    const tpl = fte`<#@ context 'd' #>Hi #{d.name}!`
    expect(tpl({ name: 'A' })).toBe('Hi A!')
    expect(tpl({ name: 'B' })).toBe('Hi B!')
  })

  test('allows overriding options per call', () => {
    const tpl = fte`<#@ context 'd' #>#{d.value}`
    const out = tpl({ value: '<b>x</b>' }, { escapeIt: (s: string) => s })
    // raw pass-through check
    expect(out).toBe('<b>x</b>')
  })

  test('handles complex expression with conditional <#- blocks', () => {
    const tpl = fte`<#@ context 'ctx' #>"#{ctx.rel.to}#{ctx.variant !== "*" ? ctx.rel.relName.split('.').join('') : ''}"`

    // Test case 1: variant !== "*" (condition true)
    const out1 = tpl({
      rel: { to: 'User', relName: 'posts.author' },
      variant: 'detail'
    })
    expect(out1).toBe('"Userpostsauthor"')

    // Test case 2: variant === "*" (condition false)
    const out2 = tpl({
      rel: { to: 'User', relName: 'posts.author' },
      variant: '*'
    })
    expect(out2).toBe('"User"')

    // Test case 3: different data
    const out3 = tpl({
      rel: { to: 'Post', relName: 'author.profile.settings' },
      variant: 'list'
    })
    expect(out3).toBe('"Postauthorprofilesettings"')

    // Test case 4: no dots in relName
    const out4 = tpl({
      rel: { to: 'Comment', relName: 'text' },
      variant: 'card'
    })
    expect(out4).toBe('"Commenttext"')
  })

  test('handles multiline complex expression with conditional <#- blocks', () => {
    const tpl = fte`<#@ context 'ctx' #>"#{ctx.rel.to}
        <#- if(ctx.variant!== "*"){ -#>
          #{ctx.rel.relName.split('.').join('')}
        <#-}#>"`

    // Test case 1: variant !== "*" (condition true)
    const out1 = tpl({
      rel: { to: 'User', relName: 'posts.author' },
      variant: 'detail'
    })
    expect(out1).toBe('"Userpostsauthor"')

    // Test case 2: variant === "*" (condition false)
    const out2 = tpl({
      rel: { to: 'User', relName: 'posts.author' },
      variant: '*'
    })
    expect(out2).toBe('"User"')
  })
})

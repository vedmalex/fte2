import { describe, expect, test } from 'vitest'
import { compileFull } from '../compileFull'
import { compileLight } from '../compileLight'
import { compileTs } from '../compileTs'

const templateSrc = 'Hello {{= name }}'

describe('Standalone compile APIs', () => {
  test('compileFull returns code string or {code,map}', () => {
    const res: any = compileFull(templateSrc, 't.njs', '/root', true, true)
    expect(typeof res === 'string' || typeof res.code === 'string').toBeTruthy()
  })

  test('compileLight returns code string', () => {
    const res: any = compileLight(templateSrc)
    expect(typeof res === 'string').toBeTruthy()
  })

  test('compileTs returns TS module string', () => {
    const res: any = compileTs(templateSrc)
    expect(typeof res).toBe('string')
    expect(res).toContain('export default')
  })
})

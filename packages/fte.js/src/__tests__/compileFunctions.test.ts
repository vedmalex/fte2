import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const factoryRun = vi.fn()
  return {
    parse: vi.fn(),
    run: vi.fn(),
    prepare: vi.fn(),
    factoryRun,
    factory: { options: {}, run: factoryRun },
  }
})

vi.mock('fte.js-parser', () => ({
  Parser: {
    parse: mocks.parse,
  },
}))

vi.mock('../run', () => ({
  run: mocks.run,
}))

vi.mock('../prepareCode', () => ({
  prepareCode: mocks.prepare,
}))

vi.mock('../compile', () => ({
  F: mocks.factory,
}))

import { compileFull } from '../compileFull'
import { compileLight } from '../compileLight'
import { compileTs } from '../compileTs'

describe('compile functions', () => {
  beforeEach(() => {
    mocks.parse.mockReset()
    mocks.run.mockReset()
    mocks.prepare.mockReset()
    mocks.factoryRun.mockReset()
    mocks.factory.options = { preserved: true }
    mocks.prepare.mockImplementation((source: string) => `optimized:${source}`)
  })

  it('compileFull parses template with sourcemap options and runs compiled.njs once', () => {
    const compiled = { main: 'view' }
    const buffer = Buffer.from('<div />')
    mocks.parse.mockReturnValueOnce(compiled)
    mocks.run.mockReturnValueOnce('generated')

    const result = compileFull(buffer, false, 'view.nhtml', '/src/views', false, true)

    expect(mocks.parse).toHaveBeenCalledTimes(1)
    expect(mocks.parse).toHaveBeenCalledWith('<div />', {
      sourceMap: true,
      sourceFile: 'view.nhtml',
      sourceContent: '<div />',
      sourceRoot: '/src/views',
    })
    expect(mocks.run).toHaveBeenCalledTimes(1)
    expect(mocks.run).toHaveBeenCalledWith(compiled, 'compiled.njs')
    expect(result).toBe('generated')
    expect(mocks.factory.options).toEqual({
      preserved: true,
      sourceMap: true,
      inline: false,
      sourceFile: 'view.nhtml',
      sourceRoot: '/src/views',
    })
  })

  it('compileFull optimizes string output when requested', () => {
    mocks.parse.mockReturnValueOnce({})
    mocks.run.mockReturnValueOnce('generated-code')

    const result = compileFull('<tmpl />', true)

    expect(mocks.run).toHaveBeenCalledTimes(1)
    expect(mocks.prepare).toHaveBeenCalledTimes(1)
    expect(mocks.prepare).toHaveBeenCalledWith('generated-code')
    expect(result).toBe('optimized:generated-code')
  })

  it('compileFull optimizes sourcemap payloads when requested', () => {
    mocks.parse.mockReturnValueOnce({})
    mocks.run.mockReturnValueOnce({ code: 'generated', map: { mappings: '' } })

    const result = compileFull('<tmpl />', true)

    expect(mocks.prepare).toHaveBeenCalledWith('generated')
    expect(result).toEqual({
      code: 'optimized:generated',
      map: { mappings: '' },
    })
  })

  it('compileLight uses raw.njs template without double-running', () => {
    const compiled = { main: 'light' }
    mocks.parse.mockReturnValueOnce(compiled)
    mocks.run.mockReturnValueOnce('light-output')

    const result = compileLight('content', false, 'light.nhtml')

    expect(mocks.parse).toHaveBeenCalledTimes(1)
    expect(mocks.run).toHaveBeenCalledTimes(1)
    expect(mocks.run).toHaveBeenCalledWith(compiled, 'raw.njs')
    expect(mocks.prepare).not.toHaveBeenCalled()
    expect(result).toBe('light-output')
  })

  it('compileTs targets es6module.njs template', () => {
    const compiled = { main: 'ts' }
    mocks.parse.mockReturnValueOnce(compiled)
    mocks.run.mockReturnValueOnce('ts-output')

    const result = compileTs('ts content', false, 'script.nhtml')

    expect(mocks.run).toHaveBeenCalledTimes(1)
    expect(mocks.run).toHaveBeenCalledWith(compiled, 'es6module.njs')
    expect(result).toBe('ts-output')
  })
})

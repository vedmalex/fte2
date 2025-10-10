import { describe, expect, test } from 'vitest'
import { toNodeReadable } from '../utils/toNodeReadable'
import { toWebReadable } from '../utils/toWebReadable'

async function* makeSource() {
  yield 'Hello'
  yield ' '
  yield 'World'
}

describe('adapters', () => {
  test('toNodeReadable pipes all data', async () => {
    const r = toNodeReadable(makeSource())
    const chunks: Buffer[] = []
    await new Promise<void>((resolve, reject) => {
      r.on('data', (c) =>
        chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(String(c))),
      )
      r.on('end', resolve)
      r.on('error', reject)
    })
    expect(Buffer.concat(chunks).toString('utf8')).toBe('Hello World')
  })

  test('toWebReadable reads all data', async () => {
    const rs = toWebReadable(makeSource())
    const reader = rs.getReader()
    const dec = new TextDecoder()
    let out = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      out += dec.decode(value)
    }
    expect(out).toBe('Hello World')
  })
})

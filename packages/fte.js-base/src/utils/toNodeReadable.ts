import { Readable } from 'node:stream'

export function toNodeReadable(source: AsyncIterable<string>): Readable {
  const readable = new Readable({
    read() {},
    objectMode: false,
  })
  ;(async () => {
    try {
      for await (const chunk of source) {
        if (!readable.push(chunk)) {
          await new Promise<void>((resolve) => readable.once('drain', resolve))
        }
      }
      readable.push(null)
    } catch (err) {
      readable.destroy(err as Error)
    }
  })()
  return readable
}

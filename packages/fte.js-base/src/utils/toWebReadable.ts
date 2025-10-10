export function toWebReadable(
  source: AsyncIterable<string>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const iterator = (source as any)[Symbol.asyncIterator]()
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next()
        if (done) {
          controller.close()
          return
        }
        controller.enqueue(encoder.encode(String(value)))
      } catch (e) {
        controller.error(e)
      }
    },
    cancel() {
      if (typeof (iterator as any).return === 'function') {
        try {
          ;(iterator as any).return()
        } catch {}
      }
    },
  })
}

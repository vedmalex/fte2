# Agents integration notes

This project can generate code in streaming and async modes, which is helpful for LLM/agents integrations.

## Async mode
- Enable with `factory.options = { ...factory.options, promise: true }`.
- Use `runAsync(context, name)` and `runPartialAsync({ context, name, options?, slots? })`.
- Expressions/partials/slots that return Promises are awaited automatically.

## Stream mode (experimental)
- Enable with `factory.options = { ...factory.options, stream: true }`.
- Use `runStream(context, name)`:
  - For non-chunk templates it returns `AsyncIterable<string>`.
  - For chunk templates it returns an array of chunks where `chunk.content` is `AsyncIterable<string>`.
- Supports early cancellation via `factory.options.abort` (boolean or `AbortSignal`-like with `.aborted`).
- With `deindent` enabled, deindent is applied on the fly via `applyDeindentStream` without full buffering.
- Stream adapters: `toNodeReadable(asyncIterable)` and `toWebReadable(asyncIterable)` help integrate with Node/Web streaming APIs.
- Stream options:
  - `onChunk?(chunk: string)` – callback per yielded chunk (non-chunk templates)
  - `onError?(error: unknown)` – callback for errors thrown inside `onChunk`
  - `highWaterMark?: number` – soft backpressure threshold for internal queue
  - `maxCoalesceChunkSize?: number` – coalesce small pieces inside chunked streams

### Example (non-chunk)
```ts
const F = new TemplateFactoryStandalone(templates as any)
F.options = { ...F.options, stream: true, onChunk: c => process.stdout.write(c) } as any
const it = (F as any).runStream({ x: Promise.resolve('X') }, 'view.njs') as AsyncIterable<string>
let acc = ''
for await (const s of it) acc += s
```

### Example (chunk)
```ts
const res = (F as any).runStream(ctx, 'project.njs') as Array<{name: string, content: AsyncIterable<string>}>
for (const ch of res) {
  let acc = ''
  for await (const s of ch.content) acc += s
  await fs.promises.writeFile(path.join(outDir, ch.name), acc)
}
```

### Adapters
```ts
import { toNodeReadable, toWebReadable } from 'fte.js-base'

// Node
const readable = toNodeReadable(it)
readable.pipe(process.stdout)

// Web
const rs = toWebReadable(it)
const reader = rs.getReader()
const dec = new TextDecoder()
let out = ''
while (true) {
  const { value, done } = await reader.read()
  if (done) break
  out += dec.decode(value)
}
```

## Example projects

- Node CJS advanced: `examples/node-cjs-advanced` (sync/async/stream, chunks/partials/alias)
- Node ESM advanced: `examples/node-esm-advanced`
- Browser ESM advanced: `examples/browser-esm-advanced` (use `pnpm ex:serve`)

## Source maps
- E2E tests validate mapping precision across templates.
- `MainTemplate` carries `codeblock` mappings to final output; dense line segments are emitted to improve fidelity.

## Safety
- Do not stream untrusted user input without proper escaping.
- Prefer `uexpression` where HTML escaping is needed.

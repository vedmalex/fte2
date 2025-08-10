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
- Supports early cancellation via `factory.options.abort` (`AbortSignal`).
- With `deindent` enabled, deindent is applied on the buffered, combined output per stream.

### Example (non-chunk)
```ts
const F = new TemplateFactoryStandalone(templates as any)
F.options = { ...F.options, stream: true } as any
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

## Source maps
- E2E tests validate mapping precision across templates.
- `MainTemplate` carries `codeblock` mappings to final output; dense line segments are emitted to improve fidelity.

## Safety
- Do not stream untrusted user input without proper escaping.
- Prefer `uexpression` where HTML escaping is needed.

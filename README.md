# fte2 monorepo

Template engine and toolchain for FTE.js (monorepo).

## CLI (fte.js)

Install (workspace):

```bash
pnpm -w --filter fte.js build
```

Usage:

```bash
fte.js bundle [templates] [dest] [options]
```

Options:

- `--typescript`       Use TypeScript templates for output
- `--single`           Bundle into a single file (singlefile mode)
- `--file <name>`      Filename for singlefile output (default: index)
- `--ext <ext>`        Template extension to pick up (default: .njs)
- `--standalone`       Generate standalone bundle (index + imports)
- `--minify`           Minify output using SWC printer
- `--sourcemap`        Generate source maps
- `--no-inline-map`    Emit external .map file instead of inline map
- `--format <format>`  Module format: `cjs` (default) or `esm`

Notes:
- `--format esm` routes bundling to ES module templates (`singlefile.es6.njs`, `standalone*.es6.njs`) for JS output. TypeScript mode uses the TS templates regardless of format.
- When `--sourcemap --no-inline-map` are used together, external `.map` files are written next to outputs; otherwise an inline data URL is appended.

Examples:

```bash
# CJS multi-file bundle (default)
fte.js bundle ./templates ./dist

# Single-file ESM bundle with inline maps
fte.js bundle ./templates ./dist --single --file bundle --format esm --sourcemap

# Multi-file standalone ESM bundle with external maps
fte.js bundle ./templates ./dist --standalone --format esm --sourcemap --no-inline-map
```

## Libraries

- `fte.js-templates`: source templates driving codegen
- `fte.js-parser`: parser with sourcemap support
- `fte.js-standalone`: runtime factory for compiled templates
- `fte.js-base`: base classes, runtime utilities

## Development

- Tests:
  ```bash
  pnpm -r test
  ```
- Build package:
  ```bash
  pnpm --filter fte.js-templates build
  ```

## Status

See `MUST_HAVE.md` for roadmap and prioritized improvements.

## Examples

### Node (CJS)

```js
// compile-time: use CLI to bundle first
// runtime:
const { TemplateFactoryStandalone: Factory } = require('fte.js-standalone/dist/TemplateFactoryStandalone.js')
const templates = require('./dist/index.js') // bundle produced by CLI

const F = new Factory(templates)
const html = F.run({ name: 'world' }, 'a/t.njs')
console.log(html)
```

### Node (ESM)

```js
import templates from './dist/index.js'
import { TemplateFactoryStandalone as Factory } from 'fte.js-standalone/dist/TemplateFactoryStandalone.js'

const F = new Factory(templates)
console.log(F.run({ name: 'world' }, 'a/t.njs'))
```

### Browser (ESM)

- Local example: `examples/browser-esm/globalthis.html`
- CDN example: `examples/browser-esm/cdn.html`
- Guide: `docs/browser-esm.md`

### Advanced example projects

- Node CJS advanced: `examples/node-cjs-advanced`
  - Build: `pnpm ex:node-cjs-adv:build`
  - Run: `pnpm ex:node-cjs-adv:sync` | `pnpm ex:node-cjs-adv:async` | `pnpm ex:node-cjs-adv:stream`
- Node ESM advanced: `examples/node-esm-advanced`
  - Build: `pnpm ex:node-esm-adv:build`
  - Run: `pnpm ex:node-esm-adv:sync` | `pnpm ex:node-esm-adv:async` | `pnpm ex:node-esm-adv:stream`
- Browser ESM advanced: `examples/browser-esm-advanced` (open `index.html` via a dev server)

### Demo-based examples (from demo/)

- Node CJS demo: `examples/demo-node-cjs` → `pnpm ex:demo-cjs`
- Node ESM demo: `examples/demo-node-esm` → `pnpm ex:demo-esm`

Dev server for browser examples:

```bash
pnpm ex:serve
# open http://localhost:8080/browser-esm-advanced/ or http://localhost:8080/browser-esm/stream.html
```

### Streaming and Async

- Async mode: set `options.promise = true` to allow expressions/partials to return Promises. Factories expose `runAsync` to await results end-to-end.
- Stream mode: set `options.stream = true` and call `runStream`. Return type:
  - Non-chunk templates: `AsyncIterable<string>` that yields as content is produced
  - Chunk templates: `Array<{ name: string, content: AsyncIterable<string> }>` where each chunk's content streams
- Abort: provide `options.abort` with `{ aborted: boolean }`; generators stop early when `aborted` becomes true.
- Deindent in stream: when template has `deindent` directive, deindent is applied via `applyDeindentStream` without full buffering.
- Stream adapters (fte.js-base):
  - `toNodeReadable(asyncIterable)` -> Node.js Readable
  - `toWebReadable(asyncIterable)` -> Web ReadableStream
- Stream options (fte.js-base):
  - `onChunk?(chunk: string)`: called for each yielded chunk (non-chunk templates)
  - `onError?(error: unknown)`: error callback from `onChunk`
  - `highWaterMark?: number`: soft backpressure threshold for internal queue
  - `maxCoalesceChunkSize?: number`: coalesce small pieces into bigger chunks in chunked stream

## Sourcemaps

- Generation is controlled per compile/build via options: `sourceMap`, `inline`, `sourceFile`, `sourceRoot`.
- CLI: `--sourcemap` enables maps, `--no-inline-map` emits external `.map` files; otherwise an inline `//# sourceMappingURL=` is appended.
- Mapping coverage:
  - `codeblock.njs` emits segments for text, expressions (escaped and raw), and code blocks; newlines update generated positions.
  - `MainTemplate.*` passes sourcemap options to `codeblock` and carries through `map` to the final artifact when available.
  - Chunked rendering collects content and preserves `sourceMappingURL` comments.
- Guarantees/limitations: see `docs/source-map-guarantees.md` for details.

## DX helpers

- `generateContextTypes(template)` from `fte.js` produces inferred context typedefs/TS-interface for use in bundles.
  ```ts
  import { generateContextTypes } from 'fte.js'
  const types = generateContextTypes(templateAst)
  console.log(types.jsTypedef) // JSDoc typedef
  console.log(types.tsInterface) // TS interface
  ```

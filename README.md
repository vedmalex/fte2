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

See `examples/browser-esm/index.html` for a minimal wiring example using `<script type="module">`.

## Sourcemaps

- Generation is controlled per compile/build via options: `sourceMap`, `inline`, `sourceFile`, `sourceRoot`.
- CLI: `--sourcemap` enables maps, `--no-inline-map` emits external `.map` files; otherwise an inline `//# sourceMappingURL=` is appended.
- Mapping coverage:
  - `codeblock.njs` emits segments for text, expressions (escaped and raw), and code blocks; newlines update generated positions.
  - `MainTemplate.*` passes sourcemap options to `codeblock` and carries through `map` to the final artifact when available.
  - Chunked rendering collects content and preserves `sourceMappingURL` comments.
- Guarantees/limitations:
  - Original source file name (`sourceFile`) is included in `map.sources`.
  - Mappings are best-effort for template-generated JS; custom transforms outside templates are not mapped.
  - Combining/minifying after build may alter positions; prefer disabling minify during debugging.

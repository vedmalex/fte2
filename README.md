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

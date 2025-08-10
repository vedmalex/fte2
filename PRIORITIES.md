# Development priorities

## 1. Source maps quality (high)
- [done] Add E2E position validation for common patterns (text, expression, uexpression, code), including nested blocks/slots
- [done] Expand tests to ensure chunked outputs preserve map integrity; increase mapping density in `codeblock` and propagate maps via `MainTemplate`
- Document per-template mapping guarantees/limitations (JS/TS/singlefile/standalone); add examples of expected fidelity and caveats
- Add more edge-case scenarios (very long lines, mixed CRLF/LF, deep nesting of blocks/slots)

## 2. Type safety and DX (high)
- Strengthen typings in fte.js-base, fte.js-standalone; remove `any` from public APIs
- Provide ergonomic helpers over Inferer to fetch context types programmatically
- [todo] Publicly expose `generateContextTypes` helper in `fte.js` index with docs and example
- [done] Guarantee JSDoc `@typedef` presence in singlefile CJS bundles; preserve/inject typedef comments in build pipeline

## 2.1 Async templates (high)
- Introduce opt-in async mode via `directives.promise` (already parsed) and runtime `options.promise`
- Add `runAsync`/`runPartialAsync` to factories; preserve existing sync APIs unchanged
- Update `codeblock`/`MainTemplate` to generate clean async variants when enabled:
  - Emit `async function` only in async mode; keep sync path intact
  - Use small helpers (`awaitable`, `awaitableJoin`, `awaitablePartial`) to await values without cluttering code
  - Do not sprinkle `await` everywhere; wrap emission points through helpers
  - Maintain sourcemap behavior; async path should not degrade mapping quality
- Tests: unit (async expressions/partials), integration (chunks hash/array), E2E build/run
- Docs and examples (Node/Browser) for async usage and caveats

Open questions:
- Should we leverage AsyncGenerators for streaming? Evaluate for:
  - streaming chunk emission and progressive rendering
  - reducing memory footprint on large outputs
  - interplay with existing chunk API (hash/array) and sourcemaps
  - backpressure/abort signals integration

## 3. Chunking and partials (medium)
- Unify chunk API (hash vs array) and option to include/exclude main chunk across modes
- Better error messages when chunked templates are used as partials

## 4. Testing and coverage (medium)
- Increase coverage for TemplateFactoryBase, merge logic, slot resolution (partially improved)
- Add integration tests: multi-file projects, aliasing, requireAs, extend in realistic graphs (extended and stabilized; keep broadening scenarios)
- Snapshot tests for generated bundles (JS/TS/ESM)

## 5. Bundling and formats (medium)
- Provide browser ESM example using globalThis if needed and verify paths
- Validate SWC/TS pipeline on large inputs to catch regressions; ensure comments/sourcemap URLs preserved
- Add documented browser ESM sample using `globalThis`-safe imports and CDN-friendly paths
  - [done] Add local example at `examples/browser-esm/globalthis.html`
  - [done] Add CDN example at `examples/browser-esm/cdn.html`

## 8. Documentation (high)
- [done] Write “Source map guarantees” doc per template (levels of fidelity, known limitations, examples)
- [done] Add browser ESM usage guide with runnable example and troubleshooting
- Update README with DX improvements (typedef in bundles, flags)

## 9. Tooling/CI (medium)
- [done] Add ESLint config at repo root; `pnpm run lint`
- [done] Add monorepo typecheck script; `pnpm run typecheck`
- [todo] Wire CI job to run `pnpm run ci` (tests + lint + typecheck)
- Automate vulnerability checks (Dependabot/GitHub alerts)

## 6. Tooling/CI (medium)
- Add ESLint/Prettier configs and enforce in CI
- Add type-check steps per package; block on public API changes
 - Exclude legacy/generated sources from lint; stage gradual cleanup for remaining warnings
- Address Dependabot-reported vulnerabilities

## 7. Performance (low)
- Benchmark parser+codegen; identify hotspots
- Memoize safe hot paths
- Optional lazy sourcemap generation behind a flag

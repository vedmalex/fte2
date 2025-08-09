# Development priorities

## 1. Source maps quality (high)
- Add E2E position validation for common patterns (text, expression, uexpression, code) including nested blocks/slots
- Expand tests to ensure chunked outputs preserve map integrity
- Document per-template mapping guarantees/limitations

## 2. Type safety and DX (high)
- Strengthen typings in fte.js-base, fte.js-standalone; remove `any` from public APIs
- Provide ergonomic helpers over Inferer to fetch context types programmatically

## 3. Chunking and partials (medium)
- Unify chunk API (hash vs array) and option to include/exclude main chunk across modes
- Better error messages when chunked templates are used as partials

## 4. Testing and coverage (medium)
- Increase coverage for TemplateFactoryBase, merge logic, slot resolution
- Add integration tests: multi-file projects, aliasing, requireAs, extend in realistic graphs
- Snapshot tests for generated bundles (JS/TS/ESM)

## 5. Bundling and formats (medium)
- Provide browser ESM example using globalThis if needed and verify paths
- Validate SWC/TS pipeline on large inputs to catch regressions

## 6. Tooling/CI (medium)
- Add ESLint/Prettier configs and enforce in CI
- Add type-check steps per package; block on public API changes
- Address Dependabot-reported vulnerabilities

## 7. Performance (low)
- Benchmark parser+codegen; identify hotspots
- Memoize safe hot paths
- Optional lazy sourcemap generation behind a flag

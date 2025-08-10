## Browser ESM usage

Two ready-to-run examples are provided under `examples/browser-esm/`.

### Local example (globalThis)
- File: `examples/browser-esm/globalthis.html`
- Imports local workspace builds of `fte.js-templates` and `fte.js-standalone`.
- Uses `compiled.njs` to construct a simple template at runtime and renders it through `TemplateFactoryStandalone`.

### CDN example
- File: `examples/browser-esm/cdn.html`
- Imports packages from a CDN (unpkg). Pin exact versions for stability.
- Same flow: compile minimal template via `compiled.njs` and run it.

### Notes
- Ensure `globalThis` exists in older browsers (the example sets `window.globalThis = window;`).
- `compiled.njs` returns a JS object with `script/compile/dependency`; wrap the `code` into `eval` to obtain a template config.
- For complex apps, pre-build templates and ship precompiled artifacts instead of compiling at runtime.

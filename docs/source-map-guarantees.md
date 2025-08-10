## Source map guarantees

This document summarizes the expected source map fidelity across templates and modes.

- Templates involved
  - codeblock.njs: emits JS code by stitching text/expressions/code segments
  - MainTemplate.njs: wraps codeblock and adds blocks/slots/chunks plumbing
  - singlefile.*: generates single-file bundles (CJS/ESM/TS)
  - standalone.*: generates index/standalone loaders

- Generation options
  - options.sourceMap: enables map generation
  - options.inline: inline base64 maps vs external .map files
  - options.sourceFile/sourceRoot: used as map file and sourceRoot

### codeblock.njs
- Emits a TemplateSourceMap with template.segments, one or more segments per original block.
- Mappings are added at the start of each emitted content and at the start of each new line to increase density.
- names: set to the block type: text|expression|uexpression|code
- sourcesContent: preserved when originalStart/sourceContent provided by parser

### MainTemplate.njs
- Propagates inner codeblock map to the outer template result.
- Inserts markers around main code to compute generated line/column shift.
- Re-emits codeblock segments with adjusted generated positions.
- Adds dense per-line segments for baseline mapping density.

Limitations:
- names in outer map can contain undefined for non-main scaffolding lines; consumers should rely on adjusted segments from inner map for precise mapping.
- Column precision for indent-adjusted content is approximated with a fixed 4-space indent when using applyIndent("    ").

### singlefile.* bundles
- CJS: ensures JSDoc typedef header is injected (or fallback typedef) before SWC print.
- Preserves sourceMappingURL comments in output even if SWC strips them.
- ESM/TS: rely on template code output; no additional transforms are applied.

### Testing coverage
- E2E tests validate:
  - external maps presence and mapping URL
  - mapping lines vs code lines density
  - sources include the original template filename
  - sourcesContent contains original template content
- Unit tests validate inline vs external behavior for codeblock and CLI.

### Recommendations
- Keep parser providing originalStart/sourceContent for all block items.
- When adding new block types, set block.type for names and provide proper eol handling so mapping lines align with code lines.

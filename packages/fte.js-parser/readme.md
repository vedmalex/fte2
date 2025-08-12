# fte.js - fast template engine that is reborn

template parser
 
## Grammar

See `GRAMMAR.ebnf` for the formal EBNF grammar describing parser states and tags.

### Validate grammar

- Online: use any EBNF playground (e.g. search for "EBNF playground" or "ISO EBNF validator").
- Local (Node): recommended tools
  - `nearley` (PEG-based) — translate EBNF to PEG by hand or via helpers and test with CLI
  - `ohm-js` — port grammar to Ohm syntax and run recognition tests
  - `ebnf-parser` — parse EBNF and inspect AST

Example (with bunx):

```bash
bunx ebnf2railroad GRAMMAR.ebnf > grammar.html   # visualize
```

For automated checks consider snapshot tests that parse a corpus of templates and assert no grammar conflicts against `GRAMMAR.ebnf` semantics.
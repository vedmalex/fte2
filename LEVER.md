# LEVER - Reuse Opportunities

## Leverage Existing Patterns
- [ ] [LEV-001] Analyze working templates in `packages/fte.js-templates/src.backup.before-regeneration` to understand the stable, string-based output generation logic.
- [ ] [LEV-002] Reuse patterns from the stable version for safe handling of optional `context` properties (like `directives`) and for inlining `partial` results as text.
- [ ] [LEV-003] Extract walkAstNodes utility from duplicate AST traversals in vscode-ftejs-lang
- [ ] [LEV-004] Reuse patterns for template path resolution

## Eliminate Duplicates
- [ ] [DUP-001] Eliminate duplicate test setups in vscode-ftejs-lang tests

## Reduce Complexity

## Applied LEVER
- [x] [LEV-001] Leveraged pattern from contextTypes.ts and tag.ts for handling {code, map} objects in runPartial - Location: packages/fte.js/src/TemplateFactory.ts
- [x] [LEV-002] Applied optional chaining pattern consistently throughout MainTemplate.ts.njs.ts for safe property access



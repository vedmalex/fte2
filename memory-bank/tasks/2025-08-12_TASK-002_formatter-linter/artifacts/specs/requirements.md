# Formatter Requirements (based on GRAMMAR.ebnf)

Time: 2025-08-12_17-59
Task: 2025-08-12_TASK-002_formatter-linter
Source: `packages/fte.js-parser/GRAMMAR.ebnf` + user NL requirements

## 1. Idempotency and Stability
- Formatting is deterministic and idempotent.
- Stable whitespace, newlines, trimming; no changes on repeated runs.

## 2. Indentation and Style
- Default indent: 2 spaces.
- Preserve user style if consistent (tabs/width).
- Final newline: template must end with a newline.

## 3. Directives
- `<#@ ... #>` (or `-#>`) must be the only construct on its line.
- Normalize spaces: "<#@", one space, keyword/identifier, params spaced, closing.
- `lang` directive defines language for text/embedded code (js/ts/c#/...).

## 4. Blocks and Slots
- Open: "<# block <name> : #>" variants with optional leading/trailing trimming (`<#-`, `-#>`).
- Close: one of "<# end #>" | "<#- end #>" | "<# end -#>" | "<#- end -#>".
- Opening/closing must be the only constructs on their lines.
- If an opening or closing tag shares a line with text, move tag to its own line and enforce trimming on both sides: use "<#-" and "-#>".
- Inner indentation starts from line begin and follows language rules for content.
- No nested blocks inside a block (lint error).
- If block/slot is used inline (as text/result), enforce trimming on both ends: opening "<#- ... -#>" and closing "<#- end -#>".

## 5. Code Blocks (`<# ... #>`)
- Inside is JavaScript by default; format as JS (or per `lang`).
- Normalize: one space after "<#"/"<#-" and before "#>"/"-#>" when non-empty.
- Consolidate adjacent constructs:
  - Avoid "-#> <#-" by merging into a single logical block with internal newlines.
  - Sequential one-line blocks are merged into a single multi-line block preserving order.
- Empty constructs (any variant of empty "<# ... #>") are removed and linted as errors.

## 6. Embedded Expressions
- "#{ ... }" and "!{ ... }" contain JS expressions yielding a string (unsafe for `!{}`).
- Do not change indentation of the carrier line (inline expressions do not shift left margin).
- Empty expressions "#{}" (or "!{}") are invalid: remove and lint as errors.
- EJS-like tags (`<% ... %>`, `<%- ... %>`, `<%= ... %>`, `<%_ ... _%>`, `-%>` variants) follow same normalization and consolidation rules.

## 7. Trimming Rules
- When tags are adjacent to text, enforce trimming on both ends: "<#- ... -#>".
- When merging "-#> <#-", keep a single logical block; avoid back-to-back boundaries.
- Inline block/slot usage must have trimming on both ends.

## 8. Syntactic Normalization
- Single space around `:` in block/slot open: "<# block <name> : #>".
- Preserve quoting/identifiers of names; normalize surrounding spaces only.
- Directive params: comma + one space.
- Strip trailing spaces; collapse multiple blank lines unless required by “only construct on line”.

## 9. Pre-format Validation
- No nested blocks inside block.
- No empty constructs: "<#-?-?#>", "#{}", "!{}".
- Opening/closing tags cannot share a line with text; formatter will split and enforce trimming.

## 10. Language Modes
- Default: JS/TS for code blocks and expressions.
- `lang` directive selects language for text-nodes and embedded code when applicable.
- Unknown languages: do not reformat internal code, only normalize tag shells.

## 11. Special Cases
- Adjacent boundaries "... -#> <#- ..." → merge into a single block with line breaks inside.
- `chunkStart/chunkEnd` calls must each be on their own lines; apply trimming "<#- ... -#>" when adjacent to text.
- Block/slot appearing inline with text → separate tags to lines and enforce trimming.

## 12. Technical Requirements
- Must preserve valid syntax per `GRAMMAR.ebnf`.
- Config options: `indentWidth`, `useTabs`, `maxLineLength?`, `lang`.
- Unknown directives (`UnknownDirective`) keep inner text; only normalize shells.
- Output should pass linter rules (to be defined) without errors post-format.

## 13. Linter Rules (IDs, severity, autofix)
- [LINT001] Directive must be only construct on line — severity: error — autofix: yes
  - Applies to `<#@ ... #>` (and `-#>` variants).
- [LINT002] Block/slot open/close must be only construct on line — severity: error — autofix: yes
  - Applies to `block/slot :` openings and `end` closings.
- [LINT003] Enforce trimming when tag adjacent to text — severity: error — autofix: yes
  - If opening/closing shares line with text, move to its own line and set `<#-`/`-#>`.
- [LINT004] Inline block/slot must use trimming on both ends — severity: error — autofix: yes
- [LINT005] No nested blocks inside block — severity: error — autofix: no (report with location range)
- [LINT006] No empty constructs (`<# ... #>`, `#{}`, `!{}`) — severity: error — autofix: yes (remove) when safe, else error only
- [LINT007] Normalize colon spacing in block/slot open — severity: warn — autofix: yes
- [LINT008] Disallow back-to-back boundaries `-#> <#-` — severity: warn — autofix: yes (merge)
- [LINT009] Merge consecutive one-line instruction tags — severity: warn — autofix: yes
- [LINT010] Ensure final newline — severity: warn — autofix: yes
- [LINT011] Consistent indentation style (no mixing) — severity: warn — autofix: yes (normalize to dominant style)
- [LINT012] Unknown directives must follow directive spacing rules — severity: warn — autofix: yes
- [LINT013] Expressions must not alter indentation — severity: warn — autofix: limited (normalize inline spacing only)
- [LINT014] EJS tags normalization (spacing/end variants) — severity: warn — autofix: yes
- [LINT015] `chunkStart/chunkEnd` on their own lines with trimming when adjacent to text — severity: error — autofix: yes
- [LINT016] Multi-line instruction fragments must be consolidated into a single block — severity: warn — autofix: yes
- [LINT017] Trailing whitespace disallowed — severity: warn — autofix: yes
- [LINT018] Collapse excessive blank lines — severity: warn — autofix: yes
- [LINT019] Space normalization inside tag bodies (one space after `<#` and before `#>` when non-empty) — severity: warn — autofix: yes

Autofix order (to avoid conflicts):
1) Split/relayout lines (LINT001, LINT002, LINT003, LINT015)
2) Consolidation/merges (LINT008, LINT009, LINT016)
3) Trimming enforcement (LINT004)
4) Spacing/colon normalization and trailing whitespace (LINT007, LINT012, LINT014, LINT019, LINT017, LINT018)
5) Final newline (LINT010)
6) Empty constructs cleanup (LINT006)

## 14. Split Formatting Feature (templating-aware)
Formatter must support producing two views from a single template:

### 14.1 Instructions-only view
- Output retains only templating instructions (directives, blocks/slots, code tags, expressions, EJS tags).
- All non-instruction text nodes must be represented as commented lines using block comments `/* ... */` regardless of `lang` to keep view uniform.
  - Multi-line text is split into lines and each line wrapped or aggregated under a `/* ... */` block, preserving order.
- Tags themselves remain intact and follow formatting rules above.

### 14.2 Template-only view (no instructions)
- After applying proper tag placement and formatting, instruction lines must be removed or replaced with multi-line comments appropriate for the template language so they do not affect downstream code formatting.
- Embedded expressions `#{ ... }` and `!{ ... }` must be replaced with string literals suitable for the template language to keep syntax valid.

Language-specific replacements:
- Comment styles:
  - JS/TS/Go/C#/Java: `/* ... */`
  - HTML/XML: `<!-- ... -->`
  - Markdown: `<!-- ... -->` (when HTML allowed), otherwise fence in code blocks as needed (out of scope for auto)
- Expression replacement for `#{ ... }` / `!{ ... }`:
  - JS/TS/Go/C#/Java: replace with `""`
  - HTML/XML: replace with a safe textual placeholder (e.g., `x`) in text nodes; in attribute values, use empty string `""`
  - Other languages: default to `""` unless configured

Notes:
- For HTML-like languages, plain text contexts accept placeholders directly; attribute contexts must remain quoted.
- Replacement must preserve original quoting where applicable and must not alter indentation of the carrier line.
- Both views must be derived from the same AST to ensure positional consistency.

API considerations:
- `format(input, options)` → full formatted template
- `extractInstructionsView(input, options)` → instructions-only view
~- `extractTemplateOnlyView(input, options)` → template-only view (no instructions)
- Options include `lang`, `indentWidth`, `useTabs`, `placeholderText` (default: `x` for markup), `stringLiteral` (default: `""` for code languages)

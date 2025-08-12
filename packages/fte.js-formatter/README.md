# fte.js-formatter

Minimal formatter & linter for FTE templates.

Usage:

```bash
# format stdin -> stdout
cat template.nhtml | fte-format > formatted.nhtml

# format files in-place
fte-format --write demo/complexSample/views/*.nhtml

# check (CI)
fte-format --check demo/complexSample/views/*.nhtml
```

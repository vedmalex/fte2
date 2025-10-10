// Types are from runtime package; avoid TS path outside rootDir
type FormatOptions = {
  indent?: number | 'tab'
  ensureFinalNewline?: boolean
  trimTrailingWhitespace?: boolean
}

// Bundle-time integration: import formatter directly from workspace package
// The server package depends on fte.js-formatter, so this file is transpiled into out/adapters/format.js
// and works without dynamic resolution at runtime.
import { format } from 'fte.js-formatter'

export function formatText(
  input: string,
  opts?: { indentSize?: number; indent?: number | 'tab' },
) {
  const options: FormatOptions = {
    indent:
      typeof opts?.indentSize === 'number'
        ? opts?.indentSize
        : opts?.indent === 'tab'
          ? 'tab'
          : 2,
    ensureFinalNewline: true,
    trimTrailingWhitespace: true,
  }
  return format(String(input ?? ''), options)
}

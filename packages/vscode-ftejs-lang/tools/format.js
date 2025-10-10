// Adapter to use fte.js-formatter from the VSCode extension server
// Plain JS to avoid TS build coupling; resolved at runtime

function resolveFormatter() {
  try {
    // Prefer workspace dependency
    return require('../../fte.js-formatter/dist/index.js')
  } catch (e) {
    try {
      return require('fte.js-formatter')
    } catch (e2) {
      throw e2
    }
  }
}

function formatText(input, opts) {
  const { format } = resolveFormatter()
  const options = {
    indent:
      typeof opts?.indentSize === 'number'
        ? opts.indentSize
        : opts?.indent === 'tab'
          ? 'tab'
          : 2,
    ensureFinalNewline: true,
    trimTrailingWhitespace: true,
  }
  return format(String(input ?? ''), options)
}

module.exports = { formatText }

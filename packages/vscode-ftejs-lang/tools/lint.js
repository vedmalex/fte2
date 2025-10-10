// Adapter to use fte.js-formatter linter from the VSCode extension server
function resolveFormatter() {
  try {
    return require('../../fte.js-formatter/dist/index.js')
  } catch (e) {
    try {
      return require('fte.js-formatter')
    } catch (e2) {
      throw e2
    }
  }
}

function lintText(input) {
  const { lint } = resolveFormatter()
  return lint(String(input ?? ''))
}

module.exports = { lintText }

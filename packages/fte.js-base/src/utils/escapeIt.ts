var escapeExp = /[&<>"]/,
  escapeAmpExp = /&/g,
  escapeLtExp = /</g,
  escapeGtExp = />/g,
  escapeQuotExp = /"/g

export function escapeIt(text: string): string {
  if (text == null) {
    return ''
  }

  var result = text.toString()
  if (!escapeExp.test(result)) {
    return result
  }

  return result
    .replace(escapeAmpExp, '&amp;')
    .replace(escapeLtExp, '&lt;')
    .replace(escapeGtExp, '&gt;')
    .replace(escapeQuotExp, '&quot;')
}

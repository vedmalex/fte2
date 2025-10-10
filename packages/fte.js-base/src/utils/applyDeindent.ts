export function applyDeindent(str: string, numChars: number | string): string
export function applyDeindent(
  str: Array<string>,
  numChars: number | string,
): Array<string>
export function applyDeindent(
  str: string | Array<string>,
  numChars: number | string,
): string | Array<string> {
  if (!str) return str
  const lines = Array.isArray(str) ? [...str] : String(str).split('\n')
  // по первой строке
  if (typeof numChars == 'string') {
    numChars = numChars.length
  }

  if (numChars != 0) {
    let i = 0
    do {
      if (lines[i].trim().length !== 0) break
      i += 1
      if (i >= lines.length - 1) break
    } while (true)
    if (i < lines.length) {
      numChars = lines[i].length - lines[i].trimStart().length
    }
  }
  if (numChars > 0) {
    for (let i = 0; i < lines.length; i++) {
      let spaceCount = 0
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === ' ') {
          spaceCount++
        } else {
          break
        }
      }
      if (spaceCount > 0) {
        if (spaceCount <= numChars) {
          lines[i] = lines[i].trimStart()
        } else {
          lines[i] = lines[i].substring(numChars)
        }
      }
    }
  }
  return Array.isArray(str) ? lines : lines.join('\n')
}

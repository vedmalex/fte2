export function applyDeindentStream(
  source: AsyncIterable<string>,
  numChars?: number | string
): AsyncIterable<string> {
  const iterator = async function* (): AsyncIterable<string> {
    let buffer = ''
    let indentChars: number | undefined

    if (typeof numChars === 'number') {
      indentChars = numChars
    } else if (typeof numChars === 'string') {
      indentChars = numChars.length
    }

    const processLine = (line: string): string => {
      if (!line) return ''
      if (indentChars === undefined) {
        // Auto-detect by first non-empty line
        if (line.trim().length === 0) {
          return ''
        }
        indentChars = line.length - line.trimStart().length
      }
      if (indentChars <= 0) return line
      // Remove up to indentChars spaces from start
      let spaceCount = 0
      for (let j = 0; j < line.length; j++) {
        if (line[j] === ' ') spaceCount++
        else break
      }
      if (spaceCount === 0) return line
      if (spaceCount <= indentChars) return line.trimStart()
      return line.substring(indentChars)
    }

    for await (const chunk of source) {
      if (chunk == null) continue
      buffer += String(chunk)
      // Split by \n, keep last partial line in buffer
      const parts = buffer.split('\n')
      buffer = parts.pop() ?? ''
      for (let part of parts) {
        if (part.endsWith('\r')) part = part.slice(0, -1)
        const trimmed = processLine(part)
        yield trimmed + '\n'
      }
    }

    // Flush remainder (no trailing newline)
    if (buffer.length > 0) {
      if (buffer.endsWith('\r')) buffer = buffer.slice(0, -1)
      const trimmed = ((): string => {
        if (indentChars === undefined) {
          if (typeof numChars === 'number') indentChars = numChars
          else if (typeof numChars === 'string') indentChars = numChars.length
          else indentChars = 0
        }
        return processLine(buffer)
      })()
      if (trimmed.length > 0) yield trimmed
    }
  }
  return iterator()
}

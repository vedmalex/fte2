import { HashType } from './interfaces'

var escapeExp = /[&<>"]/,
  escapeAmpExp = /&/g,
  escapeLtExp = /</g,
  escapeGtExp = />/g,
  escapeQuotExp = /"/g

export function escapeIt(text: string) {
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

export function applyDeindent(
  str: string | Array<string>,
  numChars: number | string,
) {
  if (!str) return str
  let lines = Array.isArray(str) ? [...str] : String(str).split('\n')
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

export function applyIndent(
  str: any | Array<string>,
  _indent: number | string,
) {
  let lines = Array.isArray(str) ? [...str] : String(str).split('\n')
  var indent = ''
  if (typeof _indent == 'number' && _indent > 0) {
    var res = ''
    for (var i = 0; i < _indent; i++) {
      res += ' '
    }
    indent = res
  }
  if (typeof _indent == 'string' && _indent.length > 0) {
    indent = _indent
  }
  if (indent && lines) {
    let res = lines.map((s) => indent + s)
    return Array.isArray(str) ? res : res.join('\n')
  } else {
    return lines
  }
}

export function set(data: HashType, path: string, value: any) {
  if ('object' === typeof data) {
    const parts = path.split('.')
    if (Array.isArray(parts)) {
      const curr = parts.shift()
      if (parts.length > 0) {
        if (!data[curr]) {
          if (isNaN(parseInt(parts[0], 10))) {
            data[curr] = {}
          } else {
            data[curr] = []
          }
        }
        set(data[curr], parts.join('.'), value)
      } else {
        data[path] = value
      }
    } else {
      data[path] = value
    }
  }
}

export function get(data: HashType, path: string) {
  if ('object' === typeof data) {
    if (data[path] === undefined) {
      const parts = path.split('.')
      if (Array.isArray(parts)) {
        const curr = parts.shift()
        if (parts.length > 0) {
          return get(data[curr], parts.join('.'))
        }
        return data[curr]
      }
    }
    return data[path]
  }
  return data
}

export function merge(a: HashType, b: HashType, property: string) {
  let prop
  const aProp = a[property]
  if (aProp !== undefined) {
    let bProp = b[property]
    if (bProp === undefined) {
      bProp = b[property] = {}
    }
    const propList = Object.keys(aProp)
    for (let i = 0, pLen = propList.length; i < pLen; i++) {
      prop = propList[i]
      if (!(prop in bProp)) {
        bProp[prop] = aProp[prop]
      }
    }
  }
}

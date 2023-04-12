export function get<T extends object>(data: T, path: string): T {
  if ('object' === typeof data) {
    if (data[path] === undefined) {
      const parts = path.split('.')
      if (Array.isArray(parts) && parts.length > 1) {
        const curr = parts.shift() as string
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

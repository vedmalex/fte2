export function set<T extends object>(data: T, path: string, value: any) {
  if ('object' === typeof data) {
    const parts = path.split('.')
    if (Array.isArray(parts) && parts.length > 1) {
      const curr = parts.shift() as string
      if (parts.length > 0) {
        if (!data![curr]) {
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

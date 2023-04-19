// info about a parameter

export type Info = {
  parent: Info
  children: Map<string, Info>
  typeName: string
  name: string
  type: 'object' | 'array' | 'primitive' | 'function'
  properties: Map<string, Info>
}

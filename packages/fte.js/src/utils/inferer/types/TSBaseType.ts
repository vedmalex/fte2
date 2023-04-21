export class TSBaseType {
  constructor(public type: 'object' | 'array' | 'primitive' | 'function') {}
  toString(): string {
    return this.type
  }
}

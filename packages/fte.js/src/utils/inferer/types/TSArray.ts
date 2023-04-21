import { TSBaseType } from './TSBaseType'

export class TSArray extends TSBaseType {
  constructor(public name: string, public children: TSBaseType) {
    super('array')
  }
  override toString(): string {
    return `${this.name}: Array<${this.children.toString()}>`
  }
}

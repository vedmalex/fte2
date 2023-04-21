import { TSBaseType } from './TSBaseType'

export class TSPrimitive extends TSBaseType {
  constructor(public name: string) {
    super('primitive')
  }
  override toString(): string {
    return `${this.name}: any`
  }
}

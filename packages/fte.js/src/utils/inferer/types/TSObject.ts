import { TSBaseType } from './TSBaseType'

export class TSObject extends TSBaseType {
  constructor(public name: string, public properties: Array<TSBaseType>) {
    super('object')
  }
  override toString(): string {
    return ` type ${this.name} = {${this.properties.map(p => `${p.toString()},`)}}`
  }
}

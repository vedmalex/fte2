import { TSBaseType } from './TSBaseType'

export class TSFunction extends TSBaseType {
  constructor(public name: string, public params: Array<TSBaseType>) {
    super('function')
  }
  override toString() {
    return `${this.name}: ((${this.params.map(p => p.toString())})=> any)`
  }
}

import { Part } from './Part'

export type Call = {
  name: string
  type: 'call'
  optional: boolean
  arguments: Part[]
}

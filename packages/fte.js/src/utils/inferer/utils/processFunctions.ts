import { Info } from '../types/Info'
import { NodePath } from '@babel/traverse'
import { processFucntion } from './processFunction'
import { FunctionType } from '../types/FunctionType'

export function processFunctions(result: Array<NodePath<FunctionType>>, context: Map<string, Info>) {
  let anonymousCount = 0
  const anonynmous = () => `anonymous${anonymousCount++}`
  result.forEach(path => {
    processFucntion(context, path, anonynmous)
  })
}

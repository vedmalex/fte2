import { DefaultFactoryOption } from './DefaultFactoryOption'

export interface FactoryConfig<OPTIONS extends DefaultFactoryOption> {
  root: string | Array<string>
  ext: Array<string>
  preload: boolean
  options: OPTIONS
  watch: boolean
}

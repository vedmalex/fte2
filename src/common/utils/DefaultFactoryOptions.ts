import { escapeIt } from './escapeIt'
import { applyIndent } from './applyIndent'
import { applyDeindent } from './applyDeindent'
import { DefaultFactoryOption } from '../types/DefaultFactoryOption'

export const DefaultFactoryOptions = {
  applyIndent,
  escapeIt,
  applyDeindent,
} satisfies DefaultFactoryOption

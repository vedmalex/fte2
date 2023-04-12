import { escapeIt } from '../utils/escapeIt'
import { applyIndent } from '../utils/applyIndent'
import { applyDeindent } from '../utils/applyDeindent'
import { DefaultFactoryOption } from './DefaultFactoryOption'

export const DefaultFactoryOptions = {
  applyIndent,
  escapeIt,
  applyDeindent,
} satisfies DefaultFactoryOption

import { escapeIt } from '../utils/escapeIt'
import { applyIndent } from '../utils/applyIndent'
import { applyDeindent } from '../utils/applyDeindent'
import { DefaultFactoryOption } from './DefaultFactoryOption'

export const DefaultFactoryOptions = {
  applyIndent,
  escapeIt,
  applyDeindent,
  // Defaults for source maps (off by default)
  sourceMap: false,
  inline: true,
} satisfies DefaultFactoryOption

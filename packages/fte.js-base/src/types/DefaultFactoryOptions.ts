import { escapeIt } from '../utils/escapeIt'
import { applyIndent } from '../utils/applyIndent'
import { applyDeindent } from '../utils/applyDeindent'
import { DefaultFactoryOption } from './DefaultFactoryOption'
import { applyDeindentStream } from '../utils/applyDeindentStream'

export const DefaultFactoryOptions = {
  applyIndent,
  escapeIt,
  applyDeindent,
  applyDeindentStream,
  // Defaults for source maps (off by default)
  sourceMap: false,
  inline: true,
} satisfies DefaultFactoryOption

import { TemplateBase } from 'fte.js-base'

type ContextType = {
  error: Error
  compiledFile: string
}

export default {
  alias: ['compilationError.njs'],
  script: function (context: ContextType, _content, partial, slot, options) {
    var out: Array<string> = []
    out.push(context.error.message + ';\n')
    out.push(context.compiledFile + ';')
    return out.join('')
  },
  compile: function (this: TemplateBase) {},
  dependency: {},
}

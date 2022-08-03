import codeblock_njs from './codeblock.njs'
import compilationError_njs from './compilationError.njs'
import compiled_njs from './compiled.njs'
import es6module_njs from './es6module.njs'
import MainTemplate_njs from './MainTemplate.njs'
import raw_njs from './raw.njs'
import singlefile_es6_njs from './singlefile.es6.njs'
import singlefile_njs from './singlefile.njs'
import standalone_es6_njs from './standalone.es6.njs'
import standalone_index_es6_njs from './standalone.index.es6.njs'
import standalone_index_njs from './standalone.index.njs'
import standalone_njs from './standalone.njs'


const templates = {
'codeblock.njs': codeblock_njs,
'compilationError.njs': compilationError_njs,
'compiled.njs': compiled_njs,
'es6module.njs': es6module_njs,
'MainTemplate.njs': MainTemplate_njs,
'raw.njs': raw_njs,
'singlefile.es6.njs': singlefile_es6_njs,
'singlefile.njs': singlefile_njs,
'standalone.es6.njs': standalone_es6_njs,
'standalone.index.es6.njs': standalone_index_es6_njs,
'standalone.index.njs': standalone_index_njs,
'standalone.njs': standalone_njs,

}
export default templates
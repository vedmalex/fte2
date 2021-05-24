const nearley = require('nearley')
const grammar = require('./raw.ne.js')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

try {
  parser.feed('#{ name ? { ...name, [key]: some} : name }')
  console.log(parser.results)
  console.log(parser.table)
} catch (parseError) {
  console.log(parseError)
  console.log('Error at character ' + parseError.offset) // "Error at character 9"
}

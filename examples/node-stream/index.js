const { TemplateFactoryStandalone } = require('fte.js-standalone')
const templates = require('fte.js-templates')

async function main() {
  const F = new TemplateFactoryStandalone(templates)
  F.options = { ...F.options, stream: true }

  const res = F.run({
    directives: {
      context: 'context', content: false, chunks: undefined,
      alias: undefined, deindent: false, requireAs: [], blocks: {}, slots: {}
    },
    blocks: {},
    slots: {},
    main: [
      { type: 'text', content: 'Hello ', eol: false },
      { type: 'expression', content: 'context.name', start: true, end: true, eol: false },
      { type: 'text', content: '!\n', eol: true },
    ],
  }, 'MainTemplate.njs')

  const code = typeof res === 'string' ? res : res.code
  const cfg = eval('(' + code + ')')
  const Local = new TemplateFactoryStandalone({ 'x.njs': cfg })
  Local.options = { ...Local.options, stream: true }

  const it = Local.runStream({ name: Promise.resolve('World') }, 'x.njs')
  for await (const chunk of it) process.stdout.write(chunk)
}

main().catch(err => { console.error(err); process.exit(1) })

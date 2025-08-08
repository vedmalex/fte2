import { Parser } from '../index'

describe('Parser Source Map', () => {
  test('should attach original positions when sourceMap enabled', () => {
    const source = '<% const x = 1; %>Hello<%= name %>'
    const res = Parser.parse(source, {
      sourceMap: true,
      sourceFile: 'template.njs',
      sourceContent: source,
      sourceRoot: '/src/templates',
    })

    // any item with content should have originalStart set
    const all = [
      ...(res.main || []),
      ...(res.documentation || []),
    ] as any[]

    expect(all.some(i => i.originalStart && i.sourceFile === 'template.njs')).toBeTruthy()
  })
})

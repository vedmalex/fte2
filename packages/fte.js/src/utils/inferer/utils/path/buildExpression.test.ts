import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import { buildExpression } from './buildExpression'

describe('buildExpression works with general members', () => {
  it('processes a simple call expression', () => {
    const code = 'm()'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'm')
    expect(expression).toMatchObject({
      name: 'm',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'm',
          type: 'call',
          optional: false,
          arguments: [],
        },
      ],
    })
  })
  it('processes a call expression with argument as function', () => {
    const code = 'run(m())'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'run')
    expect(expression).toMatchObject({
      name: 'run',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'run',
          type: 'call',
          optional: false,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [{ name: 'm', type: 'call', optional: false, arguments: [] }],
            },
          ],
        },
      ],
    })
  })
  it('processes a simple expression', () => {
    const code = 'rest.length'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'rest')
    expect(expression).toMatchObject({
      name: 'rest',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'rest',
          type: 'property',
          optional: false,
        },
        {
          name: 'length',
          type: 'property',
          optional: false,
        },
      ],
    })
  })

  it('processes a simple expression with a call', () => {
    const code = 'rest[0].some.push(a + b + c)'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'rest')
    expect(expression).toMatchObject({
      name: 'rest',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'rest',
          type: 'property',
          optional: false,
        },
        {
          name: 0,
          type: 'index',
          optional: false,
        },
        {
          name: 'some',
          type: 'property',
          optional: false,
        },
        {
          name: 'push',
          type: 'call',
          optional: false,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [
                { name: 'a', type: 'property', optional: false },
                { name: 'b', type: 'property', optional: false },
                { name: 'c', type: 'property', optional: false },
              ],
            },
          ],
        },
      ],
    })
  })

  it('processes expression with a call and a function', () => {
    const code = "param.some[1].name(m(),e.name())['super name'].nice(a + b + c);"
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'param')
    expect(expression).toMatchObject({
      name: 'param',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'param',
          type: 'property',
          optional: false,
        },
        {
          name: 'some',
          type: 'property',
          optional: false,
        },
        {
          name: 1,
          type: 'index',
          optional: false,
        },
        {
          name: 'name',
          type: 'call',
          optional: false,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [
                {
                  name: 'm',
                  type: 'call',
                  optional: false,
                  arguments: [],
                },
              ],
            },
            {
              name: 'arg1',
              type: 'expression',
              optional: false,
              children: [
                {
                  name: 'e',
                  type: 'property',
                  optional: false,
                },
                {
                  name: 'name',
                  type: 'call',
                  optional: false,
                  arguments: [],
                },
              ],
            },
          ],
        },
        {
          name: 'super name',
          type: 'index',
          optional: false,
        },
        {
          name: 'nice',
          type: 'call',
          optional: false,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [
                { name: 'a', type: 'property', optional: false },
                { name: 'b', type: 'property', optional: false },
                { name: 'c', type: 'property', optional: false },
              ],
            },
          ],
        },
      ],
    })
  })
})

describe('buildExpression works with optional members', () => {
  it('processes a optional call expression', () => {
    const code = 'm?.()'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'm')
    expect(expression).toMatchObject({
      name: 'm',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'm',
          type: 'call',
          optional: true,
          arguments: [],
        },
      ],
    })
  })
  it('processes a simple statement', () => {
    const code = 'rest?.length'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'rest')
    expect(expression).toMatchObject({
      name: 'rest',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'rest',
          type: 'property',
          optional: true,
        },
        {
          name: 'length',
          type: 'property',
          optional: false,
        },
      ],
    })
  })

  it('processes a simple expression with a call', () => {
    const code = 'rest[0]?.some?.push?.(a + b + c)'
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'rest')
    expect(expression).toMatchObject({
      name: 'rest',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'rest',
          type: 'property',
          optional: false,
        },
        {
          name: 0,
          type: 'index',
          optional: true,
        },
        {
          name: 'some',
          type: 'property',
          optional: true,
        },
        {
          name: 'push',
          type: 'call',
          optional: true,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [
                { name: 'a', type: 'property', optional: false },
                { name: 'b', type: 'property', optional: false },
                { name: 'c', type: 'property', optional: false },
              ],
            },
          ],
        },
      ],
    })
  })

  it('processes expression with a call and a function', () => {
    const code = "param.some[1].name(m(),e.name())['super name'].nice(a + b + c);"
    const ast = parse(code)
    let programNode
    traverse(ast, {
      Program(path) {
        programNode = path
      },
    })
    const expression = buildExpression(programNode, 'param')
    expect(expression).toMatchObject({
      name: 'param',
      type: 'expression',
      optional: false,
      children: [
        {
          name: 'param',
          type: 'property',
          optional: false,
        },
        {
          name: 'some',
          type: 'property',
          optional: false,
        },
        {
          name: 1,
          type: 'index',
          optional: false,
        },
        {
          name: 'name',
          type: 'call',
          optional: false,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [
                {
                  name: 'm',
                  type: 'call',
                  optional: false,
                  arguments: [],
                },
              ],
            },
            {
              name: 'arg1',
              type: 'expression',
              optional: false,
              children: [
                {
                  name: 'e',
                  type: 'property',
                  optional: false,
                },
                {
                  name: 'name',
                  type: 'call',
                  optional: false,
                  arguments: [],
                },
              ],
            },
          ],
        },
        {
          name: 'super name',
          type: 'index',
          optional: false,
        },
        {
          name: 'nice',
          type: 'call',
          optional: false,
          arguments: [
            {
              name: 'arg0',
              type: 'expression',
              optional: false,
              children: [
                { name: 'a', type: 'property', optional: false },
                { name: 'b', type: 'property', optional: false },
                { name: 'c', type: 'property', optional: false },
              ],
            },
          ],
        },
      ],
    })
  })
})

import * as visitor from './typeinfer'

describe('inferTypesFromFunction', () => {
  it('finds all function in code', () => {
    const code = `
      function name(a,b,c){}
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name')).not.toBeUndefined()
  })
  it('finds all function expression in code', () => {
    const code = `
      const name = (a,b,c)=>{
        return 'name'
      }
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name')).not.toBeUndefined()
  })
  it('finds all arrow function in code', () => {
    const code = `
      const name = function(a,b,c){
        return 'name'
      }
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name')).not.toBeUndefined()
  })
  it('finds all methods of class declaration in code', () => {
    const code = `
      class A{ name(a,b,c){}}
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name')).not.toBeUndefined()
  })

  it('finds all assigment expressions with anonynmous functions', () => {
    const code = `
      const name = (function(a,b,c){
        return 'name'
      })()
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('anonymous0')).not.toBeUndefined()
  })
  it('finds all assigment expressions with anonynmous arrow function', () => {
    const code = `
      const name = ((a,b,c)=>{
        return 'name'
      })()
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('anonymous0')).not.toBeUndefined()
  })

  it('finds all functions in code', () => {
    const code = `
      function name001(a, b, c) {}
      const name002 = (a, b, c) => {
        return 'name'
      }
      const name003 = function (a, b, c) {
        return 'name'
      }
      class A00 {
        name004(a, b, c) {}
      }
      const name005 = (function (a, b, c) {
        return 'name'
      })()
      const name006 = ((a, b, c) => {
        return 'name'
      })()
      const r00 = {
        name007(a, b, c) {
          function name008(a, b, c) {}
          const name009 = (a, b, c) => {
            return 'name'
          }
          const name010 = function (a, b, c) {
            return 'name'
          }
          class A00 {
            name011(a, b, c) {}
          }
          const name012 = (function (a, b, c) {
            return 'name'
          })()
          const name013 = ((a, b, c) => {
            return 'name'
          })()
        },
      }
      r.name7(1, 2, 3)
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(13)
    expect(result.get('name001')).not.toBeUndefined()
    expect(result.get('name002')).not.toBeUndefined()
    expect(result.get('name003')).not.toBeUndefined()
    expect(result.get('name004')).not.toBeUndefined()
    expect(result.get('anonymous0')).not.toBeUndefined()
    expect(result.get('anonymous1')).not.toBeUndefined()
    expect(result.get('name007')).not.toBeUndefined()
    expect(result.get('name008')).not.toBeUndefined()
    expect(result.get('name009')).not.toBeUndefined()
    expect(result.get('name010')).not.toBeUndefined()
    expect(result.get('name011')).not.toBeUndefined()
    expect(result.get('anonymous2')).not.toBeUndefined()
    expect(result.get('anonymous3')).not.toBeUndefined()
  })
  it('process RestElement parameters', () => {
    const code = `
      function name1(a, b, c, ...rest) {}
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name1')).not.toBeUndefined()
    const func1 = result.get('name1')
    expect(func1?.properties.size).toBe(4)
  })

  it('process isTSParameterProperty parameters', () => {
    const code = `
      class A{ constructor(public a, b, c, ...rest) {}}
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('constructor')).not.toBeUndefined()
    const func1 = result.get('constructor')
    expect(func1?.properties.size).toBe(4)
  })

  it('process ObjectPattern parameters', () => {
    const code = `
      function name1(a, {b, c, d, ...rest}) {
        c.push(a + b)
        d.last = rest
        d.name.extract(a)
        return {a, b, c, other: rest}
      }
    `
    debugger
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name1')).not.toBeUndefined()
    const func1 = result.get('name1')
    expect(func1?.properties.size).toBe(2)
  })

  it('extracts all parameters of function', () => {
    const code = `
      function name1(a, b, c, ...rest) {
        rest.push(a + b + c)
        return rest
      }
      const name2 = (a, b, c) => {
        return a + b / c
      }
      const name3 = function (a, [b, c, ...rest]) {
        return name1(a, b, c, ...rest)
      }
      class A {
        name4(a, b, c) {
          return name3(a, [b, c, 0, 1])
        }
      }
      const name5 = (function (a, { b, c }) {
        return new A().name4(a, b, c)
      })(1, { b: 2, c: 3 })
      const name6 = ((a, b, c) => {
        return a + b + c
      })(1, 2, 3)

      const r = {
        name7(a, b, c) {
          function name8(a, b, c) {
            return name2(a, b, c)
          }
          const name9 = (a, b, c) => {
            return name8(a, b, c)
          }
          const name10 = function (a, b, c) {
            return name9(a, b, c)
          }
          class A {
            name11(a, b, c) {
              return name10(a, b, c)
            }
          }
          const name12 = (function (a, b, c) {
            return new A().name11(a, b, c)
          })(a, b, c)
          const name13 = ((d, e, f) => {
            return 'name'
          })()
          return name12 + name13
        },
      }
      r.name7(1, 2, 3)
    `
    debugger
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(13)
    const func1 = result.get('name1')
    expect(func1).not.toBeUndefined()
    expect(func1?.properties.size).toBe(4)
    expect(func1?.properties.get('a')).not.toBeUndefined()
    expect(func1?.properties.get('b')).not.toBeUndefined()
    expect(func1?.properties.get('c')).not.toBeUndefined()
    expect(func1?.properties.get('rest')).not.toBeUndefined()
    const func2 = result.get('name2')
    expect(func2).not.toBeUndefined()
    expect(func2?.properties.size).toBe(3)
    expect(func2?.properties.get('a')).not.toBeUndefined()
    expect(func2?.properties.get('b')).not.toBeUndefined()
    expect(func2?.properties.get('c')).not.toBeUndefined()
    const func3 = result.get('name3')
    expect(func3).not.toBeUndefined()
    expect(func3?.properties.size).toBe(2)
    expect(func3?.properties.get('a')).not.toBeUndefined()
    expect(func3?.properties.get('param1')).not.toBeUndefined()
    const func4 = result.get('name4')
    expect(func4).not.toBeUndefined()
    expect(func4?.properties.size).toBe(3)
    expect(func4?.properties.get('a')).not.toBeUndefined()
    expect(func4?.properties.get('b')).not.toBeUndefined()
    expect(func4?.properties.get('c')).not.toBeUndefined()
    const func5 = result.get('anonymous0')
    expect(func5).not.toBeUndefined()
    expect(func5?.properties.size).toBe(2)
    expect(func5?.properties.get('a')).not.toBeUndefined()
    expect(func5?.properties.get('param1')).not.toBeUndefined()
    const func6 = result.get('anonymous1')
    expect(func6).not.toBeUndefined()
    expect(func6?.properties.size).toBe(3)
    expect(func6?.properties.get('a')).not.toBeUndefined()
    expect(func6?.properties.get('b')).not.toBeUndefined()
    expect(func6?.properties.get('c')).not.toBeUndefined()
    const func7 = result.get('name7')
    expect(func7).not.toBeUndefined()
    expect(func7?.properties.size).toBe(3)
    expect(func7?.properties.get('a')).not.toBeUndefined()
    expect(func7?.properties.get('b')).not.toBeUndefined()
    expect(func7?.properties.get('c')).not.toBeUndefined()
    const func8 = result.get('name8')
    expect(func8).not.toBeUndefined()
    expect(func8?.properties.size).toBe(3)
    expect(func8?.properties.get('a')).not.toBeUndefined()
    expect(func8?.properties.get('b')).not.toBeUndefined()
    expect(func8?.properties.get('c')).not.toBeUndefined()
    const func9 = result.get('name9')
    expect(func9).not.toBeUndefined()
    expect(func9?.properties.size).toBe(3)
    expect(func9?.properties.get('a')).not.toBeUndefined()
    expect(func9?.properties.get('b')).not.toBeUndefined()
    expect(func9?.properties.get('c')).not.toBeUndefined()
    const func10 = result.get('name10')
    expect(func10).not.toBeUndefined()
    expect(func10?.properties.size).toBe(3)
    expect(func10?.properties.get('a')).not.toBeUndefined()
    expect(func10?.properties.get('b')).not.toBeUndefined()
    expect(func10?.properties.get('c')).not.toBeUndefined()
    const func11 = result.get('name11')
    expect(func11).not.toBeUndefined()
    expect(func11?.properties.size).toBe(3)
    expect(func11?.properties.get('a')).not.toBeUndefined()
    expect(func11?.properties.get('b')).not.toBeUndefined()
    expect(func11?.properties.get('c')).not.toBeUndefined()
    const func12 = result.get('anonymous2')
    expect(func12).not.toBeUndefined()
    expect(func12?.properties.size).toBe(3)
    expect(func12?.properties.get('a')).not.toBeUndefined()
    expect(func12?.properties.get('b')).not.toBeUndefined()
    expect(func12?.properties.get('c')).not.toBeUndefined()
    const func13 = result.get('anonymous3')
    expect(func13).not.toBeUndefined()
    expect(func13?.properties.size).toBe(3)
    expect(func13?.properties.get('d')).not.toBeUndefined()
    expect(func13?.properties.get('e')).not.toBeUndefined()
    expect(func13?.properties.get('f')).not.toBeUndefined()
  })
  it('should take usage of primitive types into account', () => {
    const code = `
      function name001(a, b, c, param, ...rest) {
        rest[0].some.push(a + b + c)
        param?.some?.[1]?.['super name']?.nice(a + b + c);
        return rest
      }`
    debugger
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    const func1 = result.get('name001')
    expect(func1?.properties.get('a')).not.toBeUndefined()
    expect(func1?.properties.get('b')).not.toBeUndefined()
    expect(func1?.properties.get('c')).not.toBeUndefined()
    expect(func1?.properties.get('rest')).not.toBeUndefined()
  })
  it('should teke care of arrays', () => {
    const code = `function name001(param) {
        param.push([])
        param.push([0])
        param.forEach((item, index) => {
          item.push(index)
        })
      }`
    debugger
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
  })
})

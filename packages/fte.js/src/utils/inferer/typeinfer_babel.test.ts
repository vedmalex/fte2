import * as visitor from './typeinfer_babel'

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
    expect(result.get('name')).not.toBeUndefined()
  })
  it('finds all assigment expressions with anonynmous arrow function', () => {
    const code = `
      const name = ((a,b,c)=>{
        return 'name'
      })()
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(1)
    expect(result.get('name')).not.toBeUndefined()
  })

  it('finds all functions in code', () => {
    const code = `
      function name1(a,b,c){}
      const name2 = (a,b,c)=>{
        return 'name'
      }
      const name3 = function(a,b,c){
        return 'name'
      }
      class A{ name4(a,b,c){}}
      const name5 = (function(a,b,c){
        return 'name'
      })()
      const name6 = ((a,b,c)=>{
        return 'name'
      })()
      {function name7(a,b,c){
        function name8(a,b,c){}
        const name9 = (a,b,c)=>{
          return 'name'
        }
        const name10 = function(a,b,c){
          return 'name'
        }
        class A{ name11(a,b,c){}}
        const name12 = (function(a,b,c){
          return 'name'
        })()
        const name13 = ((a,b,c)=>{
          return 'name'
        })()
      }}
    `
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(13)
    expect(result.get('name1')).not.toBeUndefined()
    expect(result.get('name2')).not.toBeUndefined()
    expect(result.get('name3')).not.toBeUndefined()
    expect(result.get('name4')).not.toBeUndefined()
    expect(result.get('name5')).not.toBeUndefined()
    expect(result.get('name6')).not.toBeUndefined()
    expect(result.get('name7')).not.toBeUndefined()
    expect(result.get('name8')).not.toBeUndefined()
    expect(result.get('name9')).not.toBeUndefined()
    expect(result.get('name10')).not.toBeUndefined()
    expect(result.get('name11')).not.toBeUndefined()
    expect(result.get('name12')).not.toBeUndefined()
    expect(result.get('name13')).not.toBeUndefined()
  })

  it('extracts all parameters of function', () => {
    const code = `
      function name1(a,b,c){}
      const name2 = (a,b,c)=>{
        return 'name'
      }
      const name3 = function(a,b,c){
        return 'name'
      }
      class A{ name4(a,b,c){}}
      const name5 = (function(a,b,c){
        return 'name'
      })()
      const name6 = ((a,b,c)=>{
        return 'name'
      })()
      {function name7(a,b,c){
        function name8(a,b,c){}
        const name9 = (a,b,c)=>{
          return 'name'
        }
        const name10 = function(a,b,c){
          return 'name'
        }
        class A{ name11(a,b,c){}}
        const name12 = (function(a,b,c){
          return 'name'
        })()
        const name13 = ((a,b,c)=>{
          return 'name'
        })()
      }}
    `
    debugger
    const result = visitor.inferTypesFromFunction(code)
    expect(result.size).toBe(13)
    const func1 = result.get('name1')
    expect(func1).not.toBeUndefined()
    expect(func1?.properties.size).toBe(3)
    expect(func1?.properties.get('a')).not.toBeUndefined()
    expect(func1?.properties.get('b')).not.toBeUndefined()
    expect(func1?.properties.get('c')).not.toBeUndefined()
    const func2 = result.get('name2')
    expect(func2).not.toBeUndefined()
    expect(func2?.properties.size).toBe(3)
    expect(func2?.properties.get('a')).not.toBeUndefined()
    expect(func2?.properties.get('b')).not.toBeUndefined()
    expect(func2?.properties.get('c')).not.toBeUndefined()
    const func3 = result.get('name3')
    expect(func3).not.toBeUndefined()
    expect(func3?.properties.size).toBe(3)
    expect(func3?.properties.get('a')).not.toBeUndefined()
    expect(func3?.properties.get('b')).not.toBeUndefined()
    expect(func3?.properties.get('c')).not.toBeUndefined()
    const func4 = result.get('name4')
    expect(func4).not.toBeUndefined()
    expect(func4?.properties.size).toBe(3)
    expect(func4?.properties.get('a')).not.toBeUndefined()
    expect(func4?.properties.get('b')).not.toBeUndefined()
    expect(func4?.properties.get('c')).not.toBeUndefined()
    const func5 = result.get('name5')
    expect(func5).not.toBeUndefined()
    expect(func5?.properties.size).toBe(3)
    expect(func5?.properties.get('a')).not.toBeUndefined()
    expect(func5?.properties.get('b')).not.toBeUndefined()
    expect(func5?.properties.get('c')).not.toBeUndefined()
    const func6 = result.get('name6')
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
    const func12 = result.get('name12')
    expect(func12).not.toBeUndefined()
    expect(func12?.properties.size).toBe(3)
    expect(func12?.properties.get('a')).not.toBeUndefined()
    expect(func12?.properties.get('b')).not.toBeUndefined()
    expect(func12?.properties.get('c')).not.toBeUndefined()
    const func13 = result.get('name13')
    expect(func13).not.toBeUndefined()
    expect(func13?.properties.size).toBe(3)
    expect(func13?.properties.get('a')).not.toBeUndefined()
    expect(func13?.properties.get('b')).not.toBeUndefined()
    expect(func13?.properties.get('c')).not.toBeUndefined()
  })
})

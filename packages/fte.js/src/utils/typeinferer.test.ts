import { inferTypesFromFunction } from './inferer/typeinfer'
describe('typeinferer', () => {
  it('function with no params', () => {
    const text = `
      function name(){}
    `
    const result = inferTypesFromFunction(text)
    const func = result.get('name')
    expect(func).not.toBeUndefined()
    expect(func?.name).toBe('name')
    expect(func?.typeName).toBe('Name')
    expect(func?.type).toBe('function')
    expect(func?.properties.size).toBe(0)
  })
  it('empty function with params', () => {
    const text = `
      function name(name, info){}
    `
    const result = inferTypesFromFunction(text)
    const func = result.get('name')
    expect(func).not.toBeUndefined()
    expect(func?.name).toBe('name')
    expect(func?.typeName).toBe('Name')
    expect(func?.type).toBe('function')
    expect(func?.properties.size).toBe(2)
  })
  it('function with params', () => {
    const text = `
      function name({name, info}) {
        function other({context, generation}){
          generation += 1
          name.toString()
          return context
        }
        other(info)
        return name
      }
    `
    const result = inferTypesFromFunction(text)
    expect(result.size).toBe(2)
    const func = result.get('name')
    expect(func).not.toBeUndefined()
    expect(func?.name).toBe('name')
    expect(func?.typeName).toBe('Name')
    expect(func?.type).toBe('function')
    expect(func?.properties.size).toBe(1)
    expect(func?.properties.get('param0')).not.toBeUndefined()

    // должен быть сложный тип с одним сложным параметром содержащим два простых поля
  })
  it('function param with property-method call', () => {
    const text = `
      function other(name){
        name.toString()
      }
    `
    const result = inferTypesFromFunction(text)
    expect(result.size).toBe(1)
    const func = result.get('other')
    expect(func).not.toBeUndefined()
    expect(func?.name).toBe('other')
    expect(func?.typeName).toBe('Other')
    expect(func?.type).toBe('function')
    expect(func?.properties.size).toBe(1)
    expect(func?.properties.get('name')).not.toBeUndefined()
    expect(func?.properties.get('name')?.type).toBe('object')

    // должен быть сложный тип с одним сложным параметром содержащим два простых поля
  })
})

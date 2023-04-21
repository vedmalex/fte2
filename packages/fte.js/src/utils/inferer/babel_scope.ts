import * as babel from '@babel/core'
import traverse, { Scope, Binding } from '@babel/traverse'

// Define a state object to hold the collected information
const state = {
  scopes: new Map(),
  bindings: new Map(),
}

type State = typeof state

const code = `function name1(a, b, c, ...rest) {
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
// Parse the input code and traverse the AST with the enterNode function and state object
const ast = babel.parse(code, {
  sourceType: 'module',
})

traverse(
  ast,
  {
    enter(path: babel.NodePath, state: State) {
      const { scopes, bindings } = state

      // Get the current scope object
      const currentScope = path.scope

      // Add the current scope to the 'scopes' map if it hasn't already been added
      if (!scopes.has(currentScope)) {
        scopes.set(currentScope, {
          parent: currentScope.parent,
          bindings: new Map(),
        })
      }

      // Collect information about bindings in the current scope
      Object.entries(currentScope.bindings).forEach(([binding, value]) => {
        // Add the binding to the 'bindings' map if it hasn't already been added
        if (!bindings.has(binding)) {
          bindings.set(binding, {
            scope: currentScope,
            constantViolations: value.constantViolations,
          })
        }

        // Add the binding to the 'bindings' map for the current scope
        scopes.get(currentScope).bindings.set(binding, true)
      })
    },
  },
  undefined,
  state,
)

// Access the collected information from the 'state' object
console.log(state.scopes) // Map of scopes and their parent scopes
console.log(state.bindings) // Map of bindings and their corresponding scope and constant violations

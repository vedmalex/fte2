"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const babel = tslib_1.__importStar(require("@babel/core"));
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const state = {
    scopes: new Map(),
    bindings: new Map(),
};
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
    `;
const ast = babel.parse(code, {
    sourceType: 'module',
});
(0, traverse_1.default)(ast, {
    enter(path, state) {
        const { scopes, bindings } = state;
        const currentScope = path.scope;
        if (!scopes.has(currentScope)) {
            scopes.set(currentScope, {
                parent: currentScope.parent,
                bindings: new Map(),
            });
        }
        Object.entries(currentScope.bindings).forEach(([binding, value]) => {
            if (!bindings.has(binding)) {
                bindings.set(binding, {
                    scope: currentScope,
                    constantViolations: value.constantViolations,
                });
            }
            scopes.get(currentScope).bindings.set(binding, true);
        });
    },
}, undefined, state);
console.log(state.scopes);
console.log(state.bindings);
//# sourceMappingURL=babel_scope.js.map
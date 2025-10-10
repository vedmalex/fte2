# BUGS

## Found Issues
- [ ] [BUG-005] TODO: придумать конструктор для инициализации поля по умолчанию - Location: tmp/stress-inspect/generators_new/templates/schema/thing.classic.njs.js:684
- [ ] [BUG-006] TODO: проверить как можно добавлять условия в запросы - Location: tmp/stress-inspect/generators_new/templates/graphql/graphql.njs.js:18
- [ ] [BUG-007] Similar TODO in Meta.Thing/graphql.njs.js - Location: tmp/stress-inspect/generators/server/Meta.Thing/graphql.njs.js:21

## Fixed Issues
- [x] [BUG-001] Template generation command fails (`bun ... bundle ...`). Location: `packages/fte.js-templates/` - Fixed by updating runPartial to handle {code, map} objects
- [x] [BUG-002] `TypeError` when `context.directives` is undefined during template generation. Location: `packages/fte.js-templates/src/*.ts` - Fixed by adding optional chaining (directives?.)
- [x] [BUG-003] `partial(...,'core')` result is incorrectly serialized to `[object Object]`. Location: `packages/fte.js-templates/src/*.ts` - Fixed by using context.core directly in es6module.ts.njs.ts
- [x] [BUG-004] Generated TypeScript modules contain illegal top-level `return` statements. Location: `packages/fte.js-templates/src/*.ts` - Fixed as side effect of BUG-001 fix



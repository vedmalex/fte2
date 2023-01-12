var parse = require('../').parse

const res = parse({ source: '<# const i=1+10#> #{i}', context: {} })
console.log(res)

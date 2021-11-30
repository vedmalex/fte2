var parse = require('../').parse

const res = parse('<# const i=1+10#> #{i}', {})
console.log(res)

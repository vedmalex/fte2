export function merge(a: object, b: object, property: string) {
  let prop
  const aProp = a[property]
  if (aProp !== undefined) {
    let bProp = b[property]
    if (bProp === undefined) {
      bProp = b[property] = {}
    }
    const propList = Object.keys(aProp)
    for (let i = 0, pLen = propList.length; i < pLen; i++) {
      prop = propList[i]
      if (!(prop in bProp)) {
        bProp[prop] = aProp[prop]
      }
    }
  }
}

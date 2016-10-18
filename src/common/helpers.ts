import { HashType } from './interfaces';

export function set(data: HashType, path: string, value: any) {
  if ('object' === typeof data) {
    let parts = path.split('.');
    if (Array.isArray(parts)) {
      let curr = parts.shift();
      if (parts.length > 0) {
        if (!data[curr]) {
          if (isNaN(parseInt(parts[0], 10))) {
            data[curr] = {};
          } else {
            data[curr] = [];
          }
        }
        set(data[curr], parts.join('.'), value);
      } else {
        data[path] = value;
      }
    } else {
      data[path] = value;
    }
  }
}

export function get(data: HashType, path: string) {
  if ('object' === typeof data) {
    if (data[path] === undefined) {
      let parts = path.split('.');
      if (Array.isArray(parts)) {
        let curr = parts.shift();
        if (parts.length > 0) {
          return get(data[curr], parts.join('.'));
        }
        return data[curr];
      }
    }
    return data[path];
  }
  return data;
};

export function merge(a: HashType, b: HashType, property: string) {
  let prop;
  let aProp = a[property];
  if (aProp !== undefined) {
    let bProp = b[property];
    if (bProp === undefined) {
      bProp = b[property] = {};
    }
    let propList = Object.keys(aProp);
    for (let i = 0, pLen = propList.length; i < pLen; i++) {
      prop = propList[i];
      if (!(prop in bProp)) {
        bProp[prop] = aProp[prop];
      }
    }
  }
}


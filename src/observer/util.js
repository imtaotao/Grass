/**
* Parse simple path.
*/
const bailRE = /[^\w.$]/
export function parsePath (path) {
 if (bailRE.test(path)) {
   return
 }
 const segments = path.split('.')
 return function (obj) {
   for (let i = 0; i < segments.length; i++) {
     if (!obj) return
     obj = obj[segments[i]]
   }
   return obj
 }
}

export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export function protoAugment (target, src, keys) {
  target.__proto__ = src
}

export function copyAugment (target, src, keys) {
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
export function typeOf (val) {
  return Object.prototype.toString.call(val)
}

export function isString (str) {
  return typeOf(str) === '[object String]'
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPlainObject (obj) {
  return typeOf(obj) === '[object Object]'
}

export function isNumber (num) {
  return typeOf(num) === '[object Number]' && !isNaN(num)
}

export function isFunction (fun) {
  return typeOf(fun) === '[object Function]'
}

export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

export function isGeneratorFunction (fun) {
  const constructor = fun.constructor
  if (!constructor) return false
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') {
    return true
  }
  const prototype = constructor.prototype
  return typeof prototype.next === 'function' && typeof prototype.throw === 'function'
}
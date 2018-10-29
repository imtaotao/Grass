import * as _ from '../utils/index'
import { defineReactive } from './index'

export function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)

    return val
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  const ob = target.__ob__

  if (!ob) {
    target[key] = val
    return val
  }

  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

export function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }

  const ob = target.__ob__

  if (!_.hasOwn(target, key)) {
    return
  }

  delete target[key]

  if (ob) {
    ob.dep.notify()
  }
}

function isValidArrayIndex (val) {
  const n = parseFloat(String(val))
  // Arrray index must be a int number
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
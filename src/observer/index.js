import Dep from './dep'
import * as _ from '../utils'
import { arrayMethods } from './array'
import { def, protoAugment, copyAugment } from './util'

const hasProto = '__proto__' in {}
// We can't use 'Object.keys'.
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  constructor (value) {
    this.value = value
    // This dep is for 'set and 'delete' method
    this.dep = new Dep()
    def(value, '__ob__', this)
    
    if (Array.isArray(value)) {
      const augment = hasProto
      ? protoAugment
      : copyAugment

      // Changed __proto__ of array.
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0, len = keys.length; i < len; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  observeArray (items) {
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i]
      observe(item)
    }
  }
}

export function defineReactive (obj, key, val) {
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)

  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set

  let childOb = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      const value = getter ? getter.call(obj) : val
      
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }

      return value
    },
    set: function (newVal) {
      const value = getter ? getter.call(obj) : val
      const oldValue = value

      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      childOb = observe(newVal)
      dep.notify(newVal, oldValue)
    }
  })
}

/**
 * This is a tool function, it's can let state transfer to response state,
 * but it's can't transifer array.
 */
function observe (value) {
  if (!_.isObject(value) || _.isVNode(value)) {
    return
  }

  let ob
  if (_.hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    (Array.isArray(value) || _.isPlainObject(value)) &&
    Object.isExtensible(value)
  ) {
    ob = new Observer(value)
  }

  return ob
}

function dependArray (value) {
  for (let i = 0, len = value.length; i < len; i++) {
    const v = value[i]

    if (v && v.__ob__) {
      v.__ob__.dep.depend()
    }
    if (Array.isArray(v)) {
      dependArray(v)
    }
  }
}

export function initWatchState (data) {
  observe(data)
}
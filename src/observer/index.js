import Dep from './dep'
import { def, protoAugment, copyAugment } from './util'
import * as _ from '../utils'
import './watcher'

const hasProto = '__proto__' in {}

export class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    
    if (Array.isArray(value)) {
      const augment = hasProto
      ? protoAugment
      : copyAugment
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
}

function defineReactive (obj, key, val) {
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)

  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      const value = getter ? getter.call(obj) : val

      if (Dep.target) {
        dep.depend()
      }

      return value
    },
    set: function (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      dep.notify()
    }
  })
}


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

export function initWatchState (data) {
  return observe(data)
}